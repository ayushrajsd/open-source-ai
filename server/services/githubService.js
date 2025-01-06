const axios = require("axios");

const GITHUB_API_BASE_URL = "https://api.github.com";

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
  page,
  limit,
}) => {
  let query = "is:open";

  if (difficulty === "Easy" || !difficulty) {
    query += ` label:"good first issue"`;
  }
  if (preferredLanguages) {
    query += ` language:${preferredLanguages}`;
  }
  if (preferredCategories) {
    query += ` label:${preferredCategories}`;
  }

  // Adjust filters for broader results on later pages
  if (page > 3) {
    query += ` stars:>50 forks:>10`; // Broader criteria for stars and forks
  } else {
    query += ` stars:>100 forks:>20`; // Stricter criteria for stars and forks
  }

  // Add sorting by stars
  const url = `${GITHUB_API_BASE_URL}/search/issues?q=${encodeURIComponent(
    query
  )}&sort=stars&order=desc&page=${page}&per_page=${limit}`;

  console.log("GitHub access token:", accessToken);

  try {
    const response = await axios.get(
      `${GITHUB_API_BASE_URL}/search/issues?q=${encodeURIComponent(
        query
      )}&sort=stars&order=desc&page=${page}&per_page=${limit}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
        },
      }
    );

    return response.data.items || [];
  } catch (error) {
    if (error.response?.status === 401) {
      console.error(
        "GitHub API request failed: Unauthorized. Check your access token."
      );
      throw new Error("GitHub API fetch failed: Unauthorized access.");
    }
    console.error("Error fetching issues from GitHub:", error.message);
    throw new Error("GitHub API fetch failed");
  }
};

/**
 * Fetch details about a specific GitHub repository.
 * @param {String} repositoryUrl - URL of the GitHub repository.
 * @returns {Object} - Repository details (name, stars, forks).
 */
const fetchRepositoryDetails = async (repositoryUrl, accessToken) => {
  if (!repositoryUrl) {
    throw new Error("Repository URL is missing");
  }

  try {
    const response = await axios.get(repositoryUrl, {
      headers: {
        Authorization: `token ${accessToken}`, // Ensure the token is set
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

const fetchIssueDetails = async (repositoryUrl, issueNumber, accessToken) => {
  try {
    // Construct the API URL for fetching issue details
    const url = `${repositoryUrl}/issues/${issueNumber}`;
    console.log("constructed url is", url);

    // Make the API request
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${accessToken}`, // Ensure the token is included
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
  fetchRepositoryDetails,
  fetchIssueDetails,
};
