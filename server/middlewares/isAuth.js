const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "No token provided. Please login.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Authentication failed. Please login again.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );
      req.user = decoded.id;
      next();
    } catch (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        status: "error",
        message: "Token expired. Please login again.",
      });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({
      status: "error",
      message: "Authentication failed. Please try again.",
    });
  }
};

module.exports = isAuthenticated;
