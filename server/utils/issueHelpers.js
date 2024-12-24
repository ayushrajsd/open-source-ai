const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Helper function to rank issues based on activity
 * @param {Array} issues - List of issues
 * @returns {Array} - Ranked issues
 */
const rankIssues = (issues) => {
  return issues
    .sort(
      (a, b) => b.stars + b.forks - (a.stars + a.forks) // Rank by stars and forks
    )
    .slice(0, 10); // Return top 10 issues
};

/**
 * Helper function to classify issue difficulty using OpenAI
 * @param {String} title - Issue title
 * @param {String} body - Issue body
 * @returns {String} - Difficulty level (Easy, Medium, Challenging)
 */
const classifyDifficulty = async (title, body) => {
  try {
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Use gpt-4 if available
      messages: [
        {
          role: "system",
          content:
            "You are an assistant classifying GitHub issues into Easy, Medium, or Challenging.",
        },
        {
          role: "user",
          content: `Classify the following GitHub issue into Easy, Medium, or Challenging. Only respond with one word:\n\nTitle: ${title}\n\nBody: ${
            body || "No description provided."
          }`,
        },
      ],
      max_tokens: 10,
      temperature: 0.0,
    });

    const difficulty = aiResponse.choices[0]?.message?.content?.trim();

    // Validate the response
    if (["Easy", "Medium", "Challenging"].includes(difficulty)) {
      return difficulty;
    } else {
      console.warn(`Unexpected difficulty response: ${difficulty}`);
      return "Medium"; // Default to Medium if the response is unexpected
    }
  } catch (error) {
    console.error("Error classifying issue difficulty:", error.message);
    return "Medium"; // Default to Medium on error
  }
};

module.exports = {
  rankIssues,
  classifyDifficulty,
};

module.exports = {
  rankIssues,
  classifyDifficulty,
};
