const jwt = require("jsonwebtoken");

// JWT Middleware
const jwtMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.send("please login/signup");

  const jwtToken = authHeader.split(" ")[1];
  if (!jwtToken) return res.send("token not found");

  try {
    const decodedPayload = jwt.verify(jwtToken, process.env.key);
    req.userPayload = decodedPayload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "wrong token" });
  }
};

// Token generator
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.key);
};

module.exports = { jwtMiddleware, generateToken };
