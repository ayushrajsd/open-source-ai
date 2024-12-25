const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const {
  fetchIssuesFromGitHub,
  fetchRepositoryDetails,
} = require("../services/githubService");
const {
  rankIssues,
  classifyDifficulty,
  generateSummary,
} = require("../utils/issueHelpers");

const router = express.Router();

/**
 * Process GitHub issues: classify difficulty, fetch repo details, and add summary.
 * @param {Array} issues - List of issues fetched from GitHub.
 * @param {String} accessToken - GitHub access token.
 * @returns {Array} - Processed issues with additional metadata.
 */
const processIssues = async (issues, accessToken) => {
  return await Promise.all(
    issues.map(async (issue) => {
      const { id, title, body, labels, html_url, repository_url, created_at } =
        issue;

      let difficultyLevel = "Medium";
      let summary = "Summary unavailable";
      let repository = "Unknown Repository";
      let stars = 0;
      let forks = 0;

      // Classify difficulty
      try {
        difficultyLevel = await classifyDifficulty(title, body, labels);
      } catch (err) {
        console.error(
          `Error classifying difficulty for issue "${title}":`,
          err.message
        );
      }

      // Fetch repository details
      try {
        const repoDetails = await fetchRepositoryDetails(
          repository_url,
          accessToken
        );
        repository = repoDetails.repository;
        stars = repoDetails.stars;
        forks = repoDetails.forks;
      } catch (err) {
        console.warn(
          `Skipping repository details for issue "${title}" due to error:`,
          err.message
        );
      }

      // Generate summary using OpenAI
      if (body) {
        try {
          summary = await generateSummary(title, body);
        } catch (err) {
          console.error(
            `Error generating summary for issue "${title}":`,
            err.message
          );
        }
      }

      return {
        id,
        title,
        url: html_url,
        repository,
        created_at,
        labels: labels.map((label) => label.name),
        stars,
        forks,
        summary,
        difficulty: difficultyLevel,
      };
    })
  );
};

// GET /api/issues
router.get("/", authenticateUser, async (req, res) => {
  try {
    const {
      preferredLanguages,
      preferredCategories,
      difficulty,
      page = 1,
      limit = 10,
    } = req.query;

    console.log("Difficulty filter received:", difficulty);
    const accessToken = req.session.accessToken;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: No GitHub token" });
    }

    // Fetch raw issues from GitHub
    const issues = await fetchIssuesFromGitHub({
      accessToken,
      preferredLanguages,
      preferredCategories,
      difficulty,
      page,
      limit,
    });

    // Process issues: add difficulty, repo details, and summaries
    const processedIssues = await processIssues(issues, accessToken);

    // Rank and return issues
    res.json(rankIssues(processedIssues.filter((issue) => issue !== null)));
  } catch (error) {
    console.error("Error processing issues:", error.message);
    res.status(500).json({ message: "Failed to process issues." });
  }
});

module.exports = router;
