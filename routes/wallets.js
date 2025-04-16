const express = require("express");
const router = express.Router();
const walletsController = require("../controllers/wallets");

router.get("/:user_id", walletsController.getWallets);
router.post("/", walletsController.createWallet);
router.patch("/:id", walletsController.updateWallet);

module.exports = router;
