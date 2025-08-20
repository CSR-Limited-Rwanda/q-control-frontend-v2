"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
import api, {
  API_URL,
  cleanedData,
  checkCurrentAccount,
  calculateAge,
} from "@/utils/api";
import RichTexField from "@/components/forms/RichTextField";
import CustomDatePicker from "@/components/CustomDatePicker";
import Step1InfoForm from "./steps/Step1InfoForm";
import Step2ActionsForm from "./steps/Step2ActionsForm";
import Step3CompletionForm from "./steps/Step3CompletionForm";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";
import CustomTimeInput from "@/components/CustomTimeInput";
import {
  X,
  Square,
  SquareCheckBig,
  CircleCheck,
  MoveRight,
} from "lucide-react";
import { FacilityCard } from "@/components/DashboardContainer";
import DraftPopup from "@/components/DraftPopup";
import "../../../../styles/_forms.scss";
import { useAuthentication } from "@/context/authContext";
import CloseIcon from "@/components/CloseIcon";
import MessageComponent from "@/components/MessageComponet";

const LostAndFoundForm = ({ togglePopup }) => {
  const { user } = useAuthentication();
  const [currentFacility, setCurrentFacility] = useState(user.facility);
  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("lost-property");
  const [reporterFirstName, setReporterFirstName] = useState("");
  const [reporterLastName, setReporterLastName] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [dateReporting, setDateReporting] = useState("");
  const [timeReporting, setTimeReporting] = useState("");
  const [dateFound, setDateFound] = useState("");
  const [propertyName, setPropertyName] = useState("");

  const [dateBirth, setDateBirth] = useState("");
  const [age, setAge] = useState("");

  const [timeFound, setTimeFound] = useState("");
  const [relationship, setRelationship] = useState("");
  const [descriptionOfProperty, setDescriptionOfProperty] = useState("");
  const [location, setLocation] = useState("");
  const [locationReturned, setLocationReturned] = useState("");
  const [personWhoFoundPropertyFirstName, setPersonWhoFoundPropertyFirstName] =
    useState("");
  const [personWhoFoundPropertyLastName, setPersonWhoFoundPropertyLastName] =
    useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [checkboxReturnedChecked, setCheckboxReturnedChecked] = useState(false);
  const [propertyReturnedTo, setPropertyReturnedTo] = useState("");
  const [dateReturned, setDateReturned] = useState("");
  const [timeReturned, setTimeReturned] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [departmentId, setDepartmentId] = useState(
    localStorage.getItem("departmentId")
  );

  function formatTime(time) {
    if (!time) return undefined;
    const [h, m] = time.split(":");
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}:00`;
  }

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("updateNewIncident", "false");
    const handleKeyDown = (event) => {
      // Check if Ctrl or Alt key is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepRef.current < 2) {
          document.getElementById("continue-button").click();
        } else if (currentStepRef.current === 2) {
          document.getElementById("save-button").click();
        } else {
          return;
        }
      }

      if (event.ctrlKey || event.altKey) {
        switch (event.key) {
          case "s": // Ctrl + S
            event.preventDefault(); // Prevent default browser action
            if (currentStepRef.current < 2) {
              document.getElementById("continue-button").click();
            } else if (currentStepRef.current === 2) {
              document.getElementById("save-button").click();
            } else {
              return;
            }
            break;
          case "b":
            event.preventDefault();
            if (currentStepRef.current > 1 && currentStepRef.current <= 2) {
              document.getElementById("back-button").click();
            }

            break;
          case "f": // Ctrl + F
            event.preventDefault(); // Prevent default browser action
            document.getElementById("name").focus();
            break;
          case "e": // Ctrl + E
            event.preventDefault(); // Prevent default browser action
            document.getElementById("email").focus();
            break;
          default:
            break;
        }
      }
    };

    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const handleChange = (e) => {
    setSelectedOption(e.target.value);
    setCurrentStep(1);
  };

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);
    setDateBirth(date);
    setAge(calculatedAge);
  };

  async function postStepOne() {
    const data = {
      current_step: currentStep,
      facility_id: user.facility.id,
      department: departmentId,
      report_facility_id: currentFacility?.id,
      reported_by: {
        first_name: reporterFirstName,
        last_name: reporterLastName,
        profile_type: "Patient",
      },
      property_name: propertyName,
      item_description: descriptionOfProperty,
      date_reported: dateReporting,
      time_reported: timeReporting,
      relation_to_patient: relationship,
      taken_by: {
        first_name: patientFirstName,
        last_name: patientLastName,
        profile_type: "Staff",
      },

      status: "Draft",
    };

    try {
      const response = await api.post(
        `${API_URL}/incidents/lost-found/`,
        cleanedData(data)
      );

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("lost_found_id", response.data.id);
        toast.success("Data posted successfully");
        localStorage.setItem("updateNewIncident", "true");
        if (currentStep <= 3) {
          setCurrentStep(currentStep + 1);
        }

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to post data";
      toast.error(errorMessage);
    }
  }

  async function patchData(data) {
    const lostFoundId = localStorage.getItem("lost_found_id");
    const payload = cleanedData(data);

    try {
      const response = await api.put(
        `${API_URL}/incidents/lost-found/${lostFoundId}/`,
        payload
      );

      toast.success("Data posted successfully");

      if (currentStep <= 4) {
        setCurrentStep(currentStep + 1);
      }

      if (currentStep === 4) {
        postDocumentHistory(lostFoundId, "added a new incident", "create");
        localStorage.setItem("updateNewIncident", "false");
      }
    } catch (error) {
      console.error("PATCH ERROR:", error);
      if (error.response?.data) {
        console.error(
          "SERVER ERROR:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      toast.error("Failed to post data");
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveChange = async () => {
    if (currentStep === 2) {
      const isValid = validateStep({
        action_taken: actionTaken,
        ...(checkboxReturnedChecked && {
          returned_to: propertyReturnedTo,
          date_returned: dateReturned,
          time_returned: timeReturned,
          location_returned: locationReturned,
        }),
        ...(checkboxChecked && {
          location_found: location,
          date_found: dateFound,
          time_found: timeFound,
        }),
      });

      const data = {
        current_step: currentStep,
        action_taken: actionTaken,
        ...(checkboxReturnedChecked && {
          returned_to: propertyReturnedTo,
          date_returned: dateReturned,
          time_returned: timeReturned,
          location_returned: locationReturned,
        }),
        ...(checkboxChecked && {
          location_found: location,
          date_found: dateFound,
          time_found: formatTime(timeFound),
          is_found: checkboxChecked ? "True" : "False",
          found_by: {
            first_name: personWhoFoundPropertyFirstName,
            last_name: personWhoFoundPropertyLastName,
            profile_type: "Visitor",
          },
        }),
      };
      if (isValid) {
        setIsLoading(true);
        patchData(data);
      } else {
        toast.error("Please fill in all required fields.");
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const isValid = validateStep({
        "Reporter first name": reporterFirstName,
        "Reporter last name": reporterLastName,
        "Patient first name": patientFirstName,
        "Patient last name": patientLastName,
        "Date Reporting": dateReporting,
        "Time Reporting": timeReporting,
        "Property Name": propertyName,
        "Description Of Property": descriptionOfProperty,
      });

      if (isValid) {
        setIsLoading(true);
        if (localStorage.getItem("updateNewIncident") === "false") {
          postStepOne();
        }

        if (localStorage.getItem("updateNewIncident") === "true") {
          patchData({
            current_step: currentStep,
            reported_by: {
              first_name: reporterFirstName,
              last_name: reporterLastName,
              profile_type: "Patient",
            },
            property_name: propertyName,
            item_description: descriptionOfProperty,
            date_reported: dateReporting,
            time_reported: timeReporting,
            relation_to_patient: relationship,
            person_reporting_info: {
              first_name: patientFirstName,
              last_name: patientLastName,
              profile_type: "Staff",
            },

            status: "Draft",
          });
        }
      } else {
        toast.error("Please fill in all required fields.");
      }
    }
  };

  const handlePreviousStep = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
  };

  const handleCheckboxChange = () => {
    setCheckboxChecked(!checkboxChecked);
  };

  const handleCheckboxReturn = () => {
    setCheckboxReturnedChecked(!checkboxReturnedChecked);
  };

  const handleCurrentFacility = (facilityId) => {
    const selectedFacility = user?.accounts?.find(
      (facility) => facility.id === parseInt(facilityId)
    );
    setCurrentFacility(selectedFacility);
  };

  return (
    <div className="form-container">
      <div className="forms-header">
        <h2>Lost and Found Property Report</h2>
        <CloseIcon
          onClick={() => {
            togglePopup();
            localStorage.setItem("updateNewIncident", "false");
          }}
        />
        {currentStep < 3 ? (
          <div className="form-steps">
            <div className={currentStep === 1 ? "step current-step" : "step"}>
              <div className="icon">
                <CircleCheck size={32} />
              </div>
              <div className="name">
                <p className="step-name">Step 1/2</p>
                <p className="step-details">Person taking report Info</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 2 ? "step current-step" : "step"}>
              <div className="icon">
                <CircleCheck size={32} />
              </div>
              <div className="name">
                <p className="step-name">Step 2/2</p>
                <p className="step-details">Actions taken</p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* <FacilityCard /> */}
        <DraftPopup
          incidentString="lost_and_found"
          incidentType="lost_and_found"
        />
      </div>
      {currentStep === 1 && (
        <select
          className="facility-card"
          name="facility"
          id="facility"
          value={currentFacility?.id || ""}
          onChange={(e) => handleCurrentFacility(e.target.value)}
        >
          {user?.accounts?.map((facility) => (
            <option key={facility.id} value={facility.id}>
              Submitting for {facility.name}
            </option>
          ))}
        </select>
      )}

      <form className="newIncidentForm">
        {currentStep === 1 && (
          <Step1InfoForm
            reporterFirstName={reporterFirstName}
            setReporterFirstName={setReporterFirstName}
            reporterLastName={reporterLastName}
            setReporterLastName={setReporterLastName}
            patientFirstName={patientFirstName}
            setPatientFirstName={setPatientFirstName}
            patientLastName={patientLastName}
            setPatientLastName={setPatientLastName}
            dateReporting={dateReporting}
            setDateReporting={setDateReporting}
            timeReporting={timeReporting}
            setTimeReporting={setTimeReporting}
            relationship={relationship}
            setRelationship={setRelationship}
            propertyName={propertyName}
            setPropertyName={setPropertyName}
            descriptionOfProperty={descriptionOfProperty}
            setDescriptionOfProperty={setDescriptionOfProperty}
          />
        )}

        {currentStep === 2 && (
          <Step2ActionsForm
            actionTaken={actionTaken}
            setActionTaken={setActionTaken}
            checkboxChecked={checkboxChecked}
            handleCheckboxChange={handleCheckboxChange}
            location={location}
            setLocation={setLocation}
            dateFound={dateFound}
            setDateFound={setDateFound}
            timeFound={timeFound}
            setTimeFound={setTimeFound}
            personWhoFoundPropertyFirstName={personWhoFoundPropertyFirstName}
            setPersonWhoFoundPropertyFirstName={setPersonWhoFoundPropertyFirstName}
            personWhoFoundPropertyLastName={personWhoFoundPropertyLastName}
            setPersonWhoFoundPropertyLastName={setPersonWhoFoundPropertyLastName}
            checkboxReturnedChecked={checkboxReturnedChecked}
            handleCheckboxReturn={handleCheckboxReturn}
            locationReturned={locationReturned}
            setLocationReturned={setLocationReturned}
            propertyReturnedTo={propertyReturnedTo}
            setPropertyReturnedTo={setPropertyReturnedTo}
            dateReturned={dateReturned}
            setDateReturned={setDateReturned}
            timeReturned={timeReturned}
            setTimeReturned={setTimeReturned}
          />
        )}

        {currentStep === 3 && <Step3CompletionForm />}
      </form>
      <div className="incident-form-buttons">
        {currentStep > 1 && currentStep <= 2 && (
          <button
            onClick={handlePreviousStep}
            id="back-button"
            className="incident-back-btn"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back</span>
          </button>
        )}

        {currentStep === 2 ? (
          <button
            className="primary-button"
            id="save-button"
            onClick={handleSaveChange}
          >
            <span>{isLoading ? "Processing..." : "Save Incident"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          currentStep < 2 && (
            <>
              <button
                onClick={togglePopup}
                id="continue-button"
                className="incident-back-btn"
              >
                <span>Cancel</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
              <button
                onClick={handleNextStep}
                id="continue-button"
                className="primary-button"
              >
                <span>{isLoading ? "Processing..." : "Continue"}</span>
                <MoveRight />
              </button>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default LostAndFoundForm
