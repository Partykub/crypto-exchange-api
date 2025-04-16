const express = require("express");
const router = express.Router();
const fiatController = require("../controllers/fiat");

router.post("/deposit", fiatController.deposit);
router.post("/withdraw", fiatController.withdraw);
router.post("/transfer", fiatController.transfer);
router.get("/balance/:user_id", fiatController.getBalance);
router.get("/transactions/:user_id", fiatController.getTransactions);

module.exports = router;
