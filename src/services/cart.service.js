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

  async updateCartItem(id, data) {
  return await this.Carts.updateOne(
    { _id: new this.ObjectId(id) },
    { $set: data }
  );
}

async getCartById(id) {
  return await this.Carts.findOne({ _id: new this.ObjectId(id) });
}


}

module.exports = CartService;
