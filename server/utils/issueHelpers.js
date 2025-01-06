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
  const recentThreshold = new Date();
  recentThreshold.setFullYear(recentThreshold.getFullYear() - 1);

  // Filter by stars and recency
  let filteredIssues = issues.filter(
    (issue) => issue.stars > 5 && new Date(issue.created_at) > recentThreshold
  );

  // If filtered issues are fewer than 10, include less popular ones
  if (filteredIssues.length < 10) {
    const additionalIssues = issues.filter(
      (issue) => !filteredIssues.includes(issue)
    );
    filteredIssues = [...filteredIssues, ...additionalIssues].slice(0, 10);
  }

  // Rank by stars and forks
  return filteredIssues.sort((a, b) => b.stars + b.forks - (a.stars + a.forks));
};

/**
 * Helper function to classify issue difficulty using OpenAI
 * @param {String} title - Issue title
 * @param {String} body - Issue body
 * @returns {String} - Difficulty level (Easy, Medium, Challenging)
 */
// const classifyDifficulty = async (title, body) => {
//   try {
//     const aiResponse = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo", // Use gpt-4 if available
//       messages: [
//         {
//           role: "system",
//           content:
//             "You are an assistant classifying GitHub issues into Easy, Medium, or Challenging.",
//         },
//         {
//           role: "user",
//           content: `Classify the following GitHub issue into Easy, Medium, or Challenging. Only respond with one word:\n\nTitle: ${title}\n\nBody: ${
//             body || "No description provided."
//           }`,
//         },
//       ],
//       max_tokens: 10,
//       temperature: 0.0,
//     });

//     const difficulty = aiResponse.choices[0]?.message?.content?.trim();

//     // Validate the response
//     if (["Easy", "Medium", "Challenging"].includes(difficulty)) {
//       return difficulty;
//     } else {
//       console.warn(`Unexpected difficulty response: ${difficulty}`);
//       return "Medium"; // Default to Medium if the response is unexpected
//     }
//   } catch (error) {
//     console.error("Error classifying issue difficulty:", error.message);
//     return "Medium"; // Default to Medium on error
//   }
// };
const classifyDifficulty = async (title, body, labels = []) => {
  try {
    // Ensure labels are processed correctly
    const labelNames = labels.map((label) => label.name?.toLowerCase() || "");

    // Prioritize "Good First Issue" label
    if (labelNames.includes("good first issue")) {
      return "Easy";
    }

    // Use OpenAI to classify difficulty
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Classify GitHub issues for beginner developers into Easy, Medium, or Challenging.",
        },
        {
          role: "user",
          content: `Title: ${title}\n\nBody: ${body}`,
        },
      ],
      max_tokens: 10,
      temperature: 0.5,
    });

    // Extract difficulty from AI response
    const difficulty =
      aiResponse.choices[0]?.message?.content?.trim() || "Medium";

    return difficulty;
  } catch (error) {
    console.error("Error classifying difficulty:", error.message);
    // Default to "Medium" if classification fails
    return "Medium";
  }
};
const generateSummary = async (title, body) => {
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
    return summary || "Summary generation failed.";
  } catch (error) {
    console.error("Error generating summary:", error.message);
    return "Summary unavailable.";
  }
};
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
