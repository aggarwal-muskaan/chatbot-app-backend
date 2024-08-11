// importing the controllers
const { login } = require("../controllers/authController");
const { getAllMessages } = require("../controllers/getAllMessages");
const { isTokenValid } = require("../middleware/auth");

const express = require("express");
const router = express.Router();

// creating routes and attaching their associated controllers
router.post("/auth/google", login);

router.get("/getAllMessages", isTokenValid, getAllMessages);

module.exports = router;
