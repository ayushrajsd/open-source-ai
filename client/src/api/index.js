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
  const refreshToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("refresh_token="))
    ?.split("=")[1];

  if (!refreshToken) {
    console.warn("No refresh token available. Skipping refresh.");
    throw new Error("No refresh token available");
  }

  try {
    const response = await axiosInstance.post("/auth/refresh-token");
    const { token } = response.data;

    document.cookie = `token=${token}; path=/; secure; samesite=strict`;
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

        console.error("Token refresh failed:", refreshError);
        return Promise.reject(error); // Propagate original error
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
