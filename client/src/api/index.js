import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://open-source-ai.onrender.com/api" // Production backend URL
      : "http://localhost:8000/api", // Development backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow sending cookies with requests
});

let isRefreshing = false; // Flag to track if a refresh request is in progress
let failedQueue = []; // Queue for storing failed requests while token is refreshing

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Refresh token function
const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/auth/refresh-token");
    return response.data.token; // Server should set new HttpOnly cookies
  } catch (error) {
    console.error(
      "Error during token refresh:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Axios request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // No token manipulation needed due to HttpOnly cookies
    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response, // Pass through successful responses
  async (error) => {
    const originalRequest = error.config;

    // Check if the request should trigger token refresh
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/verify-auth")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshToken();
        processQueue(null); // Resolve queued requests
        isRefreshing = false;
        return axiosInstance(originalRequest); // Retry the original request
      } catch (refreshError) {
        processQueue(refreshError); // Reject queued requests
        isRefreshing = false;

        console.error("Token refresh failed:", refreshError);
        return Promise.reject(error); // Propagate original 401 error
      }
    }

    return Promise.reject(error); // Pass through non-401 errors
  }
);

export default axiosInstance;
