import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5112/api",
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.Message ||
      error.response?.data ||
      error.message ||
      "An error occurred";
    return Promise.reject({
      ...error,
      message: typeof message === "string" ? message : JSON.stringify(message),
    });
  }
);

export default api;
