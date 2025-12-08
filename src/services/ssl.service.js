const SSLCommerzPayment = require("sslcommerz-lts");

class SSLService {
  constructor(Payments, Carts) {
    this.Payments = Payments;
    this.Carts = Carts;
  }

  async initiateSSL(paymentData) {
    const data = {
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.tranId,
      success_url: `${process.env.BASE_URL}/ssl/success/${paymentData.tranId}`,
      fail_url: `${process.env.BASE_URL}/ssl/fail/${paymentData.tranId}`,
      cancel_url: `${process.env.BASE_URL}/ssl/cancel`,
      ipn_url: `${process.env.BASE_URL}/ssl/ipn`,
      product_name: paymentData.campname,
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: paymentData.address,
      cus_phone: paymentData.phone,
    };

    const sslcz = new SSLCommerzPayment(
      process.env.SSL_STORE_ID,
      process.env.SSL_STORE_PASS,
      false
    );

    return await sslcz.init(data);
  }

  async markSuccess(tranId) {
    return await this.Payments.updateOne(
      { tranId },
      {
        $set: {
          status: "success",
          paidAt: new Date(),
        },
      }
    );
  }

  async clearCart(email) {
    return await this.Carts.deleteMany({ email });
  }
}

module.exports = SSLService;
