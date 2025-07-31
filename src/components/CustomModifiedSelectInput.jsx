'use client'
import { ArrowDown } from 'lucide-react';
import React, { useState, useEffect } from "react";

const CustomModifiedSelectInput = ({
  options,
  selected,
  setSelected,
  placeholder,
}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectOption, setSelectOption] = useState(selected);

  // Sync internal `selectOption` state with external `selected` prop
  useEffect(() => {
    setSelectOption(selected);
  }, [selected]);

  // When an option is selected, update both local and parent states
  const handleSelected = (value) => {
    setSelectOption(value);
    setSelected(value); // This should trigger the parent component’s data fetch
    setShowOptions(false);
    console.log(selected);
  };

  const toggleShowOptions = () => {
    setShowOptions(!showOptions);
  };

  // Reorder the options with the selected (active) version at the top
  const orderedOptions = options.sort((a, b) => {
    // Check if either option is the selected one and move it to the top
    if (a.value === selectOption) return -1; // Move a to top
    if (b.value === selectOption) return 1; // Move b to top
    return 0; // Keep the rest in the original order
  });

  return (
    <div
      className="custom-select-input full-width"
      id="custom-select-modified-input"
    >
      <div className="modified-input" onClick={toggleShowOptions}>
        <input
          value={
            options
              .find((option) => option.value === selectOption)
              ?.label.replace(/<\/?[^>]+(>|$)/g, "") ||
            placeholder ||
            "Select an option"
          }
          readOnly
          placeholder={placeholder || "Option"}
          type="text"
        />
        {/* TODO: Take care go the background on this div. If it is transparent, text can be seen behind it, and it looks ugly */}
        <div className={`angle-down ${showOptions ? "rotate-angle" : ""}`} >
          <ArrowDown
            size={24}
          />
        </div>
      </div>

      {showOptions && (
        <div className="options-container">
          <div className="options">
            <span className="option" id="input-placeholder">
              {placeholder || "Option"}
            </span>
            {orderedOptions.map((option, index) => (
              <span
                key={index}
                onClick={() => handleSelected(option.value)}
                className={`option ${selectOption === option.value ? "selected" : ""
                  }`}
                id="option"
                dangerouslySetInnerHTML={{ __html: option.label }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomModifiedSelectInput;
