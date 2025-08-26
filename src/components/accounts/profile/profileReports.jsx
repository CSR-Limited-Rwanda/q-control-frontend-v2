import DateFormatter from "@/components/DateFormatter";
import api from "@/utils/api";
import {
  ClipboardCheck,
  ClipboardPen,
  EllipsisVertical,
  Eye,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetPermissions } from "@/hooks/fetchPermissions";

const ProfileReports = () => {
  const { accountId } = useParams();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(null); // Track which incident's popup is open
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const actionRefs = useRef({}); // Store refs for action buttons
  const reportsPerPage = 5;
  const router = useRouter();
  const { permissions } = useGetPermissions();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await api.get(`users/${accountId}/incidents/`);
        setReports(response.data);

        setIsLoading(false);
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.message ||
              error.response.data.error ||
              "Error fetching reports data"
          );
        } else {
          setError("Unknown fetching reports data");
        }
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [accountId]);

  const navigateToModify = (incidentId, reportName) => {
    if (!reportName) {
      router.push(`/incidents/general/${incidentId}/modify/`);
      localStorage.setItem("generalIncidentId", incidentId);
      return;
    }

    switch (reportName) {
      case "General Patient Visitor":
        router.push(`/incidents/general/${incidentId}/modify/`);
        localStorage.setItem("generalIncidentId", incidentId);
        break;
      case "Adverse Drug Reaction":
        router.push(`/incidents/drug-reaction/${incidentId}/modify/`);
        localStorage.setItem("adverseDrugReactionId", incidentId);
        break;
      case "Lost and Found":
        router.push(`/incidents/lost-and-found/${incidentId}/modify/`);
        localStorage.setItem("lostAndFoundId", incidentId);
        break;
      case "Medication Error":
        router.push(`/incidents/medication-error/${incidentId}/modify/`);
        localStorage.setItem("medicationErrorIncidentId", incidentId);
        break;
      case "Staff Incident Report":
        router.push(`/incidents/staff/${incidentId}/modify/`);
        localStorage.setItem("staffIncidentId", incidentId);
        break;
      case "workplace violence":
        router.push(`/incidents/workplace-violence/${incidentId}/modify/`);
        localStorage.setItem("workplaceViolenceId", incidentId);
        break;
      case "Grievance":
        router.push(`/incidents/grievance/${incidentId}/modify/`);
        localStorage.setItem("grievanceId", incidentId);
        break;
      default:
        router.push(`/incidents/general/${incidentId}/modify/`);
        localStorage.setItem("generalIncidentId", incidentId);
        break;
    }
  };

  const navigateToUpdate = (incidentId, reportName) => {
    if (!reportName) {
      router.push(`/incidents/general/${incidentId}/update/`);
      localStorage.setItem("generalIncidentId", incidentId);
      return;
    }

    switch (reportName) {
      case "General Patient Visitor":
        router.push(`/incidents/general/${incidentId}/update/`);
        localStorage.setItem("generalIncidentId", incidentId);
        break;
      case "Adverse Drug Reaction":
        router.push(`/incidents/drug-reaction/${incidentId}/update/`);
        localStorage.setItem("adverseDrugReactionId", incidentId);
        break;
      case "Lost and Found":
        router.push(`/incidents/lost-and-found/${incidentId}/update/`);
        localStorage.setItem("lostAndFoundId", incidentId);
        break;
      case "Medication Error":
        router.push(`/incidents/medication-error/${incidentId}/update/`);
        localStorage.setItem("medicationErrorIncidentId", incidentId);
        break;
      case "Staff Incident Report":
        router.push(`/incidents/staff/${incidentId}/update/`);
        localStorage.setItem("staffIncidentId", incidentId);
        break;
      case "workplace violence":
        router.push(`/incidents/workplace-violence/${incidentId}/update/`);
        localStorage.setItem("workplaceViolenceId", incidentId);
        break;
      case "Grievance":
        router.push(`/incidents/grievance/${incidentId}/update/`);
        localStorage.setItem("grievanceId", incidentId);
        break;
      default:
        router.push(`/incidents/general/${incidentId}/update/`);
        localStorage.setItem("generalIncidentId", incidentId);
        break;
    }
  };
  const handleRowClick = (incidentId, reportName) => {
    if (!reportName) {
      router.push(`/incidents/general/${incidentId}/`);
      localStorage.setItem("generalIncidentId", incidentId);
      return;
    }

    switch (reportName) {
      case "General Patient Visitor":
        router.push(`/incidents/general/${incidentId}/`);
        localStorage.setItem("generalIncidentId", incidentId);
        break;
      case "Adverse Drug Reaction":
        router.push(`/incidents/drug-reaction/${incidentId}/`);
        localStorage.setItem("adverseDrugReactionId", incidentId);
        break;
      case "Lost and Found":
        router.push(`/incidents/lost-and-found/${incidentId}/`);
        localStorage.setItem("lostAndFoundId", incidentId);
        break;
      case "Medication Error":
        router.push(`/incidents/medication-error/${incidentId}/`);
        localStorage.setItem("medicationErrorIncidentId", incidentId);
        break;
      case "Staff Incident Report":
        router.push(`/incidents/staff/${incidentId}/`);
        localStorage.setItem("staffIncidentId", incidentId);
        break;
      case "workplace violence":
        router.push(`/incidents/workplace-violence/${incidentId}/`);
        localStorage.setItem("workplaceViolenceId", incidentId);
        break;
      case "Grievance":
        router.push(`/incidents/grievance/${incidentId}/`);
        localStorage.setItem("grievanceId", incidentId);
        break;
      default:
        router.push(`/incidents/general/${incidentId}/`);
        localStorage.setItem("generalIncidentId", incidentId);
        break;
    }
  };

  const getModelName = (reportName) => {
    switch (reportName) {
      case "General Patient Visitor":
        return "general_patient_visitor";
      case "Lost and Found":
        return "lost_and_found";
      case "Medication Error":
        return "medication_error";
      case "Grievance":
        return "patient_visitor_grievance";
      case "Staff Incident Report":
        return "staff_incident_reports";
      case "workplace violence":
        return "workplace_violence_reports";
      case "Adverse Drug Reaction":
        return "adverse_drug_reaction";
      default:
        return "general_patient_visitor";
    }
  };

  const handleActionClick = (index, event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 120;
    setPopupPosition({
      top: rect.top + window.scrollY,
      left: rect.left + window.scrollX - popupWidth - 10,
    });
    setShowPopup(showPopup === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showPopup !== null &&
        !actionRefs.current[showPopup]?.contains(event.target)
      ) {
        setShowPopup(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showPopup]);

  // Calculate the reports to display on the current page
  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = reports
    ? reports
        .flatMap((report) =>
          report.incidents.map((incident) => ({
            ...incident,
            reportName: report.name,
          }))
        )
        .slice(indexOfFirstReport, indexOfLastReport)
    : [];

  // Calculate total pages
  const totalReports = reports
    ? reports.flatMap((report) => report.incidents).length
    : 0;
  const totalPages = Math.ceil(totalReports / reportsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setShowPopup(null); // Close any open popup when changing pages
  };

  // Handle Previous/Next buttons
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setShowPopup(null);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setShowPopup(null);
    }
  };

  return isLoading ? (
    <div>loading...</div>
  ) : (
    <div className="reports">
      {error && <div className="error-message">{error}</div>}
      {reports && reports.length > 0 ? (
        <>
          {currentReports.map((incident, index) => (
            <div
              key={index}
              className={`user-report ${
                incident.status === "Draft" ? "draft" : ""
              }`}
            >
              <div className="row">
                {incident.status === "Draft" ? (
                  <div className="icon-container icon-pen">
                    <ClipboardPen className="icon" />
                  </div>
                ) : (
                  <div className="icon-container icon-check">
                    <ClipboardCheck className="icon" />
                  </div>
                )}

                <div className="col">
                  <span className="title">Incident type</span>
                  <span>{incident?.reportName || "Not provided"}</span>
                </div>
              </div>

              <div className="col">
                <span className="title">Added date</span>
                <span>
                  {<DateFormatter dateString={incident?.created_at} />}
                </span>
              </div>
              <div className="col">
                <span className="title">Follow up</span>
                <span
                  className={`follow-up ${
                    incident?.status === "Draft"
                      ? "in-progress"
                      : incident?.status === "Closed"
                      ? "closed"
                      : "Open"
                  }`}
                >
                  {incident?.status}
                </span>
              </div>
              <div
                className="profile-report-action"
                ref={(el) => (actionRefs.current[index] = el)}
                onClick={(e) => handleActionClick(index, e)}
                style={{ cursor: "pointer" }}
              >
                <EllipsisVertical />
                {showPopup === index && (
                  <div
                    className="popup"
                    style={{
                      position: "absolute",
                      top: `16px`,
                      left: `-85px`,
                      background: "white",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      zIndex: 1000,
                      minWidth: "100px",
                    }}
                  >
                    <div
                      href="/details"
                      className="link"
                      onClick={() => {
                        setShowPopup(null);
                        handleRowClick(incident.id, incident.reportName);
                      }}
                    >
                      <Eye className="icon" />
                      <span>Details</span>
                    </div>

                    {permissions &&
                    permissions[getModelName(incident.reportName)]?.includes(
                      "change_incident"
                    ) ? (
                      <div
                        href={`/incidents/general/${incident.id}/modify/`}
                        className="link"
                        onClick={() => {
                          setShowPopup(null);
                          navigateToModify(incident.id, incident.reportName);
                        }}
                      >
                        <Pencil className="icon" />
                        <span>Modify</span>
                      </div>
                    ) : (
                      <div
                        href={`/incidents/general/${incident.id}/modify/`}
                        className="link"
                        onClick={() => {
                          setShowPopup(null);
                          navigateToUpdate(incident.id, incident.reportName);
                        }}
                      >
                        <Pencil className="icon" />
                        <span>Update</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination Controls */}
          <div
            className="pagination"
            style={{
              marginTop: "20px",
              display: "flex",
              gap: "5px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {currentPage > 1 && (
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  padding: "8px 12px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  background: currentPage === 1 ? "#EBF5FF" : "#145C9E",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Prev
              </button>
            )}

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background: currentPage === index + 1 ? "#145C9E" : "#fff",
                  color: currentPage === index + 1 ? "white" : "black",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                {index + 1}
              </button>
            ))}

            {currentPage !== totalPages && (
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: "8px 12px",
                  cursor:
                    currentPage === totalPages ? "not-allowed" : "pointer",
                  background:
                    currentPage === totalPages ? "#EBF5FF" : "#145C9E",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <p>No reports found</p>
      )}
    </div>
  );
};

export default ProfileReports;
