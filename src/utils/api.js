import axios from "axios";

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
        .filter(([_, value]) => value !== null && value !== undefined && value !== "")
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    const searchParams = new URLSearchParams(filteredParams);
    return searchParams.toString();
};

export const cleanedData = (data) => {
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: userTimezone,
      hour12: false,
    });
  
    return Object.entries(data).reduce(
      (acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {
        meta: {
          timezone: userTimezone,
          currentTime: currentTime,
          device: navigator.userAgent,
        },
      }
    );
};

export const checkCurrentAccount = () => {
    const facility = localStorage.getItem("activeAccount");
    let facility_id = null;
    if (facility && facility !== undefined) {
      facility_id = JSON.parse(facility).id;
      return facility_id;
    } else {
      return null;
    }
};

export const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };