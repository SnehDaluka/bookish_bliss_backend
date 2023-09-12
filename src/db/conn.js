const mongoose = require("mongoose");
mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => {
    console.log(err);
  });
