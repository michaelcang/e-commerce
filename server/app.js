require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const indexRouter = require("./routes/index");
const itemRouter = require("./routes/item");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

let options = {
  user: process.env.DB_USERNAME,
  pass: process.env.DB_PASSWORD
};

let url = "mongodb://ds247670.mlab.com:47670/mc-ecommerce"

mongoose.connect(
  url,
  options,
  () => {
    console.log("connected to database");
  }
);

app.use("/", indexRouter);
app.use("/item", itemRouter);

app.listen(3000, () => {
  console.log("listening in port 3000");
});
