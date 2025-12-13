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

  findPaymentsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await this.paymentService.findPaymentsByEmail(email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to load payments" });
  }
};

deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await this.paymentService.deletePayment(id);

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Payment not found" });
    }

    res.send({
      message: "Payment deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Payment delete failed", error);
    res.status(500).send({ message: "Payment delete failed" });
  }
};

updateByCampId = async (req, res) => {
  try {
    const campId = req.params.campId;
    const result = await this.paymentService.updateByCampId(campId, req.body);

    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update payment", error });
  }
};


}

module.exports = PaymentController;
