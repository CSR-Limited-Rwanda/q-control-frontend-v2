'use client'
import React, { useState } from "react";

const MedicationOtherInformation = ({ data, incidentStatuses }) => {
  
  return (
    <div className="incident-details">
      <div className="number-mrn"></div>
      <div className="number-mrn">
        <div className="location">
          <small>Error category</small>
          <h4>{data?.error_category || "Not provided"}</h4>
        </div>
        <div className="location">
          <small> Comments </small>
          <h4>{data?.comments || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Actions taken</small>
          <h4>{data?.actions_taken || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Severity rating </small>
          <h4>{data?.severity_rating || "Not provided"}</h4>
        </div>
      </div>
    </div>
  );
};

export default MedicationOtherInformation;
