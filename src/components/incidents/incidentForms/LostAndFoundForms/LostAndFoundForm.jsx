"use client";
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
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";
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

const LostAndFoundForm = ({ togglePopup }) => {
  const { user } = useAuthentication()
  const [currentFacility, setCurrentFacility] = useState(user.facility)
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
  )

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
        window.customToast.success("Data posted successfully");
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
      window.customToast.error(errorMessage);
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

      window.customToast.success("Data posted successfully");

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
      window.customToast.error("Failed to post data");
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
    const selectedFacility = user?.accounts?.find(facility => facility.id === parseInt(facilityId));
    setCurrentFacility(selectedFacility);
  };

  return (
    <div className="forms-container">
      <div className="forms-header">
        <h2>Lost and Found Property Report</h2>
        <X
          className="close-popup"
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
        <select className="facility-card" name="facility" id="facility" value={currentFacility?.id || ""} onChange={(e) => handleCurrentFacility(e.target.value)}>
          {
            user?.accounts?.map((facility) => (
              <option key={facility.id} value={facility.id}>
                Submitting for  {facility.name}
              </option>
            ))
          }
        </select>
      )}

      <form className="newIncidentForm">
        {currentStep === 1 && (
          <div className="step">
            <div className="half">
              <div className="field">
                <label htmlFor="reporterFirstName">
                  Person taking report first name:
                </label>
                <input
                  onChange={(e) => setReporterFirstName(e.target.value)}
                  value={reporterFirstName}
                  type="text"
                  name="reporterFirstName"
                  id="reporterFirstName"
                  placeholder="Enter first name"
                />
              </div>
              <div className="field">
                <label htmlFor="reporterLastName">
                  Person taking report last name:
                </label>
                <input
                  onChange={(e) => setReporterLastName(e.target.value)}
                  value={reporterLastName}
                  type="text"
                  name="reporterLastName"
                  id="reporterLastName"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div className="half">
              <div className="field">
                <label htmlFor="dateOfReporting">Date Reported</label>
                <CustomDatePicker
                  selectedDate={dateReporting}
                  setSelectedDate={setDateReporting}
                />
              </div>

              <div className="field">
                <label htmlFor="timeOfReporting">Time Reported</label>
                <CustomTimeInput setTime={setTimeReporting} />
              </div>
            </div>
            <div className="col">
              <label htmlFor="patientFirstName">
                Name of Patient, Patient Representative, or other individual
                reporting loss:
              </label>
              <div className="half">
                <div className="field name">
                  <input
                    onChange={(e) => setPatientFirstName(e.target.value)}
                    value={patientFirstName}
                    type="text"
                    name="patientFirstName"
                    id="patientFirstName"
                    placeholder="Enter first name"
                  />
                </div>
                <div className="field name">
                  <input
                    onChange={(e) => setPatientLastName(e.target.value)}
                    value={patientLastName}
                    type="text"
                    name="patientLastName"
                    id="patientLastName"
                    placeholder="Enter last name"
                  />
                </div>
              </div>
            </div>
            <div className="field name">
              <label htmlFor="relationship">
                Relationship to Patient (if applicable):
              </label>
              <input
                onChange={(e) => setRelationship(e.target.value)}
                value={relationship}
                type="text"
                name="relationship"
                id="relationship"
                placeholder="Enter Relationship"
              />
            </div>
            <div className="field name">
              <label htmlFor="propertyName">Property Name</label>
              <input
                onChange={(e) => setPropertyName(e.target.value)}
                value={propertyName}
                type="text"
                name="propertyName"
                id="propertyName"
                placeholder="Enter Property name"
              />
            </div>
            <div className="field name">
              <label htmlFor="descriptionOfProperty">
                Full description of the missing, lost, or misplaced property
                (including money):
              </label>
              <RichTexField
                value={descriptionOfProperty}
                onEditorChange={setDescriptionOfProperty}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="step">
            <div className="field name">
              <label htmlFor="actionTaken">
                Actions taken to locate the missing, lost, or misplaced
                property:
              </label>
              <RichTexField
                value={actionTaken}
                onEditorChange={setActionTaken}
              />
            </div>

            <div onClick={handleCheckboxChange} className="field checkbox">
              {checkboxChecked ? (
                <SquareCheckBig size={20} />
              ) : (
                <Square size={20} />
              )}
              <p>Check if missing, lost, or misplaced property was found</p>
            </div>
            {checkboxChecked && (
              <>
                <div className="field name">
                  <label htmlFor="location">
                    Location where property was found:
                  </label>
                  <input
                    onChange={(e) => setLocation(e.target.value)}
                    value={location}
                    type="text"
                    name="location"
                    id="location"
                    placeholder="Enter location found"
                  />
                </div>
                <div className="half">
                  <div className="field">
                    <label htmlFor="dateFound">Date Property Found</label>
                    <CustomDatePicker
                      selectedDate={dateFound}
                      setSelectedDate={setDateFound}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="timeFound">Time property Found</label>
                    <CustomTimeInput setTime={setTimeFound} />
                  </div>
                </div>
                <div className="half">
                  <div className="field name">
                    <label htmlFor="personWhoFoundPropertyFirstName">
                      First Name of person who found property:
                    </label>
                    <input
                      onChange={(e) =>
                        setPersonWhoFoundPropertyFirstName(e.target.value)
                      }
                      value={personWhoFoundPropertyFirstName}
                      type="text"
                      name="personWhoFoundPropertyFirstName"
                      id="personWhoFoundPropertyFirstName"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="field name">
                    <label htmlFor="personWhoFoundPropertyLastName">
                      Last Name of person who found property:
                    </label>
                    <input
                      onChange={(e) =>
                        setPersonWhoFoundPropertyLastName(e.target.value)
                      }
                      value={personWhoFoundPropertyLastName}
                      type="text"
                      name="personWhoFoundPropertyLastName"
                      id="personWhoFoundPropertyLastName"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
              </>
            )}

            <div onClick={handleCheckboxReturn} className="field checkbox">
              {checkboxReturnedChecked ? (
                <SquareCheckBig size={20} />
              ) : (
                <Square size={20} />
              )}
              <p>Check if missing, lost, or misplaced property was returned</p>
            </div>

            {checkboxReturnedChecked && (
              <>
                <div className="half">
                  <div className="field name">
                    <label htmlFor="location">
                      Location where property was returned:
                    </label>
                    <input
                      onChange={(e) => setLocationReturned(e.target.value)}
                      value={locationReturned}
                      type="text"
                      name="locationReturned"
                      id="locationReturned"
                      placeholder="Enter location returned"
                    />
                  </div>
                  <div className="field name">
                    <label htmlFor="propertyReturnedTo">
                      Property returned to:
                    </label>
                    <input
                      onChange={(e) => setPropertyReturnedTo(e.target.value)}
                      value={propertyReturnedTo}
                      type="text"
                      name="propertyReturnedTo"
                      id="propertyReturnedTo"
                      placeholder="Enter Name"
                    />
                  </div>
                </div>

                <div className="half">
                  <div className="field">
                    <label htmlFor="dateReturned">
                      Date property was returned
                    </label>
                    <CustomDatePicker
                      selectedDate={dateReturned}
                      setSelectedDate={setDateReturned}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="timeReturned">Time property returned</label>
                    <CustomTimeInput setTime={setTimeReturned} />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {currentStep === 3 && <FormCompleteMessage />}
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

export default LostAndFoundForm;
