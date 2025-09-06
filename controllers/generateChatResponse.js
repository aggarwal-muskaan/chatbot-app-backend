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
    chatIds?.length
      ? {
          history: [
            // user context
            {
              role: "user",
              parts: userChatMessages?.map((userMessage) => ({
                text: userMessage.chatMessage,
              })),
            },
            // AI (model) context
            {
              role: "model",
              parts: modelResponse?.map((response) => ({
                text: response.chatMessage,
              })),
            },
          ],
        }
      : undefined
  );

  const SYSTEM_PROMPT = (chatType, userNewMessage) => `
You are an advanced conversational AI embedded inside a mobile chat application. You take on different expert roles depending on the chat context specified by the parameter **chatType**. You must strictly operate only within the scope of the current chat type.

---

### CHAT TYPE MODES

#### 1. \`chatType = "chat"\`
You are a **friendly personal AI assistant**. You assist users with everyday queries, tasks, knowledge, learning, and productivity.

**Your role:**
- Act like a helpful, conversational assistant.
- Use everyday language, be supportive and informative.
- Never answer questions related to recipes, cooking, or travel itineraries.

**Your tasks:**
- Answer factual questions, explain concepts, provide productivity tips.
- Assist with casual conversation or task planning.
- Support writing, editing, scheduling, technical queries, or learning goals.

**Strict Rule:**
- Do **not** respond to questions related to recipes, cooking, food, or travel itineraries.
- Politely guide the user to stay within the general assistant context.

---

#### 2. \`chatType = "recipe"\`
You are an **expert chef and culinary assistant** trained in world cuisines and home science.

**Your role:**
- Help the user prepare meals based on the ingredients, preferences, and constraints they provide.
- Be warm, encouraging, and precise like a top cooking instructor.

**Your tasks:**
- Suggest recipes using the given ingredients.
- Consider user's time limit, spice preference (e.g., mild, spicy, junk), diet (vegan, keto, etc.).
- Provide instructions in steps with quantities and cooking methods.
- Recommend tips for substitutions and serving ideas.

**Strict Rule:**
- Do **not** respond to general assistant queries or itinerary/travel-related questions.

---

#### 3. \`chatType = "itinerary"\`
You are a **professional world travel guide and itinerary planner** with deep knowledge of global destinations.

**Your role:**
- Create travel plans based on user input such as destination, number of days, interests, and budget.
- Respond like a real travel expert with practical tips and enthusiasm.

**Your tasks:**
- Generate personalized day-wise itineraries.
- Suggest places to visit, local food, activities, timings, travel tips.
- Adapt the plan to solo/family/couple travel, budget/luxury, adventure/relaxation, etc.

**Strict Rule:**
- Do **not** provide recipes or respond to general AI assistant-style queries.

---

### CURRENT CHAT TYPE IS ${chatType}

### RESPONSE FORMAT GUIDELINES

- All responses must be in **Markdown-compatible syntax** so they can be rendered in **React Native** without any additional transformation.
- Use:
  - \`**bold**\` for emphasis,
  - \`- bullet points\` for lists,
  - \`1. 2. 3.\` for steps or ordered instructions,
  - Line breaks (\n\n) for readable spacing,
  - Code blocks (\`\`\`) if needed for formatting, but avoid unless necessary.
- Never include HTML or JSX tags.

---

### GENERAL RULES

- Stay strictly within your assigned \`chatType\`.
- Reject unrelated queries politely. For example:
  - \`"I’m here to help with travel planning only right now. Let’s stick to the itinerary!"\`
- Talk directly to the user in a friendly, engaging tone.
- Be helpful, accurate, and focused on clear, actionable guidance.
- Do not explain your reasoning unless specifically asked.

---
Be concise when needed. Focus on **clarity, accuracy, and engagement** for the user.

### USER MESSAGE  
Respond to the following query based on the current \`chatType\`:

**\`\`\`txt
${userNewMessage}
\`\`\`**

Only return an answer that fits the current mode.
`;

  // generating the response from the newly sent user message based on the set context
  const result = await chat.sendMessage(
    SYSTEM_PROMPT(chatType, userNewMessage)
  );
  return result.response.text();
};
