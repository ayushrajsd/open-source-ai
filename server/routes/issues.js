const express = require("express");
const axios = require("axios");
const authenticateUser = require("../middleware/authMiddleware");
const { rankIssues, classifyDifficulty } = require("../utils/issueHelpers");
const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const router = express.Router();

const GITHUB_API_BASE_URL = "https://api.github.com";

// GET /api/issues
router.get("/", authenticateUser, async (req, res) => {
  try {
    const {
      preferredLanguages,
      preferredCategories,
      page = 1,
      limit = 10,
    } = req.query;

    console.log("Access Token in Session:", req.session.accessToken);

    // Generate the GitHub API query based on preferences
    let query = "is:open";
    if (preferredLanguages) {
      query += ` language:${preferredLanguages}`;
    }
    if (preferredCategories) {
      query += ` label:${preferredCategories}`;
    }

    if (!preferredLanguages && !preferredCategories) {
      query += " good-first-issues";
    }

    // GitHub Search Issues API
    const response = await axios.get(
      `${GITHUB_API_BASE_URL}/search/issues?q=${encodeURIComponent(
        query
      )}&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `token ${req.session.accessToken}`,
        },
      }
    );

    const issues = await Promise.all(
      response.data.items.map(async (issue) => {
        let summary = "Summary unavailable";
        let difficulty = "Medium"; // Placeholder for difficulty (enhance later)

        if (issue.body) {
          try {
            console.log(`Generating summary for issue: ${issue.title}`);
            difficulty = await classifyDifficulty(issue.title, issue.body); // Call helper
            const aiResponse = await openai.chat.completions.create({
              model: "gpt-4",
              messages: [
                {
                  role: "system",
                  content:
                    "Provide a short summary for GitHub issues for beginner developers.",
                },
                {
                  role: "user",
                  content: `Summarize the following issue:\n\nTitle: ${
                    issue.title
                  }\n\nBody: ${issue.body || "No description provided."}`,
                },
              ],
              max_tokens: 100,
              temperature: 0.7,
            });

            summary =
              aiResponse.choices[0]?.message?.content?.trim() || summary;
          } catch (aiError) {
            console.error(
              `Error generating AI summary for issue "${issue.title}":`,
              aiError.message
            );
          }
        }

        const repoUrl = issue.repository_url;
        const repoData = await axios.get(repoUrl, {
          headers: {
            Authorization: `token ${req.session.accessToken}`,
          },
        });

        return {
          id: issue.id,
          title: issue.title,
          url: issue.html_url,
          repository: repoData.data.full_name,
          created_at: issue.created_at,
          labels: issue.labels.map((label) => label.name),
          stars: repoData.data.stargazers_count,
          forks: repoData.data.forks_count,
          summary,
          difficulty,
        };
      })
    );

    res.json(rankIssues(issues));
  } catch (error) {
    console.error("Error fetching GitHub issues:", error.message);
    res.status(500).json({ message: "Failed to fetch GitHub issues" });
  }
});

module.exports = router;
