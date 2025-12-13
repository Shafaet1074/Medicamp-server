const express = require("express");
const router = express.Router();
const CartController = require("../controllers/cart.controller");

module.exports = (cartController) => {
  router.get("/", cartController.getAllCarts?.bind(cartController)) // add this for all carts
  router.get("/:email", cartController.getUserCart.bind(cartController));
  router.post("/", cartController.addToCart.bind(cartController));
  router.delete("/:id", cartController.removeFromCart.bind(cartController));
  router.delete("/clear/:email", cartController.clearCart.bind(cartController));
  router.patch("/:id", cartController.updateCartItem.bind(cartController));
  router.get("/item/:id", cartController.getCartById.bind(cartController));


  return router;
};
