const pool = require("../db/pool");

module.exports = {
  getBalance: async (user_id, currency) => {
    const result = await pool.query(
      "SELECT * FROM fiat_balances WHERE user_id = $1 AND currency = $2",
      [user_id, currency]
    );
    return result.rows[0];
  },

  upsertBalance: async (user_id, currency, amount) => {
    const existing = await module.exports.getBalance(user_id, currency);
    if (existing) {
      await pool.query(
        "UPDATE fiat_balances SET balance = balance + $1 WHERE user_id = $2 AND currency = $3",
        [amount, user_id, currency]
      );
    } else {
      await pool.query(
        "INSERT INTO fiat_balances (user_id, currency, balance) VALUES ($1, $2, $3)",
        [user_id, currency, amount]
      );
    }
  },

  createTransaction: async (
    user_id,
    type,
    currency,
    amount,
    target_user_id = null
  ) => {
    if (type === "transfer") {
      await pool.query(
        "INSERT INTO fiat_transactions (user_id, type, currency, amount, description) VALUES ($1, $2, $3, $4, $5)",
        [user_id, type, currency, amount, `Transfer to user ${target_user_id}`]
      );
    } else {
      await pool.query(
        "INSERT INTO fiat_transactions (user_id, type, currency, amount) VALUES ($1, $2, $3, $4)",
        [user_id, type, currency, amount]
      );
    }
  },

  getTransactions: async (user_id) => {
    const result = await pool.query(
      "SELECT * FROM fiat_transactions WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    return result.rows;
  },
};
