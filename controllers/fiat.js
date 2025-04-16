const Fiat = require("../models/fiat");

exports.deposit = async (req, res) => {
  const { user_id, currency, amount } = req.body;
  try {
    await Fiat.upsertBalance(user_id, currency, amount);
    await Fiat.createTransaction(user_id, "deposit", currency, amount);
    res.json({ message: "Deposit successful" });
  } catch (err) {
    console.error("Deposit error:", err);
    res.status(500).json({ error: "Deposit failed" });
  }
};

exports.withdraw = async (req, res) => {
  const { user_id, currency, amount } = req.body;
  try {
    const balance = await Fiat.getBalance(user_id, currency);
    if (!balance || balance.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    await Fiat.upsertBalance(user_id, currency, -amount);
    await Fiat.createTransaction(user_id, "withdraw", currency, amount);
    res.json({ message: "Withdraw successful" });
  } catch (err) {
    console.error("Withdraw error:", err);
    res.status(500).json({ error: "Withdraw failed" });
  }
};

exports.transfer = async (req, res) => {
  const { from_user_id, to_user_id, currency, amount } = req.body;
  try {
    const balance = await Fiat.getBalance(from_user_id, currency);
    if (!balance || balance.balance < amount) {
      return res.status(400).json({ error: "Insufficient funds" });
    }

    await Fiat.upsertBalance(from_user_id, currency, -amount);
    await Fiat.upsertBalance(to_user_id, currency, amount);
    await Fiat.createTransaction(
      from_user_id,
      "transfer",
      currency,
      amount,
      to_user_id
    );

    res.json({ message: "Transfer successful" });
  } catch (err) {
    console.error("Transfer error:", err);
    res.status(500).json({ error: "Transfer failed" });
  }
};

exports.getBalance = async (req, res) => {
  const { user_id } = req.params;
  try {
    const thb = await Fiat.getBalance(user_id, "THB");
    const usd = await Fiat.getBalance(user_id, "USD");
    res.json({
      THB: thb?.balance || 0,
      USD: usd?.balance || 0,
    });
  } catch (err) {
    console.error("Balance error:", err);
    res.status(500).json({ error: "Failed to get balance" });
  }
};

exports.getTransactions = async (req, res) => {
  const { user_id } = req.params;
  try {
    const txns = await Fiat.getTransactions(user_id);
    res.json(txns);
  } catch (err) {
    console.error("Transaction error:", err);
    res.status(500).json({ error: "Failed to get transactions" });
  }
};
