const mongoose = require("mongoose");
const validator = require("validator");

const messageSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email");
    },
  },
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Messages = mongoose.model("Message", messageSchema);

module.exports = Messages;
