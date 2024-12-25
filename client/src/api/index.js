import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Your backend URL
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
    const { token } = response.data;

    // Save the new token in cookies or session
    document.cookie = `token=${token}; path=/; secure; samesite=strict`;

    // Update Authorization header for all subsequent requests
    axiosInstance.defaults.headers["Authorization"] = `Bearer ${token}`;

    return token;
  } catch (error) {
    throw error;
  }
};

// Axios request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Axios response interceptor to handle expired tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        // If a refresh request is already in progress, queue the request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshToken();
        processQueue(null, newToken);
        isRefreshing = false;

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
