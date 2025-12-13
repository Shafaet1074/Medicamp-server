const express = require("express");

module.exports = (sslController) => {
  if (!sslController) throw new Error("SSLController instance is required");

  const router = express.Router();

  router.post("/initiate", sslController.initiate);
  router.post("/success/:tranId", sslController.success);
  router.post("/fail/:tranId", sslController.fail);
  router.post("/cancel/:tranId", sslController.cancel);
  router.get("/status/:tranId", sslController.getStatus);

  return router;
};
