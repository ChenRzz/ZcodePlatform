// src/utils/axios.ts
import axios from "axios";

// 创建实例
const instance = axios.create({
    baseURL: "http://localhost:8081",
    timeout: 10000
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            alert("login expired, please login");
            window.location.href = "/login";
        }
        if (error.response?.status === 405) {
            alert("Insufficient permissions");
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default instance;
