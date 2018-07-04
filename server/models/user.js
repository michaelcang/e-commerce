const mongoose = require("mongoose");

let Schema = mongoose.Schema;
let userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"]
    },
    password: {
      type: String,
      required: [true, "Password is required"]
    },
    role: {
      type: String,
      required: [true, "Role is required"]
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);
