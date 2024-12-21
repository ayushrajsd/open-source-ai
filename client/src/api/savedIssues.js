import axiosInstance from "./index";

// Save an issue
export const saveIssue = async (issue) => {
  try {
    const response = await axiosInstance.post("/saved-issues", issue);
    return response.data;
  } catch (error) {
    console.error("Error saving issue:", error);
    throw error;
  }
};

// Fetch saved issues
export const getSavedIssues = async () => {
  try {
    const response = await axiosInstance.get("/saved-issues");
    return response.data;
  } catch (error) {
    console.error("Error fetching saved issues:", error);
    throw error;
  }
};

// Remove a saved issue
export const removeIssue = async (issueId) => {
  try {
    const response = await axiosInstance.delete(`/saved-issues/${issueId}`);
    return response.data;
  } catch (error) {
    console.error("Error removing issue:", error);
    throw error;
  }
};
