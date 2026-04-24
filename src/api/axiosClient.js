import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api", // BE của em
  headers: {
    "Content-Type": "application/json",
  },
});

// gắn token vào header nếu có
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosClient;