import axios from "axios";
import { API_URL } from "./api";

const mediaAPI = axios.create({
    baseURL: API_URL
})

mediaAPI.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("access");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`
            config.headers['Content-Type'] = 'multipart/form-data'
        } return config
    }, (error) => {
        return Promise.reject(error)
    }
)


export default mediaAPI