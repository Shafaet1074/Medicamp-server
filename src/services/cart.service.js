class CartService {
  constructor(Carts, ObjectId) {
    this.Carts = Carts;       // your collection
    this.ObjectId = ObjectId;
  }

  async getUserCart(email) {
    return await this.Carts.find({ email }).toArray();
  }

  async addToCart(data) {
    return await this.Carts.insertOne(data);
  }

  async removeFromCart(id) {
    return await this.Carts.deleteOne({ _id: new this.ObjectId(id) });
  }

  async clearCart(email) {
    return await this.Carts.deleteMany({ email });
  }

  async getAll() {
    return await this.Carts.find().toArray(); // fixed from this.collection -> this.Carts
  }
}

module.exports = CartService;
