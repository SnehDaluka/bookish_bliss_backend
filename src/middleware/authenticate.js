const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");

const authenticate = async (req, res, next) => {
  try {
    const token = req.query.token;
    // console.log(req.query.token);
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);

    const rootUser = await Customer.findOne({
      _id: verifyToken._id,
      "tokens.token": token,
    });

    if (!rootUser) throw new Error("User not found");
    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    next();
  } catch (error) {
    res.status(401).send("Unauthorized:no token provided");
  }
};

module.exports = authenticate;
