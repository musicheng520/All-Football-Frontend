import axios from "axios";

// ✅ 用环境变量判断，而不是 hostname
const BASE_URL =
    import.meta.env.MODE === "development"
        ? "http://localhost:8080"
        : import.meta.env.VITE_API_BASE_URL || "https://api.sicheng55.com";

const request = axios.create({
    baseURL: BASE_URL,
    timeout: 5000,
});

// ✅ 请求拦截器
request.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }

    return config;
});

// ✅ 响应拦截器
request.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default request;