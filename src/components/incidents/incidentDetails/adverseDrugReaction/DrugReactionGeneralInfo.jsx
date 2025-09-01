import DateFormatter from "@/components/DateFormatter";
import "../../../../styles/_drugReactionPage.scss";

function DrugReactionGeneraInfo({ data }) {
  return (
    <div className="flex-column">
      <h2>Drug Reaction</h2>
      <div className="flex-row">
        <div className="flex-column">
          <h3>Suspected medication</h3>
          <small>{data?.suspected_medication || "Not Provided"}</small>
        </div>
        <div className="flex-column">
          <h3>Dose</h3>
          <small>{data?.dose || "Not Provided"}</small>
        </div>
        <div className="flex-column">
          <h3>Route</h3>
          <small>{data?.route || "Not Provided"}</small>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <h3>Frequency</h3>
          <small>{data?.frequency || "Not Provided"}</small>
        </div>
        <div className="flex-column">
          <h3>Rate of administration(if IV)</h3>
          <small>{data?.rate_of_administration || "Not Provided"}</small>
        </div>
        <div className="flex-column">
          <h3>Date of medication order</h3>
          <small>
            {<DateFormatter dateString={data?.date_of_medication_order} /> ||
              "Not Provided"}
          </small>
        </div>
        <div className="flex-column">
          <h3>Description of other route</h3>
          <small>{data?.other_route_description || "Not Provided"}</small>
        </div>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <h3>Information on this reaction can be found on</h3>
          <small>
            {<DateFormatter dateString={data?.date_of_information} /> ||
              "Not Provided"}
          </small>
        </div>
        <div className="flex-column">
          <h3>Information on this reaction can be found in</h3>
          <small>
            {data?.progress_note
              ? "Progress Note"
              : data?.nurse_note
              ? "Nurse Note"
              : data?.other_information_can_be_found_in
              ? data?.other_information_description
              : "Not Provided"}
          </small>
        </div>
      </div>
      <div className="flex-column">
        <h3>Reaction</h3>
        <small>{data?.information_reaction || "Not Provided"}</small>
      </div>
      <div className="flex-row">
        <div className="flex-column">
          <h3>Date of adverse reaction</h3>
          <small>
            {<DateFormatter dateString={data?.date_of_adverse_reaction} /> ||
              "Not Provided"}
          </small>
        </div>
        <div className="flex-column">
          <h3>Reaction on-set time</h3>
          <small>{data?.reaction_on_settime || "Not Provided"}</small>
        </div>
        <div className="flex-column">
          <h3>Was the reaction treated?</h3>
          <small>
            {data?.reaction_was_treated ? "Yes" : "No" || "Not Provided"}
          </small>
        </div>
      </div>
      <div className="flex-column">
        <h3>Treatment description</h3>
        <small
          dangerouslySetInnerHTML={{
            __html: data?.treatment_description || "Not Provided",
          }}
        ></small>
      </div>
    </div>
  );
}

export default DrugReactionGeneraInfo;
