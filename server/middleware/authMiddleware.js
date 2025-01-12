const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    console.warn("if block Authentication failed: No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", decoded);

    req.user = decoded; // Attach user info to the request
    next();
  } catch (err) {
    console.error("catch block Authentication failed:", err.message);

    const errorResponse =
      process.env.NODE_ENV === "production"
        ? "Unauthorized: Access denied"
        : err.message;

    return res.status(401).json({ message: errorResponse });
  }
};

module.exports = authenticateUser;
