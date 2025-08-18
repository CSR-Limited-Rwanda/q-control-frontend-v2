import React from "react";
import DateFormatter from "@/components/DateFormatter";


const WorkplaceOtherInfo = ({ data, incidentStatuses }) => {
  return (
    <div className="incident-details">
      <div className="number-mrn">
        <div className="location">
          <small>Notification</small>
          <h4>{data?.notification || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Immediate supervisor</small>
          <h4>{data?.immediate_supervisor ? "Yes" : "No"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Name of supervisor</small>
          <h4>
            {data?.name_of_supervisor?.last_name || "Not provided"}{" "}
            {data?.name_of_supervisor?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="location">
          <small>Title of supervisor</small>
          <h4>{data?.name_of_supervisor?.title_of_supervisor || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Date notified</small>
          <h4>
            <DateFormatter dateString={data?.date_notified} />
          </h4>
        </div>
        <div className="location">
          <small>Time notified</small>
          <h4>{data?.time_notified || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Action taken</small>
          <h4>{data?.action_taken || "Not provided"}</h4>
        </div>
        <div className="location">
          <small>Prevention suggestion</small>
          <h4>{data?.prevention_suggestion || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Reported by</small>
          <h4>
            {data.reported_by?.last_name || "Not provided"}{" "}
            {data.reported_by?.first_name || "Not provided"}
          </h4>
        </div>
        <div className="location">
          <small>Title reported by</small>
          <h4>{data?.reported_by_title || "Not provided"}</h4>
        </div>
      </div>

      <div className="number-mrn">
        <div className="location">
          <small>Date reported</small>
          <h4>
            <DateFormatter dateString={data?.date_reported} />
          </h4>
        </div>
        <div className="location">
          <small>Time reported</small>
          <h4>{data?.time_reported || "Not provided"}</h4>
        </div>
      </div>
    </div>
  );
};

export default WorkplaceOtherInfo;
