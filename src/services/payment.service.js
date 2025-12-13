const { ObjectId } = require("mongodb");

class PaymentService {
  constructor(Payments) {
    this.Payments = Payments;
  }

  async savePayment(data) {
    return await this.Payments.insertOne(data);
  }

  async updatePaymentStatus(tranId, status) {
    return await this.Payments.updateOne(
      { tranId },
      {
        $set: {
          status,
          paidAt: new Date(),
        },
      }
    );
  }

  async findPayment(tranId) {
    return await this.Payments.findOne({ tranId });
  }

  async findPaymentsByEmail(email) {
  return await this.Payments.find({ email }).toArray();
}

  async deletePayment(id) {
    return await this.Payments.deleteOne({ _id: new ObjectId(id) });
  }

async updateByCampId(campId, data) {
  console.log(campId);
  return await this.Payments.updateOne(
    { campId },
    { $set: data }
  );
}

}

module.exports = PaymentService;
