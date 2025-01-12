import axiosInstance from "./index";

export const fetchProfile = async () => {
  try {
    const response = await axiosInstance.get("/user/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    await axiosInstance.get("/user/logout");
  } catch (error) {
    console.error("Logout failed:", error);
    throw error;
  }
};

export const verifyAuth = async () => {
  try {
    console.log("Sending verify-auth request...");
    const response = await axiosInstance.get("/user/verify-auth", {
      withCredentials: true,
    });
    console.log("Verify-auth response:", response);
    return response.data;
  } catch (error) {
    console.error(
      "Error in verify-auth request:",
      error.response?.data || error.message
    );
    throw error; // Ensure the error is propagated to the calling function
  }
};
