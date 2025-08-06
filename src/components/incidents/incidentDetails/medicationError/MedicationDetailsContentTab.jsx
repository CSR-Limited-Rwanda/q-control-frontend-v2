import DateFormatter from "@/components/DateFormatter";

const MedicationDetailsContentTab = ({ data }) => {
  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>Patient Name</small>
          <h4>
            {data.incident?.patient?.last_name || "Not provided"}{" "}
            {data.incident?.patient?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="mrn">
          <small>MRN</small>
          <h4>{data.incident?.patient?.medical_record_number || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="phone-number">
          <small>Date of birth</small>
          <h4>
            <DateFormatter dateString={data.incident?.patient?.date_of_birth} />{" "}
          </h4>
        </div>
        <div className="mrn">
          <small>Age</small>
          <h4>{data.incident?.patient?.age || "Not provided"}</h4>
        </div>
      </div>

      <div className="address">
        <div className="street">
          <small>Location</small>
          <h4>{data.incident?.location || "Not provided"}</h4>
        </div>
        <div className="state">
          <small>Date & Time</small>
          <h4>
            <DateFormatter dateString={data.incident?.date_of_error} />,
            <br />
            {data.incident?.time_of_error || "Not provided"}
          </h4>
        </div>
      </div>
      <div className="address">
        <div className="zip-code">
          <small>Day of the week</small>
          <h4>{data.incident?.day_of_the_week || "Not provided"}</h4>
        </div>
      </div>

      <div className="location-contribution-diagnosis">
        <h3>Provider/Staff Involved</h3>
        <div className="location">
          <small>Classification</small>
          <h4>{data.incident?.provider_classification || "Not provided"}</h4>
        </div>
        <div className="contribution">
          <small>Status</small>
          <h4>{data.incident?.status || "Not provided"}</h4>
        </div>
      </div>

      <div className="patient-status">
        <div className="status">
          <small>Provider Notified</small>
          <h4>
            {data.incident?.provider_info?.last_name || "Not provided"}{" "}
            {data.incident?.provider_info?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="status">
          <small>Duration of error</small>
          <h4>
            {data.incident?.days || "Not provided"} day(s), {data.incident?.hours || "Not provided"}{" "}
            hour(s){" "}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsContentTab;
