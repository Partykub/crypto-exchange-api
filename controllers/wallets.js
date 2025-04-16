const WalletModel = require("../models/wallets");

exports.getWallets = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const wallets = await WalletModel.getWalletsByUser(userId);
    res.json(wallets);
  } catch (err) {
    console.error("Get wallets error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.createWallet = async (req, res) => {
  try {
    const { user_id, currency } = req.body;
    const wallet = await WalletModel.createWallet(user_id, currency);
    res.status(201).json(wallet);
  } catch (err) {
    console.error("Create wallet error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.updateWallet = async (req, res) => {
  try {
    const walletId = req.params.id;
    const { balance } = req.body;
    const updated = await WalletModel.updateBalance(walletId, balance);
    res.json(updated);
  } catch (err) {
    console.error("Update wallet error:", err);
    res.status(500).json({ error: "Database error" });
  }
};
