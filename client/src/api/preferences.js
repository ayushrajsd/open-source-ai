import axiosInstance from "./index";

// Save user preferences
export const savePreferences = async (languages, categories) => {
  try {
    const response = await axiosInstance.post("/preferences", {
      preferredLanguages: languages || [],
      preferredCategories: categories || [],
    });
    console.log(response.data);
  } catch (error) {
    console.error(
      "Error saving preferences:",
      error.response?.data || error.message
    );
  }
};

// Fetch user preferences
export const getPreferences = async () => {
  try {
    const response = await axiosInstance.get("/preferences");
    return response.data;
  } catch (error) {
    console.error("Error fetching preferences:", error);
    throw error;
  }
};
