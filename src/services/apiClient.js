import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use(
  (config) => {
    config.headers["ngrok-skip-browser-warning"] = "mel"; //bo canh bao ngrok
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = user?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    console.log("🔍 FE gửi URL:", config.url);
    console.log("Token", token);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        "Unauthorized! Token is invalid or expired. Redirecting to login..."
      );
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("userToken");
    }
    return Promise.reject(error);
  }
);

export default apiClient;
