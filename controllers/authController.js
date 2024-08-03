const UserData = require("../model/userInfo");

const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID_WEB);

const login = async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID_WEB,
    });
    const payload = ticket.getPayload();

    const isNewUser = await isUserNew(payload.email);
    if (isNewUser) {
      const isSuccessful = createNewUserEntry(payload);

      if (!isSuccessful) {
        res.status(400).json({ message: "" });
        return;
      }
    }

    const data = {
      name: payload.name,
      email: payload.email,
      profilePic: payload.picture,
      isNewUser,
    };
    // success status
    res.status(200).json({ message: "Token is valid", data });
  } catch (error) {
    console.log("error in TOKEN VERIICATION: ", error);
    res.status(401).json({ error: "Invalid token", message: error.message });
  }
};

const isUserNew = async (userEmail) => {
  // check if user exists in our db `isNewUser`
  let isUserNew = false;
  const debug = await UserData.find({ email: userEmail });

  if (!debug.length) isUserNew = true;

  return isUserNew;
};

const createNewUserEntry = async (user) => {
  // create new entry for a user in db
  const createdUser = await UserData.create({
    name: user.name,
    email: user.email,
  });

  //   todo: check if operation is successful
};

module.exports = { login };
