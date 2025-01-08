import axiosInstance from "./index";

// Initiate GitHub OAuth flow
export const githubLogin = () => {
  window.location.href = "http://localhost:8000/auth/github";
};
