'use client'
import React, { useEffect } from "react";

function NamesInitials({ fullName }) {
  // Log only when the `fullName` prop changes
  useEffect(() => {
    console.log("fullname", fullName);
  }, [fullName]); // Dependency array ensures it only runs when `fullName` changes

  if (!fullName) {
    return "Bedell Sandi";
  } else {
    const names = fullName?.split(" ");
    const firstName = names[0].charAt(0).toUpperCase();
    const lastName = names[names.length - 1].charAt(0).toUpperCase();
    return (
      <span>
        {lastName} {firstName}
      </span>
    );
  }
}

export default NamesInitials;