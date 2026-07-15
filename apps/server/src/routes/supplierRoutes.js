const express = require("express");

const router = express.Router();

const controller = require("../controllers/supplierController");

router.post("/", controller.createSupplier);

router.get("/", controller.listSuppliers);

router.put("/:id", controller.editSupplier);

router.delete("/:id", controller.removeSupplier);

module.exports = router;