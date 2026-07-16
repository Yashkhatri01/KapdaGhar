const express = require("express");

const router = express.Router();

const controller =
  require("../controllers/cashbookController");

router.get(
  "/summary",
  controller.summary
);

router.get(
  "/",
  controller.list
);

router.post(
  "/",
  controller.add
);

module.exports = router;