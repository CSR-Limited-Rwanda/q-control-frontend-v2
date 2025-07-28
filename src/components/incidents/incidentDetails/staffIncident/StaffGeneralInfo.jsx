import React from "react"
import "../../../../styles/_medication_details.scss"
const StaffGeneralInfo = ({ data, incidentStatuses }) => {
  console.log(data)
  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>location</small>
          <h4>{data.location|| "Not provided"}</h4>
        </div>
      
      </div>

      <div className="number-mrn">
        <div className="phone-number">
          <small>Activity at the Time</small>
          <h4>{data.activity_at_time_of_incident ||"Not provided"}</h4>
        </div>
      
      </div>

      <div className="location-contribution-diagnosis">
        <div className="location">
          <small>What led up to the injury/near miss</small>
          <h4>{data.incident_description || "Not provided"}</h4>
        </div>
      </div>
      <div className="location-contribution-diagnosis">
        <div className="location">
          <small>What could have been done to prevent this injury/near miss</small>
          <h4>{data.preventive_measures || "Not provided"}</h4>
        </div>
      </div>
      <div className="location-contribution-diagnosis">
        <div className="location">
          <small>Part of your body that were injured how could  you have been hurt</small>
          <h4>{data.body_parts_injured|| "Not provided"}</h4>
        </div>
      </div>
    </div>
  );
};

export default StaffGeneralInfo;