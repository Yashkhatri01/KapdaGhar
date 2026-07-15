const express = require("express");

const router = express.Router();

const controller = require("../controllers/salesController");

// Create Sale
router.post("/", controller.createSale);

// List All Sales
router.get("/", controller.listSales);

// Get Single Sale
router.get("/:id", controller.getSale);

// Get Sale Items
router.get("/:id/items", controller.getSaleItems);

// Update Sale
router.put("/:id", controller.updateSale);

// Delete Sale
router.delete("/:id", controller.deleteSale);

module.exports = router;