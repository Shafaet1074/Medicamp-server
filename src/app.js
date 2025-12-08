require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ObjectId } = require("mongodb");


const  connectDB  = require("./config/db");
const { verifyToken } = require("./middleware/auth.middleware");
const adminMiddlewareFactory = require("./middleware/admin.middleware");

// Services
const UserService = require("./services/user.service");
const CampService = require("./services/camp.service");
const CartService = require("./services/cart.service");
const PaymentService = require("./services/payment.service");
const SSLService = require("./services/ssl.service");

// Controllers
const UserController = require("./controllers/user.controller");
const CampController = require("./controllers/camp.controller");
const CartController = require("./controllers/cart.controller");
const PaymentController = require("./controllers/payment.controller");
const SSLController = require("./controllers/ssl.controller");

// Routes
const userRoutes = require("./routes/user.routes");
const campRoutes = require("./routes/camp.routes");
const cartRoutes = require("./routes/cart.routes");
const paymentRoutes = require("./routes/payment.routes");
const sslRoutes = require("./routes/ssl.routes");
const authRoutes = require("./routes/auth.routes");

const app = express();
const port = process.env.PORT || 5005;


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

async function main() {
  const db = await connectDB();
  


const UsersCollection = db.Users;
const CampsCollection = db.Camps;
const CartsCollection = db.Carts;
const PaymentsCollection = db.Payments;
const ObjectId = db.ObjectId;


  app.locals.ObjectId = ObjectId;


  const userService = new UserService(UsersCollection);
  const campService = new CampService(CampsCollection);
  const cartService = new CartService(CartsCollection, ObjectId);
  const paymentService = new PaymentService(PaymentsCollection);
  const sslService = new SSLService(PaymentsCollection, CartsCollection);

  const userController = new UserController(userService);
  const campController = new CampController(campService);
  const cartController = new CartController(cartService);
  const paymentController = new PaymentController(paymentService);
  const sslController = new SSLController(sslService);


app.use("/users", userRoutes(userController));
app.use("/camps", campRoutes(campController));
app.use("/carts", verifyToken, cartRoutes(cartController));
app.use("/payments", verifyToken, paymentRoutes(paymentController));
app.use("/ssl", sslRoutes(sslController));
app.use("/", authRoutes);


  app.get("/", (req, res) => {
    res.send("MediCamp server running...");
  });


  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
});
