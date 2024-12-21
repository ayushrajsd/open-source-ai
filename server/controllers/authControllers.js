const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.githubCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    // Extract user details from GitHub profile
    const { id, username, profileUrl, photos, _json } = profile;
    const email = _json.email || null;

    // Check if the user already exists
    let user = await User.findOne({ githubId: id });

    if (!user) {
      // Create a new user if not found
      user = new User({
        githubId: id,
        username,
        email,
        avatarUrl: photos[0]?.value,
        profileUrl,
      });
      await user.save();
    }

    // Return user
    return done(null, user);
  } catch (error) {
    console.error("Error in GitHub OAuth:", error.message);
    return done(error, null);
  }
};

exports.getJwtToken = (req, res) => {
  if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  // Generate JWT token
  const token = jwt.sign(
    { id: req.user._id, username: req.user.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    message: "Login successful",
    token,
    user: {
      id: req.user._id,
      username: req.user.username,
      avatarUrl: req.user.avatarUrl,
      profileUrl: req.user.profileUrl,
    },
  });
};
