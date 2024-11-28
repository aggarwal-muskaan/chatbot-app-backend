const connectToDB = require("./config/connectToDB");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
const http = require("http");

const cors = require("cors");

// instantiating the server
const express = require("express");
const server = express();

// populating dot env fields in process object
require("dotenv").config();
const PORT = process.env.PORT_NUMBER || 5000;

// body parser middleware
server.use(express.json());

// adding cors middleware to facilitate communication between server(backend) and client(frontend) via requests and responses
const allowedOrigins = ["http://localhost:8081"];
server.use(
  cors({
    origin: allowedOrigins, // front end path(url) from where the request will be made to the backend or server
    credentials: true,
  })
);

// mounting the routes
const routes = require("./routes/routes");
server.use(routes);

server.get("/", (req, res) => {
  res.send(`<h1>HELLO</h1>`);
});

// connecting to db
connectToDB();

const { createSocketConnection } = require("./controllers/chatsController");
const httpServer = http.createServer(server);
const io = socketIo(httpServer);

// socket middleware
io.use((socket, next) => {
  const accessToken = socket.handshake.auth.token;
  if (accessToken) {
    try {
      const user = jwt.verify(accessToken, process.env.JWT_SECRET);
      socket.user = user; // Attach user info to the socket object
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  } else {
    next(new Error("No token provided"));
  }
});

// socketconnection
io.on("connection", (socket) => {
  createSocketConnection(socket, io);
});

// listening http server on port
httpServer.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
});
