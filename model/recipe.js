const mongoose = require("mongoose");

const recipe = new mongoose.Schema({
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

  isSaved: {
    type: Boolean,
    required: true,
    default: false,
  },
});

module.exports = mongoose.model("Recipes", recipe);
