import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5112/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("Request:", config);
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errMsg = error.response?.data || "An error occurred";
    return Promise.reject({ ...error, message: errMsg });
  }
);

export default api;
