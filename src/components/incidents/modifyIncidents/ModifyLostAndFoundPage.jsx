"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "react-router-dom";
import api, { cleanedData, calculateAge } from "@/utils/api";
import toast from "react-hot-toast";
import { X, Eye, SaveAll, LoaderCircle, TextSearch } from "lucide-react";
import RichTexField from "@/components/forms/RichTextField";
import BackToPage from "../../backToPage";
import postDocumentHistory from "../documentHistory/postDocumentHistory";
import FilesList from "../documentHistory/FilesList";
import mediaAPI from "@/utils/mediaApi";
import CustomTimeInput from "@/components/CustomTimeInput";
import CustomDatePicker from "@/components/CustomDatePicker";
import UserPermissions from "@/components/accounts/profile/userPermissions";
import { usePermission } from "@/context/PermissionsContext";
import "../../../styles/_modifyincident.scss";
// import CantModify from "../../../general/cantModify";
// import LostAndFoundInvestigation from "../../lostAndFoundInvestigation";

const ModifyLostFound = ({ data }) => {
  const permission = usePermission();
  const { incidentId } = useParams();
  const [incident, setIncident] = useState(data);
  const [isLoading, setIsLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  console.log("Modify LostFound: ", data);

  const [status, setStatus] = useState(incident?.status);
  const [severityRating, setSeverityRating] = useState(
    incident?.severity_rating
  );
  const [reporterFirstName, setReporterFirstName] = useState(
    incident?.reported_by?.first_name
  );
  const [reporterLastName, setReporterLastName] = useState(
    incident?.reported_by?.last_name
  );
  const [patientFirstName, setPatientFirstName] = useState(
    incident?.taken_by?.first_name
  );
  const [patientLastName, setPatientLastName] = useState(
    incident?.taken_by?.last_name
  );

  const [propertyName, setPropertyName] = useState(incident?.property_name);

  const [relationToPatient, setRelationToPatient] = useState(
    incident?.relation_to_patient
  );
  const [itemDescription, setItemDescription] = useState(
    incident?.item_description
  );
  const [actionTaken, setActionTaken] = useState(incident?.action_taken);
  const [isFound, setIsFound] = useState(incident?.is_found);
  const [dateFound, setDateFound] = useState(incident?.date_found);
  const [timeFound, setTimeFound] = useState(incident?.time_found);
  const [locationFound, setLocationFound] = useState(incident?.location_found);
  const [personWhoFoundPropertyFirstName, setPersonWhoFoundPropertyFirstName] =
    useState(incident?.found_by?.first_name);
  const [personWhoFoundPropertyLastName, setPersonWhoFoundPropertyLastName] =
    useState(incident?.found_by?.last_name);
  const [disposalUnclaimedProperty, setDisposalUnclaimedProperty] = useState(
    incident?.disposal_of_unclaimed_property
  );
  const [returnedTo, setReturnedTo] = useState(incident?.returned_to);
  const [dateReturned, setDateReturned] = useState(incident?.date_returned);
  const [timeReturned, setTimeReturned] = useState(incident?.time_returned);
  const [locationReturned, setLocationReturned] = useState(
    incident?.location_returned
  );
  const [resolved, setResolved] = useState(incident?.resolved);
  const [dateLetterSent, setDateLetterSent] = useState(
    incident?.date_letter_sent
  );
  const [letterSentTo, setLetterSentTo] = useState(incident?.letter_sent_to);
  const [resolveOutcome, setResolveOutcome] = useState("");
  const [dateBirth, setDateBirth] = useState(
    data?.person_reporting_info?.date_of_birth
  );
  const [showInvestigationFrom, setShowInvestigationFrom] = useState(false);
  const [age, setAge] = useState(incident?.reported_by?.age);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const handleResolveOutcome = () => {
    setResolveOutcome((prev) => !prev);
  };

  const [lostAndFoundId, setLostAndFoundId] = useState(
    localStorage.getItem("lostAndFoundId")
  );

  const handleShowInvestigationForm = () => {
    setShowInvestigationFrom(!showInvestigationFrom);
  };
  const handleIsFound = () => {
    setIsFound((prev) => !prev);
  };

  console.log(data);

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);
    setDateBirth(date);
    setAge(calculatedAge);
  };

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

  useEffect(() => {
    const fetchIncidentDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/lost-found/${lostAndFoundId}/documents/`
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
        `/incidents/lost-found/${lostAndFoundId}/documents/`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
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
  const handleModify = async (incidentStatus) => {
    const formatDate = (date) => {
      const parsedDate = new Date(date);
      return parsedDate.toString() !== "Invalid Date"
        ? parsedDate.toISOString().split("T")[0]
        : null;
    };

    const formatTime = (time) => {
      if (!time) return null;
      const timeParts = time.split(":");
      if (timeParts.length < 2) return null;
      const hours = timeParts[0].padStart(2, "0");
      const minutes = timeParts[1].padStart(2, "0");
      return `${hours}:${minutes}:00`;
    };
    console.log("dateFound:", dateFound);
    console.log("dateReturned:", dateReturned);
    console.log("dateLetterSent:", dateLetterSent);
    console.log("timeFound:", timeFound);
    console.log("timeReturned:", timeReturned);

    const incidentData = {
      action: "modify",
      property_name: propertyName,
      reported_by: {
        first_name: reporterFirstName || "",
        last_name: reporterLastName || "",
        profile_type: "Patient",
        age: age,
      },
      taken_by: {
        first_name: patientFirstName || "",
        last_name: patientLastName || "",
        profile_type: "Staff",
      },
      found_by: {
        first_name: personWhoFoundPropertyFirstName,
        last_name: personWhoFoundPropertyLastName,
        profile_type: "Staff",
      },
      relation_to_patient: relationToPatient,
      item_description: itemDescription,
      action_taken: actionTaken,
      is_found: isFound,
      date_found: formatDate(dateFound),
      time_found: formatTime(timeFound),
      location_found: locationFound,
      disposal_of_unclaimed_property: disposalUnclaimedProperty,
      returned_to: returnedTo,
      date_returned: formatDate(dateReturned),
      time_returned: formatTime(timeReturned),
      location_returned: locationReturned,
      resolved: resolved,
      date_letter_sent: formatDate(dateLetterSent),
      letter_sent_to: letterSentTo,
      status: incidentStatus,
      age: age,
      date_of_birth: dateBirth,
    };

    try {
      const response = await api.patch(
        `/incidents/lost-found/${lostAndFoundId}/`,
        cleanedData(incidentData)
      );
      if (response.status === 200) {
        setIsLoading(false);
        setSavingDraft(false);
        window.customToast.success("Incident updated successfully");
        setIncident(response.data.incident);
        postDocumentHistory(incidentId, "modified this incident", "modify");
      }
    } catch (error) {
      setIsLoading(false);
      setSavingDraft(false);
      window.customToast.error("Error updating the incident");
      console.log("Error updating incident:", error);
    }
  };

  return data.is_resolved ? (
    <CantModify />
  ) : (
    <div className="modify-page-content">
      {/* {showInvestigationFrom && (
        <div className="grievance-investigation-form">
          <div className="form-container">
            <X
              className="close-popup"
              onClick={handleShowInvestigationForm}
            />
            <LostAndFoundInvestigation lostFoundId={incidentId} />
          </div>
        </div>
      )} */}
      <div className="modify-page-header">
        <BackToPage
          link={"/incident/lost-and-found/"}
          pageName={"Lost and Found incidents"}
        />
        <h2 className="title">Modifying Lost and Found incident</h2>
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
              <label htmlFor="propertyName">Property Name</label>
              <input
                type="text"
                name="propertyName"
                id="propertyName"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                placeholder="Enter property name"
              />
            </div>
            <div className="field">
              <label htmlFor="reporterFirstName">
                Name of person taking report:
              </label>
              <div className="half">
                <div className="field">
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
            </div>

            <div className="field">
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

            <div className="field">
              <label htmlFor="relationToPatient">
                Relationship to Patient (if applicable):
              </label>
              <input
                onChange={(e) => setRelationToPatient(e.target.value)}
                value={relationToPatient}
                type="text"
                name="relationToPatient"
                id="relationToPatient"
                placeholder="Enter name"
              />
            </div>

            <div className="field full">
              <label htmlFor="complaintOrConcern">
                Full description of the missing, lost, or misplaced property
                (including money):
              </label>
              <RichTexField
                value={itemDescription}
                onEditorChange={setItemDescription}
              />
            </div>

            <div className="field full">
              <label htmlFor="complaintOrConcern">
                Actions taken to locate the missing, lost, or misplaced
                property:
              </label>
              <RichTexField
                value={actionTaken}
                onEditorChange={setActionTaken}
              />
            </div>
            <div className="check-box">
              <input
                onChange={(e) => setIsFound(e.target.checked)}
                checked={isFound}
                type="checkbox"
                name="isFound"
                id="isFound"
              />
              <label htmlFor="resolveOutcome">
                Check if missing, lost, or misplaced property was found
              </label>
            </div>
            <div className="half"></div>
          </div>
          <div className="inputs-group modify-inputs">
            <div className="field">
              <label htmlFor="returnedTo">Property returned to</label>
              <input
                onChange={(e) => setReturnedTo(e.target.value)}
                value={returnedTo}
                type="text"
                name="returnedTo"
                id="returnedTo"
                placeholder="Enter name"
              />
            </div>
            <div className="field">
              <label htmlFor="dateReturned">Date property was returned</label>
              <CustomDatePicker
                key={dateReturned}
                selectedDate={dateReturned}
                setSelectedDate={setDateReturned}
              />
            </div>

            <div className="field">
              <label htmlFor="timeFound">Time property was returned</label>
              <CustomTimeInput
                key={timeReturned}
                setTime={setTimeReturned}
                defaultTime={timeReturned}
              />
            </div>
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
            <div className="field">
              <label htmlFor="locationFound">
                Location where property was found:
              </label>
              <input
                onChange={(e) => setLocationFound(e.target.value)}
                value={locationFound}
                type="text"
                name="locationFound"
                id="locationFound"
                placeholder="Enter Name"
              />
            </div>

            <div className="field">
              <label htmlFor="dateFound">Date property found</label>

              <CustomDatePicker
                key={dateFound}
                selectedDate={dateFound}
                setSelectedDate={setDateFound}
              />
            </div>
            <div className="field">
              <label htmlFor="timeFound">Time property found</label>
              <CustomTimeInput
                key={timeFound}
                setTime={setTimeFound}
                defaultTime={timeFound}
              />
            </div>

            <div className="half">
              <div className="field name">
                <label htmlFor="employeeFirstName">First name</label>
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
                <label htmlFor="employeeLastName">Last name</label>
                <input
                  onChange={(e) =>
                    setPersonWhoFoundPropertyLastName(e.target.value)
                  }
                  value={personWhoFoundPropertyLastName}
                  type="text"
                  name="personWhoFoundPropertyFirstName"
                  id="personWhoFoundPropertyFirstName"
                  placeholder="Enter last name"
                />
              </div>
            </div>

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
            <div className="field full">
              <h3>Supporting documents</h3>
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModifyLostFound;
