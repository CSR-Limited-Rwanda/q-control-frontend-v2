"use client";

import { useState, useEffect } from "react";
import { Clock3 } from "lucide-react";
import { hoursArray, minutesArray } from "@/constants/constants";

const CustomTimeInput = ({ setTime, defaultTime }) => {
  // Ensure hour and minutes are always strings from the beginning
  const [hour, setHour] = useState("");
  const [minutes, setMinutes] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Set initial time from defaultTime prop
  useEffect(() => {
    if (defaultTime) {
      const [defaultHour, defaultMinutes] = defaultTime.split(":");
      setHour(defaultHour);
      setMinutes(defaultMinutes);
    }
  }, [defaultTime]);

  const handleHourChange = (e) => {
    let value = e.target.value;
    const numericValue = parseInt(value, 10);

    if (value === "") {
      setHour("");
      setTime(`:${minutes}`);
      return;
    }

    if (!isNaN(numericValue)) {
      if (numericValue > 23) value = "23";
      if (numericValue < 0) value = "0";
    }

    setHour(value);
    setTime(`${value}:${minutes}`);
  };

  const handleMinutesChange = (e) => {
    let value = e.target.value;
    const numericValue = parseInt(value, 10);

    if (value === "") {
      setMinutes("");
      setTime(`${hour}:`);
      return;
    }

    if (!isNaN(numericValue)) {
      if (numericValue > 59) value = "59";
      if (numericValue < 0) value = "0";
    }

    setMinutes(value);
    setTime(`${hour}:${value}`);
  };

  const handleShowDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleSetTime = () => {
    setTime(`${hour}:${minutes}`);
    setShowDropdown(false);
  };

  const handleSelectHour = (h) => {
    setHour(h);
    setTime(`${h}:${minutes}`);
  };

  const handleSelectMinutes = (m) => {
    setMinutes(m);
    setTime(`${hour}:${m}`);
  };

  return (
    <div className="custom-input custom-time-input">
      <div className="inputs">
        <input
          type="number"
          name="hour"
          id="hour"
          placeholder="hh"
          value={hour}
          onChange={handleHourChange}
          min="0"
          max="23"
        />
        :
        <input
          type="number"
          name="minutes"
          id="minutes"
          placeholder="mm"
          value={minutes}
          onChange={handleMinutesChange}
          min="0"
          max="59"
        />
      </div>

      <Clock3 className="icon" onClick={handleShowDropdown} />

      {showDropdown && (
        <div className="time-hour-drop-down">
          <div className="drop-downs">
            <div className="hours">
              {hoursArray?.map((h, index) => (
                <p
                  key={index}
                  className="unit"
                  onClick={() => handleSelectHour(h)}
                >
                  {h}
                </p>
              ))}
            </div>
            <div className="minutes">
              {minutesArray?.map((m, index) => (
                <p
                  key={index}
                  className="unit"
                  onClick={() => handleSelectMinutes(m)}
                >
                  {m}
                </p>
              ))}
            </div>
          </div>

          <button
            onClick={handleSetTime}
            type="button"
            className="secondary-button"
          >
            Set time
          </button>
        </div>
      )}
    </div>
  );
};

export default CustomTimeInput;
