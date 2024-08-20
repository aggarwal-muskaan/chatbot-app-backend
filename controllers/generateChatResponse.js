const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const chat = model.startChat({
  history: [
    // TODO: handle contexts
    // user context
    {
      role: "user",
      parts: [
        {
          text: "",
        },
      ],
    },
    // AI (model) context
    {
      role: "model",
      parts: [
        {
          text: "",
        },
      ],
    },
  ],
});

// handler to generate response
exports.generateResponse = async (userMessage) => {
  let result = await chat.sendMessage(`${userMessage}`);
  console.log(result.response.text());
  return result.response.text();
};
