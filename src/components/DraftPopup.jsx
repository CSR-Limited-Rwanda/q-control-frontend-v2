"use client";
import { X, Eye, Info } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/utils/api";

const DraftPopup = ({ incidentType, incidentString }) => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    const fetchDrafts = async () => {
      // API call to fetch drafts data
      try {
        const response = await api.get(`incidents/overview/draft/user/`);
        if (response.status === 200) {
          setIncident(response.data[incidentType]);

          setPopupOpen(response.data[incidentType].length > 0 ? true : false);
        }
      } catch (error) {
        window.customToast.error(error.message);
        console.error(error);
      }
    };

    fetchDrafts();
  }, []);

  const toggleDraftPopup = () => {
    setPopupOpen(!popupOpen);
  };

  return (
    incident?.length > 0 &&
    popupOpen && (
      <div className="warning-message">
        <div className="row">
          <div className="icon-container">
            <Info className="orange-color" />
          </div>
          <div className="col">
            <h4>You have uncleared drafts</h4>

            <p>
              Your last draft incidents were not submitted. Click the{" "}
              <span className="orange-color">"View drafts"</span> to view or{" "}
              <span className="orange-color">"Clear drafts"</span> to clear
              them.
            </p>
          </div>
        </div>
        <div className="actions-buttons">
          <Link
            href="/users/profile/"
            onClick={() => {
              localStorage.setItem("setDraftActive", "drafts");
            }}
            className="action-button"
          >
            <span>
              <Eye className="icon" />
            </span>
            <span>View drafts</span>
          </Link>
        </div>
        <X className="cancel-icon" onClick={toggleDraftPopup} />
      </div>
    )
  );
};

export default DraftPopup;
