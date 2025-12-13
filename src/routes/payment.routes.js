const express = require("express");

module.exports = (paymentController) => {
  if (!paymentController) throw new Error("PaymentController instance is required");

  const router = express.Router();

  router.post("/", paymentController.savePayment);
  router.patch("/:tranId", paymentController.updatePayment); // <-- correct method name
  router.get("/:tranId", paymentController.findPayment); // <-- correct method name

  router.get("/email/:email", paymentController.findPaymentsByEmail);
  router.delete("/:id", paymentController.deletePayment);
  router.patch("/by-camp/:campId", paymentController.updateByCampId);


  return router;
};
