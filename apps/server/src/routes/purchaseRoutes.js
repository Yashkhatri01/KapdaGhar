const express = require("express");

const router = express.Router();

const controller = require("../controllers/purchaseController");

// Create Purchase
router.post("/", controller.createPurchase);

// Get Purchase Items
router.get("/:id/items", controller.getPurchaseItems);

// Get Purchase
router.get("/:id", controller.getPurchase);

// List All Purchases
router.get("/", controller.listPurchases);

//Update Purchase
router.put("/:id", controller.updatePurchase);

//Delete Purchase
router.delete("/:id", controller.deletePurchase);



module.exports = router;