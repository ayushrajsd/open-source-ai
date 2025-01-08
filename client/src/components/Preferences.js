import React, { useState, useEffect } from "react";
import { Select, Button, message } from "antd";
import { getPreferences, savePreferences } from "../api/preferences";

const { Option } = Select;

// List of common languages for beginners
const COMMON_LANGUAGES = [
  "JavaScript",
  "Python",
  "Java",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Swift",
  "Kotlin",
  "Go",
];

function Preferences() {
  const [preferredLanguages, setPreferredLanguages] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);

  useEffect(() => {
    // Fetch preferences from the backend when the component mounts
    const fetchPreferences = async () => {
      try {
        const { data } = await getPreferences();
        setPreferredLanguages(data.languages || []);
        setPreferredCategories(data.categories || []);
      } catch (error) {
        message.error("Failed to load preferences. Please try again.");
      }
    };

    fetchPreferences();
  }, []);

  const handleSavePreferences = async () => {
    try {
      // Save preferences to the backend
      await savePreferences(preferredLanguages, preferredCategories);
      message.success("Preferences updated successfully!");
    } catch (error) {
      message.error("Failed to save preferences. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
      <h2 className="text-xl font-semibold text-blue-500 dark:text-blue-400 mb-4">
        Your Preferences
      </h2>
      <div className="space-y-6">
        {/* Preferred Programming Languages */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Programming Languages:
          </label>
          <Select
            mode="multiple"
            placeholder="Choose languages you love to work with"
            value={preferredLanguages}
            onChange={(values) => setPreferredLanguages(values)}
            className="w-full"
            style={{ minWidth: "200px" }}
          >
            {COMMON_LANGUAGES.map((lang) => (
              <Option key={lang} value={lang}>
                {lang}
              </Option>
            ))}
          </Select>
        </div>

        {/* Preferred Issue Categories */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 mb-2">
            Issue Categories:
          </label>
          <Select
            mode="multiple"
            placeholder="Select issue categories"
            value={preferredCategories}
            onChange={(values) => setPreferredCategories(values)}
            className="w-full"
            style={{ minWidth: "200px" }}
          >
            {["Bug", "Feature Request", "Documentation"].map((category) => (
              <Option key={category} value={category}>
                {category}
              </Option>
            ))}
          </Select>
        </div>

        {/* Save Button */}
        <Button type="primary" onClick={handleSavePreferences} className="mt-4">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

export default Preferences;
