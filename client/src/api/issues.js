import axiosInstance from "./index";

export const fetchIssues = async (preferredLanguages, preferredCategories) => {
  try {
    const response = await axiosInstance.get("/issues", {
      params: {
        preferredLanguages: preferredLanguages?.join(","),
        preferredCategories: preferredCategories?.join(","),
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching issues:", error.message);
    throw error;
  }
};

// Fetch issue details by ID
export const getIssueDetails = async (issueNumber, repositoryUrl) => {
  try {
    const response = await axiosInstance.get(
      `/issues/${issueNumber}?repository=${repositoryUrl}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching issue details for ID ${issueNumber}:`, error);
    throw error;
  }
};

export const generateDebuggingTips = async (issueNumber, repositoryUrl) => {
  try {
    const response = await axiosInstance.get(
      `/issues/${issueNumber}/debug-tips?repository=${repositoryUrl}`
    );
    // const response = await axiosInstance.post("/issues/debugging-tips", {
    //   issueNumber,
    //   repositoryUrl,
    // });
    return response.data;
  } catch (error) {
    console.error("Error generating debugging tips:", error.message);
    throw error;
  }
};
