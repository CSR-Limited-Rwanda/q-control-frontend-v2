"use client";

import React, { useEffect, useState } from "react";

const SwitchTheme = () => {
  const preferredTheme = localStorage.getItem("theme");
  const userTheme =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isLightMode, setIsLightMode] = useState(null);

  useEffect(() => {
    const setUserTheme = () => {
      if (preferredTheme) {
        if (preferredTheme === "dark") {
          setIsLightMode(false);
        } else if (preferredTheme === "light") {
          setIsLightMode(true);
        }
      } else {
        setIsLightMode(userTheme);
      }
    };
    setUserTheme();
  });
  document
    .querySelector("body")
    .setAttribute("data-theme", isLightMode ? "light" : "dark");
  const switchTheme = () => {
    setIsLightMode(!isLightMode);
    localStorage.setItem("theme", !isLightMode ? "light" : "dark");
  };

  return (
    <div className="theme-switcher" onClick={switchTheme}>
      {isLightMode ? (
        <div className="icon light-icon">
          <i className="fa-solid fa-moon"></i>
        </div>
      ) : (
        <div className="dark-icon icon">
          <i className="fa-solid fa-sun"></i>
        </div>
      )}{" "}
      <div className="switch-text">{isLightMode ? "Dark" : "Light"}</div>
    </div>
  );
};

export default SwitchTheme;
