const pool = require("../db/pool");

module.exports = {
  createTransaction: async ({
    from_wallet_id,
    to_wallet_id,
    currency,
    amount,
  }) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");


      const fromWalletRes = await client.query(
        "SELECT balance FROM wallets WHERE id = $1 AND currency = $2",
        [from_wallet_id, currency]
      );
      if (
        fromWalletRes.rowCount === 0 ||
        fromWalletRes.rows[0].balance < amount
      ) {
        throw new Error("Insufficient balance or wallet not found");
      }

      await client.query(
        "UPDATE wallets SET balance = balance - $1 WHERE id = $2",
        [amount, from_wallet_id]
      );

      await client.query(
        "UPDATE wallets SET balance = balance + $1 WHERE id = $2",
        [amount, to_wallet_id]
      );

      const txnRes = await client.query(
        `INSERT INTO crypto_transactions (from_wallet_id, to_wallet_id, currency, amount)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [from_wallet_id, to_wallet_id, currency, amount]
      );

      await client.query("COMMIT");
      return txnRes.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },

  getAllTransactions: async () => {
    const result = await pool.query(
      "SELECT * FROM crypto_transactions ORDER BY created_at DESC"
    );
    return result.rows;
  },
};
