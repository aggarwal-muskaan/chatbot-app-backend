const { GoogleGenerativeAI } = require("@google/generative-ai");
const UserChat = require("../model/chat"); // Mongoose model for Message
const Recipes = require("../model/recipe");
const Itineraries = require("../model/itinerary");
const UserData = require("../model/userInfo");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// handler to generate response
exports.setContextGenerateResponse = async ({
  userEmail,
  userNewMessage,
  chatType,
}) => {
  const user = await UserData.find({ email: userEmail });

  // finding the last 6 chatIds of user based on the type of chat the user is on frontend.
  const chatIds =
    chatType === "chat"
      ? user[0]?.chats?.slice(0, 6)
      : chatType === "recipe"
      ? user[0]?.recipes?.slice(0, 6)
      : user[0]?.itineraries?.slice(0, 6);

  // need to set the context when socket connection is established
  // based on the type of chats, finding chats in associated chat models
  const lastSixChatMessages =
    chatType === "chat"
      ? await UserChat.find({
          _id: { $in: chatIds },
        }).populate()
      : chatType === "recipe"
      ? await Recipes.find({
          _id: { $in: chatIds },
        }).populate()
      : await Itineraries.find({
          _id: { $in: chatIds },
        }).populate();

  // getting the last 3 user messages
  const userChatMessages = lastSixChatMessages.filter(
    (message) => !message.isAIResponse
  );
  // getting the last 3 AI model responses
  const modelResponse = lastSixChatMessages.filter(
    (message) => message.isAIResponse
  );

  // setting context only if there are atleast 2 chat messages (one user's and one AIresponse to that)
  const chat = model.startChat(
    chatIds?.length && {
      history: [
        // user context
        {
          role: "user",
          parts: userChatMessages.map((userMessage) => ({
            text: userMessage.chatMessage,
          })),
        },
        // AI (model) context
        {
          role: "model",
          parts: modelResponse.map((response) => ({
            text: response.chatMessage,
          })),
        },
      ],
    }
  );

  // generating the resposne from the newly sent user message based on the set context
  const result = await chat.sendMessage(`${userNewMessage}`);
  return result.response.text();
};
