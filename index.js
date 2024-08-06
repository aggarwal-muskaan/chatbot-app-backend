const connectToDB = require("./config/connectToDB");
const socketIo = require("socket.io");
const http = require("http");

// instantiating the server
const express = require("express");
const server = express();

// populating dot env fields in process object
require("dotenv").config();
const PORT = process.env.PORT_NUMBER || 5000;

// body parser middleware
server.use(express.json());

// mounting the routes
const routes = require("./routes/routes");
server.use(routes);

// connecting to db
connectToDB();

const { createSocketConnection } = require("./controllers/chatsController");
const httpServer = http.createServer(server);
const io = socketIo(httpServer);

// socketconnection
io.on("connection", (socket) => {
  createSocketConnection(socket, io);
});

// listening http server on port
httpServer.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
});
