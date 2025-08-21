import DateFormatter from "@/components/DateFormatter";

const formatTime = (timeString) => {
  if (!timeString) return ""; // Handle null or undefined
  return timeString.split(".")[0]; // Keep everything before the dot
};


function DrugReactionOtherInformation({ data }) {
  
  return (
    <div className="flex-column">
      <div className="flex-column">
        <h2>General Classification of Reaction</h2>
        <p>{data?.incident_type_classification || "Not Provided"}</p>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <h3>Outcome</h3>
          <p>{data?.outcome_type || "Not Provided"}</p>
        </div>
        <div className="flex-column">
          <h3>Description</h3>
          <p>{data?.treatment_description || "Not Provided"}</p>
        </div>
        <div className="flex-column">
          <h3>Anaphylaxis /ADR Outcome</h3>
          <p>{data?.anaphylaxis_outcome || "Not Provided"}</p>
        </div>
        <div className="flex-column">
          <h3>Adverse event to be reported to the FDA</h3>
          <p>
            {data?.adverse_event_to_be_reported_to_FDA
              ? "Yes"
              : "No" || "Not Provided"}
          </p>
        </div>
      </div>
      <h3>Notification</h3>
      <div className="flex-row">
        <div className="flex-column">
          <h3>Name of physician notified</h3>
          <p>
            {data.name_of_physician_notified
              ? `${data.name_of_physician_notified?.last_name} ${data.name_of_physician_notified?.first_name} `
              : "Not Provided"}
          </p>
        </div>
        <div className="flex-column">
          <h3>Date/Time physcian notified</h3>
          <p>
            {data.date_physician_was_notified &&
              data.time_physician_was_notified ? (
              <span>
                <DateFormatter dateString={data.date_physician_was_notified} />
                , {formatTime(data?.time_physician_was_notified)}
              </span>
            ) : (
              "Not Provided"
            )}
          </p>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <h3>Name of family notified</h3>
          <p>
            {" "}
            {data.name_of_family_notified
              ? `${data.name_of_family_notified?.last_name} ${data.name_of_family_notified?.first_name} `
              : "Not Provided"}
          </p>
        </div>
        <div className="flex-column">
          <h3>Date/Time family notified</h3>
          <p>
            {data.date_family_was_notified &&
              data.time_family_was_notified ? (
              <span>
                <DateFormatter dateString={data.date_family_was_notified} />,{" "}
                {formatTime(data.time_family_was_notified)}
              </span>
            ) : (
              "Not Provided"
            )}
          </p>
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-column">
          <h3>Notified by</h3>
          <p>
            {" "}
            {data.notified_by
              ? `${data.notified_by?.first_name} ${data.notified_by?.last_name}`
              : "Not Provided"}
          </p>
        </div>
        <div className="flex-column">
          <h3>Brief summary of incident</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: data?.brief_summary_incident || "Not Provided",
            }}
          ></p>
        </div>
      </div>

      <div className="flex-row">
        <div className="flex-column">
          <h3>Immediate action taken</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: data?.immediate_actions_taken || "Not Provided",
            }}
          ></p>
        </div>
        <div className="flex-column">
          <h3>Severity rating</h3>
          <p
            dangerouslySetInnerHTML={{
              __html: data?.severity_rating || "Not Provided",
            }}
          ></p>
        </div>
      </div>
    </div>
  );
}

export default DrugReactionOtherInformation;
