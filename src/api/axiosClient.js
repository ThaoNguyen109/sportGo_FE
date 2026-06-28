import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Response interceptor (QUAN TRỌNG)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu token hết hạn hoặc sai
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("user");
      window.location.href = "/login"; // redirect về login
    }

    return Promise.reject(error);
  }
);

export default axiosClient;