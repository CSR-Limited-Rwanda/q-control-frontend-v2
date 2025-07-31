import '../../../../styles/incidents/_grievance.scss'

const GeneralIncidentGeneralInformation = ({ data, incidentStatuses }) => {

  return (
    <div className="incident-type-data">
      {data.incident?.incident_type === "Fall related" ? (
        <div className="fall-incident_type">
          <h3>Fall related incident</h3>
          <div className="data">
            <div className="fall-type">
              <small>Fall type</small>
              <h4>{data.incident?.fall_related_type || "Not provided"}</h4>
            </div>

            <div className="score">
              <small>Morse fall score</small>
              <h4>{data.incident?.morse_fall_score || "Not provided"} Points</h4>
            </div>
          </div>

          <h3>Status prior to incident</h3>
          <div className="status-prior-to-incident">
            {data.incident?.patient_status_prior}
          </div>
        </div>
      ) : data.incident?.incident_type === "Equipment malfunction" ? (
        <div className="equipment-type-incident">
          <h3>Equipment related incident</h3>
          <div className="equipment-incident-data">
            <div className="equipment-incident">
              <small>Removed from services ?</small>
              <h4>{data.incident?.removed_from_service || "Not provided"}</h4>
            </div>
            <div className="equipment-type">
              <small>Equipment type</small>
              <h4>{data.incident?.equipment_type || "Not provided"}</h4>
            </div>
            <div className="manufacturer">
              <small>Manufacturer</small>
              <h4>{data.incident?.equipment_manufacturer || "Not provided"}</h4>
            </div>
            <div className="serial-number">
              <small>Serial number</small>
              <h4>{data.incident?.equipment_serial_number || "Not provided"}</h4>
            </div>
            <div className="model">
              <small>Model</small>
              <h4>{data.incident?.equipment_model || "Not provided"}</h4>
            </div>
            <div className="lot-number">
              <small>Lot/Control number</small>
              <h4>{data.incident.equipment_lot_number || "Not provided"}</h4>
            </div>
          </div>
        </div>
      ) : data.incident?.incident_type === "Treatment related" ? (
        <div className="treatment-type-incident">
          <h3>Treatment related incident</h3>
          <div className="treatment-incident-data">
            <div className="treatment-type">
              <h4>{data.incident?.treatment_type || "Not provided"}</h4>
            </div>
          </div>
        </div>
      ) : data.incident?.incident_type === "Others" ? (
        <div className="other-type-incident">
          <h3>Other related incident</h3>
          <div className="other-incident-data">
            <div className="other-type">
              <h4>{data.incident?.other_related_type || "Not provided"}</h4>
            </div>
          </div>
        </div>
      ) : (
        "Not General information. This may be because incident type is not specified"
      )}
    </div>
  );
};

export default GeneralIncidentGeneralInformation;
