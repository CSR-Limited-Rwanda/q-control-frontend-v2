

const WorkPlaceDetailsContentTab = ({ data }) => {
  const parseIfNeeded = (value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  };

  const formatIncidentType = (incidentType) => {
    const parsedType = parseIfNeeded(incidentType);
    if (Array.isArray(parsedType)) {
      return parsedType.join("/");
    }
    return parsedType || "Not provided";
  };

  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>Type of incident</small>
          <h5>
            {(() => {
              const parsedValue = parseIfNeeded(data.type_of_incident);

              if (typeof parsedValue === "string") {
                return parsedValue;
              } else if (typeof parsedValue === "array") {
                if (parsedValue.length > 0) {
                  return parsedValue.join("/ ");
                } else {
                  return parsedValue[0];
                }
              } else if (typeof parsedValue === "object") {
                const objParsedValue = parseIfNeeded(parsedValue);

                if (objParsedValue) {

                  if (objParsedValue.incidents.length > 0) {
                    return objParsedValue.incidents.join(", ");
                  } else {
                    return "Not provided";
                  }
                } else {
                  return "Not Provided";
                }
              }
              return "Type";
            })()}
          </h5>
        </div>
        <div className="mrn">
          <small>Physical injury</small>
          <h5>{data.incident?.physical_injury_description || "Not provided"}</h5>
        </div>
      </div>
      <div className="mrn">
        <small>Description</small>
        <h5>
          {(data.incident?.description &&
            data.incident?.description.replace(/[^a-zA-Z0-9\s]/g, "").trim()) ||
            "Not provided"}
        </h5>
      </div>

      <div className="assaliant">
        <div className="first-assaliant">
          <h3>
            Incident Directed at and Initiated/ <br /> Committed
          </h3>
        </div>
        {data.incident.involved_parties &&
          data.incident.involved_parties.map((person, index) => (
            <div key={person.id || index}>
              <h3>Assailant {index + 1}</h3>
              <div className="title-fields">
                <div className="individual-ttle">
                  <small>Name</small>
                  <h5>
                    {person?.last_name || "Not provided"}{" "}
                    {person?.first_name || "Not provided"}
                  </h5>
                </div>
                <div className="individual-ttle">
                  <small>Title</small>
                  <h5>{person?.title || "Not provided"}</h5>
                </div>
                <div className="individual-ttle">
                  <small>Phone Number</small>
                  <h5>{person?.phone_number || "Not provided"}</h5>
                </div>
                <div className="individual-ttle">
                  <small>Email</small>
                  <h5>{person?.email || "Not provided"}</h5>
                </div>
                <div className="individual-ttle">
                  <small>Assailant Relationship to Victim(s):</small>
                  <h5>
                    {person?.assailant_relationship_to_patient ||
                      "Not provided"}
                  </h5>
                </div>
                <div className="individual-ttle">
                  <small>Background</small>
                  <h5>{person.assailant_background || "Not provided"}</h5>
                </div>
              </div>
              <br />
              <br />
            </div>
          ))}
      </div>
    </div>
  );
};

export default WorkPlaceDetailsContentTab;
