// importing the controllers
const { login } = require("../controllers/authController");

const express = require("express");
const router = express.Router();

// creating routes and attaching their associated controllers
router.post("/auth/google", login);

module.exports = router;
