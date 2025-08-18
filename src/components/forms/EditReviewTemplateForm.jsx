import React, { useState } from "react";
import api from "@/utils/api";

import { CheckIcon } from "lucide-react";
import "../../styles/_components.scss";
import "../../styles/_forms.scss";
import { useRouter } from "next/navigation";

const incidentOptions = [
  "General Patient Visitor",
  "General Patient Visitor Grievance",
  "Workplace Violence",
  "Medication Error",
  "Lost and Found",
  "Staff Incident",
  "Adverse Drug Reaction",
];

const EditReviewTemplateForm = ({ discardFn, data }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [incidentType, setIncidentType] = useState(data?.incident_type);
  const [name, setName] = useState(data?.name);
  const [description, setDescription] = useState(data?.description);
  const [continuing, setContinuing] = useState(false);

  const goToDetails = (id) => {
    router.push(`/permissions/review-templates/${data.id}/`);
  };
  const refreshPage = () => {
    router.push(`/accounts/`);
  };
  const handleNextStep = async () => {
    if (currentStep === 1) {
      if (!incidentType || !name.trim() || !description.trim()) {
        alert("Please fill in all fields.");
        return;
      }

      const payload = {
        incident_type: incidentType,
        name,
        description,
      };

      setContinuing(true);
      try {
        const response = await api.put(
          `/permissions/review-templates/${data.id}/`,
          payload
        );

        if (response.status === 201 || response.status === 200) {
          setCurrentStep((prev) => prev + 1);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Error editing review template:", error);
        alert("Failed to edit review template .");
      } finally {
        setContinuing(false);
      }
    }
  };

  return (
    <div className="review-groups-form">
      {/* Step 1: Form */}
      {currentStep === 1 && (
        <div className="step-one">
          <form>
            <h3>Edit Review Template</h3>

            <div className="field">
              <label htmlFor="incident">Incident Type</label>
              <select
                name="incident"
                id="incident"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
              >
                <option value="">Select an Incident Type</option>
                {incidentOptions.map((incident) => (
                  <option key={incident} value={incident}>
                    {incident}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="name">Template Name</label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Template Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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

          <div className="action-buttons">
            <button className="third-button" onClick={discardFn}>
              Discard
            </button>
            <button
              className="primary-button"
              onClick={(e) => {
                e.preventDefault();
                handleNextStep();
              }}
            >
              {continuing ? "Continuing..." : "Continue"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Confirmation */}
      {currentStep === 2 && (
        <div className="final-step">
          <h2>Update Review Template</h2>
          <div className="final-step-container">
            <div className="smessage">
              <div className="check-mark">
                <CheckIcon size={46} />
              </div>

              <h3>Template Updated Successfully</h3>
              <p className="description">Your template has been updated.</p>
            </div>
            <div className="success-btn">
              <button className="visit-btn" onClick={goToDetails}>
                Manage Template
              </button>
              <button onClick={refreshPage} className="back-btn">
                Back To List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditReviewTemplateForm;
