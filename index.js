const connectToDB = require("./config/connectToDB");
const socketIo = require("socket.io");
const http = require("http");

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

const { createSocketConnection } = require("./controllers/chatsController");
const httpServer = http.createServer(server);
httpServer.listen(8080);
const io = socketIo(httpServer);
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
});
