// ReusableDatePicker.js
"use client";
import React, { forwardRef, useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";

import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <div className="custom-input" onClick={onClick} ref={ref}>
    <input type="text" value={value} readOnly placeholder="YYYY-MM-DD" />
    <CalendarDays className="icon" />
  </div>
));

const CustomDatePicker = ({
  selectedDate,
  setSelectedDate,
  stopPropagation,
}) => {
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");

  const dayRef = useRef(null);
  const yearRef = useRef(null);

  // Sync internal state when selectedDate changes from parent
  useEffect(() => {
    if (selectedDate) {
      const [y = "", m = "", d = ""] = selectedDate.split("-");
      setYear(y || "");
      setMonth(m || "");
      setDay(d || "");
    } else {
      setYear("");
      setMonth("");
      setDay("");
    }
  }, [selectedDate]);

  // Automatically update selectedDate when full date is entered
  useEffect(() => {
    if (year.length === 4 && month.length === 2 && day.length === 2) {
      const formatted = `${year.padStart(4, "0")}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(2, "0")}`;
      setSelectedDate(formatted);
      console.log("Formatted Date:", formatted);
    }
  }, [year, month, day]);

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setMonth(value);
      if (value.length === 2) dayRef.current?.focus();
    }
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setDay(value);
      if (value.length === 2) yearRef.current?.focus();
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setYear(value);
      // No selectedDate update here — we wait for useEffect
    }
  };

  return (
    <div
      className="date-input"
      onClick={(e) => stopPropagation && e.stopPropagation()}
    >
      <input
        type="text"
        placeholder="MM"
        maxLength="2"
        value={month || ""}
        onChange={handleMonthChange}
        className="date-input-field"
      />
      /
      <input
        type="text"
        ref={dayRef}
        placeholder="DD"
        maxLength="2"
        value={day || ""}
        onChange={handleDayChange}
      />
      /
      <input
        className="yyy"
        type="text"
        ref={yearRef}
        placeholder="YYYY"
        maxLength="4"
        value={year || ""}
        onChange={handleYearChange}
      />
    </div>
  );
};

// function CustomDatePickers({ selectedDate, setSelectedDate }) {
//   // Internal handler to safely process date changes
//   const handleDateChange = (newValue) => {
//     try {
//       // Ensure we always pass either null or a valid dayjs object
//       if (!newValue || !dayjs.isDayjs(newValue)) {
//         setSelectedDate(null);
//         return;
//       }

//       if (!newValue.isValid()) {
//         setSelectedDate(null);
//         return;
//       }

//       setSelectedDate(newValue);
//     } catch (error) {
//       console.error("Date parsing error:", error);
//       setSelectedDate(null);
//     }
//   };

//   // Safely get value for the DatePicker
//   const getDateValue = () => {
//     try {
//       if (
//         !selectedDate ||
//         !dayjs.isDayjs(selectedDate) ||
//         !selectedDate.isValid()
//       ) {
//         return null;
//       }
//       return selectedDate;
//     } catch {
//       return null;
//     }
//   };

//   return (
//     <LocalizationProvider dateAdapter={AdapterDayjs}>
//       <DemoContainer components={["DatePicker"]}>
//         <DatePicker
//           label="Basic date picker"
//           format="DD/MM/YYYY"
//           value={getDateValue()}
//           onChange={handleDateChange}
//           clearable
//           slotProps={{
//             textField: {
//               size: "small",
//               error: false, // Prevent error state from showing
//             },
//           }}
//           // Handle any parsing errors gracefully
//           onError={() => {
//             handleDateChange(null);
//           }}
//         />
//       </DemoContainer>
//     </LocalizationProvider>
//   );
// }

export default CustomDatePicker;
