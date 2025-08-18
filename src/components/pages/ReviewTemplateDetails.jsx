"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import Link from "next/link";
import {
  Plus,
  Pencil,
  MoveLeft,
  CirclePlusIcon,
  SquareX,
  ArrowRight,
  Trash2,
  SquarePen,
  MoveRight,
  PlusCircle,
  Container,
  CircleX,
  X,
} from "lucide-react";
import api from "@/utils/api";
import DateFormatter from "../DateFormatter";
import { useParams } from "next/navigation";
import Image from "next/image";
import OutlineButton from "../OutlineButton";
import "../../styles/reviews/reviewTemplates/_reviewTemplates.scss";
import "../../styles/reviews/reviewGroups/_reviewGroups.scss";
import AddTaskForm from "../forms/AddTaskForm";
import EditTaskForm from "../forms/EditTaskForm";
import DeletePopup from "../forms/DeletePopup";
import EditReviewTemplateForm from "../forms/EditReviewTemplateForm";
import TaskDetailsPopup from "../forms/TaskDetailsPopup";
import CloseIcon from "../CloseIcon";
import PermissionsGuard from "../PermissionsGuard";

const ReviewTemplatesDetailsContent = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({});
  const [taskId, setTaskId] = useState({});
  const [reviewTemplate, setReviewTemplate] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadingTask, setLoadingTask] = useState(true);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [showEditTaskForm, setShowEditTaskForm] = useState(false);
  const [showTaskDetailsPopup, setShowTaskDetailsPopup] = useState(false);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [showEditTemplateForm, setShowEditTemplateForm] = useState(false);
  const { templateId } = useParams();

  const handleShowEditTemplateForm = () => {
    setShowEditTemplateForm(!showEditTemplateForm);
  };
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoadingTask(true);
        const response = await api.get(
          `/permissions/review-templates/${templateId}/tasks/`
        );

        if (response.status === 200) {
          setLoadingTask(false);
          if (Array.isArray(response.data.results)) {
            setTasks(response.data.results);
          } else {
            setErrorMessage("Received data in unexpected format");
            setTasks([]);
          }
        }
      } catch (error) {
        if (error.response) {
          setErrorMessage(
            error.response.data?.message ||
              error.response.data?.error ||
              "Failed to get tasks"
          );
        } else if (error.request) {
          setErrorMessage("No response from server");
        } else {
          setErrorMessage("Failed to make request");
        }
      } finally {
        setIsLoading(false);
        setLoadingTask(false);
      }
    };
    fetchTasks();
  }, []);
  const handleShowAddTaskForm = () => {
    setShowAddTaskForm(!showAddTaskForm);
  };
  const handleShowEditTaskForm = () => {
    setShowEditTaskForm(!showEditTaskForm);
  };

  const handleShowTaskDetailsPopup = () => {
    setShowTaskDetailsPopup(!showTaskDetailsPopup);
  };

  const handleShowDeleteForm = (id) => {
    setTaskId(id);
    setShowDeleteForm(!showDeleteForm);
  };
  const fetchTaskDetails = async (id) => {
    try {
      const response = await api.get(
        `/permissions/review-templates/${templateId}/tasks/${id}/`
      );

      if (response.status === 200) {
        setTask(response.data);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data?.message ||
            error.response.data?.error ||
            "Failed to get tasks"
        );
      } else if (error.request) {
        setErrorMessage("No response from server");
      } else {
        setErrorMessage("Failed to make request");
      }
    } finally {
      setIsLoading(false);
      setLoadingTask(false);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-page-content">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <PermissionsGuard model={"tasks"} codename={"view_reviewtemplates"}>
      <div className="dashboard-page-content">
        {showAddTaskForm && (
          <div className="new-user-form-popup">
            <div className="popup">
              <div className="popup-content">
                <CloseIcon onClick={handleShowAddTaskForm} />

                <div className="form">
                  <AddTaskForm
                    showTaskDetails={handleShowTaskDetailsPopup}
                    discardFn={handleShowAddTaskForm}
                    fetchTaskDetails={(taskId) => {
                      fetchTaskDetails(taskId);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showEditTemplateForm && (
          <div className="new-user-form-popup">
            <div className="popup">
              <div className="popup-content">
                <CloseIcon onClick={handleShowEditTemplateForm} />

                <div className="form">
                  <EditReviewTemplateForm
                    data={reviewTemplate}
                    discardFn={handleShowEditTemplateForm}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showEditTaskForm && (
          <div className="new-user-form-popup">
            <div className="popup">
              <div className="popup-content">
                <CloseIcon onClick={handleShowEditTaskForm} />

                <div className="form">
                  <EditTaskForm
                    showTaskDetails={handleShowTaskDetailsPopup}
                    discardFn={handleShowEditTaskForm}
                    data={task}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showTaskDetailsPopup && (
          <div className="new-user-form-popup">
            <div className="popup">
              <div className="popup-content">
                <CloseIcon onClick={handleShowTaskDetailsPopup} />

                <div className="form">
                  <TaskDetailsPopup
                    discardFn={handleShowTaskDetailsPopup}
                    task={task}
                    templateId={templateId}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {showDeleteForm && (
          <div className="new-user-form-popup delete-form-popup">
            <div className="popup">
              <div className="popup-content">
                <div className="form">
                  <DeletePopup
                    text={"Do you really want to delete this task"}
                    cancelFn={handleShowDeleteForm}
                    apiUrl={`/permissions/review-templates/${templateId}/tasks/${taskId}/`}
                  />
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
                <h4 className="review-title">{reviewTemplate.name}</h4>
                <p className="review-date">
                  <DateFormatter dateString={reviewTemplate.created_at} />
                </p>
              </div>
              <div className="col">
                <p className="review-created">Created by</p>
                <p className="review-created-by-name">
                  {reviewTemplate.created_by
                    ? `${reviewTemplate.created_by.first_name || "N/A"} ${
                        reviewTemplate.created_by.last_name || "N/A"
                      }`
                    : "N/A"}
                </p>
              </div>
              <div className="col">
                <p className="review-update">Last updated by</p>
                <p>
                  {reviewTemplate.updated_by
                    ? `${reviewTemplate.updated_by.first_name || "N/A"} ${
                        reviewTemplate.updated_by.last_name
                      }`
                    : "N/A"}
                </p>
              </div>
            </div>
            <PermissionsGuard
              model={"tasks"}
              codename={"change_reviewtemplates"}
              isPage={false}
            >
              <div>
                <button onClick={handleShowEditTemplateForm}>
                  <Pencil />
                </button>
              </div>
            </PermissionsGuard>
          </div>
          <div className="review-group-description">
            <p>{reviewTemplate.description || "No description provided"}</p>
          </div>
        </div>

        {loadingTask ? (
          <div className="loading-state">
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length > 0 ? (
          <div className="tasks-wrapper">
            <PermissionsGuard
              model={"tasks"}
              codename={"add_reviewtemplatetasks"}
              isPage={false}
            >
              <div className="add-task-button" onClick={handleShowAddTaskForm}>
                <div className="add-icon">
                  <PlusCircle size={50} />
                </div>
                <h3>Add Task</h3>
                <p>You must add at least task for this template to be active</p>
              </div>
            </PermissionsGuard>

            {tasks.map((task, index) => (
              <div key={index} className="task-container">
                <div className="col">
                  <div className="row">
                    <span>{task?.name}</span>
                    <span>
                      <span>{task?.number_of_days_to_complete}</span>{" "}
                      <span>day(s) alloted</span>
                    </span>
                  </div>
                  <div className="review-task">
                    <h3>{task?.description}</h3>
                    <span>Admin, Supervisor, Manager review</span>
                  </div>

                  <div className="col">
                    <div className="row">
                      <span className="group-title">Assigned group(s)</span>{" "}
                      <span className="group-number">
                        {task.review_groups.length}
                      </span>
                    </div>
                    {task.review_groups.length > 0 ? (
                      <div className="groups-container">
                        {task.review_groups.map((group, index) => (
                          <div key={index} className="group-name">
                            {group.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="groups-container">
                        <div className="group-name">No assigned group</div>
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <PermissionsGuard
                      model={"tasks"}
                      codename={"delete_reviewtemplatetasks"}
                      isPage={false}
                    >
                      <div className="delete-btn">
                        <Trash2
                          size={20}
                          onClick={() => handleShowDeleteForm(task.id)}
                        />
                      </div>
                    </PermissionsGuard>

                    <PermissionsGuard
                      model={"tasks"}
                      codename={"change_reviewtemplatetasks"}
                      isPage={false}
                    >
                      <div
                        className="edit-btn"
                        onClick={async () => {
                          await fetchTaskDetails(task.id);
                          setShowEditTaskForm(true);
                        }}
                      >
                        <SquarePen size={20} />
                        <span>Edit Task</span>
                      </div>
                    </PermissionsGuard>

                    <PermissionsGuard
                      model={"tasks"}
                      codename={"view_reviewtemplatetasks"}
                      isPage={false}
                    >
                      <div
                        className="details-btn"
                        onClick={() => {
                          handleShowTaskDetailsPopup();
                          fetchTaskDetails(task.id);
                        }}
                      >
                        <MoveRight size={18} />
                      </div>
                    </PermissionsGuard>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="create-task-container">
            <Image
              src={"/empty-box.png"}
              height={80}
              width={80}
              alt="Empty Box"
            />
            <h2>No task yet</h2>
            <p>
              You must add at least two tasks for this template to be active
            </p>
            <PermissionsGuard
              model={"tasks"}
              codename={"add_reviewtemplatetasks"}
            >
              <OutlineButton
                onClick={handleShowAddTaskForm}
                text={"Create task"}
                prefixIcon={<CirclePlusIcon />}
              />
            </PermissionsGuard>
          </div>
        )}
      </div>
    </PermissionsGuard>
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
