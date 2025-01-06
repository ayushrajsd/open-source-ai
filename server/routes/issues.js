const express = require("express");
const authenticateUser = require("../middleware/authMiddleware");
const {
  fetchIssuesFromGitHub,
  fetchRepositoryDetails,
  fetchIssueDetails,
} = require("../services/githubService");
const {
  rankIssues,
  classifyDifficulty,
  generateSummary,
  generateDebuggingTips,
} = require("../utils/issueHelpers");

const GITHUB_API_BASE_URL = "https://api.github.com";

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
      const {
        id,
        number,
        title,
        body,
        labels,
        html_url,
        repository_url,
        created_at,
      } = issue;

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
        number,
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

router.get("/:issueNumber", authenticateUser, async (req, res) => {
  const { issueNumber } = req.params;
  const accessToken = req.session.accessToken;

  try {
    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: No GitHub token" });
    }

    // Dynamically fetch repository from query parameters
    const repository = req.query.repository;
    console.log("Repository:", repository);

    if (!repository) {
      return res.status(400).json({ message: "Repository is required" });
    }

    // Construct the GitHub API repository URL
    const repositoryUrl = `${GITHUB_API_BASE_URL}/repos/${repository}`;

    // Fetch the issue details using the issue ID and repository URL
    const issue = await fetchIssueDetails(
      repositoryUrl,
      issueNumber,
      accessToken
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Process the issue using existing logic
    const processedIssues = await processIssues([issue], accessToken);

    // Check if the processed issue exists
    if (processedIssues.length === 0) {
      return res.status(404).json({ message: "Processed issue not found" });
    }

    res.json(processedIssues[0]);
  } catch (error) {
    console.error("Error fetching issue details:", error.message);
    res.status(500).json({ message: "Failed to fetch issue details" });
  }
});

router.get("/:issueNumber/debug-tips", authenticateUser, async (req, res) => {
  const { issueNumber } = req.params;
  const repository = req.query.repository;
  const repositoryUrl = `${GITHUB_API_BASE_URL}/repos/${repository}`;

  try {
    const issue = await fetchIssueDetails(
      repositoryUrl,
      issueNumber,
      req.session.accessToken
    );
    const tips = await generateDebuggingTips(issue.title, issue.body);
    res.json({ tips });
  } catch (error) {
    console.error("Error generating debugging tips:", error.message);
    res.status(500).json({ message: "Failed to generate debugging tips" });
  }
});

module.exports = router;
