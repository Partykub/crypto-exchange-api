const pool = require("../db/pool");

module.exports = {
  getWalletsByUser: async (userId) => {
    const result = await pool.query(
      "SELECT * FROM wallets WHERE user_id = $1 ORDER BY currency",
      [userId]
    );
    return result.rows;
  },

  createWallet: async (userId, currency) => {
    const result = await pool.query(
      "INSERT INTO wallets (user_id, currency) VALUES ($1, $2) RETURNING *",
      [userId, currency]
    );
    return result.rows[0];
  },

  updateBalance: async (walletId, newBalance) => {
    const result = await pool.query(
      "UPDATE wallets SET balance = $1 WHERE id = $2 RETURNING *",
      [newBalance, walletId]
    );
    return result.rows[0];
  },
};
