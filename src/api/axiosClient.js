import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost/api",
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
      window.location.href = "/login"; // redirect về login
    }

    return Promise.reject(error);
  }
);

export default axiosClient;