const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], "secretkey");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "INVALID_TOKEN",
      message: "Invalid token",
    });
  }
};

module.exports = authMiddleware;