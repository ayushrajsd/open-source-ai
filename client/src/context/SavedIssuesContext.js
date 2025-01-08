import React, { createContext, useState, useEffect } from "react";

const SavedIssuesContext = createContext();

export const SavedIssuesProvider = ({ children }) => {
  const [savedIssues, setSavedIssues] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("savedIssues")) || [];
    // Flatten if nested arrays exist
    return Array.isArray(saved[0]) ? saved.flat() : saved;
  });

  // Update localStorage whenever savedIssues changes
  useEffect(() => {
    console.log("savedIssues changed:", savedIssues);
    localStorage.setItem("savedIssues", JSON.stringify(savedIssues));
  }, [savedIssues]);

  const addIssue = (issue) => {
    if (Array.isArray(issue)) {
      console.error(
        "addIssue received an array, expected an individual issue."
      );
      return;
    }
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
