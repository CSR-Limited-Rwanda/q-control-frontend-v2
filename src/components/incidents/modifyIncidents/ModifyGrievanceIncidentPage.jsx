"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import api, { calculateAge, cleanedData } from "@/utils/api";
import {
  X,
  Eye,
  SaveAll,
  LoaderCircle,
  TextSearch,
  CircleCheck,
  Square,
} from "lucide-react";
import { sourcesOfInformation } from "@/constants/constants";
import RichTexField from "@/components/forms/RichTextField";
import BackToPage from "../../backToPage";
import postDocumentHistory from "../documentHistory/postDocumentHistory";
import mediaAPI from "@/utils/mediaApi";
import { format } from "date-fns";
import GrievanceInvestigationForm from "../incidentForms/GrievanceForms/GrievanceInvestigationForm";
import FilesList from "../documentHistory/FilesList";
import CustomTimeInput from "@/components/CustomTimeInput";
import { useDepartments, usePermission } from "@/context/PermissionsContext";
import CustomDatePicker from "@/components/CustomDatePicker";
import CantModify from "@/components/CantModify";
import "../../../styles/_modifyIncident.scss";

const ModifyGrievanceIncident = ({ data, incidentId, investigation }) => {
  const permission = usePermission();
  const department = useDepartments();
  const [incident, setIncident] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [showInvestigationFrom, setShowInvestigationFrom] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);

  const [status, setStatus] = useState(incident?.status);
  const [incidentDate, setIncidentDate] = useState(incident?.date);
  const [patientFirstName, setPatientFirstName] = useState(
    incident?.patient_name?.first_name ?? ""
  );
  const [severityRating, setSeverityRating] = useState(
    incident?.severity_rating ?? ""
  );
  const [patientLastName, setPatientLastName] = useState(
    incident?.patient_name?.last_name ?? ""
  );

  const [medicalRecord, setMedicalRecord] = useState(
    incident?.patient_name?.medical_record_number ?? ""
  );
  const [formInitiatedByFirstName, setFormInitiatedByFirstName] = useState(
    incident?.form_initiated_by?.first_name ?? ""
  );
  const [formInitiatedByLastName, setFormInitiatedByLastName] = useState(
    incident?.form_initiated_by?.last_name ?? ""
  );
  const [formInitiatedByTitle, setFormInitiatedByTitle] = useState(
    incident?.title ?? ""
  );

  const [complaintByFirstName, setComplaintByFirstName] = useState(
    incident?.complaint_made_by?.first_name ?? ""
  );
  const [complaintByLastName, setComplaintByLastName] = useState(
    incident?.complaint_made_by?.last_name ?? ""
  );
  const [patientRelationship, setPatientRelationship] = useState(
    incident?.relationship_to_patient ?? ""
  );
  const [phoneNumber, setPhoneNumber] = useState(
    incident?.complaint_made_by?.phone_number ?? ""
  );
  const [sourceOfInformation, setSourceOfInformation] = useState(
    incident?.source_of_information ?? ""
  );
  const [showOtherSourceOfInfo, setShowOtherSourceOfInfo] = useState(false);
  const [complaintOrConcern, setComplaintOrConcern] = useState(
    incident?.complaint_or_concern ?? ""
  );
  const [actionTaken, setActionTaken] = useState(
    incident?.initial_corrective_actions ?? ""
  );
  const [reviewActionTaken, setReviewActionTaken] = useState("");
  const [review, setReview] = useState("");
  const [dateBirth, setdateBirth] = useState(
    incident?.patient_name?.date_of_birth ?? ""
  );
  const [age, setAge] = useState(incident?.patient_name?.age ?? "");

  const [otherInput, setOtherInput] = useState("");
  const [feedbackDate, setFeedbackDate] = useState("");
  const [extensionLetterDate, setExtensionLetterDate] = useState("");
  const [responseLetterDate, setResponseLetterDate] = useState("");
  const [actionMeeting, setActionMeeting] = useState("");
  const [involvedPerson, setInvolvedPerson] = useState("");
  const [actionTelephone, setActionTelephone] = useState("");
  const [relationshipToPatient, setRelationshipToPatient] = useState("");
  const [dateClosed, setDateClosed] = useState("");
  const [extensionLetterFile, setExtensionLetterFile] = useState(null);
  const [responseLetterFile, setResponseLetterFile] = useState(null);
  const maxFileSize = 12 * 1024 * 1024;
  const [adversePatientOutcome, setAdversePatientOutcome] = useState(
    incident?.adverse_patient_outcome ?? ""
  );
  const [outcome, setOutcome] = useState(incident?.outcome ?? "");

  const [administratorFirstName, setAdministratorFirstName] = useState(
    incident?.administrator_notified?.first_name ?? ""
  );
  const [administratorLastName, setAdministratorLastName] = useState(
    incident?.administrator_notified?.last_name ?? ""
  );
  const [notifiedAdministrator, setNotifiedAdministrator] = useState(
    incident?.administrator_notified ? true : false
  );
  const [grivanceDate, setGrivanceDate] = useState(
    incident?.notification_date ?? ""
  );
  const [grivanceTime, setGrivanceTime] = useState(
    incident?.notification_time ?? ""
  );
  const [selectedOption, setSelectedOption] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [grievanceId, setGrievanceId] = useState(
    localStorage.getItem("grievanceId")
  );

  const handleShowInvestigationForm = () => {
    setShowInvestigationFrom(!showInvestigationFrom);
  };

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);
    setdateBirth(date);
    setAge(calculatedAge);
  };
  const handleNotifiedAdministrator = () => {
    setNotifiedAdministrator((prev) => !prev);
  };
  console.log(data);
  const handleFileChange = async (event) => {
    const formData = new FormData();
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setUploadingDocuments(true);
      console.log([...formData]);

      const response = await mediaAPI.post(
        `/incidents/grievance/${grievanceId}/documents/`,
        formData
      );

      if (response.status === 200 || 201) {
        console.log(response.data.files);
        setUploadingDocuments(false);
        window.customToast.success("Files uploaded successfully");
        setUploadedFiles(response.data.files);
      }
    } catch (error) {
      window.customToast.error(error?.response?.data?.error);
      setUploadingDocuments(false);
      console.log(error);
    }
  };

  const handleAdversePatientOutcome = () => {
    setAdversePatientOutcome((prev) => !prev);
  };

  const handleSourceOfInformation = (source) => {
    if (source === "Other") {
      setShowOtherSourceOfInfo(source === "Other");
    } else {
      setSourceOfInformation(source);
    }
    console.log(source);
    // setInputValue("");
  };

  useEffect(() => {
    // get documents
    const fetchIncidentDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/grievance/${grievanceId}/documents/`
        );
        if (response.status === 200) {
          setUploadedFiles(response.data.results);
          console.log("documents updated successfully");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchIncidentDocuments();
  }, []);

  const handleSaveDraft = () => {
    setStatus("Draft");
    setSavingDraft(true);
    handleModify("Draft");
  };
  const handleSaveAndSubmit = () => {
    setStatus("Open");
    setIsLoading(true);
    handleModify("Open");
    setIsLoading(true);
  };
  const handleModify = async (incidentStatus) => {
    const formatDate = (date) => {
      return format(new Date(date), "yyyy-MM-dd");
    };
    const incidentData = {
      action: "modify",
      date: formatDate(incidentDate),
      patient_name:
        patientFirstName && patientLastName
          ? {
              first_name: patientFirstName,
              last_name: patientLastName,
              age: age,
              date_of_birth: dateBirth,
              medical_record_number: medicalRecord,
              profile_type: "Patient",
            }
          : null,

      form_initiated_by:
        formInitiatedByFirstName && formInitiatedByLastName
          ? {
              first_name: formInitiatedByFirstName,
              last_name: formInitiatedByLastName,
              profile_type: "Staff",
            }
          : null,
      title: formInitiatedByTitle,
      complaint_made_by:
        complaintByFirstName && complaintByLastName
          ? {
              first_name: complaintByFirstName,
              last_name: complaintByLastName,
              phone_number: phoneNumber,
              profile_type: "Patient",
            }
          : null,
      relationship_to_patient: patientRelationship,
      source_of_information: sourceOfInformation,
      complaint_or_concern: complaintOrConcern,
      initial_corrective_actions: actionTaken,
      adverse_patient_outcome: adversePatientOutcome,
      outcome: outcome,
      administrator_notified:
        administratorFirstName && administratorLastName
          ? {
              first_name: administratorFirstName,
              last_name: administratorLastName,
              profile_type: "Staff",
            }
          : null,
      notification_date: grivanceDate,
      notification_time: grivanceTime,
      status: incidentStatus,
    };
    console.log(dateBirth);
    console.log(incidentDate);
    console.log(
      "Submitting incident data",
      JSON.stringify(incidentData, null, 2)
    );
    try {
      const response = await api.patch(
        `incidents/grievance/${grievanceId}/`,
        cleanedData(incidentData)
      );
      if (response.status === 200) {
        setIsLoading(false);
        setSavingDraft(false);
        window.customToast.success("Incident updated successfully");
        setIncident(response.data.incident);
        console.log(response.data.incident);
        postDocumentHistory(incidentId, "modified this incident", "modify");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        window.customToast.error(
          error.response.data.message ||
            error.response.data.error ||
            "Error while updating the incident"
        );
      } else {
        window.customToast.error("Unknown error while updating the incident");
      }
      setIsLoading(false);
      setSavingDraft(false);
    }
  };

  return data.is_resolved ? (
    <CantModify />
  ) : (
    <div className="modify-page-content">
      {showInvestigationFrom && (
        <div className="grievance-investigation-form">
          <div className="form-container">
            <X className="close-popup" onClick={handleShowInvestigationForm} />
            <GrievanceInvestigationForm incidentId={grievanceId} />
          </div>
        </div>
      )}
      <div className="modify-page-header">
        <BackToPage
          link={"/incident/grievance/"}
          pageName={"Grievance incident"}
        />
        <h2 className="title">Modifying grievance incident</h2>
        {investigation ? (
          <Link
            href={`/incident/grievance/${grievanceId}`}
            onClick={() => {
              localStorage.setItem("activate_investigation_tab", true);
            }}
          >
            <button type="button" className="tertiary-button">
              <span>View investigation</span>
              <Eye size={18} />
            </button>
          </Link>
        ) : (
          <button
            onClick={handleShowInvestigationForm}
            className="tertiary-button"
          >
            <span>Add investigation</span>
            <TextSearch size={20} />
          </button>
        )}

        <div className="buttons">
          <button className="tertiary-button" onClick={handleSaveDraft}>
            {savingDraft ? (
              <>
                <LoaderCircle className="loading-icon" size={18} />
                <span>Saving draft</span>
              </>
            ) : (
              <>
                <SaveAll size={20} />
                <span>Save draft</span>
              </>
            )}
          </button>
          <button className="primary-button" onClick={handleSaveAndSubmit}>
            {isLoading ? (
              <>
                <LoaderCircle className="loading-icon" size={18} />
                <span>Saving changes</span>
              </>
            ) : (
              <>
                <SaveAll size={20} />
                <span>Save and submit</span>
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modify-incident-page">
        <div className="incident-status">
          <p>
            Status :{" "}
            <span
              className={`follow-up ${
                status === "Draft"
                  ? "in-progress"
                  : status === "Closed"
                  ? "closed"
                  : "Open"
              }`}
            >
              {status}
            </span>
          </p>
        </div>
        <form className="modify-forms">
          <div className="inputs-group modify-inputs">
            <h3 className="full">General info</h3>
            <div className="field">
              <label htmlFor="incidentDate">Date</label>

              <CustomDatePicker
                selectedDate={incidentDate}
                setSelectedDate={setIncidentDate}
              />
            </div>
            <div className="half">
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
            </div>

            <div className="field">
              <label htmlFor="dateBirth">Date of birth</label>

              <CustomDatePicker
                selectedDate={dateBirth}
                setSelectedDate={handleDateOfBirth}
              />
            </div>
            <div className="field">
              <label htmlFor="age">Age</label>
              <input
                type="text"
                name="age"
                id="age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter age"
              />
            </div>

            <div className="field">
              <label htmlFor="medicalRecord">Medical record</label>
              <input
                onChange={(e) => setMedicalRecord(e.target.value)}
                value={medicalRecord}
                type="text"
                name="medicalRecord"
                id="medicalRecord"
                placeholder="Enter medical name"
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
                placeholder="Enter   relationship"
              />
            </div>

            <div className="field">
              <label htmlFor="phoneNumber">Phone number</label>
              <input
                onChange={(e) => setPhoneNumber(e.target.value)}
                value={phoneNumber}
                type="text"
                name="phoneNumber"
                id="phoneNumber"
                placeholder=" Enter phone number"
              />
            </div>

            <div className="field full">
              <label htmlFor="phoneNumber">Source of information</label>
              <div className="half">
                {sourcesOfInformation.map((source) => (
                  <div
                    onClick={() => handleSourceOfInformation(source.value)}
                    className="check-box"
                    key={source.value}
                  >
                    {sourceOfInformation === source.value ? (
                      <CircleCheck />
                    ) : (
                      <Square />
                    )}
                    <p>{source.label}</p>
                  </div>
                ))}

                {showOtherSourceOfInfo && (
                  <div>
                    <input
                      type="text"
                      value={sourceOfInformation}
                      onChange={(e) =>
                        handleSourceOfInformation(e.target.value)
                      }
                      placeholder="Enter Source Of Information"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="inputs-group modify-inputs">
            <div className="field full">
              <label htmlFor="complaintOrConcern">Complaint or Concern:</label>
              <RichTexField
                value={complaintOrConcern}
                onEditorChange={setComplaintOrConcern}
              />
            </div>
            <div className="field full">
              <label htmlFor="actionTaken">
                What were the initial corrective actions taken to resolve the
                complaint?
              </label>
              <RichTexField
                value={actionTaken}
                onEditorChange={setActionTaken}
              />
            </div>

            <div className="check-box">
              <input
                onClick={handleAdversePatientOutcome}
                checked={adversePatientOutcome}
                type="checkbox"
                name="adversePatientOutcome"
                id="adversePatientOutcome"
                onChange={(e) => setAdversePatientOutcome(e.target.checked)}
              />
              <label htmlFor="adversePatientOutcome">
                Check if there was an adverse patient outcome related to this
                complaint.
              </label>
            </div>
            {adversePatientOutcome ? (
              <div className="field full">
                <label htmlFor="outcome">Identify outcome</label>

                <RichTexField value={outcome} onEditorChange={setOutcome} />
              </div>
            ) : null}
          </div>

          <div className="inputs-group step">
            <div className="check-box">
              <input
                onClick={handleNotifiedAdministrator}
                checked={notifiedAdministrator}
                type="checkbox"
                name="notifiedAdministrator"
                id="notifiedAdministrator"
                value={notifiedAdministrator}
                onChange={(e) => setNotifiedAdministrator(e.target.checked)}
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

            {/* {(permission.includes("Super User") ||
                            permission.includes("Admin") ||
                            permission.includes("Quality - Risk Manager")) && (
                                <div className="field">
                                    <label htmlFor="severityRating">Severity rating</label>
                                    <input
                                        value={severityRating}
                                        onChange={(e) => setSeverityRating(e.target.value)}
                                        type="text"
                                        name="severityRating"
                                        id="severityRating"
                                        placeholder="Severity rating"
                                    />
                                </div>
                            )} */}
            <div className="field">
              <label htmlFor="severityRating">Severity rating</label>
              <input
                value={severityRating}
                onChange={(e) => setSeverityRating(e.target.value)}
                type="text"
                name="severityRating"
                id="severityRating"
                placeholder="Severity rating"
              />
            </div>
            <div className="field full">
              <h3>Supporting documents</h3>
              <FilesList documents={uploadedFiles} showDownload={true} />

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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyGrievanceIncident;
