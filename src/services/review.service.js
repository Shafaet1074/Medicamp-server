class ReviewService {
  constructor(ReviewsCollection, ObjectId) {
    this.Reviews = ReviewsCollection;
    this.ObjectId = ObjectId;
  }

  async createReview(data) {
    return await this.Reviews.insertOne({
      ...data,
      createdAt: new Date(),
    });
  }

  async getAllReviews() {
    return await this.Reviews.find().toArray();
  }
}

module.exports = ReviewService;
