const express = require("express");
const router = express.Router();
const matchController = require("../controllers/orderMatches");

router.get("/", matchController.getAllMatches);

module.exports = router;
