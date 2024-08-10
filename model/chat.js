const mongoose = require("mongoose");

const Chats = new mongoose.Schema({
  sentAt: {
    type: Date,
    required: true,
    default: Date,
  },

  chatMessage: {
    type: String,
    required: true,
    trim: true,
  },

  isAIResponse: {
    type: Boolean,
    required: true,
    default: false,
  },

  //   updatedAt:{}
});

module.exports = mongoose.model("UserChat", Chats);
