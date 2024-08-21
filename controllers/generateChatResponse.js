const { GoogleGenerativeAI } = require("@google/generative-ai");
const UserChat = require("../model/chat"); // Mongoose model for Message

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// handler to generate response

exports.setContextGenerateResponse = async (userNewMessage) => {
  // need to set the context when socket connection is established
  const lastSixChatMessages = await UserChat.find()
    .sort({ _id: -1 }) // Sort by _id in descending order to get the latest entries
    .limit(6) // Limit the results to the latest 6 entries
    .exec();

  const userChatMessages = lastSixChatMessages.filter(
    (message) => !message.isAIResponse
  );
  const modelResponse = lastSixChatMessages.filter(
    (message) => message.isAIResponse
  );

  const chat = model.startChat({
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
  });

  const result = await chat.sendMessage(`${userNewMessage}`);
  return result.response.text();
};
