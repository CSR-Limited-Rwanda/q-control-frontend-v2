"use client";
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import api, { cleanedData } from "@/utils/api";
import BackToPage from "../../backToPage";
import { SquareCheck, SaveAll, LoaderCircle, Square } from "lucide-react";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomTimeInput from "@/components/CustomTimeInput";
import RichTexField from "@/components/forms/RichTextField";
import {
  drugRoutes,
  outComeData,
  outcomeReasons,
  incidentTypesData,
} from "@/constants/constants";
import postDocumentHistory from "../documentHistory/postDocumentHistory";
import FilesList from "../documentHistory/FilesList";
import mediaAPI from "@/utils/mediaApi";
import { usePermission, useDepartments } from "@/context/PermissionsContext";
import "../../../styles/_modifyincident.scss";
import CantModify from "@/components/CantModify";
import { useAuthentication } from "@/context/authContext";
const ModifyAdverseDruReactionForm = ({ data }) => {
  const [savingDraft, setSavingDraft] = useState(false);
  const { incidentId } = useParams();
  const { user } = useAuthentication()
  const [incident, setIncident] = useState(data);
  const [currentStep, setCurrentStep] = useState(1);
  const [status, setStatus] = useState(incident?.status);
  const currentStepRef = useRef(currentStep);
  const [isLoading, setIsLoading] = useState(false);

  // form
  const [outComeType, setOutComeType] = useState("mild");
  const [firstName, setFirstName] = useState(
    incident?.patient_name?.first_name
  );
  const [lastName, setLastName] = useState(incident?.patient_name?.last_name ?? "");
  const [sex, setSex] = useState(incident?.patient_name?.gender ?? "");
  const [incidentDate, setIncidentDate] = useState(incident?.incident_date ?? "");
  const [incidentTime, setIncidentTime] = useState(incident?.incident_time ?? "");
  const [incidentMr, setIncidentMr] = useState(
    incident?.patient_name?.medical_record_number ?? ""
  );
  const [address, setAddress] = useState(incident?.patient_name?.address ?? "");
  const [state, setState] = useState(incident?.patient_name?.state ?? "");
  const [zipCode, setZipCode] = useState(incident?.patient_name?.zip_code ?? "");
  const [city, setCity] = useState(incident?.patient_name?.city ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    incident?.patient_name?.phone_number ?? ""
  );
  const [physicianNotifiedFirstName, setPhysicianNotifiedFirstName] = useState(
    incident?.name_of_physician_notified?.first_name ?? ""
  );
  const [physicianNotifiedLastName, setPhysicianNotifiedLastName] = useState(
    incident?.name_of_physician_notified?.last_name ?? ""
  );
  const [familyNotifiedFirstName, setFamilyNotifiedFirstName] = useState(
    incident?.name_of_family_notified?.first_name ?? ""
  );
  const [familyNotifiedLastName, setFamilyNotifiedLastName] = useState(
    incident?.name_of_family_notified?.last_name ?? ""
  );
  const [victimType, setVictimType] = useState(incident?.patient_type ?? "");
  const [otherStatus, setOtherStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [location, setLocation] = useState("");
  const [contributingDiagnosis, setContributingDiagnosis] = useState("");
  const [isIv, setIsIv] = useState(false);
  const [isReactionTreated, setIsReactionTreated] = useState(
    incident?.reaction_was_treated ?? ""
  );
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [provider, setProvider] = useState(incident?.provider ?? "");
  const [observersFirstName, setObserversFirstName] = useState(
    incident?.observers_name?.first_name ?? ""
  );
  const [observersLastName, setObserversLastName] = useState(
    incident?.observers_name?.last_name ?? ""
  );
  const [timeOfReport, setTimeOfReport] = useState(incident?.time_of_report ?? "");
  const [dateOfReport, setDateOfReport] = useState(incident?.date_of_report ?? "");
  const [eventDetails, setEventDetails] = useState(incident?.event_detail ?? "");
  const [suspectedMedication, setSuspectedMeedication] = useState(
    incident?.suspected_medication ?? ""
  );
  const [dose, setDose] = useState(incident?.dose ?? "");
  const [frequency, setFrequency] = useState(incident?.frequency ?? "");
  const [route, setRoute] = useState(incident?.route ?? "");
  const [rateOfAdministration, setRateOfAdministration] = useState(
    incident?.rate_of_administration ?? ""
  );
  const [dateOfMedicationOrder, setDateOfMedicationOrder] = useState(
    incident?.date_of_medication_order ?? ""
  );
  const [dateInformation, setDateInformation] = useState(
    incident?.date_of_information ?? ""
  );
  const [reaction, setReaction] = useState(incident?.information_reaction ?? "");
  const [adverseReactionDate, setAdverseReactionDate] = useState(
    incident?.date_of_adverse_reaction ?? ""
  );
  const [reactionSetTime, setReactionSetTime] = useState(
    incident?.reaction_on_settime ?? ""
  );
  const [selectedAgreements, setSelectedAgreements] = useState(() => {
    return typeof incident.incident_type_classification === "string"
      ? incident?.incident_type_classification.split(", ")
      : [];
  });
  const [physcianDate, setPhyscianDate] = useState(
    incident?.date_physician_was_notified ?? ""
  );
  const [physcianTime, setPhyscianTime] = useState(
    incident?.time_physician_was_notified ?? ""
  );
  const [familyNotified, setFamilyNotified] = useState(
    incident?.name_of_family_notified
  );
  const [otherOutcome, setOtherOutcome] = useState("");
  const [familyDate, setFamilyDate] = useState(
    incident?.date_family_was_notified ?? ""
  );
  const [selectedDescription, setSelectedDescription] = useState(() => {
    return typeof incident.description === "string"
      ? incident?.description.split(", ")
      : [];
  });
  const [familyTime, setFamilyTime] = useState(
    incident?.time_family_was_notified ?? ""
  );
  const [notifiedByFirstName, setNotifiedByFirstName] = useState(
    incident?.notified_by?.first_name ?? ""
  );
  const [notifiedByLastName, setNotifiedByLastName] = useState(
    incident?.notified_by?.last_name ?? ""
  );
  const [briefSummary, setBriefSummary] = useState(
    incident?.brief_summary_incident ?? ""
  );
  const [immediateActionsTaken, setImmediateActionsTaken] = useState(
    incident?.immediate_actions_taken ?? ""
  );
  const [description, setDescription] = useState(
    incident?.other_route_description ?? ""
  );
  const [infoSource, setInfoSource] = useState(() => {
    if (incident?.nurse_note) return "Nurse note"
    if (incident?.progress_note) return "Progress note"
    if (incident?.other_information_can_be_found_in) return "Other"
    return ""
  })

  const [nurseNote, setNurseNote] = useState(!!incident?.nurse_note);
  const [progressNote, setProgressNote] = useState(!!incident?.progress_note);
  const [otherNote, setOtherNote] = useState(
    !!incident?.other_information_can_be_found_in
  );
  const [otherNoteDescription, setOtherNoteDescription] = useState(
    incident?.other_information_description ?? ""
  );
  const [treatmentDescription, setTreatmentDescription] = useState(
    incident?.treatment_description ?? ""
  );
  const [agreementDescription, setAgreementDescription] = useState("");
  const [outcomeType, setOutcomeType] = useState(incident?.outcome_type ?? "");
  const [outcomeDescription, setOutcomeDescription] = useState(
    incident?.description ?? ""
  );
  const [adrOutcome, setAdrOutcome] = useState(() => {
    return typeof incident.anaphylaxis_outcome === "string"
      ? incident?.anaphylaxis_outcome.split(", ")
      : [];
  });
  const [fdaReported, setFdaReported] = useState(
    incident?.adverse_event_to_be_reported_to_FDA ?? ""
  );
  const [severityRating, setSeverityRating] = useState(
    incident?.severity_rating ?? ""
  );
  const permission = usePermission();
  const department = useDepartments();

  const coerceBool = (v) => v === true || v === "true" || v === 1 || v === "1"

  useEffect(() => {
    // get documents
    const fetchIncidentDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/adverse-drug-reaction/${incidentId}/documents/`
        );
        if (response.status === 200) {
          setUploadedFiles(response.data.results);

        }
      } catch (error) {

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

      const response = await mediaAPI.post(
        `/incidents/adverse-drug-reaction/${incidentId}/documents/`,
        formData
      );

      if (response.status === 200 || response.status === 201) {

        setUploadingDocuments(false);
        window.customToast.success("Files uploaded successfully");
        setUploadedFiles(response.data.files);
      }
    } catch (error) {
      window.customToast.error(error?.response?.data?.error);
      setUploadingDocuments(false);

    }
  };
  const handleOutcomeDescription = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedDescription((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedDescription((prevSelected) =>
        prevSelected.filter((item) => item !== value)
      );
    }

  };

  const handleReactionTreated = () => {
    setIsReactionTreated(!isReactionTreated);
    setTreatmentDescription("");
  };

  const handleOutcomeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAdrOutcome((prevSelected) => [...prevSelected, value]);
    } else {
      setAdrOutcome((prevSelected) =>
        prevSelected.filter((item) => item !== value)
      );
    }

  };
  const handleSelection = (agreementName) => {
    setSelectedAgreements((prevSelected) => {
      if (prevSelected.includes(agreementName)) {
        // Remove if already selected
        return prevSelected.filter((name) => name !== agreementName);
      } else {
        // Add if not already selected
        return [...prevSelected, agreementName];
      }
    });
  };

  const handleOutcomeType = (value) => {
    setOutcomeType(value);
    setOutcomeDescription("");
  };

  const handleProgressNote = (value) => {
    setInfoSource(value)
    setNurseNote(value === "Nurse note")
    setProgressNote(value === "Progress note")
    const isOther = value === "Other" || value === "imaging reports"
    setOtherNote(isOther)
    setOtherNoteDescription(isOther && value === "imaging reports" ? "imaging reports" : "")
  };

  const handleModify = async (incidentStatus) => {
    setIsLoading(true);

    let src = infoSource
    if (!src) {
      if (coerceBool(nurseNote)) src === "Nurse note"
      else if (coerceBool(progressNote)) src = "Progress note"
      else if (coerceBool(otherNote)) src = "Other"
    }
    const normalizedNurse = src === "Nurse note"
    const normalizedProg = src === "Progress note"
    const normalizedOther = src === "Other" || (otherNoteDescription || "").trim().length > 0

    const normalizedOtherDesc = normalizedOther ? (otherNoteDescription || "") : ""

    const incidentData = {
      action: "modify",
      report_facility: user.facility.id,
      patient_type: victimType,
      patient_name: {
        first_name: firstName,
        last_name: lastName,
        gender: sex,
        address: address,
        state: state,
        zip_code: zipCode,
        city: city,
        phone_number: phoneNumber,
        medical_record_number: incidentMr,
        profile_type: "Patient",
      },
      incident_date: incidentDate,
      incident_time: incidentTime,

      provider: provider,

      observers_name: {
        first_name: observersFirstName,
        last_name: observersLastName,
        profile_type: "Staff",
        address: address,
        city: city,
        state: state,
        gender: sex,
      },
      time_of_report: timeOfReport,
      date_of_report: dateOfReport,
      event_detail: eventDetails,

      suspected_medication: suspectedMedication,
      dose: dose,
      frequency: frequency,
      route: route,
      rate_of_administration: rateOfAdministration,
      date_of_medication_order: dateOfMedicationOrder,
      other_route_description: description,

      date_of_information: dateInformation,
      information_reaction: reaction,
      date_of_adverse_reaction: adverseReactionDate,
      reaction_on_settime: reactionSetTime,
      nurse_note: normalizedNurse,
      progress_note: normalizedProg,
      other_information_can_be_found_in: normalizedOther,
      other_information_description: normalizedOtherDesc,

      reaction_was_treated: isReactionTreated,
      treatment_description: treatmentDescription,

      incident_type_classification: selectedAgreements.join(", "),

      outcome_type: outcomeType,
      description: selectedDescription.join(", "),
      anaphylaxis_outcome: adrOutcome.join(", "),
      adverse_event_to_be_reported_to_FDA: fdaReported,
      name_of_physician_notified: {
        first_name: physicianNotifiedFirstName,
        last_name: physicianNotifiedLastName,
        profile_type: "Staff",
      },
      date_physician_was_notified: physcianDate,
      time_physician_was_notified: physcianTime,
      name_of_family_notified: {
        first_name: familyNotifiedFirstName,
        last_name: familyNotifiedLastName,
        profile_type: "Patient",
      },
      date_family_was_notified: familyDate,
      time_family_was_notified: familyTime,
      notified_by: {
        first_name: notifiedByFirstName,
        last_name: notifiedByLastName,
        profile_type: "Nurse",
      },
      brief_summary_incident: briefSummary,
      immediate_actions_taken: immediateActionsTaken,
      status: incidentStatus,
      severity_rating: severityRating,
    };
    try {

      const response = await api.patch(
        `/incidents/adverse-drug-reaction/${incidentId}/`,
        cleanedData(incidentData)
      );
      if (response.status === 200) {
        window.customToast.success("Incident modified successfully");
        setIncident(response.data.incident);
        setIsLoading(false);
        setSavingDraft(false);

        postDocumentHistory(incidentId, "modified this incident", "modify");
      }
    } catch (error) {
      if (error.response) {

        window.customToast.error(
          error.response.data.error ||
          error.response.data.message ||
          "Error updating incident"
        );
      } else {
        window.customToast.error("Unknown error updating incident");

      }

      setIsLoading(false);
      setSavingDraft(false);
    }
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

  return (
    <div className="modify-page-content">
      <div className="modify-page-header">
        <BackToPage
          link={"/incidents/drug-reaction"}
          pageName={"ADR incidents"}
        />
        <h2 className="title">Modifying Adverse Drug Incident</h2>
        <div className="btns">
          <button className="tertiary-button" onClick={handleSaveDraft}>
            {savingDraft ? (
              <>
                <LoaderCircle className="loading-icon" size={18} />
                <span>Saving changes</span>
              </>
            ) : (
              <>
                <SaveAll size={20} />
                <span>Save changes</span>
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
              className={`follow-up ${status === "Draft"
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
            <h3 className="full">General Info</h3>
            <div className="field date">
              <label htmlFor="">Select type</label>
              <CustomSelectInput
                options={["Inpatient", "Outpatient", "ER", "Visitor"]}
                selected={victimType}
                setSelected={setVictimType}
                placeholder={"Select incident Category"}
              />
            </div>
            <div className="half">
              <div className="field name">
                <label htmlFor="patientFirstName">
                  Patient/Visitor first name
                </label>
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  type="text"
                  name="patientFirstName"
                  id="patientFirstName"
                  placeholder="Patient or visitors first name"
                />
              </div>
              <div className="field name">
                <label htmlFor="patientLastName">
                  Patient/Visitor last name
                </label>
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  type="text"
                  name="patientLastName"
                  id="patientLastName"
                  placeholder="Patient or visitors last name"
                />
              </div>
            </div>

            <div className="field name">
              <div className="sex field">
                <label htmlFor="sex">Sex</label>
                <CustomSelectInput
                  options={["Male", "Female", "Other"]}
                  selected={sex}
                  setSelected={setSex}
                  placeholder={"sex"}
                />
              </div>
            </div>
            <div className="half">
              <div className="incident-date field">
                <label htmlFor="incidentDate">Incident Date</label>
                <CustomDatePicker
                  selectedDate={incidentDate}
                  setSelectedDate={setIncidentDate}
                />
              </div>

              <div className="incident-time field">
                <label htmlFor="incidentTime">Incident Time</label>
                <CustomTimeInput
                  setTime={setIncidentTime}
                  defaultTime={incidentTime}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="incidentMr">Medical Record Number (if any)</label>
              <input
                onChange={(e) => setIncidentMr(e.target.value)}
                value={incidentMr}
                type="text"
                name="incidentMr"
                id="incidentMr"
                placeholder="Enter MRN"
              />
            </div>

            <div className="field">
              <label htmlFor="address">Address</label>
              <input
                onChange={(e) => setAddress(e.target.value)}
                value={address}
                type="text"
                name="address"
                placeholder="Enter patient or visitor address"
              />
            </div>

            <div className="field">
              <label htmlFor="city">City</label>
              <input
                onChange={(e) => setCity(e.target.value)}
                value={city}
                type="text"
                name="city"
                id="city"
                placeholder="Enter  patient or visitor city"
              />
            </div>
            <div className="field">
              <label htmlFor="state">State</label>
              <input
                onChange={(e) => setState(e.target.value)}
                value={state}
                type="text"
                name="state"
                id="state"
                placeholder="Enter  patient or visitor state"
              />
            </div>
            <div className="field">
              <label htmlFor="zipCode">Zip Code</label>
              <input
                onChange={(e) => setZipCode(e.target.value)}
                value={zipCode}
                type="text"
                name="zipCode"
                id="zipCode"
                placeholder="Zip code"
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
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="inputs-group modify-inputs">
            <div className="field">
              <label htmlFor="provider">Provider</label>
              <input
                onChange={(e) => setProvider(e.target.value)}
                value={provider}
                type="text"
                name="provider"
                id="provider"
                placeholder="Enter Provider"
              />
            </div>
            <div className="half">
              <div className="field">
                <label htmlFor="dateOfReport">Date date of report</label>
                <CustomDatePicker
                  selectedDate={dateOfReport}
                  setSelectedDate={setDateOfReport}
                />
              </div>
              <div className="field">
                <label htmlFor="timeOfReport">Time of report</label>
                <CustomTimeInput
                  setTime={setTimeOfReport}
                  defaultTime={timeOfReport}
                />
              </div>
            </div>
            <div className="field name">
              <label htmlFor="eventDetails">Event Detail</label>
              <input
                onChange={(e) => setEventDetails(e.target.value)}
                value={eventDetails}
                type="text"
                name="eventDetails"
                id="eventDetails"
                placeholder="Enter Event Detail"
              />
            </div>
            <div className="half">
              <div className="field name">
                <label htmlFor="observersFirstName">Observer first name</label>

                <input
                  value={observersFirstName}
                  onChange={(e) => setObserversFirstName(e.target.value)}
                  type="text"
                  name="observersFirstName"
                  id="observersFirstName"
                  placeholder="Enter observer first name"
                />
              </div>

              <div className="field name">
                <label htmlFor="observersLastName">Observer last name</label>

                <input
                  value={observersLastName}
                  onChange={(e) => setObserversLastName(e.target.value)}
                  type="text"
                  name="observersLastName"
                  id="observersLastName"
                  placeholder="Enter observer last name"
                />
              </div>
            </div>

            {selectedStatus === "others" ? (
              <div className="other-field">
                <div className="field name">
                  <input
                    onChange={(e) => setOtherStatus(e.target.value)}
                    value={otherStatus}
                    type="text"
                    name="otherStatus"
                    id="otherStatus"
                    placeholder="Enter other status"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="inputs-group modify-inputs">
            <div className="field">
              <label htmlFor="suspectedMedication">Suspected medication</label>
              <input
                type="text"
                name="suspectedMedication"
                id="suspectedMedication"
                placeholder="Enter suspected medication"
                value={suspectedMedication}
                onChange={(e) => setSuspectedMeedication(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="dose">Dose</label>
              <input
                type="text"
                name="dose"
                id="dose"
                placeholder="Enter dose"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
              />
            </div>

            <div className="field name">
              <label htmlFor="incidentLocation">Route</label>
              <CustomSelectInput
                options={drugRoutes.map((route) => route.label)}
                selected={route}
                setSelected={setRoute}
                placeholder={"route"}
              />
            </div>
            {route && route === "Other" && (
              <div className="field full">
                <label htmlFor="">Description</label>
                <input
                  type="text"
                  name="description"
                  id="description"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}
            <div className="field">
              <label htmlFor="frequency">Frequency</label>
              <input
                type="text"
                name="frequency"
                id="frequency"
                placeholder="Enter frequency"
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="rateOfAdministration">
                Rate of administration (if IV)
              </label>
              <input
                type="text"
                name="rateOfAdministration"
                id="rateOfAdministration"
                placeholder="Enter rate"
                value={rateOfAdministration}
                onChange={(e) => setRateOfAdministration(e.target.value)}
              />
            </div>

            <div className="field">
              <label htmlFor="dateOfMedicationOrder">
                Date of medication order
              </label>
              <CustomDatePicker
                selectedDate={dateOfMedicationOrder}
                setSelectedDate={setDateOfMedicationOrder}
              />
            </div>
          </div>
          <div className="inputs-group modify-inputs">
            <div className="field">
              <label htmlFor="dateInformation">
                Information on this reaction can be found on
              </label>
              <CustomDatePicker
                selectedDate={dateInformation}
                setSelectedDate={setDateInformation}
              />
            </div>

            <div className="field">
              <label htmlFor="informationIn">
                Information on this reaction can be found in
              </label>
              <CustomSelectInput
                options={[
                  "Nurse note",
                  "Progress note",
                  "imaging reports",
                  "Other",
                ]}
                placeholder={"source"}
                selected={infoSource}
                setSelected={handleProgressNote}
              />
            </div>

            {otherNote ? (
              <>
                <RichTexField
                  value={otherNoteDescription}
                  onEditorChange={setOtherNoteDescription}
                />
              </>
            ) : (
              ""
            )}

            <div className="field">
              <label htmlFor="reaction">Reaction</label>
              <input
                type="text"
                name="reaction"
                id="reaction"
                placeholder="Describe Reaction"
                value={reaction}
                onChange={(e) => setReaction(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="adverseReactionDate">
                Date of adverse reaction
              </label>
              <CustomDatePicker
                selectedDate={adverseReactionDate}
                setSelectedDate={setAdverseReactionDate}
              />
            </div>
            <div className="field">
              <label htmlFor="isTreated">Reaction on-set time</label>
              <CustomTimeInput
                setTime={setReactionSetTime}
                defaultTime={reactionSetTime}
              />
            </div>
            <div className="field full">
              <div className="check-boxes">
                <div className="check-box">
                  <input
                    type="checkbox"
                    name="reactionTreated"
                    id="reactionTreated"
                    onChange={handleReactionTreated}
                    checked={isReactionTreated}
                  />
                  <label htmlFor="reactionTreated">
                    Check if reaction was treated
                  </label>
                </div>
              </div>
            </div>

            {isReactionTreated ? (
              <div className="field">
                <label htmlFor="treatmentDescription">Describe treatment</label>
                <RichTexField
                  value={treatmentDescription}
                  onEditorChange={setTreatmentDescription}
                />
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="inputs-group modify-inputs">
            <h3 className="full">Incident type agreement</h3>
            <div className="grid-container full">
              {(incidentTypesData.incident_agreement || []).map(
                (agreement, index) => (
                  <div
                    onClick={() => handleSelection(agreement.name)}
                    key={index}
                    className={`type grid-item`}
                  >
                    {selectedAgreements.includes(agreement.name) ? (
                      <SquareCheck />
                    ) : (
                      <Square />
                    )}
                    <span>{agreement.name}</span>
                  </div>
                )
              )}
            </div>
            {selectedAgreements.includes("other (describe)") ? (
              <div className="field full">
                <RichTexField
                  value={agreementDescription}
                  onEditorChange={setAgreementDescription}
                />
              </div>
            ) : null}
          </div>
          <div className="inputs-group modify-inputs">
            <h2 className="full">Outcome</h2>
            <div className="check-boxes-container">
              <div className="check-box">
                <input
                  type="radio"
                  name="mildAdmission"
                  id="mildAdmission"
                  checked={outcomeType === "Mild"}
                  onChange={() => handleOutcomeType("Mild")}
                />
                <label htmlFor="mildAdmission">
                  Mild: required no intervention; no apparent harm to patient
                </label>
              </div>

              <div className="input-container check-box">
                <input
                  type="radio"
                  name="moderateAdmission"
                  id="moderateAdmission"
                  checked={outcomeType === "Moderate"}
                  onChange={() => handleOutcomeType("Moderate")}
                />
                <label htmlFor="moderateAdmission">Moderate</label>
              </div>
              <div>
                {outcomeType === "Moderate"
                  ? outComeData.Moderate.map((el, i) => (
                    <div key={i} className="outcome-data check-box">
                      <input
                        type="checkbox"
                        name="moderateOutcome"
                        id={el.name}
                        value={el.name}
                        onChange={handleOutcomeDescription}
                        checked={selectedDescription.includes(el.name)}
                      />
                      <label htmlFor={el.name}>{el.name}</label>
                    </div>
                  ))
                  : null}
              </div>

              <div className="input-container check-box">
                <input
                  type="radio"
                  name="severeAdmission"
                  id="severeAdmission"
                  checked={outcomeType === "Severe"}
                  onChange={() => handleOutcomeType("Severe")}
                />
                <label htmlFor="severeAdmission">Severe</label>
              </div>
              <div>
                {outcomeType === "Severe"
                  ? outComeData.Severe.map((el, i) => (
                    <div key={i} className="outcome-data check-box">
                      <input
                        type="checkbox"
                        name="severeOutcome"
                        id={el.name}
                        value={el.name}
                        onChange={handleOutcomeDescription}
                        checked={selectedDescription.includes(el.name)}
                      />
                      <label htmlFor={el.name}>{el.name}</label>
                    </div>
                  ))
                  : null}
              </div>

              <div className="half">
                <div className="check-boxes-container">
                  <h2>Anaphylaxis /ADR Outcome</h2>
                  <div className="grid-container">
                    {outcomeReasons &&
                      outcomeReasons.map((el, i) => (
                        <div className="check-box separator" key={i}>
                          <input
                            type="checkbox"
                            name={el.name}
                            id={el.name}
                            onChange={handleOutcomeChange}
                            value={el.name}
                            checked={adrOutcome.includes(el.name)}
                          />
                          <label htmlFor={el.name}>{el.name}</label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
              <div className="check-box separator">
                <input
                  type="checkbox"
                  name="reportedToFDA"
                  id="reportedToFDA"
                  onChange={() => setFdaReported(!fdaReported)}
                  checked={fdaReported}
                />
                <label htmlFor="reportedToFDA">
                  Adverse event to be reported to fda
                </label>
              </div>
            </div>
          </div>
          <div className="inputs-group modify-inputs">
            <h1 className="full">Notification</h1>

            <div className="half">
              <div className="field">
                <label htmlFor="physicianNotifiedFirstName">
                  First name of physician notified
                </label>
                <input
                  onChange={(e) =>
                    setPhysicianNotifiedFirstName(e.target.value)
                  }
                  type="text"
                  name="physicianNotifiedFirstName"
                  id="physicianNotifiedFirstName"
                  placeholder="Enter first name"
                  value={physicianNotifiedFirstName}
                />
              </div>
              <div className="field">
                <label htmlFor="physicianNotifiedLastName">
                  Last name of physician notified
                </label>
                <input
                  onChange={(e) => setPhysicianNotifiedLastName(e.target.value)}
                  type="text"
                  name="physicianNotifiedLastName"
                  id="physicianNotifiedLastName"
                  placeholder="Enter last name"
                  value={physicianNotifiedLastName}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="physcianDate">Date</label>
              <CustomDatePicker
                selectedDate={physcianDate}
                setSelectedDate={setPhyscianDate}
              />
            </div>
            <div className="field">
              <label htmlFor="physcianTime">Time</label>
              <CustomTimeInput
                setTime={setPhyscianTime}
                defaultTime={physcianTime}
              />
            </div>

            <div className="half">
              <div className="field">
                <label htmlFor="familyNotifiedFirstName">
                  First name of family notified
                </label>
                <input
                  onChange={(e) => setFamilyNotifiedFirstName(e.target.value)}
                  type="text"
                  name="familyNotifiedFirstName"
                  id="familyNotifiedFirstName"
                  value={familyNotifiedFirstName}
                  placeholder="Enter first name"
                />
              </div>
              <div className="field">
                <label htmlFor="familyNotifiedLastName">
                  Last name of family notified
                </label>
                <input
                  onChange={(e) => setFamilyNotifiedLastName(e.target.value)}
                  type="text"
                  name="familyNotifiedLastName"
                  id="familyNotifiedLastName"
                  value={familyNotifiedLastName}
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="familyDate">Date</label>
              <CustomDatePicker
                selectedDate={familyDate}
                setSelectedDate={setFamilyDate}
              />
            </div>
            <div className="field">
              <label htmlFor="familyTime">Time</label>
              <CustomTimeInput
                setTime={setFamilyTime}
                defaultTime={familyTime}
              />
            </div>
            <div className="half">
              <div className="field name">
                <label htmlFor="notifiedByFirstName">
                  Notified by first name
                </label>
                <input
                  onChange={(e) => setNotifiedByFirstName(e.target.value)}
                  value={notifiedByFirstName}
                  type="text"
                  name="notifiedByFirstName"
                  id="notifiedByFirstName"
                  placeholder="First name"
                />
              </div>
              <div className="field name">
                <label htmlFor="notifiedByLastName">
                  Notified by last name
                </label>
                <input
                  onChange={(e) => setNotifiedByLastName(e.target.value)}
                  value={notifiedByLastName}
                  type="text"
                  name="notifiedByLastName"
                  id="notifiedByLastName"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
          <div className="inputs-group modify-inputs">
            <h2 className="full">Other info</h2>
            <div className="half full">
              <div className="field">
                <label htmlFor="Brief Summary of incident">
                  Brief summary of incident
                </label>
                <RichTexField
                  value={briefSummary}
                  onEditorChange={setBriefSummary}
                />
              </div>
              <div className="field">
                <label htmlFor="Immediate actions taken">
                  Immediate actions taken,
                </label>
                <RichTexField
                  value={immediateActionsTaken}
                  onEditorChange={setImmediateActionsTaken}
                />
              </div>
            </div>
          </div>
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
          <div className="field full inputs-group">
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
        </form>
      </div>
    </div>
  );
};

export default ModifyAdverseDruReactionForm;
