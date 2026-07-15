const express = require("express");

const router = express.Router();

const supplierReturnController =
  require("../controllers/supplierReturnController");

// Create supplier return
router.post(
  "/",
  supplierReturnController.createSupplierReturn
);

// List supplier returns
router.get(
  "/",
  supplierReturnController.getAllSupplierReturns
);

module.exports = router;