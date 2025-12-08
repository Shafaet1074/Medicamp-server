// adminMiddleware.js

module.exports = (UsersCollection) => {
  return async (req, res, next) => {
    try {
      // User must exist via JWT (verifyToken)
      const email = req.user?.email;
      if (!email) {
        return res.status(403).send({ message: "forbidden access" });
      }

      // Find user from database
      const user = await UsersCollection.findOne({ email });

      // Check role
      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "admin access only" });
      }

      // Admin confirmed → continue
      next();
    } catch (error) {
      console.error("Admin Middleware Error:", error);
      res.status(500).send({ message: "server error" });
    }
  };
};
