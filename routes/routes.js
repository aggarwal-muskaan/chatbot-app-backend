// importing the controllers
const { login } = require("../controllers/authController");
const { getAllMessages } = require("../controllers/getAllMessages");
const { saveChatMessage } = require("../controllers/saveChatController");
const { getAllSavedMessages } = require("../controllers/getAllSavedMessages");
const { isTokenValid } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

// creating routes and attaching their associated controllers
router.post("/auth/google", login);

// save a message
router.put("/saveChatMessage", isTokenValid, saveChatMessage);

// get all chats
router.get("/getAllMessages", isTokenValid, getAllMessages);

// get saved chat messages
router.get("/getAllSavedMessages", isTokenValid, getAllSavedMessages);

module.exports = router;
