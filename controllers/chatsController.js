const UserChat = require("../model/chat"); // Mongoose model for Message
const UserData = require("../model/userInfo");
const { generateResponse } = require("./generateChatResponse");

const createSocketConnection = (socket, io) => {
  console.log("New client connected");

  socket.on("sendMessage", async (message) => {
    try {
      // create a new entry in user-chats collections
      const newUserMessage = await UserChat.create({ chatMessage: message });

      // todo: try to push both user message and the AI message into dB at once
      // pushing this message into user's array of chats
      const updatedChats = await UserData.findOneAndUpdate(
        {
          // todo: fetch this email dynamically
          email: "miheer.sharma1@gmail.com",
        },
        {
          $push: { chats: { $each: [newUserMessage._id], $position: 0 } },
        },
        { new: true }
      );

      // generate chat response
      const aiResponse = await generateResponse(message);

      // store AI response chat message in user-chat collections in DB
      const newResponseMessage = await UserChat.create({
        chatMessage: aiResponse,
        isAIResponse: true,
      });

      // pushing this response message into user's array of chats
      const updatedChatsAfterResponse = await UserData.findOneAndUpdate(
        {
          email: "miheer.sharma1@gmail.com",
        },
        {
          $push: { chats: { $each: [newResponseMessage._id], $position: 0 } },
        },
        { new: true }
      );

      socket.emit("response", aiResponse);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = { createSocketConnection };
