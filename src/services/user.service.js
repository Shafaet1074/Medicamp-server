class UserService {
  constructor(Users) {
    this.Users = Users;
  }

  async getAllUsers() {
    return await this.Users.find().toArray();
  }

  async getUserByEmail(email) {
    return await this.Users.findOne({ email });
  }

  async createUser(userData) {
    return await this.Users.insertOne(userData);
  }

  async makeAdmin(email) {
    return await this.Users.updateOne(
      { email },
      { $set: { role: "admin" } }
    );
  }

  async deleteUser(id, ObjectId) {
    return await this.Users.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = UserService;
