const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const CustomerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: 2,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    minlength: 2,
    required: true,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) throw new Error("Invalid email");
    },
  },
  phone: {
    type: String,
    minlength: 10,
    maxlength: 10,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  cpassword: {
    type: String,
    minlength: 6,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

CustomerSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.cpassword = await bcrypt.hash(this.cpassword, 12);
  }
  next();
});

CustomerSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (error) {
    console.log(error);
  }
};

const Customer = new mongoose.model("Customer", CustomerSchema);

module.exports = Customer;
