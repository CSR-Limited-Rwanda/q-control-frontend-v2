import DateFormatter from "@/components/DateFormatter";

const GrievanceDetailsContentTab = ({ data }) => {

  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="first-name">
          <small>Patient Name</small>
          <div className="patient-name">
            {" "}
            <h4>
              <span>
                {data.patient_name?.last_name || "Not provided"}
              </span>{" "}
              <span>
                {data.patient_name?.first_name || "Not provided"}
              </span>
            </h4>
          </div>
        </div>
        <div className="mrn">
          <small>MRN</small>
          <h4>{data.patient_name?.medical_record_number || "Not provided"}</h4>
        </div>
      </div>

      <div className="address">
        <div className="street">
          <small>Date of birth</small>
          <h4>
            <DateFormatter dateString={data.patient_name?.date_of_birth} />
          </h4>
        </div>
        <div className="zip-code">
          <small>Age</small>
          <h4>{data.incident?.patient_name?.age || "Not provided"}</h4>
        </div>
      </div>

      <div className="address">
        <div className="street">
          <small>Who made the complaint?</small>
          <h4>
            {data.complaint_made_by?.last_name || "Not provided"}{" "}
            {data.complaint_made_by?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="state">
          <small>Relationship to patient</small>
          <h4>{data.relationship_to_patient || "Not provided"}</h4>
        </div>
        <div className="phone-number">
          <small>Phone number</small>
          <h4>{data.complaint_made_by?.phone_number || "Not provided"}</h4>
        </div>
        <div className="zip-code">
          <small>Source of information</small>
          <h4>{data.source_of_information || "Not provided"}</h4>
        </div>
      </div>

      <div className="address">
        <div className="location">
          <small>Administrator Notified</small>
          <h4>
            {data.administrator_notified?.last_name || "Not provided"}{" "}
            {data.administrator_notified?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="status">
          <small>Date & Time</small>
          <h4>
            <DateFormatter dateString={data.date} />
          </h4>
        </div>
      </div>
    </div>
  );
};

export default GrievanceDetailsContentTab;
