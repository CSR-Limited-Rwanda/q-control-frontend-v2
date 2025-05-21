"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";
import NamesInitials from "../NamesInitials";
import { useParams, useRouter } from "next/navigation";
import { Check, Search } from "lucide-react";
import "../../styles/_components.scss";
import "../../styles/_forms.scss";
import "../../styles/reviews/reviewGroups/_forms.scss";

const EditTaskForm = ({ showTaskDetails, data, discardFn }) => {
  const router = useRouter();
  const { templateId } = useParams();

  const [currentStep, setCurrentStep] = useState(1);
  const [taskName, setTaskName] = useState(data?.name);
  const [numberOfDays, setNumberOfDays] = useState(
    data?.number_of_days_to_complete
  );
  const [description, setDescription] = useState(data?.description);
  const [requireApprovalForAll, setRequireApprovalForAll] = useState(
    data?.require_approval_for_all_groups
  );

  const [continuing, setContinuing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [taskId, setTaskId] = useState(null);

  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState(data?.review_groups);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNextStep = async () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleAddGroup = async () => {
    if (!taskName.trim() || !numberOfDays || !description.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    const payload = {
      name: taskName,
      number_of_days_to_complete: Number(numberOfDays),
      description,
      require_approval_for_all_groups: requireApprovalForAll,
    };

    setContinuing(true);

    try {
      const response = await api.put(
        `/permissions/review-templates/${templateId}/tasks/${data.id}/`,
        payload
      );

      if (response.status === 201 || response.status === 200) {
        const editedTaskId = response.data.id;
        setTaskId(editedTaskId);

        if (selectedGroups.length === 0) {
          alert("Please select at least one group.");
          return;
        }

        console.log(selectedGroups);

        if (data.review_groups.length > 0) {
          try {
            setSubmitting(true);
            const patchResponse = await api.patch(
              `/permissions/review-templates/${templateId}/tasks/${editedTaskId}/review-groups/`,
              {
                review_groups: data.review_groups.map((group) => group.id),
                action: "remove",
              }
            );

            if ([200, 204].includes(patchResponse.status)) {
              console.log(patchResponse.data);

              try {
                const response = await api.put(
                  `/permissions/review-templates/${templateId}/tasks/${data.id}/`,
                  payload
                );

                if (response.status === 201 || response.status === 200) {
                  const editedTaskId = response.data.id; // 🔥 Use this directly
                  setTaskId(editedTaskId);

                  if (selectedGroups.length === 0) {
                    alert("Please select at least one group.");
                    return;
                  }

                  console.log(selectedGroups);
                  try {
                    setSubmitting(true);
                    const patchResponse = await api.patch(
                      `/permissions/review-templates/${templateId}/tasks/${editedTaskId}/review-groups/`,
                      {
                        review_groups: selectedGroups.map((group) => group.id),
                        action: "add",
                      }
                    );

                    if ([200, 204].includes(patchResponse.status)) {
                      console.log(patchResponse.data);
                      setCurrentStep(3);
                    }
                  } catch (error) {
                    console.error("Error adding groups:", error);
                  } finally {
                    setSubmitting(false);
                    setLoading(false);
                  }

                  console.log(response.data);
                } else {
                  alert("Something went wrong. Please try again.");
                }
              } catch (error) {
                console.error("Error adding task:", error);
                alert("Failed to add task.");
              } finally {
                setContinuing(false);
              }
            }
          } catch (error) {
            console.error("Error adding groups:", error);
          } finally {
            setSubmitting(false);
            setLoading(false);
          }
        } else {
          try {
            setSubmitting(true);
            const patchResponse = await api.patch(
              `/permissions/review-templates/${templateId}/tasks/${editedTaskId}/review-groups/`,
              {
                review_groups: selectedGroups.map((group) => group.id),
                action: "add",
              }
            );

            if ([200, 204].includes(patchResponse.status)) {
              console.log(patchResponse.data);
              setCurrentStep(3);
            }
          } catch (error) {
            console.error("Error adding groups:", error);
          } finally {
            setSubmitting(false);
            setLoading(false);
          }
        }

        console.log(response.data);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task.");
    } finally {
      setContinuing(false);
    }
  };

  const handleBackStep = () => setCurrentStep((prev) => prev - 1);

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const handleSelectMember = (group) => {
    setSelectedGroups((prev) => {
      const exists = prev.find((g) => g.id === group.id);
      return exists ? prev.filter((g) => g.id !== group.id) : [...prev, group];
    });
  };

  const fetchGroups = async (query = "") => {
    setLoading(true);
    try {
      const res = await api.get("/permissions/review-groups/", {
        params: {
          page: 1,
          page_size: 8,
          search: query,
        },
      });
      setGroups(res.data);
      setFilteredGroups(res.data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchGroups(searchTerm.length >= 2 ? searchTerm : "");
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  return (
    <div className="review-groups-form">
      {/* Step 1: Task Details */}
      {currentStep === 1 && (
        <div className="step-one">
          <form>
            <h3>Update Task</h3>

            <div className="field">
              <label htmlFor="taskName">Task Name</label>
              <input
                type="text"
                id="taskName"
                placeholder="Enter Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="numberOfDays">Number of Days</label>
              <input
                type="number"
                id="numberOfDays"
                placeholder="Enter Number of Days"
                value={numberOfDays}
                onChange={(e) => setNumberOfDays(e.target.value)}
                min="1"
              />
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="8"
                placeholder="Enter Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Assign Groups */}
      {currentStep === 2 && (
        <div className="step-two">
          <h2>Assign Groups</h2>

          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          <div className="selected-members">
            Selected &nbsp; {selectedGroups.length}
          </div>

          {loading ? (
            <p>Loading groups...</p>
          ) : (
            <ul className="member-list">
              {[...filteredGroups]
                .sort((a, b) => {
                  const aSelected = selectedGroups.some((g) => g.id === a.id);
                  const bSelected = selectedGroups.some((g) => g.id === b.id);
                  return aSelected === bSelected ? 0 : aSelected ? -1 : 1;
                })
                .map((group) => {
                  const isSelected = selectedGroups.some(
                    (g) => g.id === group.id
                  );
                  return (
                    <li
                      key={group.id}
                      className={`choice ${isSelected ? "checked" : ""}`}
                      onClick={() => handleSelectMember(group)}
                    >
                      <label className="member-label">
                        <div
                          className={`custom-checkbox ${
                            isSelected ? "checked" : ""
                          }`}
                        >
                          <svg viewBox="0 0 24 24" className="checkmark">
                            <path d="M5 12l5 5L19 7" />
                          </svg>
                        </div>
                        <div className="member">
                          <p>{group.title}</p>
                        </div>
                      </label>
                    </li>
                  );
                })}
            </ul>
          )}
          <div className="custom-radio-group">
            <label
              className="group-approval"
              onClick={() => setRequireApprovalForAll(true)}
            >
              <div
                className={`custom-checkbox ${
                  requireApprovalForAll === true ? "checked" : ""
                }`}
              >
                <svg viewBox="0 0 24 24" className="checkmark">
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </div>
              <span>Require approval from each group</span>
            </label>

            <label
              className="group-approval"
              onClick={() => setRequireApprovalForAll(false)}
            >
              <div
                className={`custom-checkbox ${
                  requireApprovalForAll === false ? "checked" : ""
                }`}
              >
                <svg viewBox="0 0 24 24" className="checkmark">
                  <path d="M5 12l5 5L19 7" />
                </svg>
              </div>
              <span>Require approval from any group</span>
            </label>
          </div>
        </div>
      )}

      {/* Step 3: Success */}
      {currentStep === 3 && (
        <div className="final-step">
          <h2>Task Updated</h2>
          <div className="final-step-container">
            <div className="smessage">
              <div className="check-mark">
                <Check size={46} />
              </div>
              <h3>Task Updated Successfully</h3>
              <p className="description">
                Task and groups were added successfully.
              </p>
            </div>
            <div className="success-btn">
              <div
                className="visit-btn"
                onClick={() => {
                  discardFn();
                  showTaskDetails();
                }}
              >
                Visit Task Details
              </div>
              <button
                className="back-btn"
                onClick={() => {
                  window.location.reload();
                  router.push(`/permissions/review-templates/${templateId}`);
                }}
              >
                Back To List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        {currentStep === 1 ? (
          <>
            <button className="third-button" onClick={discardFn}>
              Discard
            </button>
            <button className="primary-button" onClick={handleNextStep}>
              {continuing ? "Continuing..." : "Continue"}
            </button>
          </>
        ) : currentStep === 2 ? (
          <>
            <button className="third-button" onClick={handleBackStep}>
              Back
            </button>
            <button
              className="primary-button"
              onClick={handleAddGroup}
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save"}
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default EditTaskForm;
