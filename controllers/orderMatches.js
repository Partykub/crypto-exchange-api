const OrderMatchModel = require("../models/orderMatches");

exports.getAllMatches = async (req, res) => {
  try {
    const matches = await OrderMatchModel.getAllMatches();
    res.json(matches);
  } catch (err) {
    console.error("Get matches error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getMatchesByUser = async (req, res) => {
  try {
    const matches = await OrderMatchModel.getMatchesByUser(req.params.user_id);
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};
