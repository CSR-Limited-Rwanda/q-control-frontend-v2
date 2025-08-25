import DateFormatter from "@/components/DateFormatter";

function DrugReactionContentTab({ data }) {

  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>Phone Number</small>
          <h4>{data.patient_name?.phone_number || "Not provided"}</h4>
        </div>
        <div className="mrn">
          <small>MRN</small>
          <h4>{data.patient_name?.medical_record_number || "Not provided"}</h4>
        </div>
      </div>

      <div className="address">
        <div className="street">
          <small>Address</small>
          <h4>{data.patient_name?.address || "Not provided"}</h4>
        </div>
        <div className="state">
          <small>State</small>
          <h4>{data.patient_name?.state || "Not provided"}</h4>
        </div>
        <div className="zip-code">
          <small>Zip</small>
          <h4>{data.patient_name?.zip_code || "Not provided"}</h4>
        </div>
      </div>

      <div className="location-contribution-diagnosis">
        <div className="location">
          <small>Provider</small>
          <h4>{data.provider || "Not provided"}</h4>
        </div>
        <div className="contribution">
          <small>Observers Name</small>
          <h4>
            {`${data.observers_name?.first_name} ${data.observers_name?.last_name}` ||
              "Not provided"}
          </h4>
        </div>
      </div>

      <div className="patient-status">
        <div className="status">
          <small>Report Date & Time</small>
          <h4>
            {<DateFormatter dateString={data.date_of_report} /> ||
              "Date not provided"}
            , {data.time_of_report || "Time not provided"}
          </h4>
        </div>
      </div>
      <div className="patient-status">
        <div className="status">
          <small>Event Details</small>
          <h4>{data.event_detail || "Not provided"}</h4>
        </div>
      </div>
    </div>
  );
}

export default DrugReactionContentTab;