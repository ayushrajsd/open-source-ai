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
  const [hasMore, setHasMore] = useState(true); // For infinite scrolling
  const [difficulty, setDifficulty] = useState("Easy"); // For difficulty filters
  const [currentPage, setCurrentPage] = useState(1); // For pagination
  const [loadingMessage, setLoadingMessage] = useState(""); // Temporary loading message
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const loadingMessages = [
    "Fetching issues from GitHub...",
    "Analyzing issues with AI...",
    "Creating summaries for the issues...",
    "Classifying issue difficulties...",
    "Almost done...",
  ];

  useEffect(() => {
    let messageIndex = 0;
    let messageInterval;

    if (isLoading) {
      // Start cycling through messages when loading starts
      setLoadingMessage(loadingMessages[messageIndex]);
      messageInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 2000); // Change message every 2 seconds
    }

    return () => {
      clearInterval(messageInterval); // Clear interval when loading ends
    };
  }, [isLoading]);

  const fetchAndCachePreferences = async () => {
    try {
      setLoadingMessage("Fetching your preferences...");
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

  const fetchIssues = async ({ isInitialFetch = true } = {}) => {
    try {
      setIsLoading(true);

      const preferences = isInitialFetch
        ? await fetchAndCachePreferences()
        : JSON.parse(localStorage.getItem("preferences")) || {};

      const { languages, categories } = preferences || {};
      const difficultyFilter = difficulty === "All" ? "" : difficulty;
      const nextPage = isInitialFetch ? 1 : currentPage + 1;

      const response = await axiosInstance.get(
        `/issues?preferredLanguages=${
          languages?.join(",") || ""
        }&preferredCategories=${
          categories?.join(",") || ""
        }&difficulty=${difficultyFilter}&page=${nextPage}&limit=10`
      );

      if (isInitialFetch) {
        setIssues(response.data);
        setCurrentPage(1);
        setHasMore(response.data.length > 0);
      } else {
        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          setIssues((prevIssues) => [...prevIssues, ...response.data]);
          setCurrentPage(nextPage);
        }
      }
    } catch (error) {
      console.error("Failed to fetch issues:", error.message);
    } finally {
      setIsLoading(false); // Stop loading when done
      setLoadingMessage(""); // Clear the message
    }
  };

  useEffect(() => {
    fetchIssues({ isInitialFetch: true });
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
            <option value="Easy">Good First Issues</option>
            <option value="Medium">Medium</option>
            <option value="Challenging">Challenging</option>
          </select>
        </div>
      </div>

      {/* Loading Message */}
      {isLoading && (
        <div className="text-center text-gray-700 dark:text-gray-300 my-4">
          <p>{loadingMessage}</p>
        </div>
      )}

      <InfiniteScroll
        dataLength={issues.length}
        hasMore={hasMore}
        next={() => fetchIssues({ isInitialFetch: false })}
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
