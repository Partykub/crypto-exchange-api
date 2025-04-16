const express = require("express");
const app = express();

app.use(express.json());

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

const walletRoutes = require("./routes/wallets");
app.use("/wallets", walletRoutes);

const txnRoutes = require("./routes/transactions");
app.use("/crypto-transactions", txnRoutes);

const orderRoutes = require("./routes/orders");
app.use("/orders", orderRoutes);

const orderMatchesRoutes = require("./routes/orderMatches");
app.use("/order-matches", orderMatchesRoutes);

const fiatRoutes = require("./routes/fiat");
app.use("/fiat", fiatRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
