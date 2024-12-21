const mongoose = require("mongoose");

const SavedIssueSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true, // To query quickly by userId
  },
  issueId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  tags: {
    type: [String], // Array of tags
    default: [],
  },
  description: {
    type: String,
    default: "",
  },
  savedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SavedIssue", SavedIssueSchema);
