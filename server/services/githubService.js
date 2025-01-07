const axios = require("axios");

const GITHUB_API_BASE_URL = "https://api.github.com";
const repoCache = new Map(); // In-memory cache for repository details

/**
 * Batch fetch details of repositories to reduce individual API calls.
 * @param {Array} repositories - List of repository URLs.
 * @param {String} accessToken - GitHub access token.
 * @returns {Object} - Repository details (stars and forks).
 */
const fetchBatchRepositoryDetails = async (repositories, accessToken) => {
  if (!accessToken) {
    throw new Error("GitHub access token is required to fetch data.");
  }

  const uniqueRepos = [...new Set(repositories)];
  const repoDetails = {};

  for (const repo of uniqueRepos) {
    if (repoCache.has(repo)) {
      repoDetails[repo] = repoCache.get(repo); // Use cached details
      continue;
    }

    try {
      const repoName = repo.replace(`${GITHUB_API_BASE_URL}/repos/`, "");
      const response = await axios.get(
        `${GITHUB_API_BASE_URL}/repos/${repoName}`,
        {
          headers: {
            Authorization: `token ${accessToken}`,
          },
        }
      );

      const details = {
        stars: response.data.stargazers_count,
        forks: response.data.forks_count,
      };
      repoCache.set(repo, details); // Cache the repository details
      repoDetails[repo] = details;
    } catch (error) {
      console.warn(
        `Failed to fetch details for repository ${repo}:`,
        error.message
      );
    }
  }

  return repoDetails;
};

/**
 * Fetch issues from GitHub based on user preferences.
 * @param {Object} params - Parameters for fetching issues.
 * @returns {Array} - List of GitHub issues.
 */
const fetchIssuesFromGitHub = async ({
  accessToken,
  preferredLanguages,
  preferredCategories,
  difficulty,
  page = 1,
  limit = 10,
}) => {
  let issues = [];
  let queryBase = "is:open";
  const maxAttempts = 5; // Maximum number of relaxation attempts
  let attempts = 0;

  // Initial strict filters
  let starsThreshold = 100;
  let forksThreshold = 20;
  let createdAfter = new Date();
  createdAfter.setMonth(createdAfter.getMonth() - 6); // Issues from the last 6 months
  let dateFilter = `created:>${createdAfter.toISOString().split("T")[0]}`;

  // Loop to progressively relax filters until we get enough issues
  while (issues.length < limit && attempts < maxAttempts) {
    let query = `${queryBase} ${dateFilter}`;

    if (difficulty === "Easy" || !difficulty) {
      query += ` label:"good first issue"`;
    }
    if (difficulty === "Medium") {
      query += ` label:"help wanted"`;
    }
    if (preferredLanguages) {
      query += ` language:${preferredLanguages}`;
    }
    if (preferredCategories) {
      query += ` label:${preferredCategories}`;
    }
    query += ` stars:>${starsThreshold} forks:>${forksThreshold}`;

    const url = `${GITHUB_API_BASE_URL}/search/issues?q=${encodeURIComponent(
      query
    )}&sort=stars&order=desc&page=${page}&per_page=${limit}`;

    console.log(`Fetching issues with query: ${query}`);
    console.log(`GitHub API URL: ${url}`);

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      });

      issues = response.data.items || [];
      console.log(`Fetched ${issues.length} issues from GitHub.`);
    } catch (error) {
      console.error("Error fetching issues from GitHub:", error.message);
      throw new Error("GitHub API fetch failed");
    }

    // Relax filters if not enough issues
    if (issues.length < limit) {
      console.log("Not enough issues found. Relaxing filters...");
      starsThreshold = Math.max(starsThreshold - 20, 0); // Reduce star threshold
      forksThreshold = Math.max(forksThreshold - 5, 0); // Reduce fork threshold
      createdAfter.setFullYear(createdAfter.getFullYear() - 1); // Expand date range
      dateFilter = `created:>${createdAfter.toISOString().split("T")[0]}`;
      attempts++;
    }
  }

  return issues;
};

/**
 * Fetch details about a specific GitHub repository.
 * @param {String} repositoryUrl - URL of the GitHub repository.
 * @param {String} accessToken - GitHub access token.
 * @returns {Object} - Repository details (name, stars, forks).
 */
const fetchRepositoryDetails = async (repositoryUrl, accessToken) => {
  if (!repositoryUrl) {
    throw new Error("Repository URL is missing");
  }
  if (!accessToken) {
    throw new Error(
      "GitHub access token is required to fetch repository details."
    );
  }

  try {
    const response = await axios.get(repositoryUrl, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    const {
      full_name: repository,
      stargazers_count: stars,
      forks_count: forks,
    } = response.data || {};

    return { repository, stars, forks };
  } catch (error) {
    console.error(
      `Error fetching repository details from URL "${repositoryUrl}":`,
      error.message
    );
    throw error;
  }
};

/**
 * Fetch details about a specific GitHub issue.
 * @param {String} repositoryUrl - URL of the GitHub repository.
 * @param {Number} issueNumber - GitHub issue number.
 * @param {String} accessToken - GitHub access token.
 * @returns {Object} - Issue details.
 */
const fetchIssueDetails = async (repositoryUrl, issueNumber, accessToken) => {
  if (!repositoryUrl) {
    throw new Error("Repository URL is required");
  }
  if (!accessToken) {
    throw new Error("GitHub access token is required to fetch issue details.");
  }

  try {
    const url = `${repositoryUrl}/issues/${issueNumber}`;
    console.log("Constructed issue URL:", url);

    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.error("Unauthorized access: Check your GitHub token.");
    } else if (error.response?.status === 404) {
      console.error(`Issue not found for ID ${issueNumber}.`);
    } else {
      console.error("Error fetching issue details:", error.message);
    }
    throw new Error("Failed to fetch issue details");
  }
};

module.exports = {
  fetchIssuesFromGitHub,
  fetchBatchRepositoryDetails,
  fetchRepositoryDetails,
  fetchIssueDetails,
};
