const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET;

  return jwt.sign({ userId }, jwtSecret, {
    expiresIn: "7d",
  });
};

module.exports = generateToken;
