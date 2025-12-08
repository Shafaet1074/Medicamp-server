class CampService {
  constructor(Camps) {
    this.Camps = Camps;
  }

  async getAllCamps() {
    return await this.Camps.find().toArray();
  }

  async getCampById(id, ObjectId) {
    return await this.Camps.findOne({ _id: new ObjectId(id) });
  }

  async createCamp(data) {
    return await this.Camps.insertOne(data);
  }

  async updateCamp(id, data, ObjectId) {
    return await this.Camps.updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
  }

  async deleteCamp(id, ObjectId) {
    return await this.Camps.deleteOne({ _id: new ObjectId(id) });
  }
}

module.exports = CampService;
