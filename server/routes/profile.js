const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const axios = require("axios");

// GET /api/profile - Fetch GitHub profile details
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    // Access token saved during GitHub OAuth
    console.log("req session", req.session);
    const accessToken = req.session.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: No access token" });
    }

    // Fetch GitHub user profile using GitHub API
    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    // Extract relevant details from response
    const { login, name, avatar_url, public_repos, html_url } = response.data;

    // Send the profile details
    res.json({
      username: login,
      name: name || login,
      avatar: avatar_url,
      repos: public_repos,
      profileUrl: html_url,
    });
  } catch (error) {
    console.error("Error fetching GitHub profile:", error.message);
    res.status(500).json({ message: "Failed to fetch profile details" });
  }
});

module.exports = router;
