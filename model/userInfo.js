const mongoose = require("mongoose");

const User = new mongoose.Schema({
  name: { type: String, required: true },

  email: {
    type: String,
    required: true,
  },

  //   profilePic: {
  //     type: ,
  //     required: false,
  //   },
});

module.exports = mongoose.model("UserData", User);
