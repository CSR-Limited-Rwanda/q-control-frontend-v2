'use client'
import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import api, { API_URL, calculateAge, cleanedData } from "@/utils/api";
import { X, Eye, SaveAll, LoaderCircle, TextSearch } from 'lucide-react';
import Link from "next/link";
import RichTexField from "@/components/forms/RichTextField";
import mediaAPI from "@/utils/mediaApi";
// import employee from "../../successMessage/employeecomplete";
import CustomSelectInput from "@/components/CustomSelectInput";
import BackToPage from "@/components/BackToPage";
import postDocumentHistory from "@/components/incidents/documentHistory/postDocumentHistory";
import EmployeeIncidentForm from "./incidents/incidentForms/EmployeeIncidentForms/EmployeeIncidentForm";
// import HealthIncidentInvestigationForm from "../healthIncidentForm";
import FilesList from "@/components/incidents/documentHistory/FilesList";
import CustomTimeInput from "@/components/CustomTimeInput";
import { useDepartments, usePermission } from "@/context/PermissionsContext";
import CantModify from "./CantModify";
import CustomDatePicker from "./CustomDatePicker";

import "@/styles/_modifyIncident.scss"

const ModifyStaffIncident = ({ data, incidentId, investigation }) => {
  const permission = usePermission();
  const department = useDepartments();
  const [incident, setIncident] = useState(data);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);

  const [statusType, setStatusType] = useState(data.incident_status);
  const [status, setStatus] = useState(incident.status);
  const [firstName, setFirstName] = useState(
    data.patient_info?.first_name
  );
  const [lastName, setLastName] = useState(data.patient_info?.last_name);
  const [description, setDescription] = useState("");
  const [jobTitle, setJobTitle] = useState(data.job_title);
  const [dateOfInjury, setDateOfInjury] = useState(
    data.date_of_injury_or_near_miss
  );
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [dateSeenDoctor, setDateSeenDoctor] = useState(
    data.doctor_consulted_dated
  );
  const [timeSeenDoctor, setTimeSeenDoctor] = useState(
    data.doctor_consulted_time
  );
  const [severityRating, setSeverityRating] = useState(data?.severity_rating);
  const [timeOfInjury, setTimeOfInjury] = useState(
    data.time_of_injury_or_near_miss
  );

  const [supervisorFirstName, setSupervisorFirstName] = useState(data.supervisor.first_name);
  const [supervisorLastName, setSupervisorLastName] = useState(data.supervisor.last_name);

  const [doctorFirstName, setDoctorFirstName] = useState(
    data.doctor_consulted_info?.first_name
  );
  const [doctorLastName, setDoctorLastName] = useState(
    data.doctor_consulted_info?.last_name
  );
  const [doctorPhone, setDoctorPhone] = useState(
    data.doctor_consulted_info?.phone_number || ""
  );
  const [whereItHappened, setWhereItHappened] = useState(data.location);
  const [doingWhat, setDoingWhat] = useState(data.activity_at_time_of_incident);
  const [whatLedTo, setWhatLedTo] = useState(data.incident_description);
  const [whenInjured, setWhenInjured] = useState(data.previous_injury_date);
  const [DoneToPrevent, setDoneToPrevent] = useState(data.preventive_measures);
  const [beingInjured, setBeingInjured] = useState(data.body_parts_injured);
  const [seenDoctor, setSeenDoctor] = useState(data.doctor_consulted);
  const [toldSupervisor, setToldSupervisor] = useState(data.supervisor);
  const [injuredBody, setInjuredBody] = useState(data.previous_injury);
  const [reportId, setReportID] = useState(null);
  const [witnesses, setWitnesses] = useState(
    data.witnesses.map((witness) => ({

      first_name: witness?.witness_name?.first_name,
      last_name: witness?.witness_name?.last_name,

    }))
  );
  const [success, setSuccess] = useState("false");
  const [incidentDate, setIncidentDate] = useState("");
  const currentStepRef = useRef(currentStep);
  const [showInvestigationFrom, setShowInvestigationFrom] = useState(false);
  const [dateBirth, setdateBirth] = useState(data.patient_info?.date_of_birth);
  const [age, setAge] = useState(data.patient_info?.age || "");
  const [staffIncidentId, setStaffIncidentId] = useState(localStorage.getItem("staffIncidentId"))

  console.log(data);
  const [newWitness, setNewWitness] = useState(
    data.witnesses.map((el) => {
      return {
        first_name: el.witness_name.first_name,
        last_name: el.witness_name.last_name,
      };
    })
  );
  const handleShowInvestigationForm = () => {
    setShowInvestigationFrom(!showInvestigationFrom);
  };

  const handleAddWitness = () => {
    if (
      newWitness.first_name.trim() &&
      newWitness.last_name.trim() !== ""
    ) {
      setWitnesses([...witnesses, newWitness]);

      setNewWitness({

        first_name: "",
        last_name: "",

      });

      console.log(newWitness);
      console.log(witnesses);
    }
  };

  const handleRemoveWitness = (nameToRemove) => {
    const newWitnesses = witnesses.filter(
      (witness) => witness !== nameToRemove
    );
    setWitnesses(newWitnesses);
  };

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);
    setdateBirth(date);
    setAge(calculatedAge);
  };

  useEffect(() => {
    // get documents
    const fetchIncidentDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/employee_incident/${incidentId}/documents/`
        );
        if (response.status === 200) {
          setUploadedFiles(response.data);
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
        `/incidents/employee_incident/${staffIncidentId}/documents/new/`,
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
  const handleSeenDoctor = () => {
    setSeenDoctor(!seenDoctor);
  };

  const handleWitnessChange = (index, event) => {
    const { name, value } = event.target;
    const newWitnesses = [...witnesses];
    newWitnesses[index][name] = value;
    setWitnesses(newWitnesses);
  };

  const handleInjuredBody = () => {
    setInjuredBody(!injuredBody);
  };

  const handleToldSupervisor = () => {
    setToldSupervisor(!toldSupervisor);
    console.log(!toldSupervisor);
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
  const handleModify = async (incidentStatus) => {
    const witnessesList = witnesses.map((el) => ({
      first_name: el.first_name,
      last_name: el.last_name,
      profile_type: "Witness"

    }));
    console.log(witnessesList);
    const incidentData = {
      action: "modify",
      incident_status: statusType,
      patient_info:
        firstName && lastName
          ? {

            first_name: firstName,
            last_name: lastName,
            age: age,
            date_of_birth: dateBirth,
            profile_type: "Patient"

          }
          : null,
      job_title: jobTitle,
      supervisor: {
        first_name: supervisorFirstName,
        last_name: supervisorLastName,
        profile_type: "Supervisor",
      },
      date_of_injury_or_near_miss: dateOfInjury,
      time_of_injury_or_near_miss: timeOfInjury,
      witnesses: witnessesList.length > 0 ? witnessesList : [],
      date_of_birth: dateBirth,
      age: age,
      location: whereItHappened || "N/A",
      activity_at_time_of_incident: doingWhat || "N/A",
      incident_description: whatLedTo || "N/A",
      preventive_measures: DoneToPrevent || "N/A",
      body_parts_injured: beingInjured,

      doctor_consulted: seenDoctor,
      doctor_consulted_dated: dateSeenDoctor || null,
      doctor_consulted_time: timeSeenDoctor || null,
      doctor_consulted_info:
        doctorFirstName && doctorLastName
          ? {

            first_name: doctorFirstName,
            last_name: doctorLastName,
            phone_number: doctorPhone || " ",
            profile_type: "Physician"

          }
          : null,

      previous_injury: injuredBody,
      previous_injury_date: whenInjured,
      status: incidentStatus,
    };
    console.log(cleanedData(incidentData));
    try {
      const response = await api.patch(
        `incidents/staff-incident/${staffIncidentId}/`,
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
      setIsLoading(false);
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
            <X
              className="close-popup"
              onClick={handleShowInvestigationForm}
            />
            <HealthIncidentInvestigationForm investigationId={incidentId} />
          </div>
        </div>
      )}
      <div className="modify-page-header">
        <BackToPage link={"/incident/staff/"} pageName={"Staff incident"} />
        <h2 className="title">Modifying Staff Incident</h2>
        {investigation && investigation.id ? (
          <Link
            to={`/incident/employee_incident/${incidentId}`}
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
            <TextSearch />
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
      {
        <form>
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
          <div className="step inputs-group">
            <h3>I am reporting a work related</h3>
            <div className="field flex-column step-2-status">
              <label htmlFor="incidentLocation">Status</label>
              <CustomSelectInput
                options={["Injury", "Illness", "Near miss"]}
                placeholder={"status"}
                selected={statusType}
                setSelected={setStatusType}
              />
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
            <div className="field flex-column job-title">
              <label htmlFor="jobTitle">Job Title</label>
              <input
                onChange={(e) => setJobTitle(e.target.value)}
                value={jobTitle}
                type="text"
                name="jobTitle"
                id="jobTitle"
                placeholder="Enter job title"
              />
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
                  type="text"
                  name="age"
                  id="age"
                  placeholder="Enter age"
                />
              </div>
            </div>
            <div className="check-box">
              <div className="check-box">
                <input
                  onChange={handleToldSupervisor}
                  checked={toldSupervisor}
                  type="checkbox"
                  name="toldSupervisor"
                  id="toldSupervisor"
                />
                <label htmlFor="toldSupervisor">
                  Check if you have told your supervisor about this injury/near
                  miss.
                </label>
              </div>
            </div>
            {toldSupervisor && (
              <div className="half">
                <div className="supervisor field">
                  <label htmlFor="supervisorName">
                    Supervisor's first name
                  </label>
                  <input
                    onChange={(e) => setSupervisorFirstName(e.target.value)}
                    value={supervisorFirstName}
                    type="text"
                    name="supervisorFirstName"
                    id="supervisorFirstName"
                    placeholder="Enter supervisor's first name"
                  />
                </div>
                <div className="supervisor field">
                  <label htmlFor="supervisorName">Supervisor's last name</label>
                  <input
                    onChange={(e) => setSupervisorLastName(e.target.value)}
                    value={supervisorLastName}
                    type="text"
                    name="supervisorLastName"
                    id="supervisorLastName"
                    placeholder="Enter supervisor's last name"
                  />
                </div>
              </div>
            )}
            <div className="half">
              <div className="date-of-injury flex-column field">
                <label htmlFor="dateOfInjury">Date Of Injury/Near Miss</label>
                <CustomDatePicker
                  selectedDate={dateOfInjury}
                  setSelectedDate={setDateOfInjury}
                />
              </div>

              <div className="time-of-injury flex-column field">
                <label htmlFor="timeOfInjury">Time Of Injury/Near Miss</label>
                <CustomTimeInput
                  setTime={setTimeOfInjury}
                  defaultTime={timeOfInjury}
                />
              </div>
            </div>
            <div className="witness-list">
              {witnesses.map((witness, index) => (
                <div className="witness field" key={index}>
                  <span>
                    {witness.first_name} {witness.last_name}
                  </span>
                  <X
                    size={18}
                    onClick={() => handleRemoveWitness(witness)}
                  />
                </div>
              ))}
            </div>
            <div className="parties">
              Witnesses:
              <br />
              To add a witness, type the name and click add witness button
              <div className="half">
                <input
                  onChange={(e) =>
                    setNewWitness({
                      ...newWitness,

                      ...newWitness,
                      first_name: e.target.value,

                    })
                  }
                  value={newWitness?.first_name}
                  type="text"
                  placeholder="Enter witness first name"
                />
                <input
                  onChange={(e) =>
                    setNewWitness({
                      ...newWitness,

                      ...newWitness,
                      last_name: e.target.value,

                    })
                  }
                  value={newWitness?.last_name}
                  type="text"
                  placeholder="Enter witness last name"
                />
              </div>
              <button
                className="new-party"
                type="button"
                onClick={() => handleAddWitness()}
              >
                <i className="fa-solid fa-plus"></i>
                Add Witnesses
              </button>
            </div>
          </div>
          <div className="step inputs-group">
            <div className="where-it-happened flex-column field">
              <label htmlFor="whereItHappened">
                Where, exactly, did it happen?
              </label>
              <input
                onChange={(e) => setWhereItHappened(e.target.value)}
                value={whereItHappened}
                type="text"
                name="whereItHappened"
                id="whereItHappened"
                placeholder="Enter where did it happen"
              />
            </div>

            <div className="doing-what flex-column field">
              <label htmlFor="doingWhat">
                What were you doing at the time?
              </label>
              <RichTexField value={doingWhat} onEditorChange={setDoingWhat} />
            </div>
            <div className="what-led-to flex-column field">
              <label htmlFor="whatLedTo">
                Describe step by step what led up to the injury/near miss.
              </label>
              <RichTexField value={whatLedTo} onEditorChange={setWhatLedTo} />
            </div>
            <div className="done-to-prevent flex-column field">
              <label htmlFor="doneToPrevent">
                What could have been done to prevent this injury/near miss?
              </label>
              <RichTexField
                value={DoneToPrevent}
                onEditorChange={setDoneToPrevent}
              />
            </div>
          </div>
          <div className="step inputs-group">
            <div className="being-injured flex-column field">
              <label htmlFor="beingInjured">
                What parts of your body were injured? If a near miss, how could
                you have been hurt?
              </label>
              <RichTexField
                value={beingInjured}
                onEditorChange={setBeingInjured}
              />
            </div>
            <div className="check-box">
              <input
                onChange={handleSeenDoctor}
                checked={seenDoctor}
                type="checkbox"
                name="seenDoctor"
                id="seenDoctor"
              />
              <label htmlFor="seenDoctor">
                Check this if you have seen a doctor about this injury/illness?
              </label>
            </div>

            {seenDoctor && (
              <>
                {" "}
                <div className="half">
                  <div className="field doctor-name">
                    <label htmlFor="doctorFirstName">Doctor's first name</label>
                    <input
                      onChange={(e) => setDoctorFirstName(e.target.value)}
                      value={doctorFirstName}
                      type="text"
                      name="doctorFirstName"
                      id="doctorFirstName"
                      placeholder="Enter doctor's first name"
                    />
                  </div>
                  <div className="field doctor-name">
                    <label htmlFor="doctorLastName">Doctor's last name</label>
                    <input
                      onChange={(e) => setDoctorLastName(e.target.value)}
                      value={doctorLastName}
                      type="text"
                      name="doctorLastName"
                      id="doctorLastName"
                      placeholder="Enter doctor's last name"
                    />
                  </div>
                </div>
                <div className="half">
                  <div className="field flex-column doctor-phone">
                    <label htmlFor="doctorPhone">Doctor's phone number:</label>
                    <input
                      onChange={(e) => setDoctorPhone(e.target.value)}
                      value={doctorPhone}
                      type="tel"
                      name="doctorPhone"
                      id="doctorPhone"
                      placeholder="Enter doctor's phone number"
                    />
                  </div>
                </div>
                <div className="half">
                  <div className="time-seen-doctor flex-column field">
                    <label htmlFor="dateSeenDoctor">Date</label>
                    <CustomDatePicker
                      selectedDate={dateSeenDoctor}
                      setSelectedDate={setDateSeenDoctor}
                    />
                  </div>

                  <div className="time-seen-doctor flex-column field">
                    <label htmlFor="timeSeenDoctor">Time</label>
                    <CustomTimeInput
                      setTime={setTimeSeenDoctor}
                      defaultTime={timeSeenDoctor}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="check-box">
              <input
                onChange={handleInjuredBody}
                checked={injuredBody}
                type="checkbox"
                name="injuredBody"
                id="injuredBody"
              />
              <label htmlFor="injuredBody">
                Check this if part of your body has been injured before.
              </label>
            </div>

            {injuredBody && (
              <div className="when-injured flex-column field">
                <label htmlFor="whenInjured">When</label>
                <CustomDatePicker
                  selectedDate={whenInjured}
                  setSelectedDate={setWhenInjured}
                />
              </div>
            )}


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
      }
    </div>
  );
};

export default ModifyStaffIncident;
