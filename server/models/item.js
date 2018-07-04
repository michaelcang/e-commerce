const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let itemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"]
    },
    price: {
      type: Number,
      required: [true, "Price is required"]
    },
    imageUrl: {
      type: String,
      required: [true, "Image is required"]
    },
    category: {
      type: String,
      required: [true, "Category is required"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("items", itemSchema);
