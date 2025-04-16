const TxnModel = require("../models/transactions");

exports.createTransaction = async (req, res) => {
  const { from_wallet_id, to_wallet_id, currency, amount } = req.body;

  try {
    const txn = await TxnModel.createTransaction({
      from_wallet_id,
      to_wallet_id,
      currency,
      amount,
    });
    res.status(201).json(txn);
  } catch (err) {
    console.error("Transaction error:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const txns = await TxnModel.getAllTransactions();
    res.json(txns);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};
