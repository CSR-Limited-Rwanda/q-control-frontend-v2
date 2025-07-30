import DateFormatter from "@/components/DateFormatter";

const formatTime = (time) => {
  if (!time || typeof time !== "string") return null;

  const [hours, minutes, seconds] = time.split(":");
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const LostFoundDetailsContentTab = ({ data }) => {
  console.log('data:', data)
  return (
    <div className="incident-details">
      <div className="report">
        <div className="person_report">
          <h3>Name of person taking report </h3>
          <small>
            {data.incident.taken_by?.last_name || "Not provided"}{" "}
            {data.incident.taken_by?.first_name || "Not provided"}
          </small>
        </div>

        <div className="reporting_relationship">
          <div className="reporting">
            <h3>Individual reporting loss</h3>
            <small>
              {data.incident.reported_by?.last_name || "Not provided"}{" "}
              {data.incident.reported_by?.first_name || "Not provided"}
            </small>
          </div>

          <div className="relationship">
            <h3>Relationship</h3>
            <small>{data.incident?.relation_to_patient || "Not provided"}</small>
          </div>
        </div>
      </div>

      <div className="property_found">
        <h2>Property was found:</h2>
        <div className="location">
          <h3>
            Location where <br></br>property was returned
          </h3>
          <small>{data.incident?.location_returned || "Not provided"}</small>
        </div>
        <div className="returned">
          <div className="property_returned">
            <h3>Property returned to</h3>
            <small>{data.incident?.returned_to || "Not provided"}</small>
          </div>

          <div className="date_time_returned">
            <h3>Date & Time returned</h3>
            <small>
              <DateFormatter dateString={data.incident?.date_reported} />,{" "}
              {data.incident?.time_reported
                ? formatTime(data.incident?.time_reported)
                : "Not provided"}
            </small>
          </div>
        </div>

        <div className="found">
          <div className="location">
            <h3>
              Location where <br></br>property was found
            </h3>
            <small>{data.incident?.location_found || "Not provided"}</small>
          </div>

          <div className="date_time_found">
            <h3>Date & Time found</h3>
            <small>
              <DateFormatter dateString={data.incident?.date_found} />,{" "}
              {data.incident?.time_found ? formatTime(data.incident?.time_found) : "Not provided"}
            </small>
          </div>
        </div>

        <div className="property_found_by">
          <h3>Person who found property:</h3>
          <small>
            {data.incident.found_by?.first_name || "Not provided"} {" "}
            {data.incident.found_by?.last_name || "Not provided"} 
          </small>
        </div>
      </div>
    </div>
  );
};

export default LostFoundDetailsContentTab;