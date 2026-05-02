import axios from "axios";

const API = axios.create({
  baseURL: "https://team-task-manager-production-4102.up.railway.app",
});

export default API;