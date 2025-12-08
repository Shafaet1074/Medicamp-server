const express = require("express");

module.exports = (sslController) => {
  if (!sslController) throw new Error("SSLController instance is required");

  const router = express.Router();

  router.post("/initiate", sslController.initiate); // was initPayment before
  router.post("/success/:tranId", sslController.success);
  router.post("/fail/:tranId", sslController.fail);

  // Add cancel if you implement it
  // router.post("/cancel", sslController.cancel);

  return router;
};
