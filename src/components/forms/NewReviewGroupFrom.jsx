'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";
import NamesInitials from "../NamesInitials";
import { useNavigate } from "react-router-dom";
import { CheckCheck, Search } from 'lucide-react';

const NewReviewGroupForm = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [continuing, setContinuing] = useState(false);
  const [groupId, setGroupId] = useState(null);

  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!title.trim() || !description.trim()) {
        alert("Please fill in both title and description.");
        return;
      }

      const payload = {
        title,
        description,
      };

      setContinuing(true);
      try {
        const response = await api.post("/permissions/review-groups/", payload);

        if (response.status === 201 || response.status === 200) {
          setCurrentStep((prev) => prev + 1);
          console.log(response.data);
          setGroupId(response.data.id);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error adding review group:", error);
        alert("Failed to add review group.");
      } finally {
        setSubmitting(false);
      }
    }
  };
  const handleBackStep = () => setCurrentStep((prev) => prev - 1);

  const handleAddMember = async () => {
    if (!groupId) {
      alert("Missing group ID.");
      return;
    }

    if (selectedMembers.length === 0) {
      alert("Please select at least one member.");
      return;
    }

    setSubmitting(true);

    try {
      let allSuccessful = true;

      for (const member of selectedMembers) {
        const response = await api.patch(
          `/permissions/review-groups/${groupId}/members/`,
          {
            member_id: member.id,
            action: "add",
          }
        );

        if (response.status === 200 || response.status === 204) {
          console.log(`Added member ${member.id}:`, response.data);
        } else {
          console.error(`Failed to add member ${member.id}:`, response);
          allSuccessful = false;
          break; // stop on first failure
        }
      }

      if (allSuccessful) {
        setCurrentStep((prev) => prev + 1);
      } else {
        alert("One or more members could not be added.");
      }
    } catch (error) {
      console.error("Error adding members to review group:", error);
      alert("Something went wrong while adding members.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSelectMember = (member) => {
    setSelectedMembers((prevSelected) => {
      const alreadySelected = prevSelected.find((m) => m.id === member.id);
      if (alreadySelected) {
        return prevSelected.filter((m) => m.id !== member.id);
      } else {
        return [...prevSelected, member];
      }
    });
  };

  const fetchMembers = async (query = "") => {
    setLoading(true);
    try {
      const response = await api.get("/users/", {
        params: {
          page: 1,
          page_size: 8,
          q: query,
          permissions: "review_permissions",
        },
      });

      if (response.status === 200) {
        setMembers(response.data);
        setFilteredMembers(response.data);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.length >= 2) {
        fetchMembers(searchTerm);
      } else {
        fetchMembers("");
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleReviewGroupDetails = (reviewId) => {
    navigate(`/permissions/review-groups/${reviewId}/members/`)
  }

  return (
    <div className="review-groups-form">
      {/* Step 1: Form */}
      {currentStep === 1 && (
        <div className="step-one">
          <form>
            <h2>Create Review Group</h2>

            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Enter Group Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="8"
                placeholder="Enter Group Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Member Selection */}
      {currentStep === 2 && (
        <div className="step-two">
          <h2>Add Members</h2>
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={handleSearch}
            // style={{ width: "100%", padding: "8px", marginBottom: "12px" }}
            />
          </div>
          <div className="selected-members">
            Selected &nbsp; &nbsp;&nbsp;{selectedMembers.length}
          </div>

          {loading ? (
            <p>Loading members...</p>
          ) : (
            <ul style={{ listStyle: "none", paddingLeft: 0 }}>
              {filteredMembers.map((member) => {
                const isSelected = selectedMembers.find(
                  (m) => m.id === member.id
                );
                return (
                  <li
                    key={member.id}
                    className={`choice ${isSelected ? "checked" : ""}`}
                    style={{ marginBottom: "8px", cursor: "pointer" }}
                    onClick={() => handleSelectMember(member)}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                      }}
                    >
                      {/* {isSelected ? <CheckmarkSquare01Icon /> : <SquareIcon />} */}
                      <div
                        className={`custom-checkbox ${isSelected ? "checked" : ""
                          }`}
                      >
                        <svg viewBox="0 0 24 24" className="checkmark">
                          <path d="M5 12l5 5L19 7" />
                        </svg>
                      </div>

                      <div className="member">
                        <div className="row">
                          <div className="profile-place-holder">
                            <NamesInitials
                              fullName={`${member?.user?.first_name} ${member?.user?.last_name}`}
                            />
                          </div>
                          <div className="column">
                            <div className="name">
                              {member?.user?.first_name}{" "}
                              {member?.user?.last_name}
                            </div>
                            <span className="position">
                              {member?.user?.position || "Unavailable"}
                            </span>
                          </div>
                        </div>
                        <div className="column">
                          <h5>Department</h5>
                          <span className="department">
                            {member?.department?.name || "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </label>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {/* Step 3: Success Message */}
      {currentStep === 3 && (
        <div className="final-step">
          <h2>Add Members</h2>
          <div className="final-step-container">
            <div className="smessage">
              <div className="check-mark">
                <CheckCheck size={46} />
              </div>

              <h3>Review Group Added Successfully</h3>
              <p className="description">
                Your new review group has been created and members have been
                added.
              </p>
            </div>
            <div className="success-btn">
              <Link to={`/permissions/review-groups/${groupId}/members/`}
                className="visit-btn"
              >
                Visit Group Details
              </Link>
              <button className="back-btn">Back To List</button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="action-buttons">
        {currentStep > 1 && currentStep < 3 ? (
          <button className="third-button" onClick={handleBackStep}>
            Back
          </button>
        ) : currentStep === 1 ? (
          <button className="third-button">Discard</button>
        ) : null}

        {currentStep === 1 && (
          <button className="primary-button" onClick={handleNextStep}>
            {continuing ? "Continuing..." : "Continue"}
          </button>
        )}

        {currentStep === 2 && (
          <button
            className="primary-button"
            onClick={handleAddMember}
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Member"}
          </button>
        )}
      </div>
    </div>
  );
};

export default NewReviewGroupForm;
