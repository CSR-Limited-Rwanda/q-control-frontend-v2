"use client";
import DateFormatter from "@/components/DateFormatter";
import api from "@/utils/api";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ClipboardPen,
  EllipsisVertical,
  FileText,
  NotebookPen,
  Pencil,
  Printer,
  SendHorizontal,
  Trash,
  X,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import "@/styles/_userComplaints.scss";
import EditComplaintForm from "@/components/forms/EditComplaintForm";
import SubmitComplaintForm from "@/components/forms/SubmitComplaintForm";
import SendComplaintToDepartment from "@/components/forms/SendComplaintToDepartment";
import { useParams } from "next/navigation";
import CloseIcon from "@/components/CloseIcon";
import PermissionsGuard from "@/components/PermissionsGuard";
import { useGetPermissions } from "@/hooks/fetchPermissions";

const UserComplaints = () => {
  const { permissions } = useGetPermissions();
  const { accountId } = useParams();
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitComplaint, setShowSubmitComplaint] = useState(false);
  const [showComplaintDetails, setShowComplainDetails] = useState(false);
  const [showSendToDepartmentForm, setShowSendToDepartmentForm] =
    useState(false);
  const [selectedComplain, setSelectedComplain] = useState({});
  const [showPopup, setShowPopup] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const actionRefs = useRef({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const complaintsPerPage = 5;

  const handleShowComplainDetails = (complaint) => {
    setSelectedComplain(complaint);
    setShowComplainDetails(!showComplaintDetails);
    setShowPopup(null);
  };

  const handleSubmitComplaint = () => {
    setShowSubmitComplaint(!showSubmitComplaint);
  };

  const handleShowEditForm = () => {
    setShowEditForm(!showEditForm);
  };

  const handleShowSendToDepartmentForm = () => {
    setShowSendToDepartmentForm(!showSendToDepartmentForm);
  };

  const handleShowPopup = (index, event) => {
    setShowPopup(showPopup === index ? null : index);
  };

  const handleDeleteComplaint = async (complaintId) => {
    try {
      setIsDeleting(true);
      await api.delete(`/complaints/${complaintId}/`);
      setIsDeleting(false);
      const updatedComplaints = complaints.filter(
        (complaint) => complaint.id !== complaintId
      );
      setComplaints(updatedComplaints);
      setShowDeleteConfirm(null);
      setShowPopup(null);

      const totalComplaintsAfterDelete = updatedComplaints.length;
      const totalPagesAfterDelete = Math.ceil(
        totalComplaintsAfterDelete / complaintsPerPage
      );
      if (currentPage > totalPagesAfterDelete && totalPagesAfterDelete > 0) {
        setCurrentPage(totalPagesAfterDelete);
      }
    } catch (error) {
      setIsDeleting(false);
      setError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error deleting complaint"
      );
      console.error(error);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await api.get(`/users/${accountId}/complaints/`);
        setComplaints(response.data.results);
        setIsLoading(false);
      } catch (error) {
        if (error.response) {
          setError(
            error.response.data.message ||
              error.response.data.error ||
              "Error fetching complaints data"
          );
        } else {
          setError("Unknown fetching complaints data");
        }
        console.error(error);
        setIsLoading(false);
      }
    };

    fetchComplaints();
  }, [accountId]);

  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = Array.isArray(complaints)
    ? complaints.slice(indexOfFirstComplaint, indexOfLastComplaint)
    : [];

  const totalComplaints = complaints ? complaints.length : 0;
  const totalPages = Math.ceil(totalComplaints / complaintsPerPage);

  return isLoading ? (
    "loading..."
  ) : (
    <div className="complaints">
      {showComplaintDetails && (
        <ComplainDetails
          handleShowComplainDetails={() => handleShowComplainDetails({})}
          complaint={selectedComplain}
          isDeleting={isDeleting}
        />
      )}

      {showSendToDepartmentForm && (
        <SendComplaintToDepartment
          complaint={selectedComplain}
          onClose={handleShowSendToDepartmentForm}
        />
      )}

      {showEditForm && (
        <EditComplaintForm
          complaint={selectedComplain}
          handleSubmitComplaint={handleShowEditForm}
        />
      )}

      {error && <div className="error-message">{error}</div>}
      {showSubmitComplaint ? (
        <SubmitComplaintForm handleSubmitComplaint={handleSubmitComplaint} />
      ) : (
        <div className="user-complaints">
          {currentComplaints && currentComplaints.length > 0 ? (
            <>
              {currentComplaints.map((complaint, index) => (
                <div
                  key={index}
                  className={`user-complaint ${
                    complaint.status === "Open" ? "open" : ""
                  }`}
                >
                  <div className="complaint-content">
                    <div className="col">
                      <div className="name-mr">
                        {
                          <div className="icon">
                            <ClipboardPen size={20} />
                          </div>
                        }
                        <div className="name">
                          <h5>{complaint.patient_name}</h5>
                          <small>{complaint.medical_record_number}</small>
                        </div>
                      </div>

                      <div className="department">
                        <small>Department</small>
                        <span>
                          {complaint?.department.length > 0
                            ? complaint?.department
                            : "Not provided"}
                        </span>
                      </div>
                    </div>

                    <div className="col">
                      <div className="date">
                        <small>Date of complaint</small>
                        <span>
                          {
                            <DateFormatter
                              dateString={complaint.date_of_complaint}
                            />
                          }
                        </span>
                      </div>
                      <div className="resolved-by-staff">
                        <small>Resolved by staff</small>
                        <span>
                          {complaint.resolved_by_staff ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    className="complaint-action"
                    ref={(el) => (actionRefs.current[index] = el)}
                  >
                    <EllipsisVertical
                      size={18}
                      onClick={(e) => handleShowPopup(index, e)}
                    />
                    {(permissions?.complaints?.includes("view_details") ||
                      permissions?.complaints?.includes("change_complaint") ||
                      permissions?.complaints?.includes(
                        "can_send_to_department"
                      ) ||
                      permissions?.complaints?.includes("delete_complaint")) &&
                      showPopup === index && (
                        <div className="popup-menu">
                          <PermissionsGuard
                            model="complaints"
                            codename="view_details"
                            isPage={false}
                          >
                            <div
                              className="popup-item"
                              onClick={() =>
                                handleShowComplainDetails(complaint)
                              }
                            >
                              <FileText size={16} />
                              <span>Complaint Detail</span>
                            </div>
                          </PermissionsGuard>

                          <PermissionsGuard
                            model="complaints"
                            codename="change_complaint"
                            isPage={false}
                          >
                            <div
                              className="popup-item"
                              onClick={() => {
                                setSelectedComplain(complaint);
                                setShowEditForm(true);
                                setShowPopup(null);
                              }}
                            >
                              <Pencil size={16} />
                              <span>Edit Complaint</span>
                            </div>
                          </PermissionsGuard>

                          <PermissionsGuard
                            model="complaints"
                            codename="can_send_to_department"
                            isPage={false}
                          >
                            <div
                              className="popup-item"
                              onClick={() => {
                                setSelectedComplain(complaint);
                                setShowSendToDepartmentForm(true);
                                setShowPopup(null);
                              }}
                            >
                              <SendHorizontal size={16} />
                              <span>Send to Department</span>
                            </div>
                          </PermissionsGuard>

                          <PermissionsGuard
                            model="complaints"
                            codename="delete_complaint"
                            isPage={false}
                          >
                            <div
                              className="popup-item"
                              onClick={() => {
                                setShowDeleteConfirm(complaint.id);
                                setShowPopup(null);
                              }}
                            >
                              <Trash size={16} />
                              <span>Delete Complaint</span>
                            </div>
                          </PermissionsGuard>
                        </div>
                      )}
                  </div>
                </div>
              ))}
              {totalComplaints > complaintsPerPage && (
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
                        background:
                          currentPage === index + 1 ? "#145C9E" : "#fff",
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
                          currentPage === totalPages
                            ? "not-allowed"
                            : "pointer",
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
              )}
            </>
          ) : (
            <p>No complaints found</p>
          )}
        </div>
      )}
      {showDeleteConfirm && (
        <DeleteComplaintForm
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleDeleteComplaint={handleDeleteComplaint}
          showDeleteConfirm={showDeleteConfirm}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default UserComplaints;

export const DeleteComplaintForm = ({
  setShowDeleteConfirm,
  handleDeleteComplaint,
  showDeleteConfirm,
  isDeleting,
}) => {
  return (
    <div className="delete-confirm-overlay">
      <div className="delete-confirm-popup">
        <div className="delete-confirm-content">
          <h4>Confirm Delete</h4>
          <p>
            Are you sure you want to delete this complaint? This action cannot
            be undone.
          </p>
          <div className="delete-confirm-buttons">
            <button
              className="cancel-button"
              onClick={() => setShowDeleteConfirm(null)}
            >
              Cancel
            </button>
            <button
              className="delete-button"
              onClick={() => handleDeleteComplaint(showDeleteConfirm)}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ComplainDetails = ({
  complaint,
  handleShowComplainDetails,
  isDeleting,
}) => {
  const { permissions } = useGetPermissions();

  const [showActions, setActions] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showSendToDepartmentForm, setShowSendToDepartmentForm] =
    useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const handleShowDeletePopup = () => {
    setShowDeletePopup(!showDeletePopup);
  };

  const handleShowSendToDepartment = () => {
    setShowSendToDepartmentForm(!showSendToDepartmentForm);
  };
  const handleShowEditForm = () => {
    setShowEditForm(!showEditForm);
    setActions(false);
  };
  const handleShowActions = () => {
    setActions(!showActions);
  };

  console.log("Complaint details:", complaint);

  return (
    <div className="complain-details-popup">
      {showEditForm ? (
        <EditComplaintForm
          complaint={complaint}
          handleSubmitComplaint={handleShowEditForm}
        />
      ) : showSendToDepartmentForm ? (
        <SendComplaintToDepartment
          onClose={handleShowSendToDepartment}
          apiLink={`complaints/${complaint.id}/send-to-department`}
          complaint={true}
        />
      ) : showDeletePopup ? (
        <DeleteComplaintForm
          setShowDeleteConfirm={setShowDeletePopup}
          showDeleteConfirm={showDeletePopup}
          handleDeleteComplaint={handleShowDeletePopup}
          isDeleting={isDeleting}
        />
      ) : (
        <div className="complaint-details popup">
          <div className="popup-content complaint-details-content">
            <h4>Complaint details</h4>
            <CloseIcon onClick={handleShowComplainDetails} />

            <div className="buttons">
              <button type="button" className="tertiary-button">
                <Printer size={19} /> <span>Print</span>
              </button>

              {(permissions?.complaints?.includes("change_complaint") ||
                permissions?.complaints?.includes("can_send_to_department") ||
                permissions?.complaints?.includes("delete_complaint")) && (
                <div className="action-btn-container">
                  <div
                    onClick={handleShowActions}
                    className="btn primary-button actions-button"
                  >
                    <span> {showActions ? "Hide actions" : "Actions"} </span>{" "}
                    <ChevronDown
                      size={20}
                      className={`chevron ${showActions && "action-active"}`}
                    />
                  </div>

                  {showActions && (
                    <div className="details-actions">
                      <PermissionsGuard
                        model="complaints"
                        codename="change_complaint"
                        isPage={false}
                      >
                        <div
                          onClick={handleShowEditForm}
                          className="details-action"
                        >
                          <Pencil size={16} /> <span>Edit complaint</span>
                        </div>
                      </PermissionsGuard>

                      <PermissionsGuard
                        model="complaints"
                        codename="can_send_to_department"
                        isPage={false}
                      >
                        <div
                          onClick={handleShowSendToDepartment}
                          className="details-action"
                        >
                          <SendHorizontal size={16} />{" "}
                          <span>Send to department</span>
                        </div>
                      </PermissionsGuard>

                      <PermissionsGuard
                        model="complaints"
                        codename="delete_complaint"
                        isPage={false}
                      >
                        <div
                          onClick={handleShowDeletePopup}
                          className="details-action"
                        >
                          <Trash size={16} /> <span>Delete complaint</span>
                        </div>
                      </PermissionsGuard>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="items-group">
              <div className="item row">
                <div className="icon">
                  <NotebookPen />
                </div>
                <div className="col">
                  <p>{complaint.patient_name}</p>
                  <p>{complaint.medical_record_number}</p>
                </div>
              </div>
              <div className="item col">
                <small>Date for complaint</small>
                <p>{complaint.date_of_complaint}</p>
              </div>
              <div className="item phone-number col">
                <small>Phone number</small>
                <p>{complaint.phone_number}</p>
              </div>

              <div className="item col">
                <small>Resolved by staff</small>
                <p>{complaint.resolved_by_staff ? "Yes" : "No"}</p>
              </div>
            </div>

            <div className="items-group">
              <div className="item col">
                <small>Nature of complaint</small>
                <p>{complaint.complaint_nature}</p>
              </div>
              <div className="item col">
                <small>Complaint type</small>
                <p>{complaint.complaint_type}</p>
              </div>
              <div className="item col">
                <small>Department</small>
                <p>
                  {complaint?.department.length > 0
                    ? complaint?.department
                    : "Not provided"}
                </p>
              </div>
              <div className="item col">
                <small>How was the complaint received?</small>
                <p>{complaint.how_complaint_was_taken}</p>
              </div>

              <div className="item col">
                <small>Person assigned to follow up</small>
                <div>
                  {complaint.assigned_to ? (
                    <div className="assignees">
                      {complaint.assigned_to?.length > 0
                        ? complaint.assigned_to.map((assignee, index) => (
                            <div key={index}>{assignee.name}</div>
                          ))
                        : "No assignee"}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="full col item">
                <small>Details</small>
                <p>{complaint.details}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
