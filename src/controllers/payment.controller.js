class PaymentController {
  constructor(paymentService) {
    this.paymentService = paymentService;
  }

  savePayment = async (req, res) => {
    try {
      const result = await this.paymentService.savePayment(req.body);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Payment save failed" });
    }
  };

  updatePayment = async (req, res) => {
    try {
      const { tranId } = req.params;
      const result = await this.paymentService.updatePaymentStatus(
        tranId,
        req.body.status
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Payment update failed" });
    }
  };

  findPayment = async (req, res) => {
    try {
      const result = await this.paymentService.findPayment(req.params.tranId);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to find payment" });
    }
  };
}

module.exports = PaymentController;
