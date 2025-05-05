"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import Link from "next/link";
import { Plus, Pencil, MoveLeft, CirclePlusIcon, SquareX } from "lucide-react";
import api from "@/utils/api";
import DateFormatter from "../DateFormatter";
import { useParams } from "next/navigation";
import Image from "next/image";
import OutlineButton from "../OutlineButton";
import "../../styles/reviews/reviewTemplates/_reviewTemplates.scss";
import AddTaskForm from "../forms/AddTaskForm";

const ReviewTemplatesDetailsContent = () => {
  const [members, setMembers] = useState([]);
  const [reviewTemplate, setReviewTemplate] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const { templateId } = useParams();

  useEffect(() => {
    const fetchReviewTemplates = async () => {
      try {
        const response = await api.get(
          `/permissions/review-templates/${templateId}/`
        );
        if (response.status === 200) {
          setReviewTemplate(response.data);
        }
      } catch (error) {
        setErrorMessage(
          error.response.data?.message ||
            error.response.data?.error ||
            "Failed to get review group members"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviewTemplates();
  }, []);

  const handleShowAddTaskForm = () => {
    setShowAddTaskForm(!showAddTaskForm);
  };

  //   useEffect(() => {
  //     const fetchGroupMembers = async () => {
  //       try {
  //         const response = await api.get(
  //           `/permissions/review-templates/${templateId}/members/`
  //         );
  //         console.log("data:", response);

  //         if (response.status === 200) {
  //           if (Array.isArray(response.data)) {
  //             setMembers(response.data);
  //           } else {
  //             setErrorMessage("Received data in unexpected format");
  //             setMembers([]);
  //           }
  //         }
  //       } catch (error) {
  //         console.log(error);
  //         if (error.response) {
  //           setErrorMessage(
  //             error.response.data?.message ||
  //               error.response.data?.error ||
  //               "Failed to get review templates"
  //           );
  //         } else if (error.request) {
  //           setErrorMessage("No response from server");
  //         } else {
  //           setErrorMessage("Failed to make request");
  //         }
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchGroupMembers();
  //   }, [templateId]);

  if (isLoading) {
    return (
      <div className="dashboard-page-content">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page-content">
      {showAddTaskForm && (
        <div className="new-user-form-popup">
          <div className="popup">
            <div className="popup-content">
              <div className="close">
                <SquareX
                  onClick={handleShowAddTaskForm}
                  className="close-icon"
                />
              </div>
              <div className="form">
                <AddTaskForm />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="group-details-top-content">
        <div className="group-details-title">
          <Link href="/accounts">
            <MoveLeft />
          </Link>
          <p>Template details</p>
        </div>
      </div>

      <div className="review-group-details-container">
        <div className="review-group-details-contents">
          <div className="row">
            <div className="col">
              <h4 className="review-title">{reviewTemplate.title}</h4>
              <p className="review-date">
                <DateFormatter dateString={reviewTemplate.created_at} />
              </p>
            </div>
            <div className="col">
              <p className="review-created">Created by</p>
              <p className="review-created-by-name">
                {reviewTemplate.created_by || "N/A"}
              </p>
            </div>
            <div className="col">
              <p className="review-update">Last updated by</p>
              <p>{reviewTemplate.updated_by || "N/A"}</p>
            </div>
          </div>
          <div>
            <button>
              <Pencil />
            </button>
          </div>
        </div>
        <div className="review-group-description">
          <p>{reviewTemplate.description || "No description provided"}</p>
        </div>
      </div>

      <div className="create-task-container">
        <Image src={"/empty-box.png"} height={80} width={80} alt="Empty Box" />
        <h2>No task yet</h2>
        <p>You must add at least two tasks for this template to be active</p>
        <OutlineButton
          onClick={handleShowAddTaskForm}
          text={"Create task"}
          prefixIcon={<CirclePlusIcon />}
        />
      </div>
    </div>
  );
};

const ReviewTemplatesDetails = () => {
  return (
    <DashboardLayout>
      <ReviewTemplatesDetailsContent />
    </DashboardLayout>
  );
};

export default ReviewTemplatesDetails;
