const express = require("express");
const { connection } = require("./config/db");
require("dotenv").config();

const { UserRouter } = require("./routes/user.route");
const { RestaurantRouter } = require("./routes/resturant.route");
const { OrderRouter } = require("./routes/order.route");

const app = express();

app.use(express.json());

app.use("/user", UserRouter);

app.use("/restaurants", RestaurantRouter);

app.use("/orders", OrderRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to Db");
    console.log(`Listening on PORT ${process.env.PORT}`);
  } catch (err) {
    console.log(err);
    console.log("Error connecting to Db");
  }
});
