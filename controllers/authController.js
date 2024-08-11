const { OAuth2Client } = require("google-auth-library");
const JSONwebToken = require("jsonwebtoken");

const UserData = require("../model/userInfo");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// login token verification controller
const login = async (req, res) => {
  // fetching the token from request body
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // check if the user is new or already existing
    const isNewUser = await isUserNew(payload.email);

    // create a new JWT token
    const userAccessToken = await fetchToken(payload.email, payload.name);

    // if new user create its entry in the DB
    if (isNewUser) {
      const isSuccessful = createNewUserEntry({
        user: payload,
        accessToken: userAccessToken,
      });

      // if user entry in DB is obstructed, send an unsuccessful response
      if (!isSuccessful) {
        return res.status(500).json({
          message: "There is some error in sign up. Please try again later",
        });
        return;
      }
    } else {
      // update accessToken for existing user
      const updatedUserEntry = await UserData.findOneAndUpdate(
        { email: payload.email },
        { accessToken: userAccessToken, lastActiveOn: Date() },
        { new: true }
      );

      // if there is a problem in updating the usertoken, return an unsuccessful response
      if (!updatedUserEntry) {
        return res.status(500).json({
          success: false,
          message:
            "Error in creating new jwt token. Please try again after some time!",
        });
      }
    }

    // data to be sent back to client on successful response
    const data = {
      name: payload.name,
      email: payload.email,
      profilePic: payload.picture,
      isNewUser,
    };

    // success status
    return res.status(200).json({ message: "Token is valid", data });
  } catch (error) {
    console.log("error in TOKEN VERIICATION: ", error);
    return res
      .status(401)
      .json({ error: "Invalid token", message: error.message });
  }
};

// function to generate a JWT token
const fetchToken = async (userEmail, name) => {
  const jwtToken = JSONwebToken.sign(
    {
      email: userEmail,
      name: name,
    },
    process.env.JWT_SECRET,
    // no token expiry
    {}
  );

  return jwtToken;
};

// function to check of the user is new (sing up) or already existing one (login)
const isUserNew = async (userEmail) => {
  // check if user exists in our db `isNewUser`
  let isUserNew = false;
  const debug = await UserData.find({ email: userEmail });

  if (!debug.length) isUserNew = true;

  return isUserNew;
};

// function to create a new user entry in DB on sign up
const createNewUserEntry = async ({ user, accessToken }) => {
  // create new entry for a user in db
  const createdUser = await UserData.create({
    name: user.name,
    email: user.email,
    profilePic: user.picture,
    accessToken,
  });

  // if there is a problem in creating the new user entry in the DB, return false so that response is set to unsuccessful
  if (!createdUser) return false;

  return true;
};

module.exports = { login };
