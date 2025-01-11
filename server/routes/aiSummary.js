const express = require("express");
const router = express.Router();
const OpenAI = require("openai");

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai/summary - Generate a summary for an issue description
router.post("/summary", async (req, res, next) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ message: "Description is required" });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Summarize the following GitHub issue description for a beginner developer:\n\n${description}`,
      max_tokens: 50,
      temperature: 0.7,
    });

    const summary = response.data.choices[0].text.trim();
    res.json({ summary });
  } catch (error) {
    console.error("Error generating summary:", error.message);
    next(error);
  }
});

module.exports = router;
