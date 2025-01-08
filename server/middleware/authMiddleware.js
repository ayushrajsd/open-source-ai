const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    const errorResponse =
      process.env.NODE_ENV === "production"
        ? "Unauthorized: Access denied"
        : err.message;

    return res.status(401).json({ message: errorResponse });
  }
};

module.exports = authenticateUser;
