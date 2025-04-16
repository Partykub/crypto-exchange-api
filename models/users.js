const pool = require("../db/pool");

module.exports = {
  getAllUsers: async () => {
    const result = await pool.query("SELECT * FROM users ORDER BY id");
    return result.rows;
  },

  getUserById: async (id) => {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  },

  getUserByEmail: async (email) => {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  },

  createUser: async (name, email, passwordHash) => {
    const result = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *",
      [name, email, passwordHash]
    );
    return result.rows[0];
  },
};
