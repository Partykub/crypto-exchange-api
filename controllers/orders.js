const OrderModel = require("../models/orders");

exports.createOrder = async (req, res) => {
  try {
    const { user_id, type, currency, price_per_unit, amount } = req.body;
    const order = await OrderModel.createOrder({
      user_id,
      type,
      currency,
      price_per_unit,
      amount,
    });

    let matchResult = null;
    try {
      matchResult = await OrderModel.matchOrder(order.id);
    } catch (matchErr) {
      console.warn("No match:", matchErr.message);
    }

    res
      .status(201)
      .json({ message: "Order created", order, matched: matchResult });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const orders = await OrderModel.getUserOrders(user_id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
};

exports.matchOrder = async (req, res) => {
  const orderId = req.params.id;
  try {
    const matched = await OrderModel.matchOrder(orderId);
    res.json({ message: "Order matched successfully", matched });
  } catch (err) {
    console.error("Match order error:", err.message);
    res.status(400).json({ error: err.message });
  }
};
