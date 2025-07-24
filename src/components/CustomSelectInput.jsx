"use client";
import React, { useState } from "react";

const CustomSelectInput = ({ options, selected, setSelected, placeholder }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectOption, setSelectedOption] = useState("");
  const handleSelected = (value) => {
    setSelectedOption(false);
    // setSelected(selectOption);
    setSelected(value);
    setShowOptions(false);
  };
  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div className="custom-select-input full-width">
      <input
        value={selected ?? ""}
        readOnly
        onClick={toggleShowOptions}
        type="text"
        name=""
        id=""
        placeholder={`Select ${placeholder || "option"}`}
      />
      {showOptions && (
        <div onClick={toggleShowOptions} className="options-container">
          <div className="options">
            <span className="option option-header">
              Select {placeholder || "option"}
            </span>
            {options.map((option, index) => (
              <span
                key={index}
                onClick={() => handleSelected(option)}
                className={`option option-hover ${
                  selected === option ? "selected" : ""
                }`}
              >
                {option}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default CustomSelectInput;
