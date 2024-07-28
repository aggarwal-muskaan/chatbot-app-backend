const connectToDB = require("./config/connectToDB");

// instantiating the server
const express = require("express");
const server = express();

// popultating dot env fields in process object
require("dotenv").config();
const PORT = process.env.PORT_NUMBER || 5000;

// listening on port
server.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
});

// connecting to db
connectToDB();

// default route
server.get("/", (req, res) => {
  res.send(`<h1>Hello</h1>`);
});
