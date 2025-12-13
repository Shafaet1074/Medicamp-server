class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  async getAllCarts(req, res) {
  try {
    const carts = await this.cartService.getAll();
    res.send(carts);
  } catch (err) {
    res.status(500).send({ message: "Server error" });
  }
}


  getUserCart = async (req, res) => {
    try {
      const email = req.params.email;
      const cart = await this.cartService.getUserCart(email);
      res.send(cart);
    } catch (error) {
      res.status(500).send({ message: "Failed to load cart" });
    }
  };

  addToCart = async (req, res) => {
    try {
      const result = await this.cartService.addToCart(req.body);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to add item" });
    }
  };

  removeFromCart = async (req, res) => {
    try {
      const result = await this.cartService.removeFromCart(req.params.id);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to remove item" });
    }
  };

  clearCart = async (req, res) => {
    try {
      const result = await this.cartService.clearCart(req.params.email);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to clear cart" });
    }
  };

  updateCartItem = async (req, res) => {
  try {
    const result = await this.cartService.updateCartItem(req.params.id, req.body);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update cart item" });
  }
};

getCartById = async (req, res) => {
  try {
    const id = req.params.id;
    const cart = await this.cartService.getCartById(id);
    res.send(cart);
  } catch (error) {
    res.status(500).send({ message: "Failed to load cart item" });
  }
};

}

module.exports = CartController;
