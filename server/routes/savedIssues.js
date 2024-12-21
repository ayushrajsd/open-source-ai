const express = require("express");
const router = express.Router();
const {
  saveIssue,
  getSavedIssues,
  removeIssue,
} = require("../controllers/savedIssuesController");
const authenticateUser = require("../middleware/authMiddleware");

// Save an issue
router.post("/", authenticateUser, saveIssue);

// Get saved issues
router.get("/", authenticateUser, getSavedIssues);

// Remove a saved issue
router.delete("/:issueId", authenticateUser, removeIssue);

module.exports = router;
