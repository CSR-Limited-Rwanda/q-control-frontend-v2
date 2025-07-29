"use client";
import React, { useState, useRef, useEffect } from "react";
import RichTexField from "@/components/forms/RichTextField";
import CustomDatePicker from "@/components/CustomDatePicker";
import {
  incidentTypesData,
  statusesPrionToIncident,
} from "@/constants/constants";
import CustomSelectInput from "@/components/CustomSelectInput";
import api, { checkCurrentAccount, cleanedData } from "@/utils/api";
import { SquareCheck, SaveAll, LoaderCircle, Square } from "lucide-react";
import BackToPage from "../../backToPage";
import mediaAPI from "@/utils/mediaApi";
import postDocumentHistory from "../documentHistory/postDocumentHistory";
import FilesList from "../documentHistory/FilesList";
import CustomTimeInput from "@/components/CustomTimeInput";
import { usePermission } from "@/context/PermissionsContext";
import { useParams } from "react-router-dom";
import CantModify from "@/components/CantModify";

// We need to resolve the issue with status prio to
const ModifyGeneralIncidentForm = ({ data }) => {
  const { incidentId } = useParams();
  //   const permission = usePermission();
  const [incident, setIncident] = useState(data);
  const [restraintOn, setRestraintOn] = useState(
    incident.fall_type_agreement || []
  );
  const [specimen, setSpecimen] = useState("");
  const [showSpecimen, setshowSpecimen] = useState(false);
  const [showRestrainOptions, setShowRestrainOptions] = useState(false);
  const [statusPrior, setStatusPrior] = useState(
    incident.patient_status_prior?.split(", ") || []
  );
  const [showPriorStatusOtherInput, setShowPriorStatusOtherInput] =
    useState("");

  const [statusPriorOtherInput, setStatusPriorOtherInput] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [generalIncidentId, setGeneralIncidentId] = useState(
    localStorage.getItem("generalIncidentId")
  );

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
        `/incidents/general-visitor/${generalIncidentId}/documents/`,
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

  const handleCheckboxChange = (option) => {
    let updatedOptions;
    if (statusPrior.includes(option)) {
      updatedOptions = statusPrior.filter((item) => item !== option);
    } else {
      updatedOptions = [...statusPrior, option];
    }
    setStatusPrior(updatedOptions);
  };

  const handlePriorStatusOtherInputChange = (event) => {
    setStatusPriorOtherInput(event.target.value);
  };
  const handlePriorStatusOtherCheckboxChange = (e) => {
    setShowPriorStatusOtherInput(e.target.checked);
    if (!e.target.checked) {
      setStatusPriorOtherInput("");
    }
  };

  const handleAgreementClick = (name) => {
    if (!agreement.includes(name)) {
      // Add value to the array
      setAgreement((prevState) => [...prevState, name]);
    } else {
      setAgreement((prevState) => prevState.filter((item) => item !== name));
    }

    if (!restraintOn.includes(name)) {
      // Add value to the array
      setRestraintOn((prevState) => [...prevState, name]);
    } else {
      setRestraintOn((prevState) => prevState.filter((item) => item !== name));
    }

    if (!specimen.includes(name)) {
      // Add value to the array
      setSpecimen((prevState) => [...prevState, name]);
    } else {
      setSpecimen((prevState) => prevState.filter((item) => item !== name));
    }

    if (name === "Restraint on") {
      setShowRestrainOptions(!showRestrainOptions);
    }
    if (name === "specimen") {
      setshowSpecimen(!showSpecimen);
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  // form
  const [category, setCategory] = useState(incident.category);
  const [severityRating, setSeverityRating] = useState(
    incident.severity_rating || ""
  );

  const [patientVisitorFirstName, setPatientVisitorFirstName] = useState(
    incident.patient_visitor?.first_name || " "
  );
  const [patientVisitorLastName, setPatientVisitorLastName] = useState(
    incident.patient_visitor?.last_name || " "
  );
  const [incidentDate, setIncidentDate] = useState(incident.incident_date ?? "");
  const [incidentTime, setIncidentTime] = useState(incident.incident_time ?? "");
  const [medicalRecoredNumber, setMedicalRecordNumber] = useState(
    incident.patient_visitor?.medical_record_number
  );
  const [address, setAddress] = useState(incident.patient_visitor?.address ?? "");
  const [state, setState] = useState(incident.patient_visitor?.state ?? "");
  const [zipCode, setZipCode] = useState(incident.patient_visitor?.zip_code ?? "");
  const [phoneNumber, setPhoneNumber] = useState(
    incident.patient_visitor?.phone_number ?? ""
  );
  const [sex, setSex] = useState(incident.patient_visitor?.gender ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(
    incident.patient_visitor?.date_of_birth
  );
  const [age, setAge] = useState(incident.patient_visitor?.age ?? "");

  // Incident Location

  const [location, setLocation] = useState(incident.location ?? "");
  const [status, setStatus] = useState(incident.status ?? "");
  const [contributingDiagnosis, setContributingDiagnosis] = useState(
    incident.consulting_diagnosis ?? ""
  );
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [otherStatus, setOtherStatus] = useState(incident.other_status ?? "");
  const [incidentType, setIncidentType] = useState(incident.incident_type ?? "");
  const [fallType, setFallType] = useState(incident.fall_related_type ?? "");
  const [fellOffOf, setFellOffOf] = useState(null);
  const [selectedTreatment, setSelectedTreatment] = useState(incident.treatment_type ?? "");
  const [agreement, setAgreement] = useState(
    (incident.fall_type_agreement &&
      incident.fall_type_agreement.split(", ")) ||
      []
  );
  const [treatmentRelated, setTreatmentRelated] = useState(null);
  const [equipmentMalfunction, setEquipmentMalfunction] = useState(null);
  const [outCome, setOutCome] = useState(incident.outcome ?? "");
  const [actionsTaken, setActionsTaken] = useState(
    incident.outcome_actions_taken ?? ""
  );
  const [adverseDrugReaction, setAdverseDrugReaction] = useState(null);
  const [otherTypes, setOtherTypes] = useState(null);
  const [outComeType, setOutComeType] = useState("mild");
  const [maintenanceNotified, setMaintenanceNotified] = useState(null);
  const [removedFromService, setRemovedFromService] = useState(null);
  const [equipmentType, setEquipmentType] = useState("");
  const [equipmentManuFacture, setEquipmentManuFacture] = useState("");
  const [equipmentModel, setEquipmentModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [missingFields, setMissingFields] = useState([]);
  const [morseFallScore, setMorseFallScore] = useState(
    incident.morse_fall_score || ""
  );
  const [others, setOthers] = useState([]);
  const [selectedOutcome, setSelectedOutcome] = useState(incident.outcome ?? "");
  const [immediateActionsTaken, setImmediateActionsTaken] = useState(
    incident.immediate_action_taken
  );
  const [briefSummary, setBriefSummary] = useState(
    incident.brief_summary_of_incident
  );

  const [physicianNotifiedFirstName, setPhysicianNotifiedFirstName] = useState(
    incident.physician_notified?.first_name || ""
  );
  const [physicianNotifiedLastName, setPhysicianNotifiedLastName] = useState(
    incident.physician_notified?.last_name || ""
  );
  const [physcianDate, setPhyscianDate] = useState(
    incident.date_physician_notified
  );
  const [physcianTime, setPhyscianTime] = useState(
    incident.time_physician_notified
  );

  const [familyNotifiedFirstName, setFamilyNotifiedFirstName] = useState(
    incident.family_notified?.first_name || ""
  );
  const [familyNotifiedLastName, setFamilyNotifiedLastName] = useState(
    incident.family_notified?.last_name || ""
  );
  const [otherOutcome, setOtherOutcome] = useState(null);
  const [familyDate, setFamilyDate] = useState(incident.date_family_notified ?? "");
  const [familyTime, setFamilyTime] = useState(incident.time_family_notified ?? "");

  const [notifiedByFirstName, setNotifiedByFirstName] = useState(
    incident.notified_by?.first_name || ""
  );
  const [notifiedByLastName, setNotifiedByLastName] = useState(
    incident.notified_by?.last_name || ""
  );
  const [city, setCity] = useState(incident.patient_visitor?.city ?? "");
  const [selectedOthers, setSelectedOthers] = useState(null);
  const [specialChecked, setSpecialChecked] = useState({});
  const [errors, setErrors] = useState({});
  const [fallFromDetails, setFallFromDetails] = useState(incident.fell_from ?? "");
  const [fallRelated, setFallRelated] = useState("");
  const [otherTreatment, setOtherTreatment] = useState("");
  const [fallTypeOther, setFallTypeOther] = useState("");

  const specialTypes = ["Unusable", "Mislabeled", "Missing"];

  localStorage.setItem("patientId", incident?.patient_visitor?.id);

  const handleSpecialCheck = (type) => {
    setSpecialChecked((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };
  const handleOtherClick = (type) => {
    setOtherTypes(type);
    setErrors({});
    if (type !== "Specimen") {
      setSpecialChecked({});
    }
  };

  const handleCategory = (value) => {
    setCategory(value);
  };

  const handleRemovedFromService = (checked) => {
    setRemovedFromService(checked);
  };

  const handleMaintenanceNotified = (checked) => {
    setMaintenanceNotified(checked);
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
  };

  const handleModify = async (incidentStatus) => {
    const incidentData = {
      facility_id: checkCurrentAccount(),
      action: "modify",
      category: category,
      severity_rating: severityRating,
      patient_visitor: {
        first_name: patientVisitorFirstName,
        last_name: patientVisitorLastName,
        phone_number: phoneNumber,
        address: address,
        state: state,
        gender: sex,
        age: age,
        date_of_birth: dateOfBirth,
        zip_code: zipCode,
        city: city,
        medical_record_number: medicalRecoredNumber,
        profile_type: "Patient",
      },
      incident_date: incidentDate,
      incident_time: incidentTime,
      location: location,
      medical_record_number: medicalRecoredNumber,

      consulting_diagnosis: contributingDiagnosis,
      patient_status_prior: statusPrior.join(", "),
      incident_type: incidentType,
      fall_related_type: fallType,
      morse_fall_score: morseFallScore,
      fell_from: fallFromDetails,
      fall_type_other: fallType === "Other" ? fallTypeOther : null,
      fall_type_agreement: agreement.join(", "),
      // incident_type: incidentTypesData,
      equipment_type: equipmentType,
      removed_from_service: removedFromService,
      equipment_serial_number: serialNumber,
      equipment_lot_number: lotNumber,
      equipment_manufacturer: equipmentManuFacture,
      equipment_model: equipmentModel,
      physician_notified: {
        first_name: physicianNotifiedFirstName,
        last_name: physicianNotifiedLastName,
        profile_type: "Physician",
      },

      date_physician_notified: physcianDate,
      time_physician_notified: physcianTime,

      family_notified: {
        first_name: familyNotifiedFirstName,
        last_name: familyNotifiedLastName,
        patient_id: parseInt(localStorage.getItem("patientId")),
        profile_type: "Family",
      },

      date_family_notified: familyDate,
      time_family_notified: familyTime,

      notified_by: {
        first_name: notifiedByFirstName,
        last_name: notifiedByLastName,
        profile_type: "Nurse",
      },

      outcome: selectedOutcome,

      immediate_action_taken: immediateActionsTaken,
      status: incidentStatus,
      brief_summary_of_incident: briefSummary,
      status: "Open",
      severity_rating: severityRating,
      treatment_type: selectedTreatment
    };

    // console.log(cleanedData(incidentData));
    console.log("Submitting incident data", JSON.stringify(incidentData));

    try {
      console.log(cleanedData(incidentData));
      const response = await api.patch(
        `/incidents/general-visitor/${generalIncidentId}/`,
        cleanedData(incidentData)
      );

      console.log("response:", response.data);
      if (response.status === 200) {
        window.customToast.success("Incident is updated successfully");
        setIsLoading(false);
        setSavingDraft(false);
        postDocumentHistory(incidentId, "modified this incident", "modify");
      }
    } catch (error) {
      if (error.response) {
        window.customToast.error(
          error.response.data.message ||
            error.response.data.error ||
            "Error updating the incident"
        );
      } else {
        alert("Unknown error updating the incident");
      }
      console.log(error);
      setIsLoading(false);
      setSavingDraft(false);
    }
  };

  useEffect(() => {
    // get documents

    const fetchIncidentDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/general-visitor/${generalIncidentId}/documents/`
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

  return data.is_resolved ? (
    <CantModify />
  ) : (
    <div className="modify-page-content">
      <div className="modify-page-header">
        <BackToPage
          link={"/incident/general/"}
          pageName={"General incidents"}
        />
        <h2 className="title">Modifying General Incident</h2>
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
      <form className="modify-forms">
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
          <div>
            <h3>General info</h3>
            <div className="inputs-group modify-inputs">
              <div className="field date">
                <label htmlFor="">Category</label>
                <CustomSelectInput
                  options={["Inpatient", "Outpatient", "ER", "Visitor"]}
                  selected={category}
                  setSelected={handleCategory}
                  placeholder={"Select incident Category"}
                />
              </div>

              <div className="half">
                <div className={`field name`}>
                  <label htmlFor="patientName">
                    Patient/Visitor first name
                  </label>
                  <input
                    // onClick={handleShowPatientSuggestions}
                    onChange={(e) => setPatientVisitorFirstName(e.target.value)}
                    value={patientVisitorFirstName}
                    type="text"
                    name="patientVisitorFirstName"
                    id="patientVisitorFirstName"
                    placeholder="Patient or visitors first name"
                  />
                  {/* {showSuggestions && (
                <div className="suggestions">
                  <UserSuggestions
                    string={patientVisitorName}
                    handleSuggestion={handleSuggestion}
                    suggestions={suggestions}
                    filteredSuggestions={filteredSuggestions || suggestions}
                    isLoading={fetchingSuggestions}
                  />
                </div>
              )} */}
                </div>
                <div className={`field name `}>
                  <label htmlFor="patientName">Patient/Visitor last name</label>
                  <input
                    // onClick={handleShowPatientSuggestions}
                    onChange={(e) => setPatientVisitorLastName(e.target.value)}
                    value={patientVisitorLastName}
                    type="text"
                    name="patientVisitorLastName"
                    id="patientVisitorLastName"
                    placeholder="Patient or visitors last name"
                  />
                  {/* {showSuggestions && (
                <div className="suggestions">
                  <UserSuggestions
                    string={patientVisitorName}
                    handleSuggestion={handleSuggestion}
                    suggestions={suggestions}
                    filteredSuggestions={filteredSuggestions || suggestions}
                    isLoading={fetchingSuggestions}
                  />
                </div>
              )} */}
                </div>
              </div>

              <div className="sex field name">
                <label htmlFor="sex">Sex</label>
                <CustomSelectInput
                  options={["Male", "Female", "Others"]}
                  placeholder={"sex"}
                  selected={sex}
                  setSelected={setSex}
                />
              </div>

              <div className="half">
                <div className="incident-date field">
                  <label htmlFor="incidentDate">Date of birth</label>
                  <CustomDatePicker
                    selectedDate={dateOfBirth}
                    setSelectedDate={setDateOfBirth}
                  />
                </div>

                <div className="age field">
                  <label htmlFor="">Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    value={age ?? ""}
                    onChange={(e) => setAge(e.target.value)}
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
                    defaultTime={incident.incident_time}
                    setTime={setIncidentTime}
                  />
                </div>
              </div>
              <div className="mr field">
                <label htmlFor="incidentMr">
                  Medical Record Number (if any)
                </label>
                <input
                  onChange={(e) => setMedicalRecordNumber(e.target.value)}
                  value={medicalRecoredNumber}
                  type="text"
                  name="medicalRecoredNumber"
                  id="medicalRecoredNumber"
                  placeholder="Enter MR"
                />
              </div>

              <div className=" field">
                <label htmlFor="address">Address</label>
                <input
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  type="text"
                  name="address"
                  placeholder="Enter  patient or visitor address"
                />
              </div>

              <div className="field">
                <div className="city">
                  <label htmlFor="city">City</label>
                  <input
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                    type="text"
                    name="city"
                    id="city"
                    placeholder="City"
                  />
                </div>
              </div>

              <div className="state field">
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
              <div className="zipCode">
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

              <div className="phoneNumber">
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

              <div className="field name">
                <label htmlFor="incidentLocation">Incident location</label>
                <input
                  onChange={(e) => setLocation(e.target.value)}
                  value={location}
                  type="text"
                  name="incidentLocation"
                  id="incidentLocation"
                  placeholder="Enter incident location"
                />
              </div>
              <div className="field name">
                <label htmlFor="contributingDiagnosis">
                  Contributing diagnosis
                </label>
                <input
                  onChange={(e) => setContributingDiagnosis(e.target.value)}
                  value={contributingDiagnosis}
                  type="text"
                  name="contributingDiagnosis"
                  id="contributingDiagnosis"
                  placeholder="Enter contributing diagnosis"
                />
              </div>

              <div className="statuses full field">
                <label htmlFor="statuses">
                  Select patient/visitor status prior to incident
                </label>
                <div
                  className="check-boxes check-boxes-row"
                  //  onChange={(e) => setRoute(e.target.value)}
                  //  value={route}
                >
                  {statusesPrionToIncident.map((status, index) => (
                    <div
                      key={index}
                      className="check-box"
                      onClick={() => handleCheckboxChange(status.description)}
                    >
                      {statusPrior.includes(status.description) ? (
                        <SquareCheck />
                      ) : (
                        <Square />
                      )}
                      <p>{status.description}</p>
                    </div>
                  ))}
                </div>
                {showPriorStatusOtherInput && (
                  <input
                    type="text"
                    placeholder="Enter other prior status"
                    value={statusPriorOtherInput}
                    onChange={handlePriorStatusOtherInputChange}
                  />
                )}
              </div>

              {selectedStatus === "Other" ? (
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
              <h3>Incident type</h3>
              <div className="field full">
                <CustomSelectInput
                  options={[
                    "Fall related",
                    "Treatment related",
                    "Equipment malfunction",
                    "Others",
                  ]}
                  value={incidentType}
                  placeholder={"incident type"}
                  selected={incidentType}
                  setSelected={setIncidentType}
                />
              </div>
              <div className="field full">
                {incidentType === "Fall related" ? (
                  <div className="fall-related">
                    <h3>Fall related incident</h3>

                    <div className="types">
                      <div className="field name">
                        <label htmlFor="incidentLocation">Fall type</label>
                        <CustomSelectInput
                          options={[
                            "Reported fall; not observed by staff",
                            "Found on floor",
                            "Lowered/Assisted to floor",
                            "Fall from:",
                            "While walking",
                            "While standing",
                            "While sitting",
                            "Other",
                          ]}
                          placeholder={"fall type"}
                          selected={fallType}
                          setSelected={setFallType}
                        />
                        {fallType === "Other" && (
                          <input
                            type="text"
                            name="other"
                            id="other"
                            className="other"
                            placeholder="Explain other fall type"
                            value={fallTypeOther}
                            onChange={(e) => setFallTypeOther(e.target.value)}
                          />
                        )}
                      </div>

                      {fallType === "Fall from:" && (
                        <div className="field name">
                          <label htmlFor="fallFromDetails">Fell from:</label>
                          <input
                            type="text"
                            name="fallFromDetails"
                            id="fallFromDetails"
                            placeholder="Enter Equipment"
                            onChange={(e) => setFallFromDetails(e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                    {fallType === "fell off of" ? (
                      <div className="field name">
                        <label htmlFor="morseFallScore">
                          Please click the checkbox to indicate your agreement
                        </label>
                        <div className="types">
                          {incidentTypesData.fell_of_of.map((type, index) => (
                            <div
                              onClick={() => setFellOffOf(type.name)}
                              className={
                                fellOffOf === type.name
                                  ? `type selected `
                                  : `type `
                              }
                            >
                              <p>{type.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <div className="field name">
                      <label htmlFor="morseFallScore">Morse fall score</label>
                      <input
                        onChange={(e) => setMorseFallScore(e.target.value)}
                        type="number"
                        name="morseFallScore"
                        id="morseFallScore"
                        value={morseFallScore}
                        placeholder="Enter Score"
                      />
                    </div>
                    <div className="field name">
                      <label htmlFor="morseFallScore">
                        Please click the checkbox to indicate your agreement
                      </label>
                      {agreement === "Were the side rails up" ? (
                        <div className="field">
                          <div className="field">
                            <label htmlFor="typeSomeStuff"></label>
                            <input
                              type="text"
                              name="typeSomeStuff"
                              id="typeSomeStuff"
                              placeholder="Enter some stuff"
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="types">
                          <div>
                            <div className="types">
                              {incidentTypesData.agreements.map(
                                (type, index) => {
                                  if (
                                    (type.name === "Chemical" ||
                                      type.name === "Four side rails" ||
                                      type.name === "Wrist restraints") &&
                                    !showRestrainOptions
                                  ) {
                                    return null;
                                  }

                                  return (
                                    <div
                                      key={index}
                                      onClick={() =>
                                        handleAgreementClick(type.name)
                                      }
                                      className={
                                        restraintOn.includes(type.name)
                                          ? `type selected ${type.name}`
                                          : "type"
                                      }
                                    >
                                      <p>{type.name}</p>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : incidentType === "Treatment related" ? (
                  <div className="treatment-status">
                    <div className="statuses">
                      <label htmlFor="statuses">Select Treatment</label>
                      <div className="status-choices">
                        <div
                          onClick={() =>
                            setSelectedTreatment("Blood product problem")
                          }
                          className={
                            selectedTreatment === "Blood product problem"
                              ? "status selected"
                              : "status"
                          }
                        >
                          <p>Blood product problem</p>
                        </div>
                        <div
                          onClick={() => setSelectedTreatment("consent")}
                          className={
                            selectedTreatment === "consent"
                              ? "status selected"
                              : "status"
                          }
                        >
                          <p>consent</p>
                        </div>
                        <div
                          onClick={() => setSelectedTreatment("incorrect site")}
                          className={
                            selectedTreatment === "incorrect site"
                              ? " status selected"
                              : "status"
                          }
                        >
                          <p>incorrect site</p>
                        </div>
                        <div
                          onClick={() => setSelectedTreatment("incorrect prep")}
                          className={
                            selectedTreatment === "incorrect prep"
                              ? "status selected"
                              : "status"
                          }
                        >
                          <p>incorrect prep</p>
                        </div>
                        <div
                          onClick={() =>
                            setSelectedTreatment("patient identification")
                          }
                          className={
                            selectedTreatment === "patient identification"
                              ? "status selected"
                              : "status"
                          }
                        >
                          <p>patient identification</p>
                        </div>
                        <div
                          onClick={() =>
                            setSelectedTreatment("sterility issue")
                          }
                          className={
                            selectedTreatment === "sterility issue"
                              ? "status selected"
                              : "status"
                          }
                        >
                          <p>sterility issue</p>
                        </div>
                        <div
                          onClick={() =>
                            setSelectedTreatment("tissue/ specimen problem")
                          }
                          className={
                            selectedTreatment === "tissue/ specimen problem"
                              ? "status selected"
                              : "status"
                          }
                        >
                          <p>tissue/ specimen problem</p>
                        </div>

                        <div
                          onClick={() => setSelectedTreatment("others")}
                          className={
                            selectedTreatment === "others"
                              ? "status selected"
                              : "status"
                          }
                        >
                          <p>others</p>
                        </div>
                        {selectedTreatment === "others" ? (
                          <div className="other-field">
                            <div className="field name">
                              <input
                                onChange={(e) =>
                                  setOtherTreatment(e.target.value)
                                }
                                value={otherTreatment}
                                type="text"
                                name="otherTreatment"
                                id="othertreatment"
                                placeholder="Enter other treatment"
                              />
                            </div>
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                  </div>
                ) : incidentType === "equipment malfunction" ? (
                  <div className="treatment-related">
                    <h1>Equipment Malfunction related</h1>
                    <div className="equipment-related">
                      <div className="half">
                        <div className="check-box">
                          <input
                            onChange={() => handleRemovedFromService(true)}
                            checked={removedFromService}
                            type="checkbox"
                            name="removedFromService"
                            id="removedFromService"
                          />
                          <label htmlFor="removedFromService">
                            Removed from service
                          </label>
                        </div>

                        <div className="check-box">
                          <input
                            onChange={() => handleMaintenanceNotified(true)}
                            checked={maintenanceNotified}
                            type="checkbox"
                            name="maintenanceNotified"
                            id="maintenanceNotified"
                          />
                          <label htmlFor="maintenanceNotified">
                            Clinical engineering / <br />
                            Maintenance notified
                          </label>
                        </div>
                      </div>
                      <div className="half">
                        <div className="field">
                          <label htmlFor="equipmentType">Equipment type</label>
                          <input
                            onChange={(e) => setEquipmentType(e.target.value)}
                            value={equipmentType}
                            type="text"
                            name="equipmentType"
                            id="equipmentType"
                            placeholder="Enter equipment type"
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="equipmentManuFacture">
                            Manufacturer
                          </label>
                          <input
                            onChange={(e) =>
                              setEquipmentManuFacture(e.target.value)
                            }
                            value={equipmentManuFacture}
                            type="text"
                            name="equipmentManuFacture"
                            id="equipmentManuFacture"
                            placeholder="Enter manufacturer"
                          />
                        </div>
                      </div>

                      <div className="half">
                        <div className="field">
                          <label htmlFor="equipmentModel">Model</label>
                          <input
                            onChange={(e) => setEquipmentModel(e.target.value)}
                            value={equipmentModel}
                            type="text"
                            name="equipmentModel"
                            id="equipmentModel"
                            placeholder="Enter model"
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="serialNumber">Serial No</label>
                          <input
                            onChange={(e) => setSerialNumber(e.target.value)}
                            value={serialNumber}
                            type="text"
                            name="serialNumber"
                            id="serialNumber"
                            placeholder="Enter serial number"
                          />
                        </div>
                      </div>
                      <div className="field">
                        <label htmlFor="LoadNumber">Lot/control no</label>
                        <input
                          onChange={(e) => setLotNumber(e.target.value)}
                          value={lotNumber}
                          type="text"
                          name="LoadNumber"
                          id="LoadNumber"
                          placeholder="Enter lot no"
                        />
                      </div>
                    </div>
                  </div>
                ) : incidentType === "injury_or_outcome" ? (
                  <div className="treatment-related">
                    <h1>Treatment related</h1>
                    <div className="types">
                      {incidentTypesData.injury_or_outcome.map(
                        (type, index) => (
                          <div
                            onClick={() => setOutCome(type.name)}
                            className={
                              outCome === type.name ? "type selected" : "type"
                            }
                          >
                            <p>{type.name}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ) : incidentType === "adverse_drug_reaction" ? (
                  <div className="treatment-related">
                    <h2>Adverse drug reaction</h2>
                    <div className="half">
                      <div className="field">
                        <label htmlFor="suspectedMedication">
                          Suspected medication
                        </label>
                        <input
                          type="text"
                          name="suspectedMedication"
                          id="suspectedMedication"
                          placeholder="Suspected  medication"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="medicationDose">Dose</label>
                        <input
                          type="text"
                          name="medicationDose"
                          id="medicationDose"
                          placeholder="Enter Dose"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="medicationRoute">Route</label>
                        <input
                          type="text"
                          name="medicationRoute"
                          id="medicationRoute"
                          placeholder="Suspected  medication"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="frequency">Frequency</label>
                        <input
                          type="text"
                          name="frequency"
                          id="frequency"
                          placeholder="Enter Frequency"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="suspectedRate">Rate if iv</label>
                        <input
                          type="text"
                          name="suspectedRate"
                          id="suspectedRate"
                          placeholder="Enter Rate"
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="dateOfMedicationOrder">
                          date of medication order
                        </label>
                        <input
                          type="date"
                          name="dateOfMedicationOrder"
                          id="dateOfMedicationOrder"
                          placeholder="Enter date of medication order"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="informationOn">
                        Information on this reaction can be found on
                      </label>
                      <input
                        type="text"
                        name="informationOn"
                        id="informationOn"
                        placeholder="Enter here"
                      />
                    </div>

                    <div className="check-boxes-container">
                      <p>Information on this reaction can be found in</p>
                      <div className="check-boxes">
                        <div className="check-box">
                          <input
                            type="checkbox"
                            name="nurseNotes"
                            id="nurseNotes"
                          />
                          <label htmlFor="nurseNotes">Nurse notes</label>
                        </div>
                        <div className="check-box">
                          <input
                            type="checkbox"
                            name="progressNotes"
                            id="progressNotes"
                          />
                          <label htmlFor="progressNotes">Progress notes</label>
                        </div>
                        <div className="check-box">
                          <input type="checkbox" name="other" id="other" />
                          <label htmlFor="other">Other notes</label>
                        </div>
                      </div>
                    </div>

                    <div className="check-box">
                      <label htmlFor="wasReactionTreated">
                        Was reaction treated?
                      </label>
                      <input
                        type="checkbox"
                        name="wasReactionTreated"
                        id="wasReactionTreated"
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="treatmentDescription">
                        Describe treatment
                      </label>
                      <input
                        type="text"
                        name="treatmentDescription"
                        id="treatmentDescription"
                        placeholder="Describe Treatment"
                      />
                    </div>
                  </div>
                ) : incidentType === "others" ? (
                  <div className="treatment-related">
                    <h1>Others</h1>
                    <div className="types">
                      {incidentTypesData.others.map((type, index) => (
                        <div
                          key={index}
                          onClick={() => setOtherTypes(type.name)}
                          className={
                            otherTypes === type.name ? "type selected" : "type"
                          }
                          style={{
                            display:
                              specialTypes.includes(type.name) &&
                              otherTypes !== "Specimen"
                                ? "none"
                                : "block",
                          }}
                        >
                          <p>{type.name}</p>
                        </div>
                      ))}
                    </div>

                    {otherTypes === "other" && (
                      <div className="field">
                        <input
                          onChange={(e) => setOthers(e.target.value)}
                          value={others}
                          type="text"
                          name="others"
                          id="others"
                          placeholder="Enter details"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>

            <div className="inputs-group modify-inputs">
              <h3>Incident Outcome</h3>
              <div className="field full">
                <label htmlFor="statuses"></label>
                <div className="status-choices">
                  <div
                    onClick={() => setSelectedOutcome("No Apparent Injury")}
                    className={
                      selectedOutcome === "No Apparent Injury"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>No Apparent Injury</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Delay in treatment")}
                    className={
                      selectedOutcome === "Delay in treatment"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Delay in treatment</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Loss of consciousness")}
                    className={
                      selectedOutcome === "Loss of consciousness"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Loss of consciousness</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Death")}
                    className={
                      selectedOutcome === "Death"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Death</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("abrasion")}
                    className={
                      selectedOutcome === "abrasion"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>abrasion</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("dislocation")}
                    className={
                      selectedOutcome === "dislocation"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>dislocation</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Neurologic change")}
                    className={
                      selectedOutcome === "Neurologic change"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Neurologic change</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Allergic reaction")}
                    className={
                      selectedOutcome === "Allergic reaction"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Allergic reaction</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("ecchymosis")}
                    className={
                      selectedOutcome === "ecchymosis"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>ecchymosis</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("pain")}
                    className={
                      selectedOutcome === "pain"
                        ? "status selected status"
                        : "status"
                    }
                  >
                    <p>pain</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("amputation")}
                    className={
                      selectedOutcome === "amputation"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>amputation</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("fracture")}
                    className={
                      selectedOutcome === "fracture"
                        ? "status selected status"
                        : "status"
                    }
                  >
                    <p>fracture</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Sprain/strain")}
                    className={
                      selectedOutcome === "Sprain/strain"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Sprain/strain</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("burn")}
                    className={
                      selectedOutcome === "burn"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>burn</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("hematoma")}
                    className={
                      selectedOutcome === "hematoma"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>hematoma</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Infection")}
                    className={
                      selectedOutcome === "Infection"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Infection</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("Lab redraw required")}
                    className={
                      selectedOutcome === "Lab redraw required"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>Lab redraw required</p>
                  </div>
                  <div
                    onClick={() => setSelectedOutcome("laceration")}
                    className={
                      selectedOutcome === "laceration"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>laceration</p>
                  </div>

                  <div
                    onClick={() => setSelectedOutcome("others")}
                    className={
                      selectedOutcome === "others"
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>others</p>
                  </div>
                </div>
              </div>
              {selectedOutcome === "others" && (
                <div className="field full">
                  <label htmlFor="">Explain the outcome</label>
                  <input
                    onChange={(e) => setOtherOutcome(e.target.value)}
                    value={otherOutcome}
                    type="text"
                    name="otherOutcome"
                    id="otherOutcome"
                    placeholder="Explain"
                  />
                </div>
              )}
            </div>

            <div className="inputs-group modify-inputs">
              <h3 className="full">Notification</h3>

              <div className="half">
                <div className="field">
                  <label htmlFor="physicianNotifiedFirstName">
                    Physician notified first name
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
                    Physician notified last name
                  </label>
                  <input
                    onChange={(e) =>
                      setPhysicianNotifiedLastName(e.target.value)
                    }
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

              <hr className="full" />
              <div className="half">
                <div className="field">
                  <label htmlFor="familyNotifiedFirstName">
                    Family notified first name
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
                    Family notified last name
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
                <div className="field">
                  <label htmlFor="notifiedByFirstName">
                    Notified by first name
                  </label>
                  <input
                    onChange={(e) => setNotifiedByFirstName(e.target.value)}
                    type="text"
                    name="notifiedByFirstName"
                    id="notifiedByFirstName"
                    placeholder="Enter first name"
                    value={notifiedByFirstName}
                  />
                </div>
                <div className="field">
                  <label htmlFor="notifiedByLastName">
                    Notified by last name
                  </label>
                  <input
                    onChange={(e) => setNotifiedByLastName(e.target.value)}
                    type="text"
                    name="notifiedByLastName"
                    id="notifiedByLastName"
                    placeholder="Enter last name"
                    value={notifiedByLastName}
                  />
                </div>
              </div>
            </div>

            <div className="inputs-group modify-inputs">
              <h3 className="full">Other Info</h3>
              <div className="full">
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
              </div>
              <div className="half full">
                <div className="field half-field">
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
                    Immediate actions taken
                  </label>
                  <RichTexField
                    value={immediateActionsTaken}
                    onEditorChange={setImmediateActionsTaken}
                  />
                </div>
              </div>
              <div className="field full">
                <h3>Supporting documents</h3>

                <FilesList
                  setDocuments={setUploadedFiles}
                  documents={uploadedFiles}
                  apiLink={"general"}
                  incidentId={incident.id}
                />

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
          </div>
        </div>
      </form>
    </div>
  );
};
export default ModifyGeneralIncidentForm;
