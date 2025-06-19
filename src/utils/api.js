import axios from "axios";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
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

export const createUrlParams = (params) => {
  const filteredParams = Object.entries(params)
    .filter(
      ([_, value]) => value !== null && value !== undefined && value !== ""
    )
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const searchParams = new URLSearchParams(filteredParams);
  return searchParams.toString();
};
