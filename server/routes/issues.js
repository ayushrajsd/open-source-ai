const express = require("express");
const axios = require("axios");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

const GITHUB_API_BASE_URL = "https://api.github.com";

// GET /api/issues
router.get("/", authenticateUser, async (req, res) => {
  try {
    const { preferredLanguages, preferredCategories } = req.query; // Pass preferences via query params
    console.log("Access Token in Session:", req.session.accessToken);

    // Generate the GitHub API query based on preferences
    let query = "is:open";
    if (preferredLanguages) {
      query += ` language:${preferredLanguages}`;
    }
    if (preferredCategories) {
      query += ` label:${preferredCategories}`;
    }

    // Fallback if no preferences provided
    if (!preferredLanguages && !preferredCategories) {
      query += " good-first-issues"; // Fetch beginner-friendly issues
    }

    // GitHub Search Issues API
    const response = await axios.get(
      `${GITHUB_API_BASE_URL}/search/issues?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `token ${req.session.accessToken}`, // Use personal access token
        },
      }
    );

    const issues = response.data.items.map((issue) => ({
      id: issue.id,
      title: issue.title,
      url: issue.html_url,
      repository: issue.repository_url.split("/").slice(-1)[0], // Extract repo name
      created_at: issue.created_at,
      labels: issue.labels.map((label) => label.name),
    }));

    res.json(issues);
  } catch (error) {
    console.error("Error fetching GitHub issues:", error.message);
    res.status(500).json({ message: "Failed to fetch GitHub issues" });
  }
});

module.exports = router;
