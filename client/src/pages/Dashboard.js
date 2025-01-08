import React, { useState, useEffect, useContext } from "react";
import { fetchProfile, verifyAuth } from "../api/user";
import SavedIssuesContext from "../context/SavedIssuesContext";
import IssueCard from "../components/IssueCard";
import Preferences from "../components/Preferences";
import { useAuth } from "../context/AuthContext";
import { NavLink } from "react-router-dom";

function Dashboard() {
  const { savedIssues, addIssue, removeIssue } = useContext(SavedIssuesContext);
  const [profile, setProfile] = useState(() => {
    // Load profile from session storage if available
    const cachedProfile = sessionStorage.getItem("profile");
    return cachedProfile ? JSON.parse(cachedProfile) : null;
  });
  const [contributions, setContributions] = useState([]);
  const [filter, setFilter] = useState("");
  const [isLoading, setIsLoading] = useState(!profile);
  const [error, setError] = useState(null);

  const { login, logout } = useAuth();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Call the verify-auth endpoint to check authentication
        const response = await verifyAuth();

        if (response.status === 200) {
          login(); // Set auth state to true
        } else {
          logout();
        }
      } catch (error) {
        console.error("Authentication verification failed:", error);
        logout(); // Log out if verification fails
      }
    };

    checkAuth();
  }, [login, logout]);

  // Fetch GitHub profile and contributions
  useEffect(() => {
    if (!profile) {
      const loadProfileAndContributions = async () => {
        try {
          setIsLoading(true);
          const data = await fetchProfile();
          setProfile(data.profile);
          setContributions(data.contributions);
          sessionStorage.setItem("profile", JSON.stringify(data.profile)); // Cache profile in session storage
        } catch (error) {
          console.error(
            "Failed to load profile or contributions:",
            error.message
          );
          setError("Unable to fetch data. Please try again later.");
        } finally {
          setIsLoading(false);
        }
      };

      loadProfileAndContributions();
    }
  }, [profile]);

  // Load saved issues
  useEffect(() => {
    const fetchSavedIssues = async () => {
      try {
        const saved = JSON.parse(localStorage.getItem("savedIssues")) || [];
        const validSavedIssues = saved.filter(
          (issue) =>
            issue.title && issue.repository && issue.url && issue.created_at
        );
        addIssue(validSavedIssues);
      } catch (error) {
        console.error("Failed to fetch saved issues:", error.message);
      }
    };

    fetchSavedIssues();
  }, [addIssue]);

  // Filter contributions
  const filteredContributions = contributions.filter(
    (contribution) => !filter || contribution.status === filter
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-900 min-h-screen">
      {/* Welcome Banner */}
      <section className="mb-8">
        {isLoading ? (
          <p>Loading your profile...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          profile && (
            <div className="flex items-center bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 rounded-lg shadow">
              <img
                src={profile.avatar}
                alt="GitHub Avatar"
                className="w-20 h-20 rounded-full mr-4"
              />
              <div>
                <h1 className="text-3xl font-bold">Welcome, {profile.name}!</h1>
                <p>Public Repos: {profile.repos}</p>
                <a
                  href={profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:underline"
                >
                  View GitHub Profile
                </a>
              </div>
            </div>
          )
        )}
      </section>

      {/* Quick Actions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <NavLink
            to="/explore"
            className="bg-blue-500 text-white px-6 py-3 rounded-md shadow hover:bg-blue-600 transition"
          >
            Explore Issues
          </NavLink>
          <NavLink
            to="/how-to-contribute"
            className="bg-green-500 text-white px-6 py-3 rounded-md shadow hover:bg-green-600 transition"
          >
            Start Contributing
          </NavLink>
        </div>
      </section>

      {/* Saved Issues */}
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
              src={require("../assets/images/no_issues.svg").default}
              alt="No saved issues"
              className="w-48 mx-auto mb-4"
            />
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              You haven’t saved any issues yet. Start exploring and bookmark the
              ones you’d like to work on!
            </p>
            <NavLink
              to="/explore"
              className="bg-blue-500 text-white px-6 py-3 rounded-md shadow hover:bg-blue-600 transition"
            >
              Explore Issues
            </NavLink>
          </div>
        )}
      </section>

      {/* Recent Contributions */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Recent Contributions</h2>
        <div className="mb-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 border rounded-md dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="">All Statuses</option>
            <option value="Merged">Merged</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        {filteredContributions.length > 0 ? (
          <ul className="space-y-4">
            {filteredContributions.map((contribution) => (
              <li
                key={contribution.url} // Use URL as a unique key
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
                  className={`text-sm ${
                    contribution.status === "Merged"
                      ? "text-green-500"
                      : contribution.status === "Pending"
                      ? "text-yellow-500"
                      : "text-red-500"
                  }`}
                >
                  Status: {contribution.status}
                </p>
                <p className="text-xs text-gray-500">
                  Date: {new Date(contribution.date).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center">
            <img
              src={require("../assets/images/my_contributions.svg").default}
              alt="No contributions"
              className="w-48 mx-auto mb-4"
            />
            <p className="text-gray-500" style={{ marginBottom: "20px" }}>
              You haven’t made any contributions yet. Start exploring and
              contributing!
            </p>
            <NavLink
              to="/how-to-contribute"
              className="bg-green-500 text-white px-6 py-3 rounded-md shadow hover:bg-green-600 transition"
            >
              Start Contributing
            </NavLink>
          </div>
        )}
      </section>

      {/* Preferences */}
      <Preferences />
    </div>
  );
}

export default Dashboard;
