import axios from "axios";

const API_BASE = "http://localhost:8000";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("livemart:token") ||
    sessionStorage.getItem("livemart:token");
  if (token && config.headers)
    config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
