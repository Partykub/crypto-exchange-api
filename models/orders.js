const pool = require("../db/pool");

module.exports = {
  createOrder: async ({ user_id, type, currency, price_per_unit, amount }) => {
    const result = await pool.query(
      `INSERT INTO orders (user_id, type, currency, price_per_unit, amount)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, type, currency, price_per_unit, amount]
    );
    return result.rows[0];
  },

  getAllOrders: async () => {
    const result = await pool.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );
    return result.rows;
  },

  getUserOrders: async (user_id) => {
    const result = await pool.query(
      "SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC",
      [user_id]
    );
    return result.rows;
  },

  matchOrder: async (orderId) => {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const orderRes = await client.query(
        "SELECT * FROM orders WHERE id = $1",
        [orderId]
      );
      const order = orderRes.rows[0];

      if (!order || order.status !== "open")
        throw new Error("Order not found or already matched");

      const oppositeType = order.type === "buy" ? "sell" : "buy";
      const matchRes = await client.query(
        `SELECT * FROM orders
         WHERE type = $1 AND currency = $2 AND price_per_unit ${
           order.type === "buy" ? "<=" : ">="
         } $3
         AND amount >= $4 AND status = 'open'
         ORDER BY price_per_unit ${
           order.type === "buy" ? "ASC" : "DESC"
         }, created_at ASC
         LIMIT 1`,
        [oppositeType, order.currency, order.price_per_unit, order.amount]
      );

      const match = matchRes.rows[0];
      if (!match) throw new Error("No matching order found");

      await client.query(
        `UPDATE orders SET status = 'matched' WHERE id IN ($1, $2)`,
        [order.id, match.id]
      );

      const buyer_id = order.type === "buy" ? order.user_id : match.user_id;
      const seller_id = order.type === "sell" ? order.user_id : match.user_id;

      const fromRes = await client.query(
        `SELECT * FROM wallets WHERE user_id = $1 AND currency = $2`,
        [seller_id, order.currency]
      );
      const from_wallet = fromRes.rows[0];
      if (!from_wallet || from_wallet.balance < order.amount)
        throw new Error("Insufficient balance");

      let to_wallet;
      const toRes = await client.query(
        `SELECT * FROM wallets WHERE user_id = $1 AND currency = $2`,
        [buyer_id, order.currency]
      );
      if (toRes.rowCount === 0) {
        const createRes = await client.query(
          `INSERT INTO wallets (user_id, currency, balance) VALUES ($1, $2, 0) RETURNING *`,
          [buyer_id, order.currency]
        );
        to_wallet = createRes.rows[0];
      } else {
        to_wallet = toRes.rows[0];
      }

      await client.query(
        `UPDATE wallets SET balance = balance - $1 WHERE id = $2`,
        [order.amount, from_wallet.id]
      );
      await client.query(
        `UPDATE wallets SET balance = balance + $1 WHERE id = $2`,
        [order.amount, to_wallet.id]
      );

      await client.query(
        `INSERT INTO crypto_transactions (from_wallet_id, to_wallet_id, currency, amount) VALUES ($1, $2, $3, $4)`,
        [from_wallet.id, to_wallet.id, order.currency, order.amount]
      );

      await client.query(
        `INSERT INTO order_matches (buy_order_id, sell_order_id, matched_amount, price_per_unit) VALUES ($1, $2, $3, $4)`,
        [
          order.type === "buy" ? order.id : match.id,
          order.type === "sell" ? order.id : match.id,
          order.amount,
          order.price_per_unit,
        ]
      );

      await client.query("COMMIT");
      return { matched_order_id: match.id, matched_amount: order.amount };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  },
};
