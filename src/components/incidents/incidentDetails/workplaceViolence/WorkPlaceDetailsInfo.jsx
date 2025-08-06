import NamesInitials from "@/components/NamesInitials";
import DateFormatter from "@/components/DateFormatter";

const WorkDetailsInfo = ({
  fullName,
  sex,
  IncidentDate,
  incidentCategory,
  incidentTime,
  incidentDetails,
  data,
}) => {
  console.log("Workplace details: ", data);
  return (
    <div className="patient-name-type">
      <div className="date">
        Incident Date & Time <DateFormatter dateString={IncidentDate} />
      </div>
      <div className="name-profile">
        <div className="profile">
          <div className="profile-pic">
            <NamesInitials fullName={fullName || "Not provided"} />
          </div>
          <div className="name-sex">
            <h3 className="name">{fullName || "Not provided"}</h3>
            {/*                         <small className="sex">{sex || 'Sex: Not provided'}</small> */}
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

export default WorkDetailsInfo;
