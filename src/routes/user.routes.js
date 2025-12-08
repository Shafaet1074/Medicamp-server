const express = require("express");

module.exports = (userController) => {
  if (!userController) throw new Error("UserController instance is required");

  const router = express.Router();

  // Check if a user is admin
  router.get("/admin/:email", userController.checkAdmin);

  // Get all users
  router.get("/", userController.getAllUsers);

  // Get user by email
  router.get("/:email", userController.getUserByEmail);

  // Create new user
  router.post("/", userController.createUser);

  // Make a user admin
  router.patch("/make-admin/:email", userController.makeAdmin);

  // Delete user by ID
  router.delete("/:id", userController.deleteUser);

  return router;
};
