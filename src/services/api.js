import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "https://loan-server-1-do86.onrender.com";

const api = axios.create({
  baseURL,
});

/* ================= REQUEST INTERCEPTOR ================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const mode = localStorage.getItem("mode");
    if (mode) {
      config.headers["X-Client-Mode"] = mode;
    }

    /**
     * 🔥 CRITICAL FIX:
     * FormData হলে Content-Type কখনো সেট করো না
     * browser নিজেই boundary set করবে
     */
    const isFormData = config.data instanceof FormData;

    if (isFormData) {
      // remove ALL manual content-type
      delete config.headers["Content-Type"];
      delete config.headers["content-type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access");
      localStorage.removeItem("mode");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
