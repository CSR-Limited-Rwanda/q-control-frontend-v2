import axios from "axios";
// import { jsPDF } from "jspdf";
// import * as XLSX from "xlsx";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const TINYEMCE_API_KEY = process.env.NEXT_PUBLIC_TINYEMCE_API_KEY;

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

//   export const exportExcel = (data, name) => {
//     const workbook = XLSX.utils.book_new();

//     const worksheet = XLSX.utils.json_to_sheet(data);

//     XLSX.utils.book_append_sheet(workbook, worksheet, name || "cohesive");

//     XLSX.writeFile(workbook, name + ".xlsx" || "cohesive_doc.xlsx");
//   };

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
  console.log("Raw facility from localStorage:", facility_id);

  if (facility_id && facility_id !== undefined) {
    console.log("Facility ID:", facility_id);
    return facility_id;
  } else if (department && department !== undefined) {
    return department;
  } else {
    console.log("No active account found in localStorage");
    return null;
  }
};
