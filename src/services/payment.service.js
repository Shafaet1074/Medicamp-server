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
}

module.exports = PaymentService;
