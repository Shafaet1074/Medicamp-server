require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { verifyToken } = require("./middleware/auth.middleware");

// Services
const UserService = require("./services/user.service");
const CampService = require("./services/camp.service");
const CartService = require("./services/cart.service");
const PaymentService = require("./services/payment.service");
const SSLService = require("./services/ssl.service");
const ReviewService = require("./services/review.service");

// Controllers
const UserController = require("./controllers/user.controller");
const CampController = require("./controllers/camp.controller");
const CartController = require("./controllers/cart.controller");
const PaymentController = require("./controllers/payment.controller");
const SSLController = require("./controllers/ssl.controller");
const ReviewController = require("./controllers/review.controller");

// Routes
const userRoutes = require("./routes/user.routes");
const campRoutes = require("./routes/camp.routes");
const cartRoutes = require("./routes/cart.routes");
const paymentRoutes = require("./routes/payment.routes");
const sslRoutes = require("./routes/ssl.routes");
const authRoutes = require("./routes/auth.routes");
const reviewRoutes = require("./routes/review.routes");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medicamp-70825.web.app",
      "https://medicamp-70825.firebaseapp.com",
    ],
    credentials: true,
  })
);

/* -------------------- ROOT ROUTE -------------------- */
app.get("/", (req, res) => {
  res.send("MediCamp server running...");
});

/* -------------------- EXPORT FUNCTION FOR VERCEL -------------------- */
async function initApp() {
  const db = await connectDB();

  const UsersCollection = db.Users;
  const CampsCollection = db.Camps;
  const CartsCollection = db.Carts;
  const PaymentsCollection = db.Payments;
  const ReviewsCollection = db.Reviews;
  const ObjectId = db.ObjectId;

  app.locals.ObjectId = ObjectId;

  // Services
  const userService = new UserService(UsersCollection);
  const campService = new CampService(CampsCollection);
  const cartService = new CartService(CartsCollection, ObjectId);
  const paymentService = new PaymentService(PaymentsCollection);
  const sslService = new SSLService(PaymentsCollection, CartsCollection);
  const reviewService = new ReviewService(ReviewsCollection, ObjectId);

  // Controllers
  const userController = new UserController(userService);
  const campController = new CampController(campService);
  const cartController = new CartController(cartService);
  const paymentController = new PaymentController(paymentService);
  const sslController = new SSLController(sslService);
  const reviewController = new ReviewController(reviewService);

  // Routes
  app.use("/users", userRoutes(userController));
  app.use("/camps", campRoutes(campController));
  app.use("/carts", verifyToken, cartRoutes(cartController));
  app.use("/payments", verifyToken, paymentRoutes(paymentController));
  app.use("/ssl", sslRoutes(sslController));
  app.use("/auth", authRoutes);
  app.use("/reviews", reviewRoutes(reviewController));

  return app;
}

/* -------------------- VERCEL HANDLER -------------------- */
module.exports = async (req, res) => {
  const initializedApp = await initApp();
  initializedApp(req, res);
};
