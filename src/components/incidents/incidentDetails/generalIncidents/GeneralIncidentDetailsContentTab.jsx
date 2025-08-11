import DateFormatter from "@/components/DateFormatter";

const displayValue = (value) => value || "Not provided";

const GeneralIncidentDetailsContentTab = ({ data }) => {
  const incident = data || {};
  const patientVisitor = incident.patient_visitor || {};

  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>Phone number</small>
          <h4>{displayValue(patientVisitor.phone_number)}</h4>
        </div>
        <div className="mrn">
          <small>MRN</small>
          <h4>MRN {displayValue(patientVisitor.medical_record_number)}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="phone-number">
          <small>Patient age</small>
          <h4>{displayValue(patientVisitor.age)}</h4>
        </div>
        <div className="mrn">
          <small>Date of birth</small>
          <h4>
            <DateFormatter dateString={patientVisitor.date_of_birth} />
          </h4>
        </div>
      </div>

      <div className="address">
        <div className="street">
          <small>Street</small>
          <h4>{displayValue(patientVisitor.address)}</h4>
        </div>
        <div className="city">
          <small>City</small>
          <h4>{displayValue(patientVisitor.city)}</h4>
        </div>
        <div className="state">
          <small>State</small>
          <h4>{displayValue(patientVisitor.state)}</h4>
        </div>
        <div className="zip-code">
          <small>Zip code</small>
          <h4>{displayValue(patientVisitor.zip_code)}</h4>
        </div>
      </div>

      <div className="location-contribution-diagnosis">
        <div className="location">
          <small>Location</small>
          <h4>{displayValue(incident.location)}</h4>
        </div>
        <div className="contribution">
          <small>Contributing Factors</small>
          <h4>{displayValue(incident.consulting_diagnosis)}</h4>
        </div>
      </div>

      <div className="patient-status">
        <div className="outcome">
          <small>Outcome</small>
          <h4>{displayValue(incident.outcome)}</h4>
        </div>
      </div>

      <div className="actions-taken patient-status">
        <div className="outcome">
          <small>Actions taken</small>
          <h4>{displayValue(incident.immediate_action_taken)}</h4>
        </div>
      </div>
    </div>
  );
};

export default GeneralIncidentDetailsContentTab;
