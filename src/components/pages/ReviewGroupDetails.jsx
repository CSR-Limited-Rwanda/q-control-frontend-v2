"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import Link from "next/link";
import {
  Plus,
  Pencil,
  MoveLeft,
  SquareX,
  ChevronRight,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import api from "@/utils/api";
import DateFormatter from "../DateFormatter";
import { useParams } from "next/navigation";
import "../../styles/reviews/reviewGroups/_reviewGroups.scss";
import AddMembersToReviewGroup from "../forms/AddMembersToReviewGroup";
import { useRouter } from "next/navigation";
import DeleteReviewGroup from "../accounts/forms/reviewGroups/DeleteReviewGroup";
import EditReviewGroup from "../accounts/forms/reviewGroups/EditReviewGroup";
import CloseIcon from "../CloseIcon";

const ReviewGroupsDetailsContent = () => {
  const [members, setMembers] = useState([]);
  const [reviewGroup, setReviewGroup] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMembersForm, setShowAddMembersForm] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { reviewId } = useParams();
  const router = useRouter();

  // review group details
  useEffect(() => {
    const fetchReviewGroup = async () => {
      try {
        const response = await api.get(
          `/permissions/review-groups/${reviewId}/`
        );
        if (response.status === 200) {
          setReviewGroup(response.data);
        }
      } catch (error) {
        setErrorMessage(
          error.response.data?.message ||
            error.response.data?.error ||
            "Failed to get review group"
        );
      }
    };
    fetchReviewGroup();
  }, []);

  // review group members
  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await api.get(
          `/permissions/review-groups/${reviewId}/members/`
        );

        if (response.status === 200) {
          if (Array.isArray(response.data)) {
            setMembers(response.data);
          } else {
            setErrorMessage("Received data in unexpected format");
            setMembers([]);
          }
        }
      } catch (error) {
        if (error.response) {
          setErrorMessage(
            error.response.data?.message ||
              error.response.data?.error ||
              "Failed to get review group members"
          );
        } else if (error.request) {
          setErrorMessage("No response from server");
        } else {
          setErrorMessage("Failed to make request");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupMembers();
  }, []);

  const handleShowNewUserForm = () => {
    setShowAddMembersForm(!showAddMembersForm);
  };

  const handleShowActions = () => {
    setShowActions(!showActions);
  };

  const handleDeleteReviewGroup = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await api.delete(`/permissions/review-groups/${reviewId}/`);

      if (res.status === 200 || res.status === 204) {
        setShowDeletePopup(false); // ✅ Close only on success
        router.push(`/accounts`);
      } else {
        setDeleteError(res.data?.message || "Failed to delete review group");
      }
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Error deleting department"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (deleteError) {
      const timer = setTimeout(() => {
        setShowDeletePopup(false);
        setDeleteError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteError]);

  if (isLoading) {
    return (
      <div className="dashboard-page-content">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="dashboard-page-content">
        {showAddMembersForm && (
          <div className="new-user-form-popup">
            <div className="popup">
              <div className="popup-content">
                <CloseIcon onClick={handleShowNewUserForm} />

                <div className="form">
                  <AddMembersToReviewGroup
                    groupId={reviewId}
                    onClose={() => setShowAddMembersForm(false)}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {showDeletePopup && (
          <DeleteReviewGroup
            onClose={() => {
              setShowDeletePopup(false);
              setDeleteError(null);
            }}
            onConfirm={handleDeleteReviewGroup}
            isLoading={isDeleting}
            error={deleteError}
          />
        )}

        {showEditForm && (
          <EditReviewGroup
            reviewGroup={reviewGroup}
            onClose={() => setShowEditForm(false)}
            onReviewGroupUpdated={(updatedReviewGroup) => {
              setReviewGroup(updatedReviewGroup);
            }}
          />
        )}

        <div className="group-details-top-content">
          <div className="group-details-title">
            <Link href="/accounts">
              <MoveLeft />
            </Link>
            <p>Group details</p>
          </div>
        </div>

        <div className="review-group-details-container">
          <div className="review-group-details-contents">
            <div className="row">
              <div className="col">
                <h4 className="review-title">
                  {reviewGroup.title || "Not provided"}
                </h4>
                <p className="review-date">
                  <DateFormatter dateString={reviewGroup.created_at || "N/A"} />
                </p>
              </div>
              <div className="col">
                <p className="review-created">Created by</p>
                <p className="review-created-by-name">
                  {reviewGroup.created_by || "N/A"}
                </p>
              </div>
              <div className="col">
                <p className="review-update">Last updated by</p>
                <p>{reviewGroup.updated_by || "N/A"}</p>
              </div>
            </div>
            <div className="action-btn">
              <div
                onClick={handleShowActions}
                className={`actions-dropdown ${showActions && "show"}`}
              >
                <button className="header">
                  <span>Actions</span>
                  <ChevronRight className="icon" />
                </button>

                {/* actions : Edit, Deactivate, Activate, Delete, Change Password */}
                <div className="actions-list">
                  <div
                    className="action"
                    onClick={() => {
                      setShowEditForm(true);
                      setShowActions(false);
                    }}
                  >
                    <SquarePen />
                    <span>Edit review group</span>
                  </div>
                  <hr />
                  <div
                    className="action"
                    onClick={() => {
                      setShowDeletePopup(true);
                      setShowActions(false);
                    }}
                  >
                    <Trash2 />
                    <span>Delete review group</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="review-group-description">
            <p>{reviewGroup.description || "No description provided"}</p>
          </div>
        </div>

        <div className="actions">
          <div className="title">
            <div>
              <h3>Group members</h3>
              <span>{members.length > 0 ? members.length : "0"}</span>{" "}
              <span>Available</span>
            </div>
          </div>
          <button
            type="button"
            className="btn tertiary-button new-user-button"
            onClick={() => setShowAddMembersForm(true)}
          >
            <Plus size={20} />
            <span>Add Members</span>
          </button>
        </div>
        <div className="table-container">
          <table className="review-groups-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Email</th>
                <th>Phone number</th>
                <th>Facility</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {members.length > 0 ? (
                members.map((member) => (
                  <tr key={member.id}>
                    <td>
                      {member.user.first_name} {member.user.last_name}
                    </td>
                    <td>{member.id}</td>
                    <td>{member.user.email}</td>
                    <td>{member.phone_number || "N/A"}</td>
                    <td>{member?.facility?.name}</td>
                    <td>
                      {member?.access_to_department?.length > 0
                        ? member.access_to_department
                            .map((dept) => dept.name)
                            .join(", ")
                        : "No department"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data-found">
                    <p>No members found in this group</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const ReviewGroupsDetails = () => {
  return (
    <DashboardLayout>
      <ReviewGroupsDetailsContent />
    </DashboardLayout>
  );
};

export default ReviewGroupsDetails;
