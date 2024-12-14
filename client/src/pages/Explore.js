import React, { useState, useContext, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { exploreIssues } from "../mockData";
import SkeletonLoader from "../components/SkeletonLoader";
import ScrollToTopButton from "../components/ScrollToTopButton";
import SavedIssuesContext from "../context/SavedIssuesContext";
import IssueCard from "../components/IssueCard";

function Explore() {
  const { savedIssues, addIssue, removeIssue } = useContext(SavedIssuesContext); // Access context

  const [issues, setIssues] = useState(exploreIssues.slice(0, 2)); // Load the first 2 issues initially
  const [hasMore, setHasMore] = useState(true); // Control if more data can be loaded
  const [filter, setFilter] = useState(""); // State for filtering by tag
  const [search, setSearch] = useState(""); // State for search bar
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

  const fetchMoreIssues = () => {
    const currentLength = issues.length;
    const additionalIssues = exploreIssues.slice(
      currentLength,
      currentLength + 2
    ); // Fetch the next 2 issues

    if (additionalIssues.length === 0) {
      setHasMore(false); // No more issues to load
    } else {
      setIssues([...issues, ...additionalIssues]);
    }
  };

  const filteredIssues = issues.filter(
    (issue) =>
      (!filter || issue.tags.includes(filter)) &&
      (!search || issue.title.toLowerCase().includes(search.toLowerCase())) &&
      (preferredLanguages.length === 0 ||
        preferredLanguages.some(
          (lang) => issue.language?.toLowerCase() === lang.toLowerCase()
        )) &&
      (preferredCategories.length === 0 ||
        preferredCategories.some((cat) => issue.tags.includes(cat)))
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">
        Explore Issues
      </h1>

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
          <option value="">All Tags</option>
          {Array.from(
            new Set(exploreIssues.flatMap((issue) => issue.tags))
          ).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <InfiniteScroll
        dataLength={filteredIssues.length}
        next={fetchMoreIssues}
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
            <IssueCard
              key={issue.id}
              issue={issue}
              onSave={() => addIssue(issue)} // Save handler
              onRemove={() => removeIssue(issue.id)} // Remove handler (optional for Explore)
              isSaved={savedIssues.some((saved) => saved.id === issue.id)} // Check if saved
            />
          ))}
        </ul>
      </InfiniteScroll>

      <ScrollToTopButton />
    </div>
  );
}

export default Explore;
