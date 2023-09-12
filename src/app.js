require("dotenv").config();
const express = require("express");
require("./db/conn");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;
let corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: ["GET, PATCH, DELETE, POST"],
  credentials: true,
};

const app = express();
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(require("./router/auth"));
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Connecting at the port ${port}`);
});
