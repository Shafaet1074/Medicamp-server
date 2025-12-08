class SSLController {
  constructor(sslService) {
    this.sslService = sslService;
  }

  initiate = async (req, res) => {
    try {
      const session = await this.sslService.initiateSSL(req.body);
      res.send({ url: session.GatewayPageURL });
    } catch (error) {
      res.status(500).send({ message: "SSL init failed" });
    }
  };

  success = async (req, res) => {
    try {
      const tranId = req.params.tranId;
      await this.sslService.markSuccess(tranId);

      res.redirect(`${process.env.FRONTEND_URL}/payment/success/${tranId}`);
    } catch (error) {
      res.status(500).send({ message: "SSL success processing failed" });
    }
  };

  fail = async (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/payment/fail`);
  };
}

module.exports = SSLController;
