"use client";
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
}) => {
  const [activeTab, setActiveTab] = useState("incidentType");
  const [incidentDocumentCount, setIncidentDocumentCount] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [incidentDocumentHistoryCount, setIncidentDocumentHistoryCount] =
    useState(0);

  const toggleActiveTab = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentDocumentCount =
        localStorage.getItem("incidentDocumentCount") || "0";
      const currentReviewsCount =
        localStorage.getItem("incidentReviewsCount") || "0";
      const currentDocumentHistoryCount =
        localStorage.getItem("documentHistoryCount") || "0";

      const parsedDocumentCount = parseInt(currentDocumentCount, 10);
      const parsedReviewsCount = parseInt(currentReviewsCount, 10);
      const parsedDocumentHistoryCount = parseInt(
        currentDocumentHistoryCount,
        10
      );

      setIncidentDocumentCount(
        isNaN(parsedDocumentCount) ? 0 : parsedDocumentCount
      );
      setReviewsCount(isNaN(parsedReviewsCount) ? 0 : parsedReviewsCount);
      setIncidentDocumentHistoryCount(
        isNaN(parsedDocumentHistoryCount) ? 0 : parsedDocumentHistoryCount
      );
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []); // Empty dependency array to run only once (on mount)

  return (
    <div className="incident-type-tabs">
      <div className="tabs">
        <div
          onClick={() => toggleActiveTab("incidentType")}
          className={`tab incident-type ${
            activeTab === "incidentType" ? "active" : ""
          }`}
        >
          <p>General Info</p>
        </div>
        <div
          onClick={() => toggleActiveTab("otherInfo")}
          className={`tab general-info ${
            activeTab === "otherInfo" ? "active" : ""
          }`}
        >
          <p>Other info</p>
        </div>
        <div
          onClick={() => toggleActiveTab("reviews")}
          className={`tab reviews ${activeTab === "reviews" ? "active" : ""}`}
        >
          <p>Comments</p>
          <div className="counter">{reviewsCount}</div>
        </div>
        <div
          onClick={() => toggleActiveTab("document-history")}
          className={`tab document-history ${
            activeTab === "document-history" ? "active" : ""
          }`}
        >
          <p>Document History</p>
          <div className="counter">{incidentDocumentHistoryCount}</div>
        </div>
        <div
          onClick={() => toggleActiveTab("documents")}
          className={`tab documents ${
            activeTab === "documents" ? "active" : ""
          }`}
        >
          <p>Documents</p>
          <div className="counter">{incidentDocumentCount}</div>
        </div>
        {showInvestigationTab && (
          <div
            onClick={() => toggleActiveTab("investigation")}
            className={`tab investigation ${
              activeTab === "investigation" ? "active" : ""
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
