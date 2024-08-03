const express = require("express");
const router = express.Router();

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_WEB);

router.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID_WEB,
    });
    const payload = ticket.getPayload();
    res.status(200).json({ message: "Token is valid", user: payload });
  } catch (error) {
    console.log("error in TOKEN VERIICATION: ", error);
    res.status(401).json({ error: "Invalid token", message: error });
  }
});

module.exports = router;
