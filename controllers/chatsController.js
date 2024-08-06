const UserChat = require("../model/chat"); // Mongoose model for Message
const UserData = require("../model/userInfo");

const createSocketConnection = (socket, io) => {
  // todo: this runs once, when new connection is created, same for disconnect, but socket events handlers run everytime, how -> read
  console.log("New client connected");

  // todo: is name "sendMessage" predefined or we can give any custom name to event
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
      console.log("updatedChats: ", updatedChats);

      // todo: UNDERSTAND what emit does, Emit the message to all clients
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
