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
