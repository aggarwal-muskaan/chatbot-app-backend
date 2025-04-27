const UserChat = require("../model/chat"); // Mongoose model for Message
const Recipes = require("../model/recipe");
const Itineraries = require("../model/itinerary");
const UserData = require("../model/userInfo");
const { setContextGenerateResponse } = require("./generateChatResponse");

const createSocketConnection = (socket, io) => {
  console.log("New client connected");

  socket.on("sendMessage", async (message, chatType) => {
    try {
      // set context for the chat & generate response
      const aiResponse = await setContextGenerateResponse({
        userEmail: socket.user.email,
        userNewMessage: message,
        chatType: chatType,
      });

      // create a new entry in chat type collections
      let newUserMessage = "";
      if (chatType === "chat") {
        newUserMessage = await UserChat.create({ chatMessage: message });
      } else if (chatType === "recipe") {
        newUserMessage = await Recipes.create({ chatMessage: message });
      } else if (chatType === "itinerary") {
        newUserMessage = await Itineraries.create({ chatMessage: message });
      }

      // store AI response chat message in chat type collections in DB
      const modelMap = {
        chat: UserChat,
        recipe: Recipes,
        itinerary: Itineraries,
      };
      const Model = modelMap[chatType];
      const newResponseMessage = Model
        ? await Model.create({
            chatMessage: aiResponse,
            isAIResponse: true,
          })
        : null;

      // creating an update query based on the chat type to be pushed into user data's concerned array for this chat type.
      const fieldName =
        chatType === "chat"
          ? "chats"
          : chatType === "recipe"
          ? "recipes"
          : "itineraries";
      const updateQuery = {
        $push: {
          [fieldName]: {
            $each: [newResponseMessage._id, newUserMessage._id],
            $position: 0,
          },
        },
      };

      // pushing this response message into user's array of chats
      const updatedChatsAfterResponse = await UserData.findOneAndUpdate(
        {
          email: socket.user.email,
          // email: "miheer.sharma1@gmail.com",
        },
        updateQuery,
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
