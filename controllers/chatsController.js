const UserChat = require("../model/chat"); // Mongoose model for Message
const UserData = require("../model/userInfo");

const createSocketConnection = (socket, io) => {
  console.log("New client connected");

  socket.on("sendMessage", async (message) => {
    try {
      const newMessage = await UserChat.create({ chatMessage: message });

      // pushing this message into user's array of chats
      const updatedChats = await UserData.findOneAndUpdate(
        {
          email: "miheer.sharma1@gmail.com",
        },
        {
          $push: { chats: { $each: [newMessage._id], $position: 0 } },
        },
        { new: true }
      );

      io.emit("message", newMessage);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = { createSocketConnection };
