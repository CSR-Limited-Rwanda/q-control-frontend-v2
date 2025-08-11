import DateFormatter from "@/components/DateFormatter";

const GeneralIncidentOtherInformation = ({ data }) => {
  return (
    <div className="incident-general-info">
      <div className="notification">
        <h3>Notification</h3>
        <div className="physician-notified">
          <div className="name">
            <small>Name of physician notified</small>
            <h4>
              {data?.physician_notified
                ? `${data.physician_notified?.last_name} ${data.physician_notified?.first_name}`
                : "Not provided"}
            </h4>
          </div>
          <div className="date">
            <small>Date/Time physician notified</small>
            {data.date_physician_notified && data.time_physician_notified ? (
              <h4>
                <DateFormatter dateString={data.date_physician_notified} />,{" "}
                {data.time_physician_notified}{" "}
              </h4>
            ) : (
              <h4>Not provided</h4>
            )}
          </div>
        </div>
        <div className="family-notified">
          <div className="name">
            <small>Name of family member notified</small>
            <h4>
              {data.family_notified
                ? `${data.family_notified?.last_name} ${data.family_notified?.first_name}`
                : "Not provided"}
            </h4>
          </div>
          <div className="date">
            <small>Date/Time family notified</small>
            {data.date_family_notified && data.time_family_notified ? (
              <h4>
                <DateFormatter dateString={data.date_family_notified} />,{" "}
                {data.time_family_notified}{" "}
              </h4>
            ) : (
              <h4>Not provided</h4>
            )}
          </div>
        </div>
      </div>
      <div className="severity-rating">
        <h3>Severity rating</h3>
        <p>{data.incident?.severity_rating || "Not provided"}</p>
      </div>
      <div className="brief-description">
        <h3>Brief summary of incident</h3>
        <p>{data.brief_summary_of_incident}</p>
      </div>
    </div>
  );
};

export default GeneralIncidentOtherInformation;
