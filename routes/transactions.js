const express = require("express");
const router = express.Router();
const txnController = require("../controllers/transactions");

router.post("/", txnController.createTransaction);
router.get("/", txnController.getAllTransactions);

module.exports = router;
