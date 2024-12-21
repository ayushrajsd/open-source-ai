import axiosInstance from "./index";

// Initiate GitHub OAuth flow
export const githubLogin = () => {
  window.location.href = "http://localhost:8000/auth/github";
};

// Logout user
export const logout = () => {
  localStorage.removeItem("token"); // Remove token
  window.location.href = "/";
};
