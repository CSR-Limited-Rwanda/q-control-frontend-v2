

const StaffDetailsContentTab = ({ data }) => {
  const workRelated = data.previous_injury ? "Yes" : "No"
  console.log(workRelated);
  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>Work Related</small>
          <h4>{workRelated || "Not provided"}</h4>
        </div>
        <div className="mrn">
          <small>Supervisor</small>
          <h4>{data.supervisor || "Not provided"}</h4>
        </div>
      </div>

      <div className="address">
        <div className="street">
          <small>Witness</small>

          <div>
            {
              data.witnesses.map((witness, index) => (
                <h4 key={index}>{witness.witness_name || "Not provided"}</h4>

              ))
            }
          </div>


        </div>

      </div>

      <div className="address">
        <div className="street">
          <small>Doctor consulted</small>
          <h4>{data.doctor_consulted || "Not provided"}</h4>
        </div>
      </div>

      <div className="address">
        <div className="street">
          <small>Date of birth</small>
          <h4>{data.date_of_birth || "Not provided"}</h4>
        </div>
        <div className="street">
          <small>Age</small>
          <h4>{data.age || "Not provided"}</h4>
        </div>
      </div>


      {/* <div className="location-contribution-diagnosis">
        <h3>Provider/Staff Involved</h3>
        <div className="location">
          <small>Classification</small>
          <h4>{data.provider_classification || "Not provided"}</h4>
        </div>
        <div className="contribution">
          <small>Status</small>
          <h4>{data.status || "Not provided"}</h4>
        </div>
      </div>

      <div className="patient-status">
        <div className="status">
          <small>Provider Notified</small>
          <h4>
            {data.provider_title || "Not provided"}
            {"  "}
            {data.provider_name || "Not provided"}
          </h4>
        </div>
        <div className="status">
          <small>Duration of error</small>
          <h4>
            {data.days || "Not provided"} day(s), {data.hours || "Not provided"}{" "}
            hour(s){" "}
          </h4>
        </div>
      </div> */}
    </div>
  );
};

export default StaffDetailsContentTab;