// ReusableDatePicker.js
"use client";
import React, { forwardRef, useRef, useState } from "react";
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
  const [month, setMonth] = useState(selectedDate?.split("-")[1] || "");
  const [day, setDay] = useState(selectedDate?.split("-")[2] || "");
  const [year, setYear] = useState(selectedDate?.split("-")[0] || "");

  const dayRef = useRef(null);
  const yearRef = useRef(null);

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (Number.isInteger(parseInt(value))) {
      if (value.length <= 2) setMonth(value);
      if (value.length === 2) dayRef.current.focus();
    } else {
      setMonth("");
    }
  };

  const handleDayChange = (e) => {
    const value = e.target.value;
    // check if value is and integer
    if (Number.isInteger(parseInt(value))) {
      if (value.length <= 2) setDay(value);
      if (value.length === 2) yearRef.current.focus();
    } else {
      setDay("");
    }
  };

  // Handle year input
  const handleYearChange = (e) => {
    const value = e.target.value;
    if (Number.isInteger(parseInt(value))) {
      if (value.length <= 4) {
        setYear(value);
        const formattedDate = `${value}-${month}-${day}`;
        setSelectedDate(formattedDate);
        console.log("Formatted Date:", formattedDate);
      } else {
        setSelectedDate("");
      }
    } else {
      setYear("");
    }
  };

  return (
    <div className="date-input">
      <input
        type="text"
        placeholder="MM"
        maxLength="2"
        value={month}
        onChange={handleMonthChange}
        className="date-input-field"
      />
      /
      <input
        type="text"
        ref={dayRef} // Reference to jump to day input
        placeholder="DD"
        maxLength="2"
        value={day}
        onChange={handleDayChange}
      />
      /
      <input
        className="yyy"
        type="text"
        ref={yearRef} // Reference to jump to year input
        placeholder="YYYY"
        maxLength="4"
        value={year}
        onChange={handleYearChange}
      />
    </div>
  );
  // const handleStartDateChange = (date) => {
  //   if (date !== "") {
  //     setSelectedDate(format(date, "yyyy-MM-dd"));
  //   }
  // };
  // const today = new Date().toISOString().split("T")[0];
  // return (
  //   // <input
  //   //   type="date"
  //   //   name=""
  //   //   id=""
  //   //   onClick={(e) => e.stopPropagation()}
  //   //   onChange={(e) => setSelectedDate(e.target.value)}
  //   //   value={selectedDate}
  //   //   max={today}

  //   // />
  //   <DatePicker
  //     selected={selectedDate ? new Date(selectedDate) : null}
  //     onChange={handleStartDateChange}
  //     customInput={<CustomInput />}
  //     placeholderText="Click to select date"
  //     dateFormat="MM-dd-yyyy"
  //     showYearDropdown
  //     scrollableYearDropdown
  //     yearDropdownItemNumber={30}
  //     showMonthDropdown
  //     dropdownMode="select"
  //     maxDate={new Date()}
  //   />
  // );
};
function CustomDatePickers({ selectedDate, setSelectedDate }) {
  // Internal handler to safely process date changes
  const handleDateChange = (newValue) => {
    try {
      // Ensure we always pass either null or a valid dayjs object
      if (!newValue || !dayjs.isDayjs(newValue)) {
        setSelectedDate(null);
        return;
      }

      if (!newValue.isValid()) {
        setSelectedDate(null);
        return;
      }

      setSelectedDate(newValue);
    } catch (error) {
      console.error("Date parsing error:", error);
      setSelectedDate(null);
    }
  };

  // Safely get value for the DatePicker
  const getDateValue = () => {
    try {
      if (
        !selectedDate ||
        !dayjs.isDayjs(selectedDate) ||
        !selectedDate.isValid()
      ) {
        return null;
      }
      return selectedDate;
    } catch {
      return null;
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DatePicker"]}>
        <DatePicker
          label="Basic date picker"
          format="DD/MM/YYYY"
          value={getDateValue()}
          onChange={handleDateChange}
          clearable
          slotProps={{
            textField: {
              size: "small",
              error: false, // Prevent error state from showing
            },
          }}
          // Handle any parsing errors gracefully
          onError={() => {
            handleDateChange(null);
          }}
        />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default CustomDatePicker;
