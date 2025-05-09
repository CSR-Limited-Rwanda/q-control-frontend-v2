"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import Link from "next/link";
import { Plus, Pencil, MoveLeft } from "lucide-react";
import api from "@/utils/api";
import DateFormatter from "../DateFormatter";
import { useParams } from "next/navigation";
import "../../styles/reviews/reviewGroups/_reviewGroups.scss";

const ReviewGroupsDetailsContent = () => {
  const [members, setMembers] = useState([]);
  const [reviewGroup, setReviewGroup] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { reviewId } = useParams();

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
            "Failed to get review group members"
        );
      }
    };
    fetchReviewGroup();
  }, []);

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        const response = await api.get(
          `/permissions/review-groups/${reviewId}/`
        );
        console.log("data:", response);

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
  }, [reviewId]);

  if (isLoading) {
    return (
      <div className="dashboard-page-content">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page-content">
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
              <h4 className="review-title">{reviewGroup.title}</h4>
              <p className="review-date">
                <DateFormatter dateString={reviewGroup.created_at} />
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
          <div>
            <button>
              <Pencil />
            </button>
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
          className="button tertiary-button new-user-button"
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
                  <td>{member.cohesive_user_id}</td>
                  <td>{member.user.email}</td>
                  <td>{member.phone_number || "N/A"}</td>
                  <td>{member?.facility?.name}</td>
                  <td>
                    {member.access_to_department
                      .map((dept) => dept.name)
                      .join(", ")}
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
