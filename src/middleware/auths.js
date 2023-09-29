require('dotenv').config();
const jwt = require("jsonwebtoken");

const checkJWT = function (req, res, next) {
  let value = req.get("Authorization");
  let signedToken;

  if (value) {
    let parts = value.split(" ");
    if (parts[0] === "Bearer" && parts[1]) {
      signedToken = parts[1];
    }
  }

  try {
    if (!signedToken) {
      // Token is missing in the request headers
      return res.status(401).json({ error: "Unauthorized: Token is missing." });
    }

    // Verify the token using your JWT secret
    const decoded = jwt.verify(signedToken, process.env.JWT_SECRET);

    if (!decoded.user_id) {
      // Token is invalid (missing user_id)
      return res.status(401).json({ error: "Unauthorized: Token is invalid." });
    }

    // If the token is valid, store the decoded payload in req.userinfo
    req.userinfo = decoded;

    // Continue processing the request
    next();
  } catch (err) {
    // Handle token verification errors
    console.log("Failed to verify JWT", err);
    res.status(401).json({ error: "Unauthorized: Token is invalid." });
  }
};

module.exports = {
  checkJWT,
};
