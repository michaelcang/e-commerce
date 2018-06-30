const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    username: String,
    password: String,
    role: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
