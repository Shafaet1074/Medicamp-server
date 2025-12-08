class CampController {
  constructor(campService) {
    this.campService = campService;
  }

  getAllCamps = async (req, res) => {
    try {
      const camps = await this.campService.getAllCamps();
      res.send(camps);
    } catch (error) {
      res.status(500).send({ message: "Failed to load camps" });
    }
  };

  getCampById = async (req, res) => {
    try {
      const camp = await this.campService.getCampById(
        req.params.id,
        req.app.locals.ObjectId
      );
      res.send(camp);
    } catch (error) {
      res.status(500).send({ message: "Failed to load camp" });
    }
  };

  createCamp = async (req, res) => {
    try {
      const result = await this.campService.createCamp(req.body);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to create camp" });
    }
  };

  updateCamp = async (req, res) => {
    try {
      const result = await this.campService.updateCamp(
        req.params.id,
        req.body,
        req.app.locals.ObjectId
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to update camp" });
    }
  };

  deleteCamp = async (req, res) => {
    try {
      const result = await this.campService.deleteCamp(
        req.params.id,
        req.app.locals.ObjectId
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to delete camp" });
    }
  };
}

module.exports = CampController;
