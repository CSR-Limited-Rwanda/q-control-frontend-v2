import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;