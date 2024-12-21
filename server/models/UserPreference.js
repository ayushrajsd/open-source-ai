const mongoose = require("mongoose");

const UserPreferenceSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true, // Ensure one preference record per user
  },
  languages: {
    type: [String], // Array of preferred languages
    default: [],
  },
  categories: {
    type: [String], // Array of preferred categories
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("UserPreference", UserPreferenceSchema);
