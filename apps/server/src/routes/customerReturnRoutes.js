const express = require("express");
const router = express.Router();

const controller = require("../controllers/customerReturnController");

/**
 * Create return
 */
router.post("/", controller.createCustomerReturn);

/**
 * Customer Returns History (JOIN with customer)
 */
router.get("/", controller.getCustomerReturns);

/**
 * Single Return
 */
router.get("/:id", controller.getCustomerReturn);

module.exports = router;