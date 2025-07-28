'use client'
import "../../../../styles/_medication_details.scss"
import DateFormatter from "@/components/DateFormatter";

const StaffInvestigationInfo = ({ data, incidentStatuses }) => {
  console.log('data:',data);
  return data ? (
    <div className="incident-details">
      <h3>Employee details</h3>
      <div className="number-mrn">
        <div className="phone-number">
          <small>Name of injured staff</small>
          <h4>
            {data.name_of_injured_staff?.last_name || "Not provided"}{" "}
            {data.name_of_injured_staff?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="phone-number">
          <small>Sex</small>
          <h4>{data.name_of_injured_staff?.gender || "Not provided"}</h4>
        </div>
        <div className="phone-number">
          <small>Date of hire</small>
          <h4>
            <DateFormatter dateString={data.date_of_hire} />
          </h4>
        </div>
        <div className="phone-number">
          <small>Date of birth</small>
          <h4>
            <DateFormatter dateString={data.date_of_birth} />
          </h4>
        </div>
        <div className="phone-number">
          <small>Martial status</small>
          <h4>{data.marital_status || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="phone-number">
          <small>Address</small>
          <h4>{data.name_of_injured_staff?.address || "Not provided"}</h4>
        </div>
        <div className="phone-number">
          <small>City</small>
          <h4>{data.name_of_injured_staff?.city || "Not provided"}</h4>
        </div>
        <div className="phone-number">
          <small>State</small>
          <h4>{data.name_of_injured_staff?.state || "Not provided"}</h4>
        </div>
        <div className="phone-number">
          <small>Zip code</small>
          <h4>{data.name_of_injured_staff?.zip_code || "Not provided"}</h4>
        </div>
      </div>
      <br />
      <h3>General information</h3>
      <div className="number-mrn">
        <div className="field small-field">
          <label htmlFor="city">Part of the body That was injured</label>
          <h4>{data.part_of_body_injured || "Not provided"}</h4>
        </div>
        <div className="field small-field">
          <label htmlFor="city">Nature of the injury</label>
          <h4>{data.nature_of_injury || "Not provided"}</h4>
        </div>
      </div>
      <div className="number-mrn">
        <div className="field small-field">
          <label htmlFor="city">How the accident happened</label>
          <h4>{data.accident_details || "Not provided"}</h4>
        </div>
        <div className="field small-field">
          <label htmlFor="city">What staff were doing prior to the event</label>
          <h4>{data.employee_prior_activity || "Not provided"}</h4>
        </div>
      </div>
      <div className="number-mrn">
        <div className="field small-field">
          <label htmlFor="city">Equipment or tools that were being used</label>
          <h4>{data.equipment_or_tools || "Not provided"}</h4>
        </div>
      </div>
      <br />
      <h3>Other information</h3>
      <div className="number-mrn">
        <div className="phone-number">
          <small>Witness(es)</small>
          <h4>{data.witnesses || "Not provided"}</h4>
        </div>
        <div className="phone-number">
          <label htmlFor="city">Event location</label>
          <h4>{data.event_location || "Not provided"}</h4>
        </div>
      </div>
      <div className="number-mrn">
        <div className="field small-field">
          <label htmlFor="city">What caused the event:</label>
          <h4>{data.cause_of_event || "Not provided"}</h4>
        </div>
        <div className="field small-field">
          <label htmlFor="city">Date of event</label>
          <h4>
            <DateFormatter dateString={data.date_of_event} />
          </h4>
        </div>
        <div className="field small-field">
          <label htmlFor="city">Time of event</label>
          <h4>{data.time_of_event || "Not provided"}</h4>
        </div>
      </div>
      <div className="number-mrn">
        <div className="field small-field">
          <label htmlFor="city">
            Were safety regulations in place and used? If not, what was wrong?
          </label>
          <h4>{data.safety_regulations || "Not provided"}</h4>
        </div>
      </div>
      <div className="number-mrn">
        <div className="phone-number">
          <label htmlFor="city">Date Claims notified</label>
          <h4>
            <DateFormatter dateString={data.date_claim_notified} />{" "}
          </h4>
        </div>
        <div className="phone-number">
          <label htmlFor="city">Claim Number</label>
          <h4>{data.claim || "Not provided"}</h4>
        </div>
        <div className="phone-number">
          <label htmlFor="city">Went to see a doctor/hospital </label>
          <h4>{data.went_to_doctor_or_hospital ? "Yes" : "No"}</h4>
        </div>
      </div>
      <div className="number-mrn">
        <div className="phone-number">
          <label htmlFor="city">Doctor name</label>
          <h4>
            {data.doctor_info?.user?.last_name || "Not provided"}{" "}
            {data.doctor_info?.user?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="phone-number">
          <label htmlFor="city">Hospital Name </label>
          <h4>{data.hospital_name || "Not provided"}</h4>
        </div>
        <div className="field small-field">
          <label htmlFor="city">
            Recommended preventative action to take in the future to prevent
            re-occurrence.
          </label>
          <h4>{data.recommendations || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="phone-number">
          <label htmlFor="city">Created by</label>
          <h4>
            {data.created_by?.last_name || "Not provided"}{" "}
            {data.created_by?.first_name || "Not provided"}
          </h4>
        </div>

        <div className="field small-field">
          <label htmlFor="city">Employee report</label>
          <h4>{data.employee_report || "Not provided"}</h4>
        </div>
      </div>
    </div>
  ) : (
    "No Investigation has been added to this incident"
  );
};

export default StaffInvestigationInfo;
