class SSLController {
  constructor(sslService) {
    this.sslService = sslService;
  }

  initiate = async (req, res) => {
    try {
      const session = await this.sslService.initiateSSL(req.body);

      if (!session || !session.GatewayPageURL) {
        return res.status(400).send({
          message: "SSL Session Failed",
          session,
        });
      }

      // Send Gateway URL and tranId for frontend redirect
      res.send({ url: session.GatewayPageURL, tranId: session.tran_id || req.body.tranId });
    } catch (error) {
      console.error("SSL initiate error:", error);
      res.status(500).send({ message: "SSL init failed", error: error.message });
    }
  };

  success = async (req, res) => {
    const tranId = req.params.tranId;
    try {
      await this.sslService.markSuccess(tranId);
    return res.redirect(
      303,
      `${process.env.FRONTEND_URL}/payment-success?tranId=${tranId}`
    );

    } catch (error) {
      console.error("SSL success error:", error);
      res.status(500).send({ message: "SSL success failed", error: error.message });
    }
  };

  fail = async (req, res) => {
    const tranId = req.params.tranId;
    await this.sslService.markFailed(tranId);
    res.send({ status: "failed", tranId });
  };

  cancel = async (req, res) => {
    const tranId = req.params.tranId;
    await this.sslService.markCancelled(tranId);
    res.send({ status: "cancelled", tranId });
  };

  getStatus = async (req, res) => {
    const tranId = req.params.tranId;
    const payment = await this.sslService.getPayment(tranId);
    if (!payment) return res.status(404).send({ message: "Payment not found" });
    res.send(payment);
  };
}

module.exports = SSLController;
