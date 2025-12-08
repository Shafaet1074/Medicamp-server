const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/jwt", (req, res) => {
  const user = req.body;

  if (!user?.email) {
    return res.status(400).send({ message: "Email required" });
  }

  const token = jwt.sign(
    user,
    process.env.ACCESS_TOKEN,
    { expiresIn: "7d" }
  );

  res.send({ token });
});

module.exports = router;
