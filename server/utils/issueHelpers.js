const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// In-memory caches
const summaryCache = new Map(); // Cache for summaries
const difficultyCache = new Map(); // Cache for difficulty classifications

/**
 * Helper function to rank issues based on activity
 * @param {Array} issues - List of issues
 * @returns {Array} - Ranked issues
 */
const rankIssues = (issues) => {
  console.log("Raw issues count:", issues.length);

  // Relax thresholds to ensure more issues pass through
  let filteredIssues = issues.filter(
    (issue) =>
      issue.stars >= 3 && // Lowered minimum stars
      issue.forks >= 0 // Allow repositories with no forks
  );

  console.log("Filtered issues count:", filteredIssues.length);

  // Fallback: Ensure at least 5 issues are returned
  if (filteredIssues.length < 5) {
    const additionalIssues = issues.filter(
      (issue) => !filteredIssues.includes(issue) && issue.stars >= 1
    );
    filteredIssues = [...filteredIssues, ...additionalIssues].slice(0, 5); // Ensure a minimum of 5 issues
  }

  console.log("Ranked issues count:", filteredIssues.length);

  return filteredIssues;
};

/**
 * Helper function to classify issue difficulty using OpenAI
 * @param {String} title - Issue title
 * @param {String} body - Issue body
 * @param {Array} labels - Issue labels
 * @returns {String} - Difficulty level (Easy, Medium, Challenging)
 */
const classifyDifficulty = async (title, body, labels = []) => {
  const cacheKey = `difficulty_${title}_${body}`;
  if (difficultyCache.has(cacheKey)) {
    return difficultyCache.get(cacheKey); // Return cached difficulty
  }

  try {
    const labelNames = labels.map((label) => label.name?.toLowerCase() || "");

    // Debugging log
    console.log("Classifying difficulty for issue:", { title, labels });

    // Prioritize labels
    if (labelNames.includes("good first issue")) {
      difficultyCache.set(cacheKey, "Easy");
      return "Easy";
    }
    if (labelNames.includes("help wanted")) {
      difficultyCache.set(cacheKey, "Medium");
      return "Medium";
    }

    // Use OpenAI to classify difficulty
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Classify GitHub issues into Easy, Medium, or Challenging. Use the issue title, body, and labels.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nBody: ${body}`,
        },
      ],
      max_tokens: 10,
      temperature: 0.5,
    });

    let difficulty =
      aiResponse.choices[0]?.message?.content?.trim().toLowerCase() || "medium";

    // Handle unclear classifications
    if (
      difficulty.includes("lacks sufficient information") ||
      difficulty.includes("unknown")
    ) {
      console.warn(
        `Unclear difficulty for issue "${title}". Defaulting to Medium.`
      );
      difficulty = "medium";
    }

    // Cache the result
    difficultyCache.set(cacheKey, difficulty);

    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  } catch (error) {
    console.error("Error classifying difficulty:", error.message);
    return "Medium"; // Default to Medium if classification fails
  }
};

/**
 * Generate a summary for a GitHub issue using OpenAI
 * @param {String} title - Issue title
 * @param {String} body - Issue body
 * @returns {String} - Summary of the issue
 */
const generateSummary = async (title, body) => {
  const cacheKey = `summary_${title}_${body}`;
  if (summaryCache.has(cacheKey)) {
    return summaryCache.get(cacheKey); // Return cached summary
  }

  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Switch to 3.5 for cost-efficiency
      messages: [
        {
          role: "system",
          content:
            "You are an assistant summarizing GitHub issues. Provide a clear and concise summary, including the problem and a suggested resolution. Keep it actionable and easy to understand for developers.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nDescription: ${body}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const summary = aiResponse.choices[0]?.message?.content?.trim();
    summaryCache.set(cacheKey, summary || "Summary unavailable."); // Cache the result
    return summary || "Summary unavailable.";
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return "Summary unavailable.";
  }
};

/**
 * Generate debugging tips for a GitHub issue using OpenAI
 * @param {String} title - Issue title
 * @param {String} body - Issue body
 * @returns {String} - Debugging tips
 */
const generateDebuggingTips = async (title, body) => {
  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an assistant helping developers debug GitHub issues. Provide clear debugging tips for the following issue.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nDescription: ${body}`,
        },
      ],
      max_tokens: 200,
      temperature: 0.5,
    });

    return aiResponse.choices[0]?.message?.content || "No tips available.";
  } catch (error) {
    console.error("Error generating debugging tips:", error.message);
    throw new Error("Failed to generate debugging tips");
  }
};

module.exports = {
  rankIssues,
  classifyDifficulty,
  generateSummary,
  generateDebuggingTips,
};
