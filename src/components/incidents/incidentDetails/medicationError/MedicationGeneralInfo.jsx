
import "../../../../styles/_medication_details.scss"
import DateFormatter from "@/components/DateFormatter";
const MedicationGeneralInfo = ({ data, incidentStatuses }) => {
  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="phone-number">
          <small>Drug ordered</small>
          <h4>{data.incident?.drug_ordered || "Not provided"}</h4>
        </div>
        <div className="mrn">
          <small>Route</small>
          <h4>{data.incident?.drug_ordered_route || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="phone-number">
          <small>Drug Given</small>
          <h4>{data.incident?.drug_given || "Not provided"}</h4>
        </div>
        <div className="mrn">
          <small>Route</small>
          <h4>{data.incident?.drug_given_route || "Not provided"}</h4>
        </div>
        {/* <div className="mrn">
          <small>Dose</small>
          <h4>
            {data.dose || "Not provided"}
          </h4>
        </div> */}
      </div>
      <div className="number-mrn">
        <div className="phone-number">
          <small>Date of report</small>
          <h4>
            <DateFormatter dateString={data.incident?.date_of_report} />{" "}
          </h4>
        </div>
        <div className="mrn">
          <small>Time of report</small>
          <h4>{data.incident?.time_of_report || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>What Happened?</small>
          <h4>{data.incident?.what_happened || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Form of error</small>
          <h4>{data.incident?.form_of_error || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Description of error</small>
          <h4>{data.incident?.description_of_error || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Contributing factors</small>
          <h4>{data.incident?.contributing_factors || "Not provided"}</h4>
        </div>
      </div>
    </div>
  );
};

export default MedicationGeneralInfo;
