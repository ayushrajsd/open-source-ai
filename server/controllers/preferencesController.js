const UserPreference = require("../models/UserPreference");
const { body, validationResult } = require("express-validator");

// Save User Preferences
exports.savePreferences = async (req, res, next) => {
  try {
    const { preferredLanguages, preferredCategories } = req.body;
    const userId = req.user.id; // Extract user ID from JWT payload
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const preferences = await UserPreference.findOneAndUpdate(
      { userId },
      { languages: preferredLanguages, categories: preferredCategories },
      { new: true, upsert: true } // Update or insert if not found
    );
    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    console.error("Error saving preferences:", error);
    next(error);
  }
};

// Get User Preferences
exports.getPreferences = async (req, res, next) => {
  try {
    const userId = req.user.id; // Extract user ID from JWT payload

    const preferences = await UserPreference.findOne({ userId });
    if (!preferences) {
      return res
        .status(404)
        .json({ success: false, message: "No preferences found" });
    }

    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    console.error("Error fetching preferences:", error);
    next(error);
  }
};
