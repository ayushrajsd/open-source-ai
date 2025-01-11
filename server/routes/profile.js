const express = require("express");
const router = express.Router();
const authenticateUser = require("../middleware/authMiddleware");
const axios = require("axios");

// GET /api/profile - Fetch GitHub profile details and contributions
router.get("/profile", authenticateUser, async (req, res, next) => {
  try {
    // Access token saved during GitHub OAuth
    const accessToken = req.cookies.github_access_token;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: No access token" });
    }

    // Fetch GitHub user profile
    const profileResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    // Extract profile details
    const { login, name, avatar_url, public_repos, html_url } =
      profileResponse.data;

    // Fetch user contributions (Pull Requests authored by the user)
    const contributionsResponse = await axios.get(
      `https://api.github.com/search/issues?q=author:${login}+is:pr`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    // Extract contribution details
    const contributions = contributionsResponse.data.items.map((item) => ({
      title: item.title,
      repo: item.repository_url.split("/").slice(-2).join("/"),
      url: item.html_url,
      status: item.state === "closed" ? "Merged" : "Open",
      date: item.closed_at || item.created_at,
    }));

    // Send the combined response
    res.json({
      profile: {
        username: login,
        name: name || login,
        avatar: avatar_url,
        repos: public_repos,
        profileUrl: html_url,
      },
      contributions,
    });
  } catch (error) {
    console.error(
      "Error fetching GitHub profile or contributions:",
      error.message
    );
    next(error);
  }
});

router.get("/logout", async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });

  // Call logout to terminate the session
  req.logout(() => {
    res.status(200).json({ message: "Successfully logged out" });
  });
});

router.get("/verify-auth", authenticateUser, (req, res) => {
  res
    .status(200)
    .json({ message: "Authenticated", user: req.user, status: 200 });
});

module.exports = router;
