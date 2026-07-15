const express = require("express");
const router = express.Router();

const controller = require("../controllers/inventoryController");

router.post("/", controller.createItem);
router.get("/", controller.listItems);
router.put("/stock", controller.changeStock);
router.put("/:id", controller.updateItem);
router.delete("/:id", controller.deleteItem);
router.put("/status", controller.updateStock);

module.exports = router;