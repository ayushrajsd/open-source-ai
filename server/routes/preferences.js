const express = require("express");
const { body, check, validationResult } = require("express-validator");
const authenticateUser = require("../middleware/authMiddleware");

const validatePreferences = [
  check("preferredLanguages")
    .isArray()
    .withMessage("Preferred languages must be an array"),
  check("preferredCategories")
    .isArray()
    .withMessage("Preferred categories must be an array"),
];

const router = express.Router();
const {
  savePreferences,
  getPreferences,
} = require("../controllers/preferencesController");

// Save user preferences
router.post("/", authenticateUser, validatePreferences, savePreferences);

// Get user preferences
router.get("/", authenticateUser, getPreferences);

module.exports = router;
