const express = require("express");

const router = express.Router();

const supplierReturnController =
require("../controllers/supplierReturnController");

// Create
router.post(
  "/",
  supplierReturnController.createSupplierReturn
);

// History
router.get(
  "/",
  supplierReturnController.getSupplierReturns
);

// View Single
router.get(
  "/:id",
  supplierReturnController.getSupplierReturn
);

module.exports = router;