const { login } = require("../controllers/authController");

const express = require("express");
const router = express.Router();

router.post("/auth/google", login);

module.exports = router;
