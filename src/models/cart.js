const mongoose = require("mongoose");
const validator = require("validator");

const cartSchema = new mongoose.Schema({
  bookname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email");
    },
  },
  quantity: {
    type: Number,
    requiredL: true,
  },
});

const CartItems = mongoose.model("Cart-item", cartSchema);

module.exports = CartItems;
