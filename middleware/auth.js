const jwt = require("jsonwebtoken");

exports.isTokenValid = async (request, response, next) => {
  // extracting the token from request header (replace Bearer_ with '')
  const authToken = request.headers["authorization"].replace("Bearer ", "");

  try {
    const verifiedToken = jwt.verify(authToken, process.env.JWT_SECRET);
    request.user = verifiedToken;
  } catch (error) {
    console.log("ERROR in token verification: ", error);
    return response.status(401).json({
      success: false,
      message: "Invalid Token.",
      error,
    });
  }

  next();
};
