'use client'
import api from "@/utils/api";
import React, { useEffect, useState } from "react";
const UserComplaints = () => {
  const [complaints, setComplaints] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showSubmitComplaint, setShowSubmitComplaint] = useState(false);
  const [showComplaintDetails, setShowComplainDetails] = useState(false);
  const [selectedComplain, setSelectedComplain] = useState({});

  const handleSelectedComplaint = (complaint) => {
    setSelectedComplain(complaint);
    handleShowComplainDetails();
  };

  const handleShowComplainDetails = () => {
    setShowComplainDetails(!showComplaintDetails);
  };

  const handleSubmitComplaint = () => {
    setShowSubmitComplaint(!showSubmitComplaint);
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setError("");
        setIsLoading(true);
        const response = await api.get("/accounts/profile/complaints/");
        setComplaints(response.data.complaints);
        console.log(response.data.complaints);
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
          handleShowComplainDetails={handleShowComplainDetails}
          complaint={selectedComplain}
        />
      )}
      <button onClick={handleSubmitComplaint} className="primary-button">
        Submit a complaint
      </button>
      {error && <div className="error-message">{error}</div>}
      {showSubmitComplaint ? (
        <SubmitComplaintForm handleSubmitComplaint={handleSubmitComplaint} />
      ) : (
        <div className="user-complains">
          {complaints && complaints.length > 0 ? (
            complaints.map((complaint, index) => (
              <div
                onClick={() => handleSelectedComplaint(complaint)}
                key={index}
                className={`user-complaint ${complaint.status === "Open" ? "open" : ""
                  }`}
              >
                <div className="complain-content">
                  <div className="card name-mr">
                    {
                      <div className="icon">
                        <GoogleDocIcon size={20} />
                      </div>
                    }
                    <div className="name">
                      <h5>{complaint.patient_name}</h5>
                      <small>{complaint.medical_record_number}</small>
                    </div>
                  </div>
                  <div className="card date">
                    <small>Date of complaint</small>
                    <h5>
                      {<DateFormatter dateString={complaint.created_at} />}
                    </h5>
                  </div>
                  {/* <div className="card department">
                                                <small>Department</small>
                                                <h5>{complaint.department}</h5>
                                            </div> */}

                  <div className="card resolved-by-staff">
                    <small>Resolved by staff</small>
                    <h5>{complaint.resolved_by_staff ? "Yes" : "No"}</h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No complaints found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserComplaints;

export const ComplainDetails = ({ complaint, handleShowComplainDetails }) => {
  const permissions = usePermission();
  console.log(complaint);
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
        <div className="complaint-details">
          <EditComplaintForm
            complaint={complaint}
            handleSubmitComplaint={handleShowEditForm}
          />
        </div>
      ) : showSendToDepartmentForm ? (
        <div className="complaint-details">
          <SendToDepartmentForm
            closeForm={handleShowSendToDepartment}
            apiLink={`complaints/${complaint.id}/send-to-department`}
            complaint={true}
          />
        </div>
      ) : showDeletePopup ? (
        <div className="complaint-details">
          <DeleteComplaint
            closeForm={handleShowDeletePopup}
            id={complaint.id}
            name={"complaint"}
          />
        </div>
      ) : (
        <div className="complaint-details">
          <h4>Complaint details</h4>
          <Cancel01Icon
            className="close-icon"
            onClick={handleShowComplainDetails}
          />

          <div className="btns">
            {/* <button type="button" className="tertiary-button"><PrinterIcon size={19} /> <span>Print</span></button> */}
            <div
              onClick={handleShowActions}
              className="btn primary-button actions-button"
            >
              {showActions ? (
                <>
                  {" "}
                  <span>Hide actions</span> <ArrowRight01Icon size={20} />
                </>
              ) : (
                <>
                  <span>Actions</span> <ArrowRight01Icon size={20} />
                </>
              )}
              {showActions && (
                <div className="actions">
                  {permissions.includes("Super User") ||
                    permissions.includes("Admin") ||
                    permissions.includes("Quality - Risk Manager") ? (
                    <div onClick={handleShowEditForm} className="action">
                      <PencilEdit02Icon /> <span>Edit complaint</span>
                    </div>
                  ) : (
                    ""
                  )}

                  {permissions.includes("Super User") ||
                    permissions.includes("Admin") ||
                    permissions.includes("Quality - Risk Manager") ? (
                    <div
                      onClick={handleShowSendToDepartment}
                      className="action"
                    >
                      <Navigation03Icon /> <span>Send to department</span>
                    </div>
                  ) : (
                    ""
                  )}
                  {permissions.includes("Super User") ||
                    permissions.includes("Admin") ||
                    permissions.includes("Quality - Risk Manager") ? (
                    <div onClick={handleShowDeletePopup} className="action">
                      <Delete01Icon /> <span>Delete complaint</span>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="items-group">
            <div className="item">
              <p>{complaint.patient_name}</p>
              <p>{complaint.medical_record_number}</p>
            </div>
            <div className="item">
              <small>Date for complaint</small>
              <p>{complaint.date_of_complaint}</p>
            </div>
            <div className="item">
              <small>Phone number</small>
              <p>{complaint.phone_number}</p>
            </div>

            <div className="item">
              <small>Resolved by staff</small>
              <p>{complaint.resolved_by_staff ? "Yes" : "No"}</p>
            </div>
          </div>

          <div className="items-group">
            <div className="item">
              <small>Nature of complaint</small>
              <p>{complaint.complaint_nature}</p>
            </div>
            <div className="item">
              <small>Complaint type</small>
              <p>{complaint.complaint_type}</p>
            </div>
            <div className="item">
              <small>Department</small>
              <p>{complaint.department}</p>
            </div>
            <div className="item">
              <small>How was the complaint received?</small>
              <p>{complaint.how_complaint_was_taken}</p>
            </div>

            <div className="item">
              <small>Person assigned to follow up</small>
              <p>
                {complaint.assigned_to ? (
                  <div className="assignees">
                    {complaint.assigned_to.map((assignee, index) => (
                      <div key={index}>{assignee.name}</div>
                    ))}
                  </div>
                ) : (
                  ""
                )}
              </p>
            </div>
            <div className="full">
              <p>{complaint.details}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
