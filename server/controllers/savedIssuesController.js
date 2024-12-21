const SavedIssue = require("../models/SavedIssue");

// Save an Issue
exports.saveIssue = async (req, res) => {
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
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch Saved Issues
exports.getSavedIssues = async (req, res) => {
  try {
    const userId = req.user.id;

    const savedIssues = await SavedIssue.find({ userId }).sort({
      savedAt: -1,
    });

    res.status(200).json({ success: true, data: savedIssues });
  } catch (error) {
    console.error("Error fetching saved issues:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Remove a Saved Issue
exports.removeIssue = async (req, res) => {
  try {
    const { issueId } = req.params;
    const userId = req.user.id;

    await SavedIssue.findOneAndDelete({ userId, issueId });

    res
      .status(200)
      .json({ success: true, message: "Issue removed successfully" });
  } catch (error) {
    console.error("Error removing issue:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
