"use client";

import toast from "react-hot-toast";
import React, { useRef, useState, useEffect } from "react";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import RichTexField from "@/components/forms/RichTextField";
import api, { cleanedData, calculateAge } from "@/utils/api";
import mediaAPI from "@/utils/mediaApi";
import {
  whatHappenedOptions,
  drugRoutes,
  severityCategories,
  contributingFactors,
  errorTypes,
} from "@/constants/constants";
import { SquareCheck, SaveAll, LoaderCircle, Square } from "lucide-react";
import "@/styles/_modifyIncident.scss";
import postDocumentHistory from "../documentHistory/postDocumentHistory";
import FilesList from "../documentHistory/FilesList";
import CustomTimeInput from "@/components/CustomTimeInput";
import { useDepartments, usePermission } from "@/context/PermissionsContext";
import CantModify from "@/components/CantModify";
import BackToPage from "@/components/BackToPage";
const ModifyMedicalErrorForm = ({ data, incidentId }) => {
  const permission = usePermission();
  const department = useDepartments();
  const [incident, setIncident] = useState(data);
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState(incident?.status);
  const [savingDraft, setSavingDraft] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);

  const [physicianFirstName, setPhysicianFirstName] = useState(
    incident?.provider_info?.first_name
  );
  const [physicianLastName, setPhysicianLastName] = useState(
    incident?.provider_info?.last_name
  );
  const [firstName, setFirstName] = useState(incident?.patient?.first_name);
  const [lastName, setLastName] = useState(incident?.patient?.last_name);
  const [severityRating, setSeverityRating] = useState(
    incident?.severity_rating ?? ""
  );
  const [age, setAge] = useState(incident?.patient?.age);
  const [mrn, setMrn] = useState(incident?.patient?.medical_record_number);
  const [dateOfBirth, setDateOfBirth] = useState(
    incident?.patient?.date_of_birth
  );
  const [dayWeek, setDayWeek] = useState(incident?.day_of_the_week);
  const [hour, setHour] = useState(incident?.hours);
  const [date, setDate] = useState(incident?.date_of_error);
  const [dateNotified, setDateNotified] = useState(incident?.date_of_report);
  const [timeNotified, setTimeNotified] = useState(incident?.time_of_report);
  const [time, setTime] = useState(incident?.time_of_error);
  const [location, setLocation] = useState(incident?.location);
  const [staffClassification, setStaffClassification] = useState(
    incident?.provider_classification
  );
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [staffStatus, setStaffStatus] = useState(incident?.staff_status);
  const [varienceDuration, setVarienceDuration] = useState(incident?.days);
  const [drugOrdered, setDrugOrdered] = useState(incident?.drug_ordered);
  const [drugOrderedRoutes, setDrugOrderedRoutes] = useState(
    incident?.drug_ordered_route?.split(", ") || []
  );
  const [otherDrugRoute, setOtherDrugRoute] = useState("");
  const [drugGiven, setDrugGiven] = useState(incident?.drug_given);
  const [drugGivenRoutes, setDrugGivenRoutes] = useState(
    incident?.drug_given_route?.split(", ") || []
  );
  const [formError, setFormError] = useState(incident?.form_of_error);
  const [actionTaken, setActionTaken] = useState(incident?.actions_taken);
  const [comment, setComment] = useState(incident?.comments);
  const [route, setRoute] = useState([]);
  const [routeOtherInput, setRouteOtherInput] = useState("");
  const [secondRouteOtherInput, setSecondRouteOtherInput] = useState("");
  const [secondRoute, setSecondRoute] = useState([]);
  const [showRouteOtherInput, setShowRouteOtherInput] = useState(false);
  const [showSecondRouteOtherInput, setShowSecondRouteOtherInput] =
    useState(false);

  const [whatHappened, setWhatHappened] = useState(
    incident?.what_happened?.split(", ") || []
  );
  const [otherWhatHappened, setOtherWhatHappened] = useState("");
  const [showWhatHappenedOtherInput, setshowWhatHappenedOtherInput] =
    useState("");

  const [descriptionError, setDescriptionError] = useState(
    incident?.description_of_error
  );
  const [contributingfactors, setContributingFactors] = useState(
    incident?.contributing_factors
  );

  const [category, setCategory] = useState(() => {
    try {
      return typeof incident?.error_category === "string"
        ? JSON.parse(incident.error_category)
        : incident?.error_category || {};
    } catch {
      return {};
    }
  });
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [medicationErrorIncidentId, setMedicationErrorIncidentId] = useState(
    localStorage.getItem("medicationErrorIncidentId")
  );

  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState(
    data.department ? data.department.id : "",
    data.department ? data.department.id : ""
  );

  const handleDepartmentChange = (event) => {
    setSelectedDepartmentId(event.target.value);
  };

  useEffect(
    () => {
      if (!data.report_facility) return;

      const fetchDepartments = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(`/departments/`, {
            params: {
              facility_id: data?.report_facility?.id
                ? data?.report_facility.id
                : data?.report_facility,
            },
          });
          if (response.status === 200) {
            setDepartments(response.data.results);
          }
        } catch (error) {
          toast.error("Error fetching departments");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchDepartments();
    },
    data.report_facilit ? [data.report_facility.id] : []
  );
  const handleDrugOrderedRoute = (drug) => {
    // check if the route is not in the array of routes, then add it else, remove it

    if (drugOrderedRoutes && !drugOrderedRoutes.includes(drug)) {
      // drugOrderedRoutes.push(drug)
      setDrugOrderedRoutes([...drugOrderedRoutes, drug]);
    } else {
      // remove incident from the array
      setDrugOrderedRoutes(
        drugOrderedRoutes && drugOrderedRoutes.filter((item) => item !== drug)
      );
    }
  };

  const handleRouteOtherInputChange = (route) => {
    // Check if an entry with the same label or value already exists
    if (route === "ordered") {
      if (!drugRoutes.some((route) => route.label === otherDrugRoute)) {
        // Add the new route if it doesn't already exist
        drugRoutes.push({
          label: otherDrugRoute,
          value: otherDrugRoute,
        });
      }
      handleDrugOrderedRoute(otherDrugRoute);
    } else if (route === "given") {
      if (!drugRoutes.some((route) => route.label === otherDrugRoute)) {
        // Add the new route if it doesn't already exist
        drugRoutes.push({
          label: otherDrugRoute,
          value: otherDrugRoute,
        });
      }

      handleDrugOrderedRoute(otherDrugRoute);
      setOtherDrugRoute("");
    }
  };

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);
    setDateOfBirth(date);
    setAge(calculatedAge);
  };
  const handleDrugGivenRoute = (drug) => {
    // check if the route is not in the array of routes, then add it
    if (drugGivenRoutes && !drugGivenRoutes.includes(drug)) {
      setDrugGivenRoutes([...drugGivenRoutes, drug]);
    } else {
      setDrugGivenRoutes(
        drugGivenRoutes && drugGivenRoutes.filter((item) => item !== drug)
      );
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
  };
  const handleModify = async (incidentStatus) => {
    if (!selectedDepartmentId) {
      toast.error("Please select a department");
      setIsLoading(false);
      setSavingDraft(false);
      setStatus(data.status);
      return;
    }

    const incidentData = {
      action: "modify",
      report_facility: data.report_facility.id,
      department: parseInt(selectedDepartmentId),
      patient: {
        first_name: firstName || "",
        last_name: lastName || "",
        medical_record_number: mrn,
        age: age,
        date_of_birth: dateOfBirth,
        profile_type: "Patient",
      },

      provider_info: {
        first_name: physicianFirstName || "",
        last_name: physicianLastName || "",
        profile_type: "Physician",
      },
      day_of_the_week: dayWeek,
      date_of_error: date,
      time_of_error: time,
      location: location,
      date_of_birth: incident.date_of_birth || null,
      date_of_report: dateNotified,
      time_of_report: timeNotified,

      follow_up: actionTaken,
      comment: comment,
      provider_classification: staffClassification,
      staff_status: staffStatus,
      days: varienceDuration,
      hours: hour,
      drug_ordered: drugOrdered,
      drug_given: drugGiven,
      drug_ordered_route: drugOrderedRoutes && drugOrderedRoutes.join(", "),
      drug_ordered_route_other: routeOtherInput,
      drug_given_route: drugGivenRoutes && drugGivenRoutes.join(", "),
      drug_given_route_other: secondRouteOtherInput,
      what_happened: whatHappened && whatHappened.join(", "),
      contributing_factors: contributingfactors,
      description_of_error: descriptionError,
      error_category: JSON.stringify(selectedCategory),
      actions_taken: actionTaken,
      comments: comment,
      form_of_error: formError,
      status: incidentStatus,
      severity_rating: severityRating,
    };

    try {
      const response = await api.patch(
        `/incidents/medication-error/${medicationErrorIncidentId}/`,
        cleanedData(incidentData)
      );
      if (response.status === 200) {
        setIsLoading(false);
        setSavingDraft(false);
        toast.success("Incident updated successfully");
        setIncident(response.data.incident);

        postDocumentHistory(incidentId, "modified this incident", "modify");
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message ||
            error.response.data.error ||
            "Error while updating the incident"
        );
      } else {
        toast.error("Unknown error while updating the incident");
      }

      setIsLoading(false);
      setSavingDraft(false);
    }
  };

  const handleWhatHappenedInputChange = () => {
    if (!whatHappenedOptions.some((h) => h.label === otherWhatHappened)) {
      whatHappenedOptions.push({
        value: otherWhatHappened,
        label: otherWhatHappened,
      });
    }

    handleWhatHappenedOptions(otherWhatHappened);
  };

  const handleWhatHappenedOptions = (option) => {
    if (whatHappened && !whatHappened.includes(option)) {
      setWhatHappened([...whatHappened, option]);
    } else {
      setWhatHappened(
        whatHappened && whatHappened.filter((item) => item !== option)
      );
    }
  };

  const handleContributingFactor = (type) => {
    setContributingFactors(type);
  };

  const handleTypeSelection = (errorType) => {
    setDescriptionError(errorType);
  };

  const handleCategory = (category) => {
    setCategory(category);
  };

  const handleSelectedCategory = (category) => {
    setSelectedCategory(category);
  };
  useEffect(() => {
    // get documents
    const fetchIncidentDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/medication-error/${medicationErrorIncidentId}/documents/`
        );
        if (response.status === 200) {
          setUploadedFiles(response.data.results);
        }
      } catch (error) {}
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
        `/incidents/medication-error/${medicationErrorIncidentId}/documents/`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setUploadingDocuments(false);
        toast.success("Files uploaded successfully");
        setUploadedFiles(response.data.files);
      }
    } catch (error) {
      toast.error(error?.response?.data?.error);
      setUploadingDocuments(false);
    }
  };
  return data.is_resolved ? (
    <CantModify />
  ) : (
    <div className="modify-page-content">
      <div className="modify-page-header">
        <BackToPage
          link={"/incidents/medication-error/"}
          pageName={"Medication Error incidents"}
        />
        <h2 className="title">Modifying Medication Error</h2>
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
            <div className="department-select field">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                value={selectedDepartmentId || ""}
                onChange={handleDepartmentChange}
              >
                <option value="">Select a department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.id}>
                    {department.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="half">
              <div className="field name">
                <label htmlFor="employeeFirstName">First name</label>
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  type="text"
                  name="employeeFirstName"
                  id="employeeFirstName"
                  placeholder="Enter first name"
                />
              </div>
              <div className="field name">
                <label htmlFor="employeeLastName">Last name</label>
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  type="text"
                  name="employeeLastName"
                  id="employeeLastName"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="incident-date field">
              <label htmlFor="incidentDate">Date of birth</label>

              <CustomDatePicker
                selectedDate={dateOfBirth}
                setSelectedDate={handleDateOfBirth}
              />
            </div>
            <div className="field small-field">
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
            <div className="field small-field">
              <label htmlFor="medicalRecordNumber">MRN</label>
              <input
                onChange={(e) => setMrn(e.target.value)}
                value={mrn}
                type="text"
                name="medicalRecordNumber"
                id="medicalRecordNumber"
                placeholder="Enter MRN"
              />
            </div>
            <div className="field small-field">
              <label htmlFor="dayOfTheWeek">Day of the week</label>
              <CustomSelectInput
                options={[
                  "Sunday",
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ]}
                placeholder={"Set day of the week"}
                selected={dayWeek}
                setSelected={setDayWeek}
              />
            </div>
            <div className="field small-field">
              <label htmlFor="date">Date</label>

              <CustomDatePicker selectedDate={date} setSelectedDate={setDate} />
            </div>
            <div className="field small-field">
              <label htmlFor="time">Time</label>
              <CustomTimeInput setTime={setTime} defaultTime={time} />
            </div>
            <div className="field small-field">
              <label htmlFor="location">Location</label>
              <input
                onChange={(e) => setLocation(e.target.value)}
                value={location}
                type="text"
                name="location"
                id="location"
                placeholder="Enter location"
              />
            </div>
            <div className="half">
              <div className="field name">
                <label htmlFor="physicianNameFirstName">
                  Physician notified first name
                </label>
                <input
                  onChange={(e) => setPhysicianFirstName(e.target.value)}
                  value={physicianFirstName}
                  type="text"
                  name="physicianNameFirstName"
                  id="physicianNameFirstName"
                  placeholder="Enter first name"
                />
              </div>
              <div className="field name">
                <label htmlFor="physicianNameLastName">
                  Physician notified last name
                </label>
                <input
                  onChange={(e) => setPhysicianLastName(e.target.value)}
                  value={physicianLastName}
                  type="text"
                  name="physicianNameLastName"
                  id="physicianNameLastName"
                  placeholder="Enter last name"
                />
              </div>
            </div>
            <div className="field small-field">
              <label htmlFor="dateNotified">Date Notified</label>

              <CustomDatePicker
                selectedDate={dateNotified}
                setSelectedDate={setDateNotified}
              />
            </div>
            <div className="field small-field">
              <label htmlFor="timeNotified">Time notified</label>
              <CustomTimeInput
                setTime={setTimeNotified}
                defaultTime={timeNotified}
              />
            </div>
            <div className="field small-field">
              <label htmlFor="staffClassification">Classification</label>
              <CustomSelectInput
                options={[
                  "Nurse",
                  "Pharmacist",
                  "Provider",
                  "Direct Staff Support",
                  "Respiratory Therapist",
                ]}
                placeholder={"Select Classifications"}
                selected={staffClassification}
                setSelected={setStaffClassification}
              />
            </div>
            <div className="field small-field">
              <label htmlFor="staffStatus">Status</label>
              <CustomSelectInput
                options={["Full-Time", "Part-Time", "Agency/Contract"]}
                placeholder={"Select status"}
                selected={staffStatus}
                setSelected={setStaffStatus}
              />
            </div>
            <div className="field small-field">
              <label htmlFor="varienceDuration">Duration of Error</label>
              <div className="field">
                <input
                  onChange={(e) => setVarienceDuration(e.target.value)}
                  value={varienceDuration}
                  type="number"
                  name="varienceDuration"
                  id="varienceDuration"
                  placeholder="Enter Days"
                />
                <input
                  onChange={(e) => setHour(e.target.value)}
                  value={hour}
                  type="number"
                  name="varienceDuration"
                  id="varienceDuration"
                  placeholder="Enter Hours"
                />
              </div>
            </div>
          </div>
          <div className="inputs-group modify-inputs">
            <div className="field small-field">
              <label htmlFor="drugOrdered">Drug Ordered</label>
              <input
                onChange={(e) => setDrugOrdered(e.target.value)}
                value={drugOrdered}
                type="text"
                name="drugOrdered"
                id="drugOrdered"
                placeholder="Enter Drug Ordered"
              />
            </div>
            <div className="field full">
              <label htmlFor="drugGiven">Route</label>
              <div className="routes">
                {drugRoutes.map((route, index) => (
                  <div
                    onClick={() => handleDrugOrderedRoute(route.value)}
                    className="check-box"
                    key={index}
                  >
                    {drugOrderedRoutes &&
                    drugOrderedRoutes.includes(route.value) ? (
                      <SquareCheck color="#F87C47" />
                    ) : (
                      <Square />
                    )}
                    <p>{route.label}</p>
                  </div>
                ))}
              </div>
              {drugOrderedRoutes && drugOrderedRoutes.includes("Other") && (
                <div className="other">
                  <input
                    type="text"
                    placeholder="Enter other route"
                    value={otherDrugRoute}
                    onChange={(e) => setOtherDrugRoute(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRouteOtherInputChange("ordered")}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="inputs-group modify-inputs">
            <div className="field small-field">
              <label htmlFor="drugOrdered">Drug Given</label>
              <input
                onChange={(e) => setDrugGiven(e.target.value)}
                value={drugGiven}
                type="text"
                name="drugOrdered"
                id="drugOrdered"
                placeholder="Enter Drug Ordered"
              />
            </div>
            <div className="field full">
              <label htmlFor="drugGiven">Route</label>
              <div className="routes">
                {drugRoutes.map((route, index) => (
                  <div
                    onClick={() => handleDrugGivenRoute(route.value)}
                    className="check-box"
                    key={index}
                  >
                    {drugGivenRoutes &&
                    drugGivenRoutes.includes(route.value) ? (
                      <SquareCheck color="#F87C47" />
                    ) : (
                      <Square />
                    )}
                    <p>{route.label}</p>
                  </div>
                ))}
              </div>
              {drugGivenRoutes && drugGivenRoutes.includes("Other") && (
                <div className="other">
                  <input
                    type="text"
                    placeholder="Enter other route"
                    value={otherDrugRoute}
                    onChange={(e) => setOtherDrugRoute(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRouteOtherInputChange("ordered")}
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="inputs-group modify-inputs full">
            <h1 className="sub-h1 full">
              What happened? Incorrect (check all that apply):
            </h1>
            <div className="field full">
              <div className="routes">
                {whatHappenedOptions.map((option, index) => (
                  <div
                    onClick={() => handleWhatHappenedOptions(option.value)}
                    className="check-box"
                    key={index}
                  >
                    {whatHappened && whatHappened.includes(option.value) ? (
                      <SquareCheck size={20} color="#F87C47" />
                    ) : (
                      <Square size={20} />
                    )}
                    <p>{option.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {whatHappened && whatHappened.includes("Other") && (
              <div className="field small-field">
                <input
                  type="text"
                  value={otherWhatHappened}
                  placeholder="Enter what happened"
                  onChange={(e) => setOtherWhatHappened(e.target.value)}
                />
                <button onClick={handleWhatHappenedInputChange} type="button">
                  Add
                </button>
              </div>
            )}
            <div className="field full">
              <label htmlFor="dayOfTheWeek">Form of error</label>
              <CustomSelectInput
                options={["Actual", "Near Miss"]}
                placeholder={"Select form"}
                selected={formError}
                setSelected={setFormError}
              />
            </div>
          </div>

          <div className="inputs-group modify-inputs">
            <div className=" field full">
              <div className="types full">
                <h2>
                  Description of error:
                  <span> In your opinion, why did this error occur?</span>
                </h2>
                <p>
                  Please be specific and refer to the example descriptions. If
                  necessary, briefly describe error. Error in:
                </p>
                {errorTypes.map((error, index) => (
                  <div
                    key={index}
                    className={`type full full-width-type ${
                      descriptionError === error.name ? "selected" : ""
                    }`}
                    onClick={() => handleTypeSelection(error.name)}
                  >
                    <h5>{error.name}</h5>
                    {error.description}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="inputs-group modify-inputs">
            <div className=" field full">
              <div className="types full">
                <h2>
                  Contributing Factors:
                  <span>
                    In your opinion, were there factors that made this error
                    difficult to prevent or detect?
                  </span>
                </h2>
                {contributingFactors.map((item, index) => (
                  <div
                    className={`type full full-width-type ${
                      contributingfactors === item.factor ? "selected" : ""
                    }`}
                    onClick={() => handleContributingFactor(item.factor)}
                    key={index}
                  >
                    <h5>{item.factor}</h5>
                    {item.description}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="inputs-group modify-inputs">
            <div className=" field full">
              <div className="types full">
                <h2>
                  Severity of the error (check one) Use your best judgment, to
                  rate the severity of the error.
                </h2>
                {severityCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`type full full-width-type ${
                      selectedCategory.value === category.value
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelectedCategory({
                        category: category.category,
                        description: category.description,
                        value: category.value,
                      })
                    }
                  >
                    <h5>{category.category}</h5>
                    {category.description}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="inputs-group modify-inputs">
            <div className="field full">
              <label htmlFor="comment">Your comments:</label>
              <RichTexField value={comment} onEditorChange={setComment} />
            </div>
            <div className="field full">
              <label htmlFor="actionTaken">Actions/Outcomes:</label>
              <RichTexField
                value={actionTaken}
                onEditorChange={setActionTaken}
              />
            </div>
          </div>
          {/* {(permission.includes("Super User") ||
            permission.includes("Admin") ||
            (permission.includes("Manager") &&
              department.includes(incident?.department)) ||
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

          <div className="field full inputs-group">
            <h3>Supporting documents</h3>
            <FilesList
              setDocuments={setUploadedFiles}
              documents={uploadedFiles}
              canDelete={true}
              showDownload={true}
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
        </form>
      </div>
    </div>
  );
};

export default ModifyMedicalErrorForm;
