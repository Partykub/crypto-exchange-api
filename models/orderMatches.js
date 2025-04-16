const pool = require("../db/pool");

module.exports = {
  getAllMatches: async () => {
    const result = await pool.query(`
      SELECT * FROM order_matches ORDER BY created_at DESC
    `);
    return result.rows;
  },

  getMatchesByUser: async (user_id) => {
    const result = await pool.query(
      `
      SELECT om.*
      FROM order_matches om
      JOIN orders bo ON om.buy_order_id = bo.id
      JOIN orders so ON om.sell_order_id = so.id
      WHERE bo.user_id = $1 OR so.user_id = $1
      ORDER BY om.created_at DESC
    `,
      [user_id]
    );

    return result.rows;
  },
};
