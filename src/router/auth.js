const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");

require("../db/conn");
const Books = require("../models/books");
const Customer = require("../models/customer");
const Messages = require("../models/message");
const CartItems = require("../models/cart");

router.get("/", authenticate, (req, res) => {
  res.status(200).json(req.rootUser);
});

router.post("/register", async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      gender,
      dob,
      email,
      phone,
      password,
      cpassword,
    } = req.body;

    const userExist = await Customer.findOne({ email: email });
    if (userExist) {
      res.status(409).json({ status: 409, message: "User already exists" });
    } else {
      const user = new Customer({
        firstname,
        lastname,
        gender,
        dob,
        email,
        phone,
        password,
        cpassword,
      });
      // console.log(user);
      await user.save();
      res.status(201).json({
        status: 201,
        message: "User Registered Successfully!!!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const userData = await Customer.findOne({ email: email });
    if (!userData) {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid Credentials" });
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (isMatch) {
      const token = await userData.generateAuthToken();
      // res.cookie("jwtoken", token, {
      //   expires: new Date(Date.now() + 2592000000),
      //   httpOnly: true,
      // });
      return res.status(200).json({
        status: 200,
        token: token,
        email: email,
        message: "Logged In Successfully",
      });
    } else {
      return res
        .status(400)
        .json({ status: 400, message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.post("/addbook", async (req, res) => {
  try {
    const {
      name,
      category,
      qty,
      author,
      publisher,
      pprice,
      sprice,
      authordetails,
      description,
      imgsrc,
    } = req.body;
    if (
      !name ||
      !category ||
      !qty ||
      !author ||
      !publisher ||
      !pprice ||
      !sprice ||
      !authordetails ||
      !description ||
      !imgsrc
    ) {
      return res.status(422).json({ error: "Please fill all the fields" });
    }
    const bookExist = await Books.findOne({ name: name });
    if (!bookExist) {
      const book = new Books({
        name,
        category,
        qty,
        author,
        publisher,
        pprice,
        sprice,
        authordetails,
        description,
        imgsrc,
      });
      const newBook = await book.save();
      res.status(201).send(newBook);
    } else {
      res.status(422).json({ error: "Book already exists" });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/messages", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const messages = new Messages({
      email: email,
      name: name,
      message: message,
    });
    await messages.save();
    res.status(201).send({ message: "Message Saved" });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.get("/books", async (req, res) => {
  try {
    const books = await Books.find({});
    res.status(200).send(books);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.get("/books/category/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const books = await Books.find({ category: name });
    res.status(200).send(books);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.get("/books/search", async (req, res) => {
  try {
    const name = req.query.name;
    const books = await Books.find({
      $text: {
        $search: name,
        $language: "english",
        $caseSensitive: false,
        $diacriticSensitive: true,
      },
    });
    res.status(200).send(books);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.get("/book/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // console.log(id);
    const book = await Books.find({ _id: id });
    // console.log(book);
    res.status(200).send(book);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.get("/bookname", async (req, res) => {
  try {
    const name = req.query.name;
    const book = await Books.find({ name: name });
    res.status(200).send(book);
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Server Error",
    });
  }
});

router.get("/cart", async (req, res) => {
  try {
    const name = req.query.name;
    const email = req.query.email;
    const book = await CartItems.findOne({ bookname: name, email: email });
    if (book) {
      res.status(200).send({ found: true });
    } else {
      res.status(200).send({ found: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.post("/addtocart", async (req, res) => {
  try {
    const { _id, email } = req.body;
    if (!email) {
      return res.status(200).send({ message: "Login Please" });
    }
    const book = await Books.findById(_id);
    const cart = new CartItems({
      bookname: book.name,
      email: email,
      quantity: 1,
    });
    await cart.save();
    res.status(201).send({ message: "item added" });
  } catch (error) {
    res.status(404).send("Server Error");
  }
});

router.get("/cartitems", async (req, res) => {
  try {
    const email = req.query.email;
    const books = await CartItems.find({ email: email }).select(
      "bookname quantity"
    );
    // console.log(books);
    res.status(200).send(books);
  } catch (error) {
    res.status(404).send("Server Error");
  }
});

router.delete("/cart", async (req, res) => {
  try {
    const name = req.query.name;
    const book = await CartItems.deleteOne({ bookname: name });
    res.status(200).send("Book deleted");
  } catch (error) {
    res.status(404).send("Server Error");
  }
});

router.patch("/cart", async (req, res) => {
  try {
    const name = req.query.name;
    const book = await CartItems.updateOne({ bookname: name }, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).send("Quantity updated");
  } catch (error) {
    res.status(404).send("Server Error");
  }
});

router.delete("/cart/all", async (req, res) => {
  try {
    const email = req.query.email;
    const book = await CartItems.deleteMany({ email: email });
    res.status(200).send("Books deleted");
  } catch (error) {
    res.status(404).send("Server Error");
  }
});

router.post("/logout", async (req, res) => {
  try {
    const { email, token } = req.body;
    await Customer.findOneAndUpdate(
      { email, email },
      { $pull: { tokens: { token: token } } },
      { safe: true, multi: false }
    );
    res.status(200).send("Logout Successful");
  } catch (error) {
    res.status(404).send("Server Error");
  }
});

module.exports = router;
