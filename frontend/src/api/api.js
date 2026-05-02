import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-production-4102.up.railway.app",
});

// 🔥 Add this interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;