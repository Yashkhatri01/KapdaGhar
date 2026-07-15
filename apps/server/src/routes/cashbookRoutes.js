const express = require("express");
const router = express.Router();

const controller = require("../controllers/cashbookController");

router.post("/", controller.add);
router.get("/", controller.list);

module.exports = router;