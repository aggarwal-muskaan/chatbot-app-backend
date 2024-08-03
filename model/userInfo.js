const mongoose = require("mongoose");

const User = new mongoose.Schema({
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
