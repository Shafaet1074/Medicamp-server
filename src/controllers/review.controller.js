class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  createReview = async (req, res) => {
    try {
      const result = await this.reviewService.createReview(req.body);
      res.status(201).send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to add review", error });
    }
  };

  getReviews = async (req, res) => {
    try {
      const result = await this.reviewService.getAllReviews();
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch reviews", error });
    }
  };
}

module.exports = ReviewController;
