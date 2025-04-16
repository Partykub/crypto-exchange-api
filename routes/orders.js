const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orders");

router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.get("/user/:user_id", orderController.getUserOrders);
router.post("/match/:id", orderController.matchOrder);

module.exports = router;
