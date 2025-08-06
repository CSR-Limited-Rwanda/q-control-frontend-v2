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

const UserComplaints = () => {
  const [complaints, setComplaints] = useState();
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

  let profileId;
  if (typeof window !== "undefined") {
    profileId = JSON.parse(localStorage.getItem("loggedInUserInfo"))?.id;
  } else {
    profileId = null;
  }

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
      setComplaints(
        complaints.filter((complaint) => complaint.id !== complaintId)
      );
      setShowDeleteConfirm(null);
      setShowPopup(null);
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

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await api.get(`/users/${profileId}/complaints/`);
        setComplaints(response.data.results);
        console.log(response.data.results);
        console.log(response.data);
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
  }, []);

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
          {complaints && complaints.length > 0 ? (
            complaints.map((complaint, index) => (
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
                      <span>{complaint.resolved_by_staff ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>

                <div
                  className="action"
                  ref={(el) => (actionRefs.current[index] = el)}
                >
                  <EllipsisVertical
                    size={18}
                    onClick={(e) => handleShowPopup(index, e)}
                  />
                  {showPopup === index && (
                    <div className="popup-menu">
                      <div
                        className="popup-item"
                        onClick={() => handleShowComplainDetails(complaint)}
                      >
                        <FileText size={16} />
                        <span>Complaint Detail</span>
                      </div>
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
                    </div>
                  )}
                </div>
              </div>
            ))
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

  return (
    <div className="complain-details-popup">
      {showEditForm ? (
        <EditComplaintForm
          complaint={complaint}
          handleSubmitComplaint={handleShowEditForm}
        />
      ) : showSendToDepartmentForm ? (
        <div className="complaint-details">
          <SendToDepartmentForm
            closeForm={handleShowSendToDepartment}
            apiLink={`complaints/${complaint.id}/send-to-department`}
            complaint={true}
          />
        </div>
      ) : showDeletePopup ? (
        <DeleteComplaintForm
          setShowDeleteConfirm={setShowDeletePopup}
          showDeleteConfirm={showDeletePopup}
          handleDeleteComplaint={handleShowDeletePopup}
          isDeleting={isDeleting}
        />
      ) : (
        <div className="complaint-details">
          <h4>Complaint details</h4>
          <X className="close-icon" onClick={handleShowComplainDetails} />

          <div className="btns">
            <button type="button" className="tertiary-button">
              <Printer size={19} /> <span>Print</span>
            </button>
            <div className="action-btn-container">
              <div
                onClick={handleShowActions}
                className="btn primary-button actions-button"
              >
                <>
                  <span> {showActions ? "Hide actions" : "Actions"} </span>{" "}
                  <ChevronDown
                    size={20}
                    className={`chevron ${showActions && "action-active"}`}
                  />
                </>
              </div>
              {showActions && (
                <div className="actions">
                  <div onClick={handleShowEditForm} className="action">
                    <Pencil size={16} /> <span>Edit complaint</span>
                  </div>

                  <div onClick={handleShowSendToDepartment} className="action">
                    <SendHorizontal size={16} /> <span>Send to department</span>
                  </div>

                  <div onClick={handleShowDeletePopup} className="action">
                    <Trash size={16} /> <span>Delete complaint</span>
                  </div>
                </div>
              )}
            </div>
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
              <p>{complaint.department}</p>
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
                    {complaint.assigned_to.map((assignee, index) => (
                      <div key={index}>{assignee.name}</div>
                    ))}
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
      )}
    </div>
  );
};
