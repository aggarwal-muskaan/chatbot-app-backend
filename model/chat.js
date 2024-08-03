const mongoose = require("mongoose");

const Chats = new mongoose.Schema({
  sentAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },

  chatMessage: {
    type: String,
    required: true,
  },

  //   updatedAt:{}
});

module.exports = mongoose.model("UserChat", Chats);
