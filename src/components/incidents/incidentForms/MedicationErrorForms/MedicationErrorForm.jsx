import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRef } from "react";

// import { stepOne, stepTwo } from "../validators/medicationErrorForm";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
import "@/styles/_forms.scss";
import api, {
  API_URL,
  checkCurrentAccount,
  calculateAge,
  cleanedData,
} from "@/utils/api";
import CustomSelectInput from "@/components/CustomSelectInput";
import RichTexField from "@/components/forms/RichTextField";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";
import CustomTimeInput from "@/components/CustomTimeInput";
import {
  drugRoutes,
  severityCategories,
  whatHappenedOptions,
} from "@/constants/constants";
import { X, CheckSquare, Square, SquareIcon } from "lucide-react";
import { FacilityCard } from "@/components/DashboardContainer";
import CustomDatePicker from "@/components/CustomDatePicker";
import DraftPopup from "@/components/DraftPopup";

const MedicationErrorForm = ({ togglePopup }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);
  const [isLoading, setIsLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [physicianFirstName, setPhysicianFirstName] = useState("");
  const [physicianLastName, setPhysicianLastName] = useState("");
  const [age, setAge] = useState("");
  const [mrn, setMrn] = useState("");
  const [dayWeek, setDayWeek] = useState("");
  const [hour, setHour] = useState("");
  const [date, setDate] = useState("");
  const [dateNotified, setDateNotified] = useState("");
  const [time, setTime] = useState("");
  const [timeNotified, setTimeNotified] = useState("");
  const [location, setLocation] = useState("");
  const [staffClassification, setStaffClassification] = useState("");
  const [staffStatus, setStaffStatus] = useState("");
  const [otherStaffStatus, setOtherStaffStatus] = useState("");
  const [varienceDuration, setVarienceDuration] = useState("");
  const [drugOrdered, setDrugOrdered] = useState("");
  const [drugGiven, setDrugGiven] = useState("");
  const [formError, setFormError] = useState("");
  const [actionTaken, setActionTaken] = useState("");
  const [comment, setComment] = useState("");
  const [route, setRoute] = useState([]);
  const [routeOtherInput, setRouteOtherInput] = useState("");
  const [secondRouteOtherInput, setSecondRouteOtherInput] = useState("");
  const [secondRoute, setSecondRoute] = useState([]);
  const [showRouteOtherInput, setShowRouteOtherInput] = useState(false);
  const [showSecondRouteOtherInput, setShowSecondRouteOtherInput] =
    useState(false);

  const [whatHappened, setWhatHappened] = useState([]);
  const [whatHappenedOtherInput, setWhatHappenedOtherInput] = useState("");
  const [showWhatHappenedOtherInput, setshowWhatHappenedOtherInput] =
    useState("");

  const [descriptionerror, setDescriptionError] = useState([]);
  const [contributingfactors, setContributingFactors] = useState([]);
  const [category, setCategory] = useState({});
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [otherExplanation, setOtherExplanation] = useState();
  const [otherDrugRoute, setOtherDrugRoute] = useState();
  const [drugGivenRoutes, setDrugGivenRoutes] = useState([]);
  const [drugOrderedRoutes, setDrugOrderedRoutes] = useState([]);
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [facilityId, setFacilityId] = useState(
    localStorage.getItem("facilityId")
  );
  const [departmentId, setDepartmentId] = useState(
    localStorage.getItem("departmentId")
  )

  const handleDrugOrderedRoute = (drug) => {
    // check if the route is not in the array of routes, then add it else, remove it
    console.log(drugOrderedRoutes, drug);
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

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);

    if (calculatedAge === null) {
      setAge("");
      setDateOfBirth(date);
      return;
    }

    setDateOfBirth(date);
    setAge(calculatedAge);
  };

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    localStorage.setItem("updateNewIncident", "false");
    console.log(localStorage.getItem("updateNewIncident"));
    const handleKeyDown = (event) => {
      // Check if Ctrl or Alt key is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepRef.current < 9) {
          document.getElementById("continue-button").click();
        } else if (currentStepRef.current === 9) {
          document.getElementById("save-button").click();
        } else {
          return;
        }
      }

      if (event.ctrlKey || event.altKey) {
        switch (event.key) {
          case "s": // Ctrl + S
            event.preventDefault(); // Prevent default browser action
            if (currentStepRef.current < 9) {
              document.getElementById("continue-button").click();
            } else if (currentStepRef.current === 9) {
              document.getElementById("save-button").click();
            } else {
              return;
            }
            break;
          case "b":
            event.preventDefault();
            if (currentStepRef.current > 1 && currentStepRef.current <= 9) {
              document.getElementById("back-button").click();
            }
            console.log(currentStepRef.current);
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
  const handleCheckboxChange = (option) => {
    let updatedOptions;
    if (route.includes(option)) {
      updatedOptions = route.filter((item) => item !== option);
    } else {
      updatedOptions = [...route, option];
    }
    setRoute(updatedOptions);
  };

  const handleSecondCheckboxChange = (option) => {
    let updatedOptions;
    if (secondRoute.includes(option)) {
      updatedOptions = secondRoute.filter((item) => item !== option);
    } else {
      updatedOptions = [...secondRoute, option];
    }
    setSecondRoute(updatedOptions);
  };

  const handleRouteOtherCheckboxChange = (e) => {
    setShowRouteOtherInput(e.target.checked);
    if (!e.target.checked) {
      setRouteOtherInput("");
    }
  };

  const handleWhatHappenedOtherCheckboxChange = (e) => {
    setshowWhatHappenedOtherInput(e.target.checked);
    if (!e.target.checked) {
      setWhatHappenedOtherInput("");
    }
  };

  const handleSecondRouteOtherCheckboxChange = (e) => {
    setShowSecondRouteOtherInput(e.target.checked);
    if (!e.target.checked) {
      setSecondRouteOtherInput("");
    }
  };

  const handleRouteOtherInputChange = (event) => {
    setRouteOtherInput(event.target.value);
  };
  const handleSecondRouteOtherInputChange = (event) => {
    setSecondRouteOtherInput(event.target.value);
  };

  const handleWhatHappenedInputChange = (event) => {
    setWhatHappenedOtherInput(event.target.value);
  };

  const handleWhatHappened = (option) => {
    let updatedOptions;
    if (whatHappened.includes(option)) {
      updatedOptions = whatHappened.filter((item) => item !== option);
    } else {
      updatedOptions = [...whatHappened, option];
    }
    setWhatHappened(updatedOptions);
  };

  const handleContributingFactor = (type) => {
    const index = contributingfactors.indexOf(type);
    if (index === -1) {
      setContributingFactors([...contributingfactors, type]);
    } else {
      setContributingFactors(
        contributingfactors.filter((item) => item !== type)
      );
    }
  };

  const handleOtherExplanationChange = (value) => {
    setContributingFactors([...contributingfactors, otherExplanation]);
    setOtherExplanation("");
  };
  const [showOtherExplanation, setShowContributingFactors] = useState(false);
  const handleShowOtherContributingFactors = () => {
    handleContributingFactor("OTHER");
    setShowContributingFactors(!showOtherExplanation);
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

  async function postStepOne() {
    let currentDate = new Date();

    const data = {
      // report_facility: checkCurrentAccount(),
      facility_id: facilityId,
      department: departmentId,
      report_facility: facilityId,
      patient: {
        first_name: firstName,
        last_name: lastName,
        profile_type: "Patient",
        age: age,
        date_of_birth: dateOfBirth,
        medical_record_number: mrn,
      },

      day_of_the_week: dayWeek,
      date_of_error: date,
      time_of_error: time,
      location: location,

      status: "Draft",
    };

    console.log(data);
    try {
      const response = await api.post(
        `${API_URL}/incidents/medication-error/`,
        // {
        //   params: {
        //     report_facility: checkCurrentAccount(),
        //   },
        // },
        cleanedData(data)
      );

      console.log(response.status);

      if (response.status === 200 || response.status === 201) {
        console.log(response.data);
        localStorage.setItem("medication_id", response.data.id);
        window.customToast.success("Data posted successfully");
        if (currentStep <= 7) {
          setCurrentStep(currentStep + 1);
          setIsLoading(false);
        }
        localStorage.setItem("updateNewIncident", "true");
        console.log(localStorage.getItem("updateNewIncident"));
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      window.customToast.error("Failed to post data");
      window.customToast.error(error.message);
      console.log(currentStep);
    }
  }

  async function patchData(data) {
    console.log(data);
    try {
      const medication_id = localStorage.getItem("medication_id");

      const response = await api.put(
        `${API_URL}/incidents/medication-error/${medication_id}/`,
        cleanedData(data)
      );

      if (response.status === 200 || response.status === 201) {
        window.customToast.success("Data saved successfully");
        if (currentStep <= 8) {
          setCurrentStep(currentStep + 1);
        }

        if (currentStep === 9) {
          postDocumentHistory(medication_id, "added a new incident", "create");
          localStorage.setItem("updateNewIncident", "false");
        }

        setIsLoading(false);
      }

      console.log(response.data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      window.customToast.error("Failed to post data");
      window.customToast.error(error.message);
    }
  }

  async function postStepThree() {
    let routeUpdatedOptions = [...route];
    let secondRouteUpdatedOptions = [...route];
    if (showRouteOtherInput && routeOtherInput.trim() !== "") {
      routeUpdatedOptions.push(routeOtherInput.trim());
    }
    if (showSecondRouteOtherInput && secondRouteOtherInput.trim() !== "") {
      secondRouteUpdatedOptions.push(secondRouteOtherInput.trim());
    }

    // Reset the input field and hide it after submission if needed
    setRouteOtherInput("");
    setSecondRouteOtherInput("");
    setShowRouteOtherInput(false);
    setShowSecondRouteOtherInput(false);
    setRoute([]);
    setSecondRoute([]);

    const data = {
      current_step: currentStep,
      drug_ordered: drugOrdered,
      drug_given: drugGiven,
      drug_ordered_route: drugOrderedRoutes.join(", "),
      drug_given_route: drugGivenRoutes.join(", "),
    };

    patchData(data);
  }

  async function postStepFour() {
    let whatHappenedUpdatedOptions = [...whatHappened];

    if (showWhatHappenedOtherInput && whatHappenedOtherInput.trim() !== "") {
      whatHappenedUpdatedOptions.push(whatHappenedOtherInput.trim());
    }

    // Reset the input field and hide it after submission if needed
    setWhatHappenedOtherInput("");

    setWhatHappenedOtherInput(false);
    setshowWhatHappenedOtherInput(false);

    setWhatHappened([]);

    const data = {
      current_step: currentStep,
      what_happened: whatHappenedUpdatedOptions.join(", "),
      form_of_error: formError,
    };

    patchData(data);
  }

  const handleSaveChange = () => {
    if (currentStep === 8) {
      const isValid = validateStep({
        Comments: comment,
        "Actions Taken": actionTaken,
      });
      if (isValid) {
        patchData({
          current_step: currentStep,
          comments: comment,
          actions_taken: actionTaken,
          status: "Open",
        });
      }
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      console.log(time);
      const isValid = validateStep({
        Age: age,
        "Date of birth": dateOfBirth,
        "first name": firstName,
        "last name": lastName,
        Date: date,
        Time: time,
        day: dayWeek,
        location: location,
      });
      console.log(isValid);

      if (isValid) {
        if (localStorage.getItem("updateNewIncident") === "false") {
          postStepOne();
        }

        if (localStorage.getItem("updateNewIncident") === "true") {
          patchData({
            current_step: currentStep,
            report_facility: checkCurrentAccount(),
            patient: {
              first_name: firstName,
              last_name: lastName,
              age: age,
              date_of_birth: dateOfBirth,
              medical_record_number: mrn,
            },

            day_of_the_week: dayWeek,
            date_of_error: date,
            time_of_error: time,
            location: location,

            status: "Draft",
          });
        }
      } else {
        return;
      }
    }

    if (currentStep === 2) {
      const isValid = validateStep({
        "Physician first name": physicianFirstName,
        "Physician last name": physicianLastName,
        "Date Notified": dateNotified,
        "Time Notified": timeNotified,
        Classification: staffClassification,
        Status: staffStatus,
        "Duration of Varience": varienceDuration,
        Hours: hour,
      });
      console.log(isValid);
      if (isValid) {
        patchData({
          facility_id: facilityId,
          current_step: currentStep,
          provider_info: {
            first_name: physicianFirstName,
            last_name: physicianLastName,
            profile_type: "Provider",
          },
          provider_title: "Physician",
          provider_classification: staffClassification,
          date_of_report: dateNotified,
          time_of_report: timeNotified,
          days: varienceDuration,
          hours: hour,
          staff_status:
            staffStatus === "Other" ? otherStaffStatus : staffStatus,
        });
      } else {
        return;
      }
    }

    if (currentStep === 3) {
      const isValid = validateStep({
        "Drug ordered": drugOrdered,
        "Drug given": drugGiven,
        "Select Route for drug ordered": drugOrderedRoutes.length > 0,
        "Select Route for drug given": drugGivenRoutes.length > 0,
      });

      if (isValid) {
        setIsLoading(true);

        postStepThree();
      } else {
        return;
      }
    }

    if (currentStep === 4) {
      const isValid = validateStep({
        "Select what happened ": whatHappened.length > 0,
        "Form of error": formError,
      });
      console.log(isValid);

      if (isValid) {
        setIsLoading(true);

        postStepFour();
      } else {
        return;
      }
    }

    if (currentStep === 5) {
      const isValid = validateStep({
        "Select description error": descriptionerror.length > 0,
      });

      if (isValid) {
        setIsLoading(true);

        patchData({
          current_step: currentStep,
          description_of_error: descriptionerror,
        });
      } else {
        return;
      }
    }

    if (currentStep === 6) {
      console.log("Contributing Factors:", contributingfactors);
      const isValid = validateStep({
        "Contributing Factors": contributingfactors.length > 0,
      });
      console.log(isValid);

      if (isValid) {
        setIsLoading(true);

        patchData({
          current_step: currentStep,
          contributing_factors: contributingfactors.join(", "),
        });
      } else {
        return;
      }
    }

    if (currentStep === 7) {
      const isValid = validateStep({
        Category: selectedCategory,
      });

      if (isValid) {
        patchData({
          current_step: currentStep,
          error_category: JSON.stringify(selectedCategory),
        });
        console.log(category);
      } else {
      }
    }
    setIsLoading(true);
  };
  const handlePreviousStep = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
  };
  return (
    <div className="forms-container">
      <div className="forms-header">
        <h2>Medication Error</h2>

        <X className="close-popup" onClick={togglePopup} />
        {currentStep < 5 ? (
          <div className="form-steps">
            <div className={currentStep === 1 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 1/9</p>
                <p className="step-details">Incident Info</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 2 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 2/9</p>
                <p className="step-details">Location & status</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 3 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 3/9</p>
                <p className="step-details">Incident type</p>
              </div>
            </div>
            <div className="divider"></div>
            <div
              className={
                currentStep === 4 || currentStep === 5 || currentStep === 6
                  ? "step current-step"
                  : "step"
              }
            >
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 4/9</p>
                <p className="step-details">Other info</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="form-steps">
            <div className={currentStep === 5 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 5/9</p>
                <p className="step-details">Incident Info</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 6 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 6/9</p>
                <p className="step-details">Location & status</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 7 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 7/9</p>
                <p className="step-details">Incident type</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 8 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 8/9</p>
                <p className="step-details">Comments/Actions</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 9 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 9/9</p>
                <p className="step-details">Form Open</p>
              </div>
            </div>
          </div>
        )}
        <FacilityCard />
        <DraftPopup
          incidentString="medication_error"
          incidentType="medical_error"
        />
      </div>
      <form className="medicationErrorForm newIncidentForm">
        {currentStep === 1 ? (
          <div className="step">
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

            <div className="half">
              <div className="incident-date field">
                <label htmlFor="incidentDate">Date of birth</label>

                <CustomDatePicker
                  selectedDate={dateOfBirth}
                  setSelectedDate={handleDateOfBirth}
                />
              </div>
              <div className="field age">
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
            <div className="field medical-record-number">
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
            <div className="field step-2-status">
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
            <div className="half">
              <div className="date field">
                <label htmlFor="date">Date</label>

                <CustomDatePicker
                  selectedDate={date}
                  setSelectedDate={setDate}
                />
              </div>
              <div className="time field">
                <label htmlFor="time">Time</label>
                <CustomTimeInput setTime={setTime} defaultTime={time} />
              </div>
            </div>
            <div className="field location">
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
          </div>
        ) : currentStep === 2 ? (
          <div className="step">
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
            <div className="half">
              <div className="date-notified field">
                <label htmlFor="dateNotified">Date</label>

                <CustomDatePicker
                  selectedDate={dateNotified}
                  setSelectedDate={setDateNotified}
                />
              </div>

              <div className="time-notified field">
                <label htmlFor="timeNotified">Time</label>
                <CustomTimeInput
                  setTime={setTimeNotified}
                  defaultTime={timeNotified}
                />
              </div>
            </div>
            <div className="staff-involved">
              <label htmlFor="staffInvolved">Practitioner/Staff Involved</label>
              <div className="half">
                <div className="field step-2-status">
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
                <div className="field step-2-status">
                  <label htmlFor="staffStatus">Status</label>
                  <CustomSelectInput
                    options={[
                      "Full-Time",
                      "Part-Time",
                      "Agency/Contract",
                      "Other",
                    ]}
                    placeholder={"Select status"}
                    selected={staffStatus}
                    setSelected={setStaffStatus}
                  />
                </div>
              </div>

              {staffStatus === "Other" && (
                <div className="field">
                  <label htmlFor="">Explain</label>
                  <input
                    onChange={(e) => setOtherStaffStatus(e.target.value)}
                    value={otherStaffStatus}
                    type="text"
                    name="otherStaffStatus"
                    id="otherStaffStatus"
                    placeholder="Enter explanation"
                  />
                </div>
              )}
            </div>
            <div className="field varience-duration">
              <label htmlFor="varienceDuration">Duration of Error</label>
              <div className="half">
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
        ) : currentStep === 3 ? (
          <div className="step">
            <h1 className="sub-h1">Medication and Doses Involved</h1>
            <div className="field">
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
            <h4>Route</h4>
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
                      <CheckSquare color="#F87C47" />
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
            <div className="field">
              <label htmlFor="drugGiven">Drug Given</label>
              <input
                onChange={(e) => setDrugGiven(e.target.value)}
                value={drugGiven}
                type="text"
                name="drugGiven"
                id="drugGiven"
                placeholder="Enter Drug Given"
              />
            </div>
            <h4>Route</h4>
            <div className="routes">
              {drugRoutes.map((route, index) => (
                <div
                  onClick={() => handleDrugGivenRoute(route.value)}
                  className="check-box"
                  key={index}
                >
                  {drugGivenRoutes && drugGivenRoutes.includes(route.value) ? (
                    <CheckSquare color="#F87C47" />
                  ) : (
                    <SquareIcon />
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
        ) : currentStep === 4 ? (
          <div className="step medication-step-4">
            <h1 className="sub-h1">
              What happened? Incorrect (check all that apply):
            </h1>
            <div className="field full">
              <div className="routes">
                {whatHappenedOptions.map((option, index) => (
                  <div
                    onClick={() => handleWhatHappened(option.value)}
                    className="check-box"
                    key={index}
                  >
                    {whatHappened && whatHappened.includes(option.value) ? (
                      <CheckSquare color="#F87C47" />
                    ) : (
                      <SquareIcon />
                    )}
                    <p>{option.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {showWhatHappenedOtherInput && (
              <input
                type="text"
                value={whatHappenedOtherInput}
                placeholder="Enter what happened"
                onChange={handleWhatHappenedInputChange}
              />
            )}
            <div className="field step-2-status form-of-error">
              <label htmlFor="dayOfTheWeek">Form of error</label>
              <CustomSelectInput
                options={["Actual", "Near Miss"]}
                placeholder={"Select form"}
                selected={formError}
                setSelected={setFormError}
              />
            </div>
          </div>
        ) : currentStep === 5 ? (
          <div className="step">
            <div className="description-of-varience">
              <h2>
                Description of error:
                <span> In your opinion, why did this error occur?</span>
              </h2>
              <p>
                Please be specific and refer to the example descriptions. If
                necessary, briefly describe error. Error in:
              </p>
              <div className="types">
                <div
                  className={`type full-width-type ${descriptionerror.includes("PRESCRIBING") ? "selected" : ""
                    }`}
                  onClick={() => handleTypeSelection("PRESCRIBING")}
                >
                  <h5>PRESCRIBING</h5>
                  E.G. Incomplete or unclear order, excessive quantity
                  prescribed, wrong drug, etc.
                </div>

                <div
                  className={`type full-width-type ${descriptionerror.includes("TRANSCRIBING") ? "selected" : ""
                    }`}
                  onClick={() => handleTypeSelection("TRANSCRIBING")}
                >
                  <h5>TRANSCRIBING</h5>
                  E.G. Order entered on wrong person, order content changed
                  during schedule revision, incorrect verbal order, etc.
                </div>

                <div
                  className={`type full-width-type ${descriptionerror.includes("PROCUREMENT & STORAGE")
                      ? "selected"
                      : ""
                    }`}
                  onClick={() => handleTypeSelection("PROCUREMENT & STORAGE")}
                >
                  <h5>PROCUREMENT & STORAGE</h5>
                  E.G. Lack of standardized storage locations, lack of safe drug
                  storage and stocking practices, lack of standardization of
                  stock drug concentrations, expired drugs, provider failed to
                  fill prescription, etc.
                </div>

                <div
                  className={`type full-width-type ${descriptionerror.includes("DISPENSING") ? "selected" : ""
                    }`}
                  onClick={() => handleTypeSelection("DISPENSING")}
                >
                  <h5>DISPENSING</h5>
                  E.G. Medication mislabeled, wrong medication stocked in
                  satellite pharmacy, wrong medication withdrawn from satellite
                  pharmacy,inaccurate dose calculation, etc.
                </div>

                <div
                  className={`type full-width-type ${descriptionerror.includes("ADMINISTERING") ? "selected" : ""
                    }`}
                  onClick={() => handleTypeSelection("ADMINISTERING")}
                >
                  <h5>ADMINISTERING</h5>
                  E.G. Medication label misread or not read, previous dose given
                  but not charted or charted incorrectly, person identification
                  not verified, person not available on unit, etc.
                </div>
                <div
                  className={`type full-width-type ${descriptionerror.includes("MONITORING") ? "selected" : ""
                    }`}
                  onClick={() => handleTypeSelection("MONITORING")}
                >
                  <h5>MONITORING</h5>
                  E.G. Inaccurate documentation of person’s weight, necessary
                  tests or procedures not ordered, test/procedure results
                  misinterpreted, test/procedure results not charted or charted
                  incorrectly, lapse in profile or new order review, etc.
                </div>
              </div>
            </div>
          </div>
        ) : currentStep === 6 ? (
          <div className="step">
            <div className="description-of-varience">
              <h2>
                Contributing Factors:
                <span>
                  In your opinion, were there factors that made this error
                  difficult to prevent or detect?
                </span>
              </h2>

              <div className="types">
                <div
                  className={`type full-width-type ${contributingfactors.includes("PRODUCT") ? "selected" : ""
                    }`}
                  onClick={() => handleContributingFactor("PRODUCT")}
                >
                  <h5>PRODUCT</h5>
                  E.G. Unclear manufacturing labeling, “sound-alike” drug names,
                  look-alike packaging, omission or misuse of a prefix or suffix
                  such as “fos” phenytoin or diltiazem “CD” etc.
                </div>

                <div
                  className={`type full-width-type ${contributingfactors.includes("MEDICATION USE SYSTEM")
                      ? "selected"
                      : ""
                    }`}
                  onClick={() =>
                    handleContributingFactor("MEDICATION USE SYSTEM")
                  }
                >
                  <h5>MEDICATION USE SYSTEM</h5>
                  E.G. Side-by-side storage of look-alike drugs, lack of
                  standardization in practice, competing distractions, etc.
                </div>

                <div
                  className={`type full-width-type ${contributingfactors.includes("COMMUNICATION DYNAMICS")
                      ? "selected"
                      : ""
                    }`}
                  onClick={() =>
                    handleContributingFactor("COMMUNICATION DYNAMICS")
                  }
                >
                  <h5>COMMUNICATION DYNAMICS</h5>
                  E.G. Lack of clear, accurate, and timely written and oral
                  communications related to drug regimen, lack of interactions
                  that are free of fear of intimidation, punishment, and
                  embarrassment etc.
                </div>

                <div
                  className={`type full-width-type ${contributingfactors.includes("OTHER") ? "selected" : ""
                    }`}
                  onClick={
                    handleShowOtherContributingFactors
                    // handleContributingFactor("OTHER")
                  }
                >
                  <h5>OTHER</h5>
                  <span>Explain</span>
                </div>
              </div>
              {showOtherExplanation && (
                <div className="field">
                  <label htmlFor="otherExplanation">Other explanation:</label>
                  <textarea
                    id="otherExplanation"
                    name="otherExplanation"
                    value={otherExplanation}
                    onChange={(e) => setOtherExplanation(e.target.value)}
                  ></textarea>
                  <button onClick={handleOtherExplanationChange} type="button">
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : currentStep === 7 ? (
          <div className="step">
            <div className="description-of-varience">
              <h2>
                Severity of the error (check one) Use your best judgment, to
                rate the severity of the error.
              </h2>

              <div className="types">
                {severityCategories.map((category, index) => (
                  <div
                    key={index}
                    className={`type full full-width-type ${selectedCategory.value === category.value
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
        ) : currentStep === 8 ? (
          <div className="step">
            <div className="field">
              <label htmlFor="comment">Your comments:</label>
              <RichTexField value={comment} onEditorChange={setComment} />
            </div>

            <div className="field">
              <label htmlFor="actionTaken">Actions/Outcomes:</label>
              <RichTexField
                value={actionTaken}
                onEditorChange={setActionTaken}
              />
            </div>
          </div>
        ) : currentStep === 9 ? (
          <FormCompleteMessage />
        ) : (
          <h1>Something ain't right</h1>
        )}
      </form>
      <div className="btns">
        {currentStep > 1 && currentStep < 9 ? (
          <button
            onClick={handlePreviousStep}
            id="back-button"
            className="secondary-button"
          >
            <i className="fa-solid fa-arrow-left"></i>
            <span>back</span>
          </button>
        ) : (
          ""
        )}

        {currentStep > 7 && currentStep < 9 ? (
          <button
            className="primary-button"
            id="save-button"
            onClick={() => handleSaveChange()}
          >
            <span>{isLoading ? "Processing..." : "Save Incident"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : currentStep < 9 ? (
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

export default MedicationErrorForm;
