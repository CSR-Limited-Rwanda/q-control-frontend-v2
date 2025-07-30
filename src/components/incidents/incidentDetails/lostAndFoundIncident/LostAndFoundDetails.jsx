import DateFormatter from "@/components/DateFormatter"
const formatTime = (timeString) => {
  if (!timeString) return ""; // Handle null or undefined
  return timeString.split(".")[0]; // Keep everything before the dot
};

const LostDetails = ({ data, incidentDetails }) => {

  return (
    <div className="patient-name-type">
      <div className="date">
        <small>Date & Time reported</small>
        <h4>
          <DateFormatter dateString={data.date_reported} />, {formatTime(data.time_reported)}
          {/* {incidentData.time_reported}  */}
          {/* {incidentData.date_reported ? incidentData.date_reported : " "}
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
          {incidentData.time_reported ? formatTime(incidentData.time_reported) : "Not provided"} */}
        </h4>
      </div>
      {incidentDetails}
    </div>
  )
}

export default LostDetails