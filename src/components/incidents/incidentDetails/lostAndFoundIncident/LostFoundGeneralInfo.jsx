import "../../../../styles/incidents/_lostandfounddetails.scss"
const LostFoundGeneralInfo = ({ data, incidentStatuses }) => {
  return (
    <div className="incident-details">
      <div className="location-contribution-diagnosis">
        <div className="location">
          <h3>
            Full description of the missing, lost, or misplaced property
            (including money):
          </h3>
          {/* <small>{incidentData.item_description || "Not provided"}</small> */}
          <small>{data.item_description || "Not provided"}</small>
        </div>
      </div>
      <div className="location-contribution-diagnosis">
        <div className="location">
          <h3>
            Actions taken to locate the missing, lost, or misplaced property:
          </h3>
          {/* <small>{incidentData.action_taken || "Not provided"}</small> */}
          <small>{data.action_taken || "Not provided"}</small>
        </div>
      </div>
      <div className="location-contribution-diagnosis">
        <div className="location">
          <h3>Disposal of Unclaimed Property</h3>
          {/* <small >{incidentData.disposal_of_unclaimed_property || "Not provided"}</small> */}
          <small>{data.incident?.disposal_of_unclaimed_property || "Not provided"}</small>
        </div>
      </div>
    </div>
  );
};

export default LostFoundGeneralInfo;
