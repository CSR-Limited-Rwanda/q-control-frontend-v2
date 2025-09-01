"use client";
import "@/styles/_incidentActivities.scss";
import { fetchActivities } from "@/hooks/fetchActivities";
import { Download, DownloadIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const IncidentActivitiesTab = ({ incidentId, incidentType, setCount }) => {
  // incident activities component
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleFetchActivities = async () => {
    setIsLoading(true);
    const response = await fetchActivities(incidentId, incidentType);
    if (!response.success) {
      setError(response.message);
      setIsLoading(false);
      return;
    }
    console.log(response.data);
    setActivities(response.data || []);
    setIsLoading(false);
  };

  const handleActivityLink = (activity) => {
    // based on the activity type, navigate to the appropriate page
    if (
      activity.activity_type === "incident_sent" &&
      activity.activity_highlight?.id
    ) {
      return `/departments/${activity.activity_highlight.id}`;
    } else if (
      activity.activity_type === "incident_closed" ||
      activity.activity_type === "document_uploaded"
    ) {
      return `/incidents/${incidentId}`;
    } else {
      return "#";
    }
  };
  // update the count of activities
  useEffect(() => {
    if (setCount) {
      setCount(activities.length);
    }
  }, [activities, setCount]);
  useEffect(() => {
    handleFetchActivities();
  }, [incidentId, incidentType]);
  return (
    <div className="incident-activities">
      {isLoading ? (
        <div className="loading">Loading...</div>
      ) : error ? (
        <div className="message error">{error}</div>
      ) : activities.length > 0 ? (
        <div className="activities-list">
          {activities.map((activity) => (
            <div key={activity.id} className="activity-item">
              <div className="dot"></div>
              <div className="activity-content">
                <div className="activity-message">
                  <p>{activity.activity_message}</p>
                  {activity.activity_highlight?.name && (
                    <Link href={handleActivityLink(activity)}>
                      {activity.activity_highlight.name}
                    </Link>
                  )}
                </div>

                <div className="user-destination">
                  {activity.activity_date && (
                    <small className="date">
                      At:
                      {new Date(activity.activity_date).toLocaleString()}
                    </small>
                  )}
                  {activity.created_by && (
                    <div className="user">
                      <small>By:</small>
                      <span>
                        {activity.created_by.first_name}{" "}
                        {activity.created_by.last_name}
                      </span>
                    </div>
                  )}
                  {activity.destination && (
                    <div className="destination">
                      <small> Sent to:</small>
                      <span>{activity.destination.name}</span>
                    </div>
                  )}
                </div>

                {activity.files && activity.files.length > 0 && (
                  <div className="files">
                    <h4>Files:</h4>
                    <div className="files-list">
                      {activity.files.map((file, index) => (
                        <div key={index} className="document file">
                          <img
                            src={`/images/files/types/${file.file_type.slice(
                              1
                            )}.svg`}
                            alt=""
                          />
                          <span>{file.name}</span>
                          <Link href={file.url} target="_blank">
                            <div className="download-icon">
                              <DownloadIcon />
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="message no-activities">No activities found.</div>
      )}
    </div>
  );
};

export default IncidentActivitiesTab;
