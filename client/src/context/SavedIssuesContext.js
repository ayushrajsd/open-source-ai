import React, { createContext, useState, useEffect } from "react";

const SavedIssuesContext = createContext();

export const SavedIssuesProvider = ({ children }) => {
  const [savedIssues, setSavedIssues] = useState(() => {
    // Load initial state from localStorage
    const saved = JSON.parse(localStorage.getItem("savedIssues")) || [];
    return saved;
  });

  // Update localStorage whenever savedIssues changes
  useEffect(() => {
    console.log("savedIssues changed:", savedIssues);
    localStorage.setItem("savedIssues", JSON.stringify(savedIssues));
  }, [savedIssues]);

  const addIssue = (issue) => {
    if (!savedIssues.some((saved) => saved.id === issue.id)) {
      setSavedIssues([...savedIssues, issue]);
    }
  };

  const removeIssue = (id) => {
    console.log("Removing issue with id:", id);
    setSavedIssues(savedIssues.filter((issue) => issue.id !== id));
  };

  return (
    <SavedIssuesContext.Provider value={{ savedIssues, addIssue, removeIssue }}>
      {children}
    </SavedIssuesContext.Provider>
  );
};

export default SavedIssuesContext;
