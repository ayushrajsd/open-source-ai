const SavedIssue = require("../models/SavedIssue");

// Save an Issue
exports.saveIssue = async (req, res, next) => {
  try {
    const { issueId, title, url, tags, description } = req.body;
    const userId = req.user.id;

    const savedIssue = await SavedIssue.create({
      userId,
      issueId,
      title,
      url,
      tags,
      description,
    });

    res.status(201).json({ success: true, data: savedIssue });
  } catch (error) {
    console.error("Error saving issue:", error);
    next(error);
  }
};

// Fetch Saved Issues
exports.getSavedIssues = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const savedIssues = await SavedIssue.find({ userId }).sort({
      savedAt: -1,
    });

    res.status(200).json({ success: true, data: savedIssues });
  } catch (error) {
    console.error("Error fetching saved issues:", error);
    next(error);
  }
};

// Remove a Saved Issue
exports.removeIssue = async (req, res, next) => {
  try {
    const { issueId } = req.params;
    const userId = req.user.id;

    await SavedIssue.findOneAndDelete({ userId, issueId });

    res
      .status(200)
      .json({ success: true, message: "Issue removed successfully" });
  } catch (error) {
    console.error("Error removing issue:", error);
    next(error);
  }
};
