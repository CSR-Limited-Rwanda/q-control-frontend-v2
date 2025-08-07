import React from "react";
import DateFormatter from "@/components/DateFormatter";

const StaffOtherInformation = ({ data, incidentStatuses }) => {

  return (
    <div className="incident-type-data">
      <div className="general-col">
        <div className="flex-row">
          <div className="general-sub-col">
            <h3>Doctor he/she has seen</h3>
            <small>
              {data.doctor_consulted_info?.last_name || "Not provided"}{" "}
              {data.doctor_consulted_info?.first_name || "Not provided"}
            </small>
          </div>
          <div className="general-sub-col">
            <h3>Doctor’s phone number:</h3>
            <small>
              {data.doctor_consulted_info?.phone_number || "Number"}
            </small>
          </div>
          <div className="general-sub-col">
            <h3>Supervisor:</h3>
            {/* <small>{data.supervisor || "Number"}</small> */}
          </div>
        </div>

        <div className="flex-row">
          <div className="general-sub-col">
            <h3>Time</h3>
            <small>{data.doctor_consulted_time || "Not provided"}</small>
          </div>
          <div className="general-sub-col">
            <h3>Date</h3>
            <small>
              <DateFormatter dateString={data.doctor_consulted_dated} />{" "}
            </small>
          </div>
        </div>

        <div className="flex-row">
          <div className="general-sub-col">
            <h3>Previous injury</h3>
            <small>{data.previous_injury ? "Yes" : "No"}</small>
          </div>
          <div className="general-sub-col">
            <h3>Date of previous injury</h3>
            <small>
              <DateFormatter dateString={data.previous_injury_date} />{" "}
            </small>
          </div>
          <div className="general-sub-col">
            <h3>Report Open</h3>
            <small>{data.report_completed ? "Yes" : "No"}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffOtherInformation;
