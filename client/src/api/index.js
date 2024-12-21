import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000/api", // Your backend URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow sending cookies with requests
});

export default axiosInstance;
