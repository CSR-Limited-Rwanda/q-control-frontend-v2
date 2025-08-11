import NamesInitials from "@/components/NamesInitials";
import DateFormatter from "@/components/DateFormatter";

const IncidentDetails = ({
  data,
  fullName,
  sex,
  IncidentDate,
  incidentTime,
  incidentCategory,
  incidentDetails,
  hasSex = true,
  hasInitiated = false,
}) => {

  console.log(data)
  return (
    <div className="patient-name-type">
      <div className="date">
        Incident Date{" "}
        <DateFormatter
          dateString={
            data?.incident_date ||
            data?.date_of_injury_or_near_miss ||
            data?.date ||
            data?.date_reported ||
            data?.date_of_report ||
            data?.date_of_incident
          }
        />
      </div>
      {/* <div className="date">Incident Date <DateFormatter dateString={data.incident_date} />{data.incident_time}</div> */}
      <div className="name-profile">
        <div className="profile">
          <div className="profile-pic">
            <NamesInitials fullName={fullName || "Not provided"} />
          </div>
          <div className="name-sex">
            {hasInitiated ? <small>Form initiated by</small> : ""}

            <h3 className="name">{fullName || "Not provided"}</h3>

            {hasSex ? (
              <small className="sex">{sex || "Sex: Not provided"}</small>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="patient-type">
          <p>{incidentCategory || "Not provided"}</p>
        </div>
      </div>
      {incidentDetails}
    </div>
  );
};

export default IncidentDetails;
