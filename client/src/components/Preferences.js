import React, { useState, useEffect } from "react";
import { Select, Button, message } from "antd";

const { Option } = Select;

function Preferences({ onSave }) {
  const [preferredLanguages, setPreferredLanguages] = useState([]);
  const [preferredCategories, setPreferredCategories] = useState([]);

  useEffect(() => {
    // Load preferences from localStorage
    const savedLanguages =
      JSON.parse(localStorage.getItem("preferredLanguages")) || [];
    const savedCategories =
      JSON.parse(localStorage.getItem("preferredCategories")) || [];
    setPreferredLanguages(savedLanguages);
    setPreferredCategories(savedCategories);
  }, []);

  const handleSavePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem(
      "preferredLanguages",
      JSON.stringify(preferredLanguages)
    );
    localStorage.setItem(
      "preferredCategories",
      JSON.stringify(preferredCategories)
    );

    // Callback to inform Dashboard of changes
    if (onSave) {
      onSave(preferredLanguages, preferredCategories);
    }
    message.success("Preferences updated successfully!");
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
            placeholder="Select programming languages"
            value={preferredLanguages}
            onChange={(values) => setPreferredLanguages(values)}
            className="w-full"
            style={{ minWidth: "200px" }}
          >
            {["JavaScript", "Python", "Java", "C++"].map((lang) => (
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

        <Button type="primary" onClick={handleSavePreferences} className="mt-4">
          Save Preferences
        </Button>
      </div>
    </div>
  );
}

export default Preferences;
