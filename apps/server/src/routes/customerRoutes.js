const express = require("express");
const router = express.Router();

const controller = require("../controllers/customerController");

router.get("/", controller.listCustomers);
router.post("/", controller.createCustomer);

router.put("/:id", controller.editCustomer);
router.delete("/:id", controller.removeCustomer);

module.exports = router;