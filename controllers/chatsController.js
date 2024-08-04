const UserChat = require("../model/chat"); // Mongoose model for Message

const createSocketConnection = (socket, io) => {
  console.log("New client connected");

  socket.on("sendMessage", async (message) => {
    try {
      const newMessage = new UserChat(message);
      await newMessage.save();
      io.emit("message", newMessage); // Emit the message to all clients
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = { createSocketConnection };
