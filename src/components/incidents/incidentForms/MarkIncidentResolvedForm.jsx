'use client'
import React, { useState } from "react";
import { Check, LoaderCircle, X } from 'lucide-react';
import api, { API_URL } from "@/utils/api";
import postDocumentHistory from "../documentHistory/postDocumentHistory";

function MarkResolvedForm({ incidentId, apiLink, isResolved }) {

  const [isLoading, setIsLoading] = useState(false);
  const [resolved, setResolved] = useState(false);

  const markResolved = async () => {
    setIsLoading(true);
    try {
      const response = await api.put(
        `/incidents/${apiLink}/${incidentId}/resolve/`
      );
      if (response.status === 200) {

        setResolved(true);
        setIsLoading(false);
        postDocumentHistory(incidentId, "resolved this incident", "resolve");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response.status === 403) {
        window.customToast.error(error.response.data.message);
      } else if (error.response.status === 400) {
        window.customToast.error(error.response.data.message);
      } else {
        window.customToast.error("Unknown error while resolving incident");
      }

    }
  };
  const closeForm = () => {
    window.location.reload();
  };
  return (
    <div className="popup">
      <div className="popup-content mark-resolved">
        {resolved ? <h1>Closed</h1> : <h3>Mark As Close</h3>}

        {resolved ? (
          <p>
            This incident is closed. If you want to undo the action, please
            contact your manager
          </p>
        ) : (
          <p>Are you sure you want to mark this incident as closed?</p>
        )}
        <div className="buttons">
          {resolved ? (
            ""
          ) : (
            <button
              onClick={closeForm}
              type="button"
              className="outline-button"
            >
              Cancel
            </button>
          )}
          {resolved ? (
            <button
              onClick={closeForm}
              type="button"
              className="secondary-color"
            >
              <X size={20} />
              <span>Close</span>
            </button>
          ) : (
            <button
              onClick={() => {
                // Close logic here
                markResolved();
              }}
              type="button"
              className="primary-button"
            >
              {isLoading ? (
                <>
                  <LoaderCircle size={16} className="loading-icon" />
                  <span>Saving</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Close</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarkResolvedForm;
