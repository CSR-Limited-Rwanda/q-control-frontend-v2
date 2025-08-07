import React from "react";
import "../../../../styles/_medication_details.scss"

const WorkPlaceGeneralInfo = ({ data, incidentStatuses }) => {

  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>Incident type</small>
          <h3>{data.incident?.incident_type || "Not provided"}</h3>
          <h4>{data.incident?.physical_injury_description || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="phone-number">
          <small>
            Detailed description of the observation, threat, incident, or
            activity
          </small>
          <h4>
            {(data.incident.description &&
              data.incident.description.replace(/[^a-zA-Z0-9\s]/g, "").trim()) ||
              "Not provided"}
          </h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Person injured</small>
          {data.incident.persons_injured ?
            data.incident.persons_injured.map((person) => (
              <div key={person.id}>
                <h4>{person.last_name || "N/A"} {person.first_name || "N/A"}</h4>
              </div>
            )) : "No person was injured"}
        </div>
        <div className="location">
          <small>Incident witness(es)</small>
          {/* I am using form choices to get some styling, but we will change it */}
          <h4 className="form-choices">
            {data.incident.incident_witness ?
              data.incident.incident_witness.map((witness) =>
                <div key={witness.id} className="choice">
                  <h4>{witness.last_name || "N/A"} {witness.first_name || "N/A"}</h4>
                </div>
              ) : "No witness"}
          </h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Type of contact</small>
          <h4>{data.incident?.type_of_contact || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Was the victim alone?</small>
          <h4>{data.incident?.victim_was_alone ? "Yes" : "No"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Location</small>
          <h4>{data.location || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Were weapons involved</small>
          <h4>{data.incident?.weapons_were_involved ? "Yes" : "No"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Weapon used</small>
          <h4>{data.incident?.weapon_used || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Any threats before?</small>
          <h4>{data.incident?.there_was_threats_before || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Termination of incident</small>
          <h4>
            {data.incident?.termination_of_incident}
          </h4>
        </div>
        <div className="location">
          <small>Are they any injuries?</small>
          <h4>{data.incident?.there_were_injuries || "Not provided"}</h4>
        </div>
      </div>
    </div>
  );
};

export default WorkPlaceGeneralInfo;
