class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  getAllUsers = async (req, res) => {
    try {
      const users = await this.userService.getAllUsers();
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Failed to fetch users" });
    }
  };

  getUserByEmail = async (req, res) => {
    try {
      const email = req.params.email;
      const user = await this.userService.getUserByEmail(email);
      res.send(user);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error finding user" });
    }
  };

  createUser = async (req, res) => {
    try {
      const result = await this.userService.createUser(req.body);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Failed to create user" });
    }
  };

  makeAdmin = async (req, res) => {
    try {
      const { email } = req.params;
      const result = await this.userService.makeAdmin(email);
      res.send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Failed to upgrade user" });
    }
  };
  
    checkAdmin = async (req, res) => {
    const email = req.params.email;
    const user = await this.userService.getUserByEmail(email);
    res.send({ admin: user?.role === "admin" });
  };


  deleteUser = async (req, res) => {
    try {
      const result = await this.userService.deleteUser(
        req.params.id,
        req.app.locals.ObjectId
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to delete user" });
    }
  };
}

module.exports = UserController;
