'use client'
import React, { useEffect, useState } from "react";
import api, {API_URL} from "@/utils/api";
import DateFormatter from "@/components/DateFormatter";
const MedicationDocumentHistory = ({ incidentId }) => {
  const [documentHistory, setDocumentHistory] = useState([]);
  const [gettingDocumentHistory, setGettingDocumentHistory] = useState(true);

  useEffect(() => {
    const getDocumentHistory = async () => {
      try {
        const response = await api.get(
          `${API_URL}/activities/list/${incidentId}/`
        );
        if (response.status === 200) {
          setDocumentHistory(response.data);
          console.log(response.data);
          localStorage.setItem("documentHistoryCount", response.data.length);
          setGettingDocumentHistory(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          window.customToast.error("Authentication error");
        } else {
          window.customToast.error("Failed to fetch document History");
          console.error(error);
        }
        setGettingDocumentHistory(false);
      }
    };
    getDocumentHistory();
  }, []);
  return gettingDocumentHistory ? (
    <p>...getting document history</p>
  ) : documentHistory && documentHistory.length > 0 ? (
    <div className="document-history-container">
      {documentHistory.map((el, index) => (
        <div key={index} className="document-history">
          <div className="document-row">
            <div className="small-circle"></div>
            <div className="document-col">
              <p>
                {el.user.email ? el.user.email : "Anonymous "} &nbsp;
                {el.description}
              </p>
              <p>
                <span>
                  On <DateFormatter dateString={el.timestamp} />
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>No document history</p>
  );
};

export default MedicationDocumentHistory;
