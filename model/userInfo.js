const mongoose = require("mongoose");

const User = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true,
  },

  lastActiveOn: {
    type: Date,
    required: true,
    default: Date,
  },

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  profilePic: {
    type: String,
    required: false,
  },

  chats: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserChat",
    },
  ],
});

module.exports = mongoose.model("UserData", User);
