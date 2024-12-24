import React, { useState, useContext, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SkeletonLoader from "../components/SkeletonLoader";
import ScrollToTopButton from "../components/ScrollToTopButton";
import SavedIssuesContext from "../context/SavedIssuesContext";
import IssueCard from "../components/IssueCard";
import { getPreferences } from "../api/preferences"; // Import API for fetching preferences
import axiosInstance from "../api/index"; // API instance for backend requests

function Explore() {
  const { savedIssues, addIssue, removeIssue } = useContext(SavedIssuesContext);

  const [issues, setIssues] = useState([]); // Initially no issues loaded
  const [hasMore, setHasMore] = useState(true); // For infinite scrolling (future-proofing)
  const [difficulty, setDifficulty] = useState(""); // For difficulty filters
  const [currentPage, setCurrentPage] = useState(1); // For pagination

  // Fetch and cache preferences
  const fetchAndCachePreferences = async () => {
    try {
      const { data } = await getPreferences();
      localStorage.setItem(
        "preferredLanguages",
        JSON.stringify(data.languages || [])
      );
      localStorage.setItem(
        "preferredCategories",
        JSON.stringify(data.categories || [])
      );
      return data;
    } catch (error) {
      console.error("Failed to fetch preferences:", error.message);
      throw error;
    }
  };

  // Fetch Issues from the backend
  const fetchIssues = async () => {
    try {
      const preferences = await fetchAndCachePreferences();
      const { languages, categories } = preferences || {};
      const response = await axiosInstance.get(
        `/issues?preferredLanguages=${
          languages?.join(",") || ""
        }&preferredCategories=${
          categories?.join(",") || ""
        }&difficulty=${difficulty}&page=${currentPage}&limit=10`
      );

      setIssues(response.data);
      setCurrentPage(1); // Reset to the first page
    } catch (error) {
      console.error("Failed to load issues:", error.message);
    }
  };

  const fetchMoreIssues = async () => {
    if (!hasMore) return; // Do not fetch if no more data to load

    try {
      const preferences = JSON.parse(localStorage.getItem("preferences")) || {};
      const response = await axiosInstance.get(
        `/issues?preferredLanguages=${
          preferences.languages?.join(",") || ""
        }&preferredCategories=${
          preferences.categories?.join(",") || ""
        }&difficulty=${difficulty}&page=${currentPage + 1}&limit=10`
      );

      if (response.data.length === 0) {
        setHasMore(false); // No more data to load
      } else {
        setIssues((prevIssues) => [...prevIssues, ...response.data]); // Append new data
        setCurrentPage((prevPage) => prevPage + 1); // Increment page
      }
    } catch (error) {
      console.error("Failed to fetch more issues:", error.message);
    }
  };

  // UseEffect to fetch issues on component mount
  useEffect(() => {
    fetchIssues();
  }, [difficulty]);

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">
        Explore Issues
      </h1>

      {/* Difficulty Filters */}
      <div className="mb-4 flex justify-between">
        <div className="flex items-center">
          <label className="text-gray-700 dark:text-gray-300 mr-4">
            Filter by Difficulty:
          </label>
          <select
            className="p-2 border border-gray-300 rounded dark:bg-gray-800 dark:text-gray-200"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>

      <InfiniteScroll
        dataLength={issues.length}
        hasMore={hasMore}
        next={fetchMoreIssues}
        loader={<SkeletonLoader count={2} />}
        endMessage={
          <p className="text-center mt-4 text-gray-600 dark:text-gray-400">
            You've reached the end of the issues.
          </p>
        }
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onSave={() => addIssue(issue)}
              onRemove={() => removeIssue(issue.id)}
              isSaved={savedIssues.some((saved) => saved.id === issue.id)}
            />
          ))}
        </ul>
      </InfiniteScroll>

      <ScrollToTopButton />
    </div>
  );
}

export default Explore;
