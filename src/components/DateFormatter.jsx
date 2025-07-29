import React from "react";

const DateFormatter = ({ dateString }) => {
  // Log input for debugging
  console.log("DateFormatter input:", dateString);

  // Check if dateString is valid and parseable
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    console.log("Invalid date in DateFormatter:", dateString);
    return <span>N/A</span>;
  }

  const date = new Date(dateString);
  const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });

  const day = dayFormatter.format(date);
  const formattedDate = dateFormatter.format(date).replace(/\//g, "-"); // Replace slashes with dashes for MM-DD-YYYY

  return (
    <span className="formatted-date">
      {day}, {formattedDate}
    </span>
  );
};

export default DateFormatter;
