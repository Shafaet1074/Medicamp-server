const express = require("express");

module.exports = (reviewController) => {
  const router = express.Router();

  // POST /reviews (protected)
  router.post("/", reviewController.createReview);

  // GET /reviews (public)
  router.get("/", reviewController.getReviews);

  return router;
};
