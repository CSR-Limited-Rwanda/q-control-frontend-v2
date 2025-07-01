"use client";
import { useState } from "react";
import { Clock3 } from "lucide-react";
import { hoursArray, minutesArray } from "@/constants/constants";

const CustomTimeInput = ({ setTime, defaultTime }) => {
    const [hour, setHour] = useState(defaultTime?.split(':')[0] || '')
    const [minutes, setMinutes] = useState(defaultTime?.split(':')[1] || '');
    const [fullTime, setFullTime] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

  const handleHourChange = (e) => {
    let value = parseInt(e.target.value, 10);

    if (value > 23) {
      value = 23;
    } else if (value < 0 || isNaN(value)) {
      value = "";
    }
    setHour(value);
    setTime(`${value}:${minutes}`);
  };

  const handleMinutesChange = (e) => {
    let value = parseInt(e.target.value, 10);

    if (value > 59) {
      value = 59;
    } else if (value < 0 || isNaN(value)) {
      value = "";
    }
    setMinutes(value);
    setTime(`${hour}:${value}`);
  };

  const handleShowDropdown = () => {
    setShowDropdown(!showDropdown);
  };

    const handleSetTime = () => {
        setTime(`${hour}:${minutes}`);
        setShowDropdown(false)

    }
    return (
        <>
            <div className='custom-input custom-time-input'>
                <div className="inputs">
                    <input
                        type="number"
                        name="hour"
                        id="hour"
                        placeholder='hh'
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
                        placeholder='mm'
                        value={minutes}
                        onChange={handleMinutesChange}
                        min="0"
                        max="59"
                    />
                </div>
                <Clock3 className='icon' onClick={handleShowDropdown} />
                {
                    (showDropdown &&
                    <div className="time-hour-drop-down">
                        <div className="drop-downs">
                            <div className="hours">
                                {
                                    hoursArray && hoursArray.map(hour => (
                                        <p key={hour} className='unit' onClick={() => setHour(hour)}>{hour}</p>
                                    ))
                                }
                            </div>
                            <div className="minutes">
                                {
                                    minutesArray && minutesArray.map(minute => (
                                        <p key={minute} className='unit' onClick={() => setMinutes(minute)}>{minute}</p>
                                    ))
                                }
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
    </>
  );
};

export default CustomTimeInput;
