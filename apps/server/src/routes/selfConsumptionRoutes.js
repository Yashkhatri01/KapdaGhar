const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/selfConsumptionController");

// Create
router.post(
  "/",
  controller.createSelfConsumption
);

// List
router.get(
  "/",
  controller.listSelfConsumptions
);

router.get(
  "/:id/items",
  controller.getSelfConsumptionItems
);

module.exports = router;