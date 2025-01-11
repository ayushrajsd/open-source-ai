const express = require("express");
const jwt = require("jsonwebtoken");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/refresh-token", authenticateUser, (req, res) => {
  // Check if user is logged in
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  // Generate a new token
  const token = jwt.sign(
    { id: req.user._id, username: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ message: "Token refreshed", token });
});

module.exports = router;
