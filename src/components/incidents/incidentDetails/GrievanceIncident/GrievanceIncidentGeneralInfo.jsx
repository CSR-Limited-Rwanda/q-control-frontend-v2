const GrievanceIncidentGeneralInfo = ({ data, incidentStatuses }) => {
    return (
      <div className="incident-type-data">
        <div className="general-col">
          <div className="general-sub-col">
            <h3>Complaint or Concern</h3>
            <small>{data.incident?.complaint_or_concern || "Not provided"}</small>
          </div>
          <div className="general-sub-col">
            <h3>Initial corrective actions taken to resolve the complaint</h3>
            <small>{data.incident?.initial_corrective_actions || "Not provided"}</small>
          </div>
          <div className="street">
            <h3>Title</h3>
            <small>{data.incident?.title || "Not provided"}</small>
          </div>
          <div className="general-sub-col">
            <h3>Outcome</h3>
            <small>{data.incident?.outcome || "Not provided"}</small>
          </div>
          <div className="general-sub-col">
            <h3>Adverse patient outcome</h3>
            <small>{data.incident?.adverse_patient_outcome ? "Yes" : "No"}</small>
          </div>
  
          <div className="address"></div>
        </div>
      </div>
    );
  };
  
  export default GrievanceIncidentGeneralInfo;