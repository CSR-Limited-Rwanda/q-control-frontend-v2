'use client'
import React from "react";
import NamesInitials from "../../../NamesInitials";
import DateFormatter from "../../../DateFormatter";

const StaffDetails = ({
  data,
  fullName,
  job_title,
  IncidentDate,
  incidentTime,
  status,
  incidentDetails,
}) => {
  return (
    <div className="patient-name-type">
      <div className="date">
        Injury Date & Time:{" "}
        <div>
          <DateFormatter dateString={IncidentDate} /> {incidentTime}
        </div>
      </div>
      <div className="name-profile">
        <div className="profile">
          <div className="profile-pic">
            <NamesInitials fullName={fullName || "Not provided"} />
          </div>
          <div className="name-sex">
            <h3 className="name">{fullName || "Not provided"}</h3>
            <small className="sex">{data.job_title || "Not provided"}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetails;