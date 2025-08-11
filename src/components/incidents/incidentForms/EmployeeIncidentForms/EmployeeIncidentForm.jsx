import React, { useState, useEffect } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
import api, {
  API_URL,
  calculateAge,
  checkCurrentAccount,
  cleanedData,
} from "@/utils/api";

// import employee from "../../successMessage/employeecomplete";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import RichTexField from "@/components/forms/RichTextField";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";

import { Info, X } from "lucide-react";
import CustomTimeInput from "@/components/CustomTimeInput";
import { FacilityCard } from "@/components/DashboardContainer";
import DraftPopup from "@/components/DraftPopup";

import "@/styles/_forms.scss";
import "@/styles/_employeeIncidentForm.scss";
import { useAuthentication } from "@/context/authContext";

const EmployeeIncidentForm = ({ togglePopup }) => {
  const { user } = useAuthentication();
  const [currentFacility, setCurrentFacility] = useState(user.facility);

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [statusType, setStatusType] = useState("Select Status");
  const [status, setStatus] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [dateOfInjury, setDateOfInjury] = useState("");
  const [dateSeenDoctor, setDateSeenDoctor] = useState("");
  const [timeSeenDoctor, setTimeSeenDoctor] = useState("");
  const [timeOfInjury, setTimeOfInjury] = useState("");
  const [supervisorFirstName, setSupervisorFirstName] = useState("");
  const [supervisorLastName, setSupervisorLastName] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorProfileType, setDoctorProfileType] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [doctorPhone, setDoctorPhone] = useState("");
  const [whereItHappened, setWhereItHappened] = useState("");
  const [doingWhat, setDoingWhat] = useState("");
  const [whatLedTo, setWhatLedTo] = useState("");
  const [whenInjured, setWhenInjured] = useState("");
  const [DoneToPrevent, setDoneToPrevent] = useState("");
  const [beingInjured, setBeingInjured] = useState("");
  const [seenDoctor, setSeenDoctor] = useState(false);
  const [toldSupervisor, setToldSupervisor] = useState(false);
  const [injuredBody, setInjuredBody] = useState(false);
  const [reportId, setReportID] = useState("");
  const [witnesses, setWitnesses] = useState([]);
  const [newWitness, setNewWitness] = useState({
    first_name: "",
    last_name: "",
  });
  const [success, setSuccess] = useState("false");
  const [incidentDate, setIncidentDate] = useState("");
  const [dateBirth, setdateBirth] = useState(null);
  const [age, setAge] = useState("");
  const currentStepRef = useRef(currentStep);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [facilityId, setFacilityId] = useState(user.facility.id);
  const [departmentId, setDepartmentId] = useState(
    localStorage.getItem("departmentId")
  );

  console.log(facilityId);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("updateNewIncident", "false");
    const handleKeyDown = (event) => {
      // Check if Ctrl or Alt key is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepRef.current < 5) {
          document.getElementById("continue-button").click();
        } else if (currentStepRef.current === 5) {
          document.getElementById("save-button").click();
        } else {
          return;
        }
      }

      if (event.ctrlKey || event.altKey) {
        switch (event.key) {
          case "s": // Ctrl + S
            event.preventDefault(); // Prevent default browser action
            if (currentStepRef.current < 5) {
              document.getElementById("continue-button").click();
            } else if (currentStepRef.current === 5) {
              document.getElementById("save-button").click();
            } else {
              return;
            }
            break;
          case "b":
            event.preventDefault();
            if (currentStepRef.current > 1 && currentStepRef.current <= 5) {
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
  const handleAddWitness = () => {
    if (newWitness.first_name.trim() && newWitness.last_name.trim() !== "") {
      setWitnesses([...witnesses, newWitness]);

      setNewWitness({
        first_name: "",
        last_name: "",
      });
    }
  };

  const handleRemoveWitness = (nameToRemove) => {
    const newWitnesses = witnesses.filter(
      (witness) => witness !== nameToRemove
    );
    setWitnesses(newWitnesses);
  };

  // const handleIsAnonymous = (value) => {
  //   setIsAnonymous(value);
  // };
  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);

    if (calculatedAge === null) {
      setAge("");
      setdateBirth(date);
      return;
    }

    setdateBirth(date);
    setAge(calculatedAge);
  };

  const handleStepOneSubmit = async () => {
    const witnessesList = witnesses.map((el) => ({
      first_name: el.first_name,
      last_name: el.last_name,
      profile_type: "Witness",
    }));
    const incidentData = {
      facility_id: user?.facility?.id,
      department: user?.department?.id,
      current_step: currentStep,
      incident_status: statusType,
      report_facility_id: currentFacility?.id,
      patient_info:
        firstName && lastName
          ? {
              first_name: firstName,
              last_name: lastName,
              profile_type: "Patient",
              age: age,
              date_of_birth: dateBirth,
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
      witnesses: witnessesList.length > 0 ? witnessesList : null,
      status: "Draft",
    };

    try {
      const res = await api.post(
        `${API_URL}/incidents/staff-incident/`,
        incidentData
      );

      setIsLoading(true);

      if (res.status === 200 || res.status === 201) {
        setIsLoading(false);
        setCurrentStep(currentStep + 1);
        window.customToast.success("Data posted successfully");

        localStorage.setItem("employeeId", res.data.id);
        localStorage.setItem("updateNewIncident", "true");

        setReportID(res.data.id);
      }
    } catch (error) {
      console.error("Error submitting step 1: ", error);

      setIsLoading(false);
      return;
    }
  };

  const handleStepThreeSubmit = async () => {
    try {
      const res = await api.put(
        `${API_URL}/incidents/staff-incident/${reportId}/`,

        cleanedData({
          current_step: currentStep,
          id: reportId,
          location: whereItHappened,
          activity_at_time_of_incident: doingWhat,
          incident_description: whatLedTo,
          preventive_measures: DoneToPrevent,
        })
      );
      setIsLoading(true);

      if (res.status === 200 || res.status === 201) {
        setCurrentStep(currentStep + 1);
        window.customToast.success("Data posted successfully");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error submitting step 3: ", error);
      setIsLoading(false);
      return;
    }
  };

  const handleToldSupervisor = () => {
    setToldSupervisor(!toldSupervisor);
  };

  const handleSaveChange = async () => {
    if (currentStep === 4) {
      let isValid = validateStep({
        "Being injured": beingInjured,
      });

      if (
        seenDoctor &&
        !doctorFirstName &&
        !doctorLastName &&
        !doctorProfileType &&
        !dateSeenDoctor &&
        !timeSeenDoctor
      ) {
        window.customToast.error(
          "Please fill all required fields for Doctor information"
        );
        isValid = false;
        return;
      }
      if (injuredBody && !whenInjured) {
        window.customToast.error("Please fill in when the injury occured");
        isValid = false;
        return;
      }

      if (isValid) {
        const data = {
          facility_id: facilityId,
          current_step: currentStep,
          id: reportId,
          body_parts_injured: beingInjured,
          doctor_consulted: seenDoctor,
          doctor_consulted_dated: seenDoctor ? dateSeenDoctor : null,
          doctor_consulted_time: seenDoctor ? timeSeenDoctor : null,
          doctor_consulted_info:
            doctorFirstName && doctorLastName
              ? {
                  first_name: doctorFirstName,
                  last_name: doctorLastName,
                  profile_type: "Physician",
                }
              : null,

          previous_injury: injuredBody,

          previous_injury_date: injuredBody ? whenInjured : null,
          // anonymous: isAnonymous ? true : false,
          status: "Open",
        };

        try {
          const res = await api.put(
            `${API_URL}/incidents/staff-incident/${reportId}/`,
            cleanedData(data)
          );

          setIsLoading(true);

          if (res.status === 200) {
            setCurrentStep(currentStep + 1);
            window.customToast.success("Data posted successfully");
            setIsLoading(false);

            if (currentStep === 5) {
              localStorage.setItem("updateNewIncident", "false");
            }
            postDocumentHistory(reportId, "added a new incident", "create");
          }
        } catch (error) {
          console.error("Error submitting step 4: ", error);

          setIsLoading(false);
          return;
        }
        setSuccess(true);
      } else {
        return;
      }
    }
  };

  const updateStepOne = async (data) => {
    try {
      const res = await api.put(
        `${API_URL}/incidents/employee_incidents/update/staff/final_report/`,
        data
      );

      setIsLoading(true);

      if (res.status === 200) {
        setCurrentStep(currentStep + 1);
        window.customToast.success("Data posted successfully");
        setIsLoading(false);

        if (currentStep === 5) {
          localStorage.setItem("updateNewIncident", "false");
        }
        postDocumentHistory(reportId, "added a new incident", "create");
      }
    } catch (error) {
      console.error("Error submitting step 4: ", error);
      return;
    }
    setSuccess(true);
  };
  const handleSeenDoctor = () => {
    setSeenDoctor(!seenDoctor);
  };

  const handleInjuredBody = () => {
    setInjuredBody(!injuredBody);
  };
  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      let isValid = validateStep({
        "Status Type": statusType,
        "first name": firstName,
        "last name": lastName,
        "Job Title": jobTitle,
        date_of_birth: dateBirth,
        age: age,
        "Date of Injury": dateOfInjury,
        "Time of Injury": timeOfInjury,
      });

      // const areWitnessesValid = witnesses.every(
      //   (witness) => witness.trim() !== ""
      // );
      // if (!areWitnessesValid) {
      //   window.customToast.error("Please provide names for all witnesses.");
      //   isValid = false;
      // }

      if (
        toldSupervisor &&
        !supervisorFirstName.trim() &&
        !supervisorLastName.trim()
      ) {
        window.customToast.error(
          "Please provide the supervisor's name if you have informed them about the injury/near miss."
        );
        isValid = false;
      }

      if (isValid) {
        setIsLoading(true);
        if (localStorage.getItem("updateNewIncident") === "false") {
          handleStepOneSubmit();
        }

        if (localStorage.getItem("updateNewIncident") === "true") {
          const witnessesList = witnesses.map((el) => ({
            first_name: el.first_name,
            last_name: el.last_name,
          }));
          updateStepOne(
            cleanedData({
              current_step: currentStep,
              id: reportId,
              incident_status: statusType,
              facility: checkCurrentAccount(),
              patient_info:
                firstName && lastName
                  ? {
                      first_name: firstName,
                      last_name: lastName,
                      profile_type: "Patient",
                      age: age,
                      date_of_birth: dateBirth,
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
              witnesses: witnessesList.length > 0 ? witnessesList : null,
              status: "Draft",
            })
          );
        }
      }
    } else if (currentStep === 3) {
      const isValid = validateStep({
        "What led to": whatLedTo,
        "Done to prevent": DoneToPrevent,
        "Where it happened": whereItHappened,
        "What were you doing": doingWhat,
      });
      if (isValid) {
        setIsLoading(true);

        handleStepThreeSubmit();
      }
    }
  };

  const handlePreviousStep = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
  };

  const handleCurrentFacility = (facilityId) => {
    const selectedFacility = user?.accounts?.find(
      (facility) => facility.id === parseInt(facilityId)
    );
    setCurrentFacility(selectedFacility);
    console.log(selectedFacility);
  };
  return (
    <div className="forms-container">
      <div className="forms-header">
        <h2>Staff Incident</h2>
        <X className="close-popup" onClick={togglePopup} />
        <div className="form-steps">
          <div className={currentStep === 1 ? "step current-step" : "step"}>
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="name">
              <p className="step-name">Step 1/4</p>
              <p className="step-details">Incident Info</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className={currentStep === 2 ? "step current-step" : "step"}>
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="name">
              <p className="step-name">Step 2/4</p>
              <p className="step-details">Location & status</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className={currentStep === 3 ? "step current-step" : "step"}>
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="name">
              <p className="step-name">Step 3/4</p>
              <p className="step-details">Incident type</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className={currentStep === 4 ? "step current-step" : "step"}>
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="name">
              <p className="step-name">Step 4/4</p>
              <p className="step-details">Injury details</p>
            </div>
          </div>
        </div>
        <FacilityCard />
        <DraftPopup
          incidentString="employee_incident"
          incidentType="employee_incident"
        />
      </div>

      {currentStep === 2 && (
        <select
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
            <div className="form-notification">
              <div className="info-icon-main-container">
                <div className="info-container">
                  <div className="info-icon">
                    <Info className="icon" />
                  </div>
                </div>
              </div>
              <p>
                Staff shall use this form to report all work-related injuries,
                illnesses, or “near miss” events (which could have caused an
                injury or illness) – no matter how minor. This helps us to
                identify and correct hazards before they cause serious injuries.
                This form shall be Open by employees as soon as possible
              </p>
            </div>
          </div>
        ) : currentStep === 2 ? (
          <div className="step">
            <h3>I am reporting a work related</h3>
            <div className="field step-2-status">
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
                <label htmlFor="employeeFirstName">Patient First name</label>
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
                <label htmlFor="employeeLastName">Patient Last name</label>
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

            <div className="field job-title">
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
              <div className="date-of-injury field">
                <label htmlFor="dateOfInjury">Date Of Injury/Near Miss</label>
                <CustomDatePicker
                  selectedDate={dateOfInjury}
                  setSelectedDate={setDateOfInjury}
                />
              </div>

              <div className="time-of-injury field">
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
                    className="delete-witness"
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
                  value={newWitness.first_name}
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
                  value={newWitness.last_name}
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
        ) : currentStep === 3 ? (
          <div className="step">
            <div className="where-it-happened field">
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

            <div className="doing-what field">
              <label htmlFor="doingWhat">
                What were you doing at the time?
              </label>
              <RichTexField value={doingWhat} onEditorChange={setDoingWhat} />
            </div>
            <div className="what-led-to field">
              <label htmlFor="whatLedTo">
                Describe step by step what led up to the injury/near miss.
              </label>
              <RichTexField value={whatLedTo} onEditorChange={setWhatLedTo} />
            </div>
            <div className="done-to-prevent field">
              <label htmlFor="doneToPrevent">
                What could have been done to prevent this injury/near miss?
              </label>
              <RichTexField
                value={DoneToPrevent}
                onEditorChange={setDoneToPrevent}
              />
            </div>
          </div>
        ) : currentStep === 4 ? (
          <div className="step">
            <div className="being-injured field">
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
                <label htmlFor="doctorName">If yes, whom did you see?</label>
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
                <div className="field doctor-phone">
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
                <div className="half">
                  <div className="time-seen-doctor field">
                    <label htmlFor="dateSeenDoctor">Date</label>
                    <CustomDatePicker
                      selectedDate={dateSeenDoctor}
                      setSelectedDate={setDateSeenDoctor}
                    />
                  </div>

                  <div className="time-seen-doctor field">
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
                Check if this part of your body has been injured before.
              </label>
            </div>

            {injuredBody && (
              <div className="when-injured field">
                <label htmlFor="whenInjured">When</label>
                <CustomDatePicker
                  selectedDate={whenInjured}
                  setSelectedDate={setWhenInjured}
                />
              </div>
            )}

            {/* <div className="types">
              <div className="type">
                <input
                  onChange={(e) => handleIsAnonymous(e.target.value)}
                  type="radio"
                  name="isAnonymous"
                  id="yes"
                  value={true}
                />
                <label htmlFor="yes">Yes</label>
              </div>

              <div className="type">
                <input
                  onChange={(e) => handleIsAnonymous(e.target.value)}
                  type="radio"
                  name="isAnonymous"
                  id="no"
                  value={false}
                />
                <label htmlFor="no">No</label>
              </div>
            </div> */}
          </div>
        ) : currentStep === 5 ? (
          <FormCompleteMessage />
        ) : (
          <h1>Something ain't right</h1>
        )}
      </form>

      <div className="btns">
        {currentStep > 1 && currentStep < 5 ? (
          <button
            onClick={handlePreviousStep}
            id="back-button"
            className="secondary-button"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back</span>
          </button>
        ) : (
          ""
        )}

        {currentStep > 3 && currentStep < 5 ? (
          <button
            className="primary-button"
            id="save-button"
            onClick={handleSaveChange}
          >
            <span>{isLoading ? "Processing..." : "Save Incident"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : currentStep < 5 ? (
          <button
            onClick={handleNextStep}
            id="continue-button"
            className="primary-button"
          >
            <span>{isLoading ? "Processing..." : "Save & Continue"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default EmployeeIncidentForm;
