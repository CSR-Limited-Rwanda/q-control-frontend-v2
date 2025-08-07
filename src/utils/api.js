import axios from "axios";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const TINYEMCE_API_KEY = process.env.NEXT_PUBLIC_TINYEMCE_API_KEY;

const api = axios.create({
  baseURL: API_URL,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request interceptor
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

// Response interceptor for handling token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refresh');

      if (!refreshToken) {
        // No refresh token, redirect to login
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_URL}/auth/refresh/`, {
          refresh: refreshToken,
        });

        if (response.status === 200) {
          const { access } = response.data;
          localStorage.setItem('access', access);

          // Process queued requests
          processQueue(null, access);

          // Retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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

export const calculateAge = (dateOfBirth) => {
  const birthDate = new Date(dateOfBirth);

  if (isNaN(birthDate.getTime())) {
    // Invalid date
    return null;
  }

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

//   export const exportTableToPDF = (headers, data, options = {}) => {
//     const {
//       title = "Report",
//       fontSize = 14,
//       textColor = "#000000",
//       font = "helvetica",
//     } = options;

//     const doc = new jsPDF();

//     doc.setFont(font);
//     doc.setFontSize(fontSize);
//     doc.setTextColor(textColor);

//     doc.text(title, 14, 10);

//     doc.setLineWidth(0.5);
//     doc.line(14, 12, 200, 12);

//     doc.setFontSize(12);
//     doc.text("Generated on: " + new Date().toLocaleString(), 14, 18);

//     doc.autoTable({
//       head: [headers],
//       body: data,
//       startY: 22,
//       theme: "striped",
//       headStyles: {
//         fillColor: [22, 160, 133],
//         textColor: [255, 255, 255],
//       },
//       alternateRowStyles: {
//         fillColor: [240, 240, 240],
//       },
//       styles: {
//         fontSize: 10,
//         font: font,
//       },
//     });

//     doc.save(`${title}.pdf`);
//   };

export const exportExcel = (data, name) => {

  // Placeholder function - needs XLSX library
  // const workbook = XLSX.utils.book_new();
  // const worksheet = XLSX.utils.json_to_sheet(data);
  // XLSX.utils.book_append_sheet(workbook, worksheet, name || "cohesive");
  // XLSX.writeFile(workbook, name + ".xlsx" || "cohesive_doc.xlsx");
};

export const formatDateTime = (date) => {
  if (date) {
    const newDate = new Date(date).toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // Ensures 24-hour format
    });

    return newDate;
  } else {
    return "N/A";
  }
};

export const cleanedData = (data) => {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const currentTime = new Date().toLocaleString("en-US", {
    timeZone: userTimezone,
    hour12: false,
  });

  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value.first_name !== "" &&
        value.first_name !== null &&
        value.last_name !== "" &&
        value.last_name !== null
      ) {
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
  const facility_id = localStorage.getItem("facilityId");
  const department = localStorage.getItem("departmentId");

  if (facility_id && facility_id !== undefined) {

    return facility_id;
  } else if (department && department !== undefined) {
    return department;
  } else {

    return null;
  }
};
