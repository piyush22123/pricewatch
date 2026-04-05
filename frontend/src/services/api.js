import axios from "axios";

const API = axios.create({
  baseURL: "https://pricewatch-tx1n.onrender.com/api"
});

// Add token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;