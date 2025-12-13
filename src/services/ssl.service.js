const SSLCommerzPayment = require("sslcommerz-lts");
const { ObjectId } = require("mongodb");

class SSLService {
  constructor(PaymentCollection, CartCollection) {
    this.PaymentCollection = PaymentCollection;
    this.CartCollection = CartCollection;
  }

  async initiateSSL(paymentData) {
    const transactionId = new ObjectId().toString();

    // 1️⃣ Save initial payment record (status: pending)
    const record = {
      tranId: transactionId,
      campId: paymentData.campId,
      email: paymentData.email,
      name: paymentData.name,
      CampName: paymentData.CampName,
      CampFees: paymentData.CampFees,
      status: "pending",
      createdAt: new Date(),
    };
    await this.PaymentCollection.insertOne(record);

    // 2️⃣ Create SSLCommerz payload
    const data = {
      store_id: process.env.STORE_ID,
      store_passwd: process.env.STORE_PASSWORD,

      total_amount: Number(paymentData.CampFees),
      currency: "BDT",
      tran_id: transactionId,  // correct transaction variable

      success_url: `${process.env.BACKEND_URL}/ssl/success/${transactionId}`,
      fail_url: `${process.env.BACKEND_URL}/ssl/fail/${transactionId}`,
      cancel_url: `${process.env.BACKEND_URL}/ssl/cancel/${transactionId}`,

      emi_option: 0,

      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: "Dhaka",
      cus_phone: "01700000000",

      product_name: paymentData.CampName,
      product_profile: "non-physical",
      product_category: "medical camp",

      shipping_method: "NO",
    };

    const sslcz = new SSLCommerzPayment(
      process.env.STORE_ID,
      process.env.STORE_PASSWORD,
      process.env.SSL_MODE === "live"
    );

    // 3️⃣ Return gateway URL
    return await sslcz.init(data);
  }

  async markSuccess(tranId) {
    const payment = await this.PaymentCollection.findOne({ tranId });
    if (!payment) throw new Error("Payment record not found");

    await this.PaymentCollection.updateOne(
      { tranId },
      { $set: { status: "paid", paidAt: new Date() } }
    );

    if (payment.campId) {
      await this.CartCollection.updateOne(
        { _id: new ObjectId(payment.campId) },
        {
          $set: {
            status: "paid",
            paymentStatus: "paid",
            confirmationStatus: "pending",
            paidAt: new Date(),
          },
        }
      );
    }

    return payment;
  }

  async markFailed(tranId) {
    return await this.PaymentCollection.updateOne(
      { tranId },
      { $set: { status: "failed" } }
    );
  }

  async markCancelled(tranId) {
    return await this.PaymentCollection.updateOne(
      { tranId },
      { $set: { status: "cancelled" } }
    );
  }

  async getPayment(tranId) {
    return await this.PaymentCollection.findOne({ tranId });
  }


}

module.exports = SSLService;
