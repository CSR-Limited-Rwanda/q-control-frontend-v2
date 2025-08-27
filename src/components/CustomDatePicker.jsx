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
  const [warning, setWarning] = useState("");

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
      setWarning("");
    }
  }, [selectedDate]);

  // Validate date format and non-future date
  useEffect(() => {
    if (year.length === 4 && month.length === 2 && day.length === 2) {
      const formatted = `${year.padStart(4, "0")}-${month.padStart(
        2,
        "0"
      )}-${day.padStart(2, "0")}`;

      const isValidDate = dayjs(formatted, "YYYY-MM-DD", true).isValid();
      const isFutureDate = dayjs(formatted).isAfter(dayjs(), "day");

      if (!isValidDate) {
        setWarning("Invalid date entered. Please enter a valid date.");
      } else if (isFutureDate) {
        setWarning("Please enter a date that is today or in the past.");
      } else {
        setWarning("");
        setSelectedDate(formatted);
      }
    } else {
      setWarning("");
    }
  }, [year, month, day, setSelectedDate]);

  const validateMonth = (value) => {
    if (!/^\d{0,2}$/.test(value)) {
      setWarning("Month must be a number.");
      return false;
    }
    if (value.length === 2 && (parseInt(value) < 1 || parseInt(value) > 12)) {
      setWarning("Month must be between 01 and 12.");
      return false;
    }
    return true;
  };

  const validateDay = (value) => {
    if (!/^\d{0,2}$/.test(value)) {
      setWarning("Day must be a number.");
      return false;
    }
    if (value.length === 2) {
      const parsedDay = parseInt(value);
      let maxDays = 31;
      if (month.length === 2) {
        const parsedMonth = parseInt(month);
        if ([4, 6, 9, 11].includes(parsedMonth)) {
          maxDays = 30;
        } else if (parsedMonth === 2) {
          maxDays = 29; // Allow up to 29 for February; leap year check in full validation
        }
      }
      if (parsedDay < 1 || parsedDay > maxDays) {
        setWarning(
          `Day must be between 01 and ${maxDays} for the selected month.`
        );
        return false;
      }
    }
    return true;
  };

  const validateYear = (value) => {
    if (!/^\d{0,4}$/.test(value)) {
      setWarning("Year must be a number.");
      return false;
    }
    if (value.length === 4 && parseInt(value) < 1900) {
      setWarning("Year must be 1900 or later.");
      return false;
    }
    return true;
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (validateMonth(value)) {
      setMonth(value);
      setWarning("");
      if (value.length === 2) dayRef.current?.focus();
    }
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (validateDay(value)) {
      setDay(value);
      setWarning("");
      if (value.length === 2) yearRef.current?.focus();
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (validateYear(value)) {
      setYear(value);
      setWarning("");
    }
  };

  return (
    <div
      className="date-input"
      onClick={(e) => stopPropagation && e.stopPropagation()}
    >
      <div className="date-container">
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
      {warning && <div className="date-warning">{warning}</div>}
    </div>
  );
};

export default CustomDatePicker;
