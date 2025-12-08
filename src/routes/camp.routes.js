const express = require("express");
const router = express.Router();
const CampController = require("../controllers/camp.controller");

module.exports = (campController) => {
  router.get("/", campController.getAllCamps.bind(campController));
  router.get("/:id", campController.getCampById.bind(campController));
  router.post("/", campController.createCamp.bind(campController));
  router.patch("/:id", campController.updateCamp.bind(campController));
  router.delete("/:id", campController.deleteCamp.bind(campController));

  return router;
};
