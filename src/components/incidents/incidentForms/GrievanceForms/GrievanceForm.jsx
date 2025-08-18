"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState, useRef } from "react";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
import api, {
  API_URL,
  calculateAge,
  checkCurrentAccount,
  cleanedData,
} from "@/utils/api";
import RichTexField from "@/components/forms/RichTextField";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";
import CustomDatePicker from "@/components/CustomDatePicker";
import FilesList from "../../documentHistory/FilesList";
import mediaAPI from "@/utils/mediaApi";
import CustomTimeInput from "@/components/CustomTimeInput";
import { X, CircleCheck, MoveRight, MoveLeft } from "lucide-react";
import { FacilityCard } from "@/components/DashboardContainer";
import DraftPopup from "@/components/DraftPopup";
import { useAuthentication } from "@/context/authContext";
import CloseIcon from "@/components/CloseIcon";
import MessageComponent from "@/components/MessageComponet";

const GrievanceForm = ({ togglePopup }) => {
  const { user } = useAuthentication();
  const [currentFacility, setCurrentFacility] = useState(user.facility);

  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);
  const [userId, setUserId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [incidentDate, setIncidentDate] = useState("");
  const [patientFirstName, setPatientFirstName] = useState("");
  const [patientLastName, setPatientLastName] = useState("");
  const [medicalRecord, setMedicalRecord] = useState("");
  const [formInitiatedByFirstName, setFormInitiatedByFirstName] = useState("");
  const [formInitiatedByLastName, setFormInitiatedByLastName] = useState("");
  const [formInitiatedByTitle, setFormInitiatedByTitle] = useState("");
  const [complaintByFirstName, setComplaintByFirstName] = useState("");
  const [complaintByLastName, setComplaintByLastName] = useState("");
  const [patientRelationship, setPatientRelationship] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [complaintOrConcern, setComplaintOrConcern] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [dateBirth, setdateBirth] = useState("");
  const [age, setAge] = useState("");
  const [reviewActionTaken, setReviewActionTaken] = useState("");
  const [review, setReview] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(null);
  const [otherInput, setOtherInput] = useState("");
  const [feedbackDate, setFeedbackDate] = useState("");
  const [extensionLetterDate, setExtensionLetterDate] = useState("");
  const [responseLetterDate, setResponseLetterDate] = useState("");
  const [actionMeeting, setActionMeeting] = useState("");
  const [involvedPerson, setInvolvedPerson] = useState("");
  const [actionTelephone, setActionTelephone] = useState("");
  const [relationshipToPatient, setRelationshipToPatient] = useState("");
  const [dateClosed, setDateClosed] = useState("");
  const [extensionLetterFile, setExtensionLetterFile] = useState("");
  const [responseLetterFile, setResponseLetterFile] = useState("");
  const maxFileSize = 12 * 1024 * 1024;
  const [adversePatientOutcome, setAdversePatientOutcome] = useState(false);
  const [notifiedAdministrator, setNotifiedAdministrator] = useState(false);
  const [outcome, setOutcome] = useState("");
  const [administratorFirstName, setAdministratorFirstName] = useState("");
  const [administratorLastName, setAdministratorLastName] = useState("");
  const [grivanceDate, setGrivanceDate] = useState("");
  const [grivanceTime, setGrivanceTime] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  const handleAdversePatientOutcome = () => {
    setAdversePatientOutcome((prev) => !prev);
  };
  const [departmentId, setDepartmentId] = useState(
    localStorage.getItem("departmentId")
  );

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);
    setdateBirth(date);
    setAge(calculatedAge);
  };
  // const handleIsAnonymous = (e) => {
  //   setIsAnonymous(e.target.value === "true");
  // };
  const handleNotifiedAdministrator = () => {
    setNotifiedAdministrator((prev) => !prev);
  };

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("updateNewIncident", "false");
    const handleKeyDown = (event) => {
      // Check if Ctrl or Alt key is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepRef.current < 3) {
          document.getElementById("continue-button").click();
        } else if (currentStepRef.current === 3) {
          document.getElementById("save-button").click();
        } else {
          return;
        }
      }

      if (event.ctrlKey || event.altKey) {
        switch (event.key) {
          case "s": // Ctrl + S
            event.preventDefault(); // Prevent default browser action
            if (currentStepRef.current < 3) {
              document.getElementById("continue-button").click();
            } else if (currentStepRef.current === 3) {
              document.getElementById("save-button").click();
            } else {
              return;
            }
            break;
          case "b":
            event.preventDefault();
            if (currentStepRef.current > 1 && currentStepRef.current <= 3) {
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

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  async function postStepOne() {
    const data = {
      current_step: currentStep,
      facility_id: user.facility.id,
      department: user.department.id,
      report_facility_id: currentFacility?.id,
      date: incidentDate,
      patient_name: {
        first_name: patientFirstName,
        last_name: patientLastName,
        profile_type: "Patient",
        age: age,
        date_of_birth: dateBirth,
        medical_record_number: medicalRecord,
      },

      form_initiated_by: {
        first_name: formInitiatedByFirstName,
        last_name: formInitiatedByLastName,
        profile_type: "Staff",
      },

      complaint_made_by: {
        first_name: complaintByFirstName,
        last_name: complaintByLastName,
        profile_type: "Patient",
        // phone_number: phoneNumber,
      },
      relationship_to_patient: patientRelationship,
      status: "Draft",
      title: formInitiatedByTitle,
      source_of_information:
        selectedOption === "other"
          ? otherInput
          : selectedOption
            ? selectedOption
            : null,
    };

    try {
      const response = await api.post(
        `${API_URL}/incidents/grievance/`,
        cleanedData(data)
      );

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("grievance_id", response.data.id);
        localStorage.setItem("updateNewIncident", "true");

        setUserId(response.data.created_by);
        toast.success("Data saved successfully");
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      if (error.response) {
        toast.error(
          error.response?.data.message ||
          error.response?.data.error ||
          "Error while saving incident"
        );
      } else {
        toast.error("Unknown error while saving incident");
      }
    }
  }

  async function patchData(data) {
    try {
      const grievance_id = localStorage.getItem("grievance_id");
      const response = await api.put(
        `${API_URL}/incidents/grievance/${grievance_id}/`,
        data
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Data saved successfully");
        setCurrentStep(currentStep + 1);
        setIsLoading(false);

        if (currentStep === 4) {
          postDocumentHistory(grievance_id, "added a new incident", "create");
          localStorage.setItem("updateNewIncident", "false");
        }
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Failed to post data");
      toast.error(error.message);
    }
  }

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
    // setInputValue("");
  };
  const handlePhoneNumberChange = (e) => {
    const newValue = e.target.value;
    // Check if the new value is a valid number or an empty string
    if (newValue === "" || !isNaN(newValue)) {
      setPhoneNumber(newValue);
    }
  };

  const handleNextStep = () => {
    let isValid = true;

    if (currentStep === 1) {
      if (selectedOption === "other") {
        isValid = validateStep({
          "incident date": incidentDate,
          "patient first name": patientFirstName,
          "patient last name": patientLastName,
          "date of birth": dateBirth,
          age: age,
          "form initiated by first name": formInitiatedByFirstName,
          "form initiated by last name": formInitiatedByLastName,
          "complaint by first name": complaintByFirstName,
          "complaint by last name": complaintByLastName,
          "patient relationship": patientRelationship,
          "phone number": phoneNumber,
          "form initiated by title": formInitiatedByTitle,
          "source of information input": otherInput,
        });
      } else {
        isValid = validateStep({
          "incident date": incidentDate,
          "patient first name": patientFirstName,
          "patient last name": patientLastName,
          "form initiated by first name": formInitiatedByFirstName,
          "form initiated by last name": formInitiatedByLastName,
          "complaint by first name": complaintByFirstName,
          "complaint by last name": complaintByLastName,
          "patient relationship": patientRelationship,
          "phone number": phoneNumber,
          "form initiated by title": formInitiatedByTitle,
          "source of information": selectedOption,
        });
      }
      if (isValid) {
        if (localStorage.getItem("updateNewIncident") === "false") {
          postStepOne();
        }

        if (localStorage.getItem("updateNewIncident") === "true") {
          patchData({
            current_step: currentStep,
            user_id: userId,
            date: incidentDate,

            patient_name: {
              first_name: patientFirstName,
              last_name: patientLastName,
              profile_type: "Patient",
            },

            // medical_record_number: medicalRecord,
            form_initiated_by: {
              first_name: formInitiatedByFirstName,
              last_name: formInitiatedByLastName,
              profile_type: "Staff",
            },

            complaint_made_by: {
              first_name: administratorFirstName,
              last_name: administratorLastName,
              profile_type: "Patient",
              phone_number: phoneNumber,
              age: age,
              date_of_birth: dateBirth,
            },
            relationship_to_patient: patientRelationship,
            status: "Draft",
            title: formInitiatedByTitle,
            source_of_information:
              selectedOption === "other"
                ? otherInput
                : selectedOption
                  ? selectedOption
                  : null,
          });
        }
      } else {
        toast.error("Please fill in all required fields.");
      }
    } else if (currentStep === 2) {
      isValid = validateStep({
        "complaint or concern": complaintOrConcern,
        "action taken": actionTaken,
      });

      if (adversePatientOutcome && !outcome.trim()) {
        toast.error(
          "Please identify outcome for adverse patient outcome."
        );
        isValid = false;
      }

      if (isValid) {
        patchData({
          current_step: currentStep,
          user_id: userId,
          complaint_or_concern: complaintOrConcern,
          initial_corrective_actions: actionTaken,
          adverse_patient_outcome: adversePatientOutcome,
          outcome: outcome,
        });
      } else {
        toast.error("Please fill in all required fields.");
        return;
      }
    } else if (currentStep === 3) {
      if (notifiedAdministrator) {
        isValid = validateStep({
          // Anonymous: isAnonymous !== null,
          "Administrator first name": administratorFirstName,
          "Administrator last name": administratorLastName,
          "grivance date": grivanceDate,
          "grivance time": grivanceTime,
        });

        if (isValid) {
          patchData({
            current_step: currentStep,
            user_id: userId,
            // anonymous: isAnonymous,
            administrator_notified: {
              first_name: administratorFirstName,
              last_name: administratorLastName,
              profile_type: "Staff",
            },
            notification_date: grivanceDate,
            notification_time: grivanceTime,
            status: "Open",
          });
        } else {
          toast.error("Please fill in all required fields.");
        }
      } else {
        patchData({
          current_step: currentStep,
          user_id: userId,
          administrator_notified: {
            first_name: "N/A",
            last_name: "N/A",
            profile_type: "Staff",
          },
          notification_date: null,
          notification_time: null,
          status: "Open",
        });
      }
    } else if (currentStep === 4) {
      isValid = validateStep({
        "feedback date": feedbackDate,
        "Involved Person": involvedPerson,
        "relationship to patient": relationshipToPatient,
      });
      if (!actionMeeting && !actionTelephone) {
        toast.error("Please select at least one option.");
        isValid = false;
      }
    }

    if (!isValid) {
      return;
    }

    setIsLoading(true);
  };

  const handlePreviousStep = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
  };

  const handleFileChange = async (event) => {
    const formData = new FormData();
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const grievance_id = localStorage.getItem("grievance_id");
      setUploadingDocuments(true);

      const response = await mediaAPI.post(
        `/incidents/grievance/${grievance_id}/documents/`,
        formData
      );

      if (response.status === 201 || response.status === 200) {
        setUploadingDocuments(false);
        toast.success("Files uploaded successfully");
        setUploadedFiles(response.data.files);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setUploadingDocuments(false);
    }
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
        <h2>Patient/Patient Representative Grievance Form</h2>
        <CloseIcon
          onClick={() => {
            togglePopup();
            localStorage.setItem("updateNewIncident", "false");
          }}
        />

        {currentStep < 4 ? (
          <div className="form-steps">
            <div className={currentStep === 1 ? "step current-step" : "step"}>
              <div className="icon">
                <CircleCheck size={32} />
              </div>
              <div className="name">
                <p className="step-name">Step 1/3</p>
                <p className="step-details">Patient Information</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 2 ? "step current-step" : "step"}>
              <div className="icon">
                <CircleCheck size={32} />
              </div>
              <div className="name">
                <p className="step-name">Step 2/3</p>
                <p className="step-details">Complaints details</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 3 ? "step current-step" : "step"}>
              <div className="icon">
                <CircleCheck size={32} />
              </div>
              <div className="name">
                <p className="step-name">Step 3/3</p>
                <p className="step-details">
                  Administrator details & Attachments
                </p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {/* <FacilityCard /> */}
        <DraftPopup
          incidentString="grievance"
          incidentType="grievance_incident"
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
        {currentStep === 1 ? (
          <div className="step">
            <div className="field">
              <label htmlFor="incidentDate">Date</label>

              <CustomDatePicker
                selectedDate={incidentDate}
                setSelectedDate={setIncidentDate}
              />
            </div>
            <div className="half">
              <div className="field">
                <label htmlFor="patientFirstName">Patient first name</label>
                <input
                  onChange={(e) => setPatientFirstName(e.target.value)}
                  value={patientFirstName}
                  type="text"
                  name="patientFirstName"
                  id="patientFirstName"
                  placeholder="Enter patient first name"
                />
              </div>
              <div className="field">
                <label htmlFor="patientLastName">Patient last name</label>
                <input
                  onChange={(e) => setPatientLastName(e.target.value)}
                  value={patientLastName}
                  type="text"
                  name="patientLastName"
                  id="patientLastName"
                  placeholder="Enter patient last name"
                />
              </div>
            </div>

            <div className="half">
              <div className="date-of-injury field">
                <label htmlFor="dateBirth">Date of birth</label>

                <CustomDatePicker
                  selectedDate={dateBirth}
                  setSelectedDate={handleDateOfBirth}
                />
              </div>

              <div className="field job-title">
                <label htmlFor="age">Age</label>
                <input
                  onChange={(e) => setAge(e.target.value)}
                  value={age}
                  type="number"
                  name="age"
                  id="age"
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="medicalRecord">
                Medical record number (if any)
              </label>
              <input
                onChange={(e) => setMedicalRecord(e.target.value)}
                value={medicalRecord}
                type="text"
                name="medicalRecord"
                id="medicalRecord"
                placeholder="Enter medical record number"
              />
            </div>
            <div className="half">
              <div className="field">
                <label htmlFor="formInitiatedByFirstName">
                  Form initiated by first name
                </label>
                <input
                  onChange={(e) => setFormInitiatedByFirstName(e.target.value)}
                  value={formInitiatedByFirstName}
                  type="text"
                  name="formInitiatedByFirstName"
                  id="formInitiatedByFirstName"
                  placeholder="Enter first name"
                />
              </div>
              <div className="field">
                <label htmlFor="formInitiatedByLastName">
                  Form initiated by last name
                </label>
                <input
                  onChange={(e) => setFormInitiatedByLastName(e.target.value)}
                  value={formInitiatedByLastName}
                  type="text"
                  name="formInitiatedByLastName"
                  id="formInitiatedByLastName"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="half">
              <div className="field">
                <label htmlFor="formInitiatedByTitle">Title</label>
                <input
                  onChange={(e) => setFormInitiatedByTitle(e.target.value)}
                  value={formInitiatedByTitle}
                  type="text"
                  name="formInitiatedByTitle"
                  id="formInitiatedByTitle"
                  placeholder="Enter title"
                />
              </div>
            </div>
            <div className="half">
              <div className="field">
                <label htmlFor="complaintByFirstName">
                  Complaint by first name:
                </label>
                <input
                  onChange={(e) => setComplaintByFirstName(e.target.value)}
                  value={complaintByFirstName}
                  type="text"
                  name="complaintByFirstName"
                  id="complaintByFirstName"
                  placeholder="Enter first name"
                />
              </div>
              <div className="field">
                <label htmlFor="complaintBy">Complaint by last name:</label>
                <input
                  onChange={(e) => setComplaintByLastName(e.target.value)}
                  value={complaintByLastName}
                  type="text"
                  name="complaintByLastName"
                  id="complaintByLastName"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="half">
              <div className="field">
                <label htmlFor="patientRelationship">
                  Relationship to patient
                </label>
                <input
                  onChange={(e) => setPatientRelationship(e.target.value)}
                  value={patientRelationship}
                  type="text"
                  name="patientRelationship"
                  id="patientRelationship"
                  placeholder="Enter relationship"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                onChange={handlePhoneNumberChange}
                value={phoneNumber}
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder=" Enter phone number"
              />
            </div>

            <div className="field">
              <label htmlFor="phoneNumber">Source of information</label>
              <div className="half">
                <div className="check-box">
                  <input
                    type="radio"
                    name="source_of_information"
                    id="survey"
                    value="survey"
                    onChange={handleOptionChange}
                    checked={selectedOption === "survey"}
                  />
                  <label htmlFor="survey">Patient satisfaction survey</label>
                </div>

                <div className="check-box">
                  <input
                    type="radio"
                    name="source_of_information"
                    id="letter"
                    value="letter"
                    onChange={handleOptionChange}
                    checked={selectedOption === "letter"}
                  />
                  <label htmlFor="letter">Letter</label>
                </div>
                <div className="check-box">
                  <input
                    type="radio"
                    name="source_of_information"
                    value="leadershipRounds"
                    id="leadershipRounds"
                    onChange={handleOptionChange}
                    checked={selectedOption === "leadershipRounds"}
                  />
                  <label htmlFor="leadershipRounds">Leadership Rounds</label>
                </div>
                <div className="check-box">
                  <input
                    type="radio"
                    name="source_of_information"
                    id="verbalReport"
                    value="verbalReport"
                    onChange={handleOptionChange}
                    checked={selectedOption === "verbalReport"}
                  />
                  <label htmlFor="verbalReport">
                    Verbal Report form patient and /or visitor
                  </label>
                </div>
                <div className="check-box">
                  <input
                    type="radio"
                    name="source_of_information"
                    id="other"
                    value="other"
                    onChange={handleOptionChange}
                    checked={selectedOption === "other"}
                  />
                  <label htmlFor="other">other</label>
                </div>
                <div>
                  {selectedOption === "other" && (
                    <input
                      type="text"
                      value={otherInput}
                      onChange={(e) => setOtherInput(e.target.value)}
                      placeholder="Enter Source Of Infromation"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === 2 ? (
          <div className="step">
            <div className="field">
              <label htmlFor="complaintOrConcern">Complaint or Concern:</label>
              <RichTexField
                value={complaintOrConcern}
                onEditorChange={setComplaintOrConcern}
              />
              {/* <textarea
                onChange={(e) => setComplaintOrConcern(e.target.value)}
                value={complaintOrConcern}
                name="complaintOrConcern"
                id="complaintOrConcern"
                rows="6"
                placeholder="Enter description"
              ></textarea> */}
            </div>
            <div className="field">
              <label htmlFor="actionTaken">
                What were the initial corrective actions taken to resolve the
                complaint?
              </label>
              <RichTexField
                value={actionTaken}
                onEditorChange={setActionTaken}
              />
              {/* <textarea
                onChange={(e) => setActionTaken(e.target.value)}
                value={actionTaken}
                name="actionTaken"
                id="actionTaken"
                rows="6"
                placeholder="Enter description"
              ></textarea> */}
            </div>

            <div className="check-box">
              <input
                type="checkbox"
                name="adversePatientOutcome"
                id="adversePatientOutcome"
                checked={adversePatientOutcome}
                onChange={handleAdversePatientOutcome}
              />
              <label htmlFor="adversePatientOutcome">
                Check if there was an adverse patient outcome related to this
                complaint.
              </label>
            </div>
            {adversePatientOutcome ? (
              <div className="field">
                <label htmlFor="outcome">Identify outcome</label>

                <RichTexField value={outcome} onEditorChange={setOutcome} />
                {/* <textarea
                  name="outcome"
                  id="outcome"
                  rows="6"
                  placeholder="Enter outcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                ></textarea> */}
              </div>
            ) : null}
          </div>
        ) : currentStep === 3 ? (
          <div className="step">
            <div className="check-box">
              <input
                onChange={handleNotifiedAdministrator}
                checked={notifiedAdministrator}
                type="checkbox"
                name="notifiedAdministrator"
                id="notifiedAdministrator"
                value={notifiedAdministrator}
              />
              <label htmlFor="notifiedAdministrator">
                Check if administrator on call or designee was notified
              </label>
            </div>
            {notifiedAdministrator && (
              <>
                <div className="half">
                  <div className="field">
                    <label htmlFor="AdministratorFirstName">
                      First name of administrator on call or designee notified:
                    </label>
                    <input
                      type="text"
                      name="AdministratorFirstName"
                      id="AdministratorFirstName"
                      onChange={(e) =>
                        setAdministratorFirstName(e.target.value)
                      }
                      value={administratorFirstName}
                      placeholder="First name of administrator"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="AdministratorLastName">
                      Last name of administrator on call or designee notified:
                    </label>
                    <input
                      type="text"
                      name="AdministratorLastName"
                      id="AdministratorLastName"
                      onChange={(e) => setAdministratorLastName(e.target.value)}
                      value={administratorLastName}
                      placeholder="Last name of administrator"
                    />
                  </div>
                </div>
                <div className="half">
                  <div className="field">
                    <label htmlFor="grivanceDate">Date</label>

                    <CustomDatePicker
                      selectedDate={grivanceDate}
                      setSelectedDate={setGrivanceDate}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="grivanceTime">Time</label>
                    <CustomTimeInput
                      setTime={setGrivanceTime}
                      defaultTime={grivanceTime}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="field full">
              <h3>Attachments</h3>
              <FilesList documents={uploadedFiles} />

              {uploadingDocuments ? (
                "Uploading ..."
              ) : (
                <input
                  type="file"
                  onChange={handleFileChange}
                  name="files"
                  id="files"
                  multiple
                />
              )}
            </div>
            {/* <div className="field">
              <label htmlFor="isAnonymous">
                Do you want to submit this incident as anonymous?
              </label>
              <div className="types">
                <div className="type">
                  <input
                    onChange={handleIsAnonymous}
                    type="radio"
                    name="isAnonymous"
                    checked={isAnonymous === true}
                    id="yes"
                    value="true"
                  />
                  <label htmlFor="yes">Yes</label>
                </div>

                <div className="type">
                  <input
                    onChange={handleIsAnonymous}
                    type="radio"
                    name="isAnonymous"
                    id="no"
                    checked={isAnonymous === false}
                    value="false"
                  />
                  <label htmlFor="no">No</label>
                </div>
              </div>
            </div> */}
          </div>
        ) : currentStep === 4 ? (
          <FormCompleteMessage />
        ) : (
          ""
        )}
      </form>
      <div className="incident-form-buttons">
        {currentStep > 1 && currentStep < 4 ? (
          <button onClick={handlePreviousStep} className="incident-back-btn">
            <MoveLeft />
            <span>back</span>
          </button>
        ) : (
          ""
        )}

        {currentStep < 3 ? (
          <button
            onClick={handleNextStep}
            id="continue-button"
            className="primary-button"
          >
            <span>{isLoading ? "Processing..." : "Save & Continue"}</span>
            <MoveRight />
          </button>
        ) : currentStep === 3 ? (
          <button
            onClick={handleNextStep}
            id="save-button"
            className="primary-button"
          >
            <span>{isLoading ? "Processing..." : "Save"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GrievanceForm;
