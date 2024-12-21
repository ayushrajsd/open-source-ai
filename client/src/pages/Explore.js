import React, { useState, useContext, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonLoader from "../components/SkeletonLoader";
import ScrollToTopButton from "../components/ScrollToTopButton";
import SavedIssuesContext from "../context/SavedIssuesContext";
import axiosInstance from "../api/index";
import dayjs from "dayjs";
import { getPreferences } from "../api/preferences";

function Explore() {
  const { savedIssues, addIssue, removeIssue } = useContext(SavedIssuesContext); // Access context

  const [issues, setIssues] = useState([]); // Store fetched issues
  const [hasMore, setHasMore] = useState(true); // Control if more data can be loaded
  const [filter, setFilter] = useState(""); // State for filtering by tags
  const [search, setSearch] = useState(""); // State for search bar

  const fetchAndCachePreferences = async () => {
    try {
      const preferences = await getPreferences();
      localStorage.setItem(
        "preferredLanguages",
        JSON.stringify(preferences.preferredLanguages || [])
      );
      localStorage.setItem(
        "preferredCategories",
        JSON.stringify(preferences.preferredCategories || [])
      );
      return preferences;
    } catch (error) {
      console.error("Failed to fetch preferences:", error.message);
      throw error;
    }
  };

  const fetchIssues = async () => {
    try {
      const preferences = await fetchAndCachePreferences();
      const { preferredLanguages, preferredCategories } = preferences;

      const response = await axiosInstance.get(
        `/issues?preferredLanguages=${preferredLanguages?.join(
          ","
        )}&preferredCategories=${preferredCategories?.join(",")}`
      );

      setIssues(response.data);
    } catch (error) {
      console.error("Failed to load issues:", error.message);
    }
  };

  useEffect(() => {
    fetchIssues(); // Fetch issues on component mount
  }, []);

  const filteredIssues = issues.filter(
    (issue) =>
      (!filter || issue.labels.some((label) => label.includes(filter))) &&
      (!search || issue.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">
        Explore Issues
      </h1>

      {/* Filter and Search */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          placeholder="Search issues..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        >
          <option value="">All Labels</option>
          {Array.from(new Set(issues.flatMap((issue) => issue.labels))).map(
            (label) => (
              <option key={label} value={label}>
                {label}
              </option>
            )
          )}
        </select>
      </div>

      {/* Issues List */}
      <InfiniteScroll
        dataLength={filteredIssues.length}
        hasMore={hasMore}
        loader={<SkeletonLoader count={2} />}
        endMessage={
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            You've reached the end of the issues.
          </p>
        }
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredIssues.map((issue) => (
            <li
              key={issue.id}
              className="p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition duration-300 dark:bg-gray-800"
            >
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 font-semibold text-lg hover:underline"
              >
                {issue.title}
              </a>
              <p className="text-sm text-gray-500">
                Repository: {issue.repository}
              </p>
              <p className="text-sm text-gray-500">
                Created: {dayjs(issue.created_at).format("MMM D, YYYY")}
              </p>
              <p className="text-sm text-gray-500">
                Labels:{" "}
                {issue.labels.length > 0
                  ? issue.labels.join(", ")
                  : "No tags available"}
              </p>
              <button
                onClick={() =>
                  savedIssues.some((saved) => saved.id === issue.id)
                    ? removeIssue(issue.id)
                    : addIssue(issue)
                }
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {savedIssues.some((saved) => saved.id === issue.id)
                  ? "Remove Issue"
                  : "Save Issue"}
              </button>
            </li>
          ))}
        </ul>
      </InfiniteScroll>

      <ScrollToTopButton />
    </div>
  );
}

export default Explore;
