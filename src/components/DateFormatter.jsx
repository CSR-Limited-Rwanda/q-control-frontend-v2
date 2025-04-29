
const DateFormatter = ({dateString}) => {
    if (dateString) {
        const date = new Date(dateString);
    
        const dayFormatter = new Intl.DateTimeFormat("en-US", { weekday: "short" });
        const dateFormatter = new Intl.DateTimeFormat("en-US", {
          month: "2-digit", // MM format
          day: "2-digit", // DD format
          year: "numeric", // YYYY format
        });
        const timeFormatter = new Intl.DateTimeFormat("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: false, // 24-hour format
        });
    
        const day = dayFormatter.format(date);
        const formattedDate = dateFormatter.format(date);
    
        const [month, dayOfMonth, year] = formattedDate.split("/");
        const formattedDateMMDDYYYY = `${month}-${dayOfMonth}-${year}`;
    
        return (
          <span className="formatted-date">
            {day}, {formattedDateMMDDYYYY}
          </span>
        );
      } else {
        return <span>N/A</span>;
      }
}

export default DateFormatter

  