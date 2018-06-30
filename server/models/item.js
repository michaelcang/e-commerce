const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let itemSchema = new Schema(
  {
    name: String,
    price: Number,
    imageUrl: String,
    category: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("items", itemSchema);