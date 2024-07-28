const mongoose = require("mongoose");

require("dotenv").config();
const dbURL = process.env.DB_URL;

const connectToDB = () => {
  mongoose
    .connect(dbURL)
    .then(() => {
      console.log("DB connected Succesfully");
    })
    .catch((error) => {
      console.log("Error in connecting to DB: ", error);
      process.exit(1);
    });
};

module.exports = connectToDB;
