const express = require("express");

const router = express.Router();

const controller = require("../controllers/reportController");

// Sales Summary
router.get(
  "/sales-summary",
  controller.getSalesSummary
);

// Purchase Summary
router.get(
  "/purchase-summary",
  controller.getPurchaseSummary
);

// Profit Summary
router.get(
  "/profit-summary",
  controller.getProfitSummary
);

module.exports = router;