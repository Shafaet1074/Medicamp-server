const express = require("express");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const app = express();
const port = process.env.PORT || 5005;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medicamp-70825.web.app",
      "https://medicamp-70825.firebaseapp.com",
    ],
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5ftvpmn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const SSLCommerzPayment = require('sslcommerz-lts');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const CampCollections = client.db("MediCamp").collection("Camps");
    const OrganizerCollections = client.db("MediCamp").collection("organizers");
    const userCollections = client.db("MediCamp").collection("users");
    const cartCollection = client.db("MediCamp").collection("carts");
    const paymentCollection = client.db("MediCamp").collection("payments");
    const reviewsCollection = client.db("MediCamp").collection("Reviews");

    // jwt related API
    app.post("/jwt", async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1h",
      });
      res.send({ token });
    });

    const verifyToken = (req, res, next) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authHeader.split(" ")[1];
      jwt.verify(token, process.env.ACCESS_TOKEN, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "unauthorized" });
        }
        req.user = decoded;
        next();
      });
    };

    const verifyAdmin = async (req, res, next) => {
      try {
        const email = req.user.email;
        const user = await userCollections.findOne({ email });
        next();
      } catch (error) {
        console.error("Error verifying admin:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    };

    //users related API
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await userCollections.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists", insertedId: null });
      }
      const result = await userCollections.insertOne(user);
      res.send(result);
    });

    app.get("/users", verifyToken, verifyAdmin, async (req, res) => {
      const result = await userCollections.find().toArray();
      res.send(result);
    });

    app.get("/users/:email", verifyToken, async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await userCollections.findOne(query);
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({ message: "Cart item not found" });
      }
    });

    app.patch("/users/:email", verifyToken, async (req, res) => {
      try {
        const email = req.params.email;
        const query = { email: email };
        const updateDoc = {
          $set: {
            campname: req.body.campname,
            image: req.body.image,
            phonenumber: req.body.phonenumber,
          },
        };
        const result = await userCollections.updateOne(query, updateDoc);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to update profile", error });
      }
    });

    app.get("/users/admin/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === "admin";
      }
      res.send({ admin });
    });

    app.patch(
      "/users/admin/:id",
      verifyToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = {
          $set: {
            role: "admin",
          },
        };
        const result = await userCollections.updateOne(filter, updatedDoc);
        res.send(result);
      }
    );

    app.post("/reviews", verifyToken, async (req, res) => {
      try {
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error inserting review:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.get("/reviews", async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    //camps related API
    app.get("/camps", async (req, res) => {
      const result = await CampCollections.find().toArray();
      res.send(result);
    });

    app.get("/campdetails/id/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await CampCollections.findOne(query);
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({ message: "Cart item not found" });
      }
    });

 app.get("/carts", verifyToken, async (req, res) => {
  const result = await cartCollection.find().toArray();
  res.send(result);
});


    app.get("/carts/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.findOne(query);
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({ message: "Cart item not found" });
      }
    });

    app.post("/carts", async (req, res) => {
      const cartItem = req.body;
      const result = await cartCollection.insertOne(cartItem);
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    app.patch("/carts/:id", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        console.log(`Attempting to update cart with ID: ${id}`);
        const query = { _id: new ObjectId(id) };
        const existingDoc = await cartCollection.findOne(query);
        if (!existingDoc) {
          console.error(`Cart item with ID: ${id} not found`);
          return res.status(404).send({ message: "Cart item not found" });
        }
        console.log("Existing document:", existingDoc);
        const updateData = req.body;
        console.log("Update data:", updateData);
        const updateResult = await cartCollection.updateOne(query, {
          $set: updateData,
        });
        console.log("Update result:", updateResult);
        res.status(200).send(updateResult);
      } catch (error) {
        console.error("Error updating cart item:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

    app.post("/camps", verifyToken, verifyAdmin, async (req, res) => {
      const campItem = req.body;
      const result = await CampCollections.insertOne(campItem);
      res.send(result);
    });

    app.delete("/camps/:id", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await CampCollections.deleteOne(query);
      res.send(result);
    });

    app.put("/camps/:id", async (req, res) => {
      const id = req.params.id;
      const updatedCamp = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          campname: updatedCamp.campname,
          image: updatedCamp.image,
          campfees: updatedCamp.campfees,
          Location: updatedCamp.Location,
          HealthcareProfessionalName: updatedCamp.HealthcareProfessionalName,
          Participantcount: updatedCamp.Participantcount,
          Description: updatedCamp.Description,
        },
      };
      const result = await CampCollections.updateOne(filter, updateDoc);
      res.send(result);
    });

    app.patch("/camps/:campname", async (req, res) => {
      const campname = req.params.campname;
      console.log(campname);
      const updateResult = await CampCollections.updateOne(
        { campname: campname },
        { $inc: { Participantcount: 1 } }
      );
      if (updateResult.modifiedCount > 0) {
        res.send({ message: "Participant count updated successfully" });
      } else {
        res.status(500).send({ message: "Failed to update participant count" });
      }
    });

    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      console.log(amount, "amount inside the intent");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });
      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });

    app.post("/payments", async (req, res) => {
      const payment = req.body;
      console.log("Received payment:", payment);
      const paymentResult = await paymentCollection.insertOne(payment);
      if (paymentResult.insertedId) {
        console.log("Payment inserted successfully:", paymentResult.insertedId);
        res.send(paymentResult);
      } else {
        res.status(500).send({ message: "Failed to process payment" });
      }
    });

    app.get("/payments/:email", verifyToken, async (req, res) => {
      const query = { email: req.params.email };
      if (req.params.email !== req.user.email) {
        return res.status(403).send({ message: "forbidden access" });
      }
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });

    app.patch("/carts/:id", verifyToken, async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          paymentStatus: "paid",
        },
      };
      const result = await cartCollection.updateOne(filter, updateDoc);
      res.send(result);
    });

    //organizers related API
    app.post("/ssl-payment", verifyToken, async (req, res) => {
      try {
        const {  CampFees, email, name, CampName, campId } = req.body;
     
        const transactionId = new ObjectId().toString();
        const paymentData = {
          tranId: transactionId,
          campId,
          email,
          
          CampName,
          CampFees,
          status: "pending",
          createdAt: new Date(),
        };
        await paymentCollection.insertOne(paymentData);

        const data = {
          store_id: process.env.STORE_ID,
          store_passwd: process.env.STORE_PASSWORDWORD,
          total_amount: Number(CampFees),
          currency: "BDT",
          tran_id: transactionId,
          success_url: `${process.env.BACKEND_URL}/ssl-payment-success/${transactionId}`,
          fail_url: `${process.env.BACKEND_URL}/ssl-payment-fail/${transactionId}`,
          cancel_url: `${process.env.BACKEND_URL}/ssl-payment-cancel/${transactionId}`,
          emi_option: 0,
          cus_name: name,
          cus_email: email,
          cus_add1: "Dhaka",
          cus_phone: "01700000000",
          product_name: CampName,
          product_profile: "non-physical",
          product_category: "medical camp",
          shipping_method: "NO",
        };

        const sslcz = new SSLCommerzPayment(
          process.env.STORE_ID,
          process.env.STORE_PASSWORD,
          process.env.SSL_MODE === "live"
        );

        sslcz.init(data).then((apiResponse) => {
          if (apiResponse.GatewayPageURL) {
            res.send({ url: apiResponse.GatewayPageURL, tranId: transactionId });
          } else {
            res.status(400).send({ message: "SSLCommerz session failed", apiResponse });
          }
        });
      } catch (error) {
        console.error("Error creating SSL payment:", error);
        res.status(500).send({ message: "Internal server error" });
      }
    });

app.post("/ssl-payment-success/:tranId", async (req, res) => {
  const tranId = req.params.tranId;
  console.log("SSL success hit. TranId:", tranId);

  try {
    if (!tranId) {
      return res.send({ status: "failed", message: "Invalid transaction ID" });
    }

    // 1️⃣ Find payment record (to get campId)
    const payment = await paymentCollection.findOne({ tranId });

    if (!payment) {
      return res.send({ status: "failed", message: "Payment record not found" });
    }

    const campId = payment.campId;   // 👉 use stored campId

    // 2️⃣ Update payment status
    const payResult = await paymentCollection.updateOne(
      { tranId },
      { $set: { status: "paid", paidAt: new Date() } }
    );

    console.log("Payment modified:", payResult.modifiedCount);

    // 3️⃣ Update CampCollections status field
  if (campId) {
  // Get paidAt from paymentCollection
  const paidAt = payment.paidAt || new Date(); // fallback to now if missing

  await cartCollection.updateOne(
    { _id: new ObjectId(campId) },
    {
      $set: {
        status: "paid",
        paymentStatus: "paid",
        confirmationStatus: "pending",
        paidAt: paidAt,  // <-- added field
      },
    }
  );
  console.log("Camp status updated for camp:", campId, "with paidAt:", paidAt);
}

    if (payResult.modifiedCount > 0) {
      return res.redirect(`http://localhost:5173/dashboard/paymenthistory`);
    }

    return res.send({ status: "failed", tranId });

  } catch (error) {
    console.error("SSL Validation Error:", error);
    return res.send({ status: "error", message: "Validation failed" });
  }
});



app.get("/ssl-payment-success/:tranId", (req, res) => {
  const tranId = req.params.tranId;

  // Redirect user to React frontend page with query params
  res.redirect('http://localhost:5173/dashboard/registeredcamps')

});



    app.post("/ssl-payment-fail/:tranId", async (req, res) => {
      const tranId = req.params.tranId;
      await paymentCollection.updateOne({ tranId }, { $set: { status: "failed" } });
      res.send({ status: "failed", tranId });
    });

    app.post("/ssl-payment-cancel/:tranId", async (req, res) => {
      const tranId = req.params.tranId;
      await paymentCollection.updateOne({ tranId }, { $set: { status: "cancelled" } });
      res.send({ status: "cancelled", tranId });
    });

    app.get("/payments/status/:tranId", verifyToken, async (req, res) => {
      const tranId = req.params.tranId;
      const payment = await paymentCollection.findOne({ tranId });
      if (!payment) return res.status(404).send({ message: "Payment not found" });
      res.send(payment);
    });

    app.get("/organizers", async (req, res) => {
      const result = await OrganizerCollections.find().toArray();
      res.send(result);
    });

    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("medicamp server is running");
});

app.listen(port, () => {
  console.log(`server is running on ${port}`);
});