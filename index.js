const connectToDB = require("./config/connectToDB");

// instantiating the server
const express = require("express");
const server = express();

// populating dot env fields in process object
require("dotenv").config();
const PORT = process.env.PORT_NUMBER || 5000;

// listening on port
server.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
});

// body parser middleware
server.use(express.json());

// mounting the routes
const routes = require("./routes/routes");
server.use(routes);

// connecting to db
connectToDB();
