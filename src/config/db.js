const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ftvpmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

let db = null;

async function connectDB() {
  if (db) return db; // prevent reconnect loop

  try {
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    console.log("✅ MongoDB Connected");

    const database = client.db("MediCamp");

    db = {
      ObjectId,
      Users: database.collection("users"),
      Camps: database.collection("Camps"),
      Carts: database.collection("carts"),
      Payments: database.collection("payments"),
      Organizers: database.collection("organizers"),
      Reviews: database.collection("Reviews"),
    };

    return db;

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

module.exports = connectDB;
