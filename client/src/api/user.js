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
    const response = await axiosInstance.get("/user/verify-auth", {
      withCredentials: true, // Send cookies with the request
    });
    return response.data;
  } catch (error) {
    console.error("Error verifying authentication:", error);
    throw error;
  }
};
