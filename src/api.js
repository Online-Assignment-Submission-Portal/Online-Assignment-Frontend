import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/v1", // Update with your backend URL
});

// Add headers if needed
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const signup = (formData) => API.post("/user/signup", formData);
export const signin = (formData) => API.post("/user/login", formData);
