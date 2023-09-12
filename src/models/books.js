const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  qty: {
    type: Number,
    required: true,
  },
  author: {
    type: String,
    required: true,
    trim: true,
  },
  publisher: {
    type: String,
    required: true,
    trim: true,
  },
  pprice: {
    type: Number,
    required: true,
  },
  sprice: {
    type: Number,
    required: true,
  },
  authordetails: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  imgsrc: {
    type: String,
    required: true,
  },
});

ItemSchema.index({ name: "text" });
const Books = new mongoose.model("Book", ItemSchema);

module.exports = Books;
