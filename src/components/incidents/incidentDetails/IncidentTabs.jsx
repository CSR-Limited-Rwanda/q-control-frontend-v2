'use client'
import React, { useEffect, useState } from "react";


const IncidentTabs = ({
  data,
  statuses,
  generalInformation,
  otherInformation,
  reviews,
  documentHistory,
  documents,
  investigation,
  showInvestigationTab,
  reviewsCount,
}) => {
  const [activeTab, setActiveTab] = useState("incidentType");
  const [incidentReviewsCount, setIncidentReviewsCount] = useState(0);
  const [incidentDocumentHistoryCount, setIncidentDocumentHistoryCount] =
    useState(0);
  const [incidentDocumentCount, setIncidentDocumentCount] = useState(0);

  const toggleActiveTab = (tab) => {
    setActiveTab(tab)
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentCount = localStorage.getItem("incidentReviewsCount") || "0";
      setIncidentReviewsCount(parseInt(currentCount, 10));
    }, 1000); // Adjust the interval as needed

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentCount = localStorage.getItem("incidentDocumentCount") || "0";
      const parsedCount = parseInt(currentCount, 10);
      setIncidentDocumentCount(isNaN(parsedCount) ? 0 : parsedCount);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);// Empty dependency array to run only once (on mount)

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentCount = localStorage.getItem("documentHistoryCount") || "0";
      setIncidentDocumentHistoryCount(parseInt(currentCount, 10));
    }, 1000); // Adjust the interval as needed

    if (localStorage.getItem("activate_investigation_tab")) {
      setActiveTab("investigation");
      localStorage.removeItem("activate_investigation_tab");
    }

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array to run only once (on mount)

  return (
    <div className="incident-type-tabs">
      <div className="tabs">
        <div
          onClick={() => toggleActiveTab("incidentType")}
          className={`tab incident-type ${activeTab === "incidentType" ? "active" : ""
            }`}
        >
          <p>General Info</p>
        </div>
        <div
          onClick={() => toggleActiveTab("otherInfo")}
          className={`tab general-info ${activeTab === "otherInfo" ? "active" : ""
            }`}
        >
          <p>Other info</p>
        </div>
        <div
          onClick={() => toggleActiveTab("reviews")}
          className={`tab reviews ${activeTab === "reviews" ? "active" : ""}`}
        >
          <p>Reviews</p>
          <div className="counter">{reviewsCount}</div>
        </div>
        <div
          onClick={() => toggleActiveTab("document-history")}
          className={`tab document-history ${activeTab === "document-history" ? "active" : ""
            }`}
        >
          <p>Document History</p>
          <div className="counter">{incidentDocumentHistoryCount}</div>
        </div>
        <div
          onClick={() => toggleActiveTab("documents")}
          className={`tab documents ${activeTab === "documents" ? "active" : ""
            }`}
        >
          <p>Documents</p>
          <div className="counter">{incidentDocumentCount}</div>
        </div>
        {showInvestigationTab && (
          <div
            onClick={() => toggleActiveTab("investigation")}
            className={`tab investigation ${activeTab === "investigation" ? "active" : ""
              }`}
          >
            <p>Investigation</p>
          </div>
        )}
      </div>

      <div className="tabs-content">
        {activeTab === "incidentType" ? (
          <>{generalInformation}</>
        ) : activeTab === "otherInfo" ? (
          <>{otherInformation}</>
        ) : activeTab === "reviews" ? (
          <>{reviews}</>
        ) : activeTab === "document-history" ? (
          <>{documentHistory}</>
        ) : activeTab === "documents" ? (
          <>{documents}</>
        ) : activeTab === "investigation" ? (
          <>{investigation}</>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default IncidentTabs;