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

router.get(
  "/dashboard",
  controller.dashboard
);

router.get(
  "/sales-trend",
  controller.salesTrend
);

router.get(
  "/top-products",
  controller.topProducts
);

router.get(
  "/low-stock",
  controller.lowStock
);

router.get(
  "/dead-stock",
  controller.deadStock
);

router.get(
  "/revenue-vs-purchase",
  controller.revenueVsPurchase
);


module.exports = router;