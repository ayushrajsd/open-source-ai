import React, { useState, useEffect } from "react";
import { exploreIssues, savedIssues, contributionsMock } from "../mockData";
import { BookOutlined, SmileOutlined } from "@ant-design/icons";
import { useContext } from "react";
import SavedIssuesContext from "../context/SavedIssuesContext";
import IssueCard from "../components/IssueCard";
import Preferences from "../components/Preferences";

function Dashboard() {
  // const [savedIssues, setSavedIssues] = useState([]);
  const { savedIssues, addIssue, removeIssue } = useContext(SavedIssuesContext); // Access context

  const [contributions, setContributions] = useState(() => {
    const savedContributions = JSON.parse(
      localStorage.getItem("contributions")
    );
    return savedContributions && savedContributions.length > 0
      ? savedContributions
      : contributionsMock; // Use mock data as the default
  });
  const [filter, setFilter] = useState(""); // Filter contributions by status

  useEffect(() => {
    const savedContributions = JSON.parse(
      localStorage.getItem("contributions")
    );
    if (!savedContributions || savedContributions.length === 0) {
      // Save mockData to localStorage
      localStorage.setItem("contributions", JSON.stringify(contributions));
    }
  }, []);

  useEffect(() => {
    // Retrieve saved issues from localStorage
    const saved = JSON.parse(localStorage.getItem("savedIssues")) || [];
    addIssue(saved);
  }, []);

  useEffect(() => {
    // Initialize contributions in localStorage if not already present
    const savedContributions = JSON.parse(
      localStorage.getItem("contributions")
    );
    if (!savedContributions) {
      localStorage.setItem("contributions", JSON.stringify([]));
    } else {
      setContributions(savedContributions);
    }
  }, []);
  const filteredContributions = contributions
    .filter((contribution) => !filter || contribution.status === filter)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date (most recent first)

  // const removeIssue = (id) => {
  //   // Filter out the issue with the given id
  //   const updatedIssues = savedIssues.filter((issue) => issue.id !== id);

  //   // Update the state
  //   addIssue(updatedIssues);

  //   // Persist the changes in localStorage
  //   localStorage.setItem("savedIssues", JSON.stringify(updatedIssues));
  // };
  const handlePreferencesSave = (languages, categories) => {
    console.log("Updated Preferences:", languages, categories);
    // Re-fetch or filter data based on new preferences
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">
        Dashboard
      </h1>
      <Preferences onSave={handlePreferencesSave} />

      {/* Explore Issues Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Explore New Issues</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400 text-center">
          Not sure where to start? Browse through issues below and bookmark ones
          that interest you!
        </p>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exploreIssues.map((issue) => (
            <li
              key={issue.id}
              className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-medium text-blue-500 dark:text-blue-400">
                <a href={issue.url} target="_blank" rel="noopener noreferrer">
                  {issue.title}
                </a>
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {issue.description}
              </p>
              <div className="mt-2 flex space-x-2">
                {issue.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full dark:bg-blue-700 dark:text-blue-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 text-center">
          <a
            href="/explore"
            className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md shadow hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
          >
            Explore More Issues
          </a>
        </div>
      </section>

      {/* Saved Issues Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Saved Issues</h2>
        {savedIssues.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedIssues.map((issue) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                onSave={() => addIssue(issue)} // Save handler
                onRemove={() => removeIssue(issue.id)} // Remove handler
                isSaved={savedIssues.some((saved) => saved.id === issue.id)} // Check if saved
              />
            ))}
          </ul>
        ) : (
          <div className="text-center">
            <img
              src={require("../assets/images/saved_issues.svg").default}
              alt="No saved issues"
              className="w-48 mx-auto mb-4"
            />
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Your saved issues will appear here. Start exploring and bookmark
              issues you’d like to work on.
            </p>
            <a
              href="/explore"
              className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md shadow hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition"
            >
              Explore Issues
            </a>
          </div>
        )}
      </section>

      {/* My Contributions Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">My Contributions</h2>

        {/* Filter Dropdown */}
        <div className="mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="Merged">Merged</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {/* Contributions List */}
        {filteredContributions.length > 0 ? (
          <ul className="space-y-4">
            {filteredContributions.map((contribution) => (
              <li
                key={contribution.id}
                className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-medium text-blue-500 dark:text-blue-400">
                  <a
                    href={contribution.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {contribution.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Repository: {contribution.repo}
                </p>
                <p
                  className={`text-sm mt-2 ${
                    contribution.status === "Merged"
                      ? "text-green-500"
                      : contribution.status === "Pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  Status: {contribution.status}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Date: {contribution.date}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center">
            {/* <SmileOutlined className="text-5xl mb-4 text-green-500 dark:text-green-400" /> */}
            <img
              src={require("../assets/images/my_contributions.svg").default}
              alt="No contributions"
              className="w-48 mx-auto mb-4"
            />

            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You haven’t made any contributions yet. Find issues to work on and
              start building your contribution journey!
            </p>
            <a
              href="/explore"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-md shadow hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition"
            >
              Start Contributing
            </a>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
