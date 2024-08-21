const {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  StartChatParams,
} = require("@google/generative-ai");
const UserChat = require("../model/chat"); // Mongoose model for Message

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chat;

exports.setChatContext = async () => {
  console.log("Insdie Set Context ()");
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

  chat = model.startChat({
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
};

// handler to generate response
exports.generateResponse = async (userMessage) => {
  let result = await chat.sendMessage(`${userMessage}`);
  console.log(result.response.text());
  return result.response.text();
};
