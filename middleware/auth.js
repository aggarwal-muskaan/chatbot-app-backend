const UserData = require("../model/userInfo");

const jwt = require("jsonwebtoken");

exports.isTokenValid = async (request, response) => {
  // extracting the token from request header (replace Bearer_ with '')
  const authToken = request.headers["authorization"].replace("Bearer ", "");

  try {
    const veifiedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    console.log("Token Payload: ", veifiedToken);
  } catch (error) {
    console.log("ERROR in token verification: ", error);
    return response.status(401).json({
      success: false,
      message: "Invalid Token.",
      error,
    });
  }
};
