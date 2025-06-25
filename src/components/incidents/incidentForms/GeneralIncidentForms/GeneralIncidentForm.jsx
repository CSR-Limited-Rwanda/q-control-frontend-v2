import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
// import axios from "axios";
import api, {
  API_URL,
  cleanedData,
  checkCurrentAccount,
  calculateAge
} from "@/utils/api";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomDatePicker from "@/components/CustomDatePicker";
import RichTexField from "@/components/forms/RichTextField";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";
import mediaAPI from "@/utils/mediaApi";
import {
  generalOutcomeOptions,
  incidentTypesData,
  statusesPrionToIncident
} from "@/constants/constants";
import { X, Square, SquareCheckBig, LoaderCircle, CircleCheck } from "lucide-react";
import CustomTimeInput from "@/components/CustomTimeInput";
import { FacilityCard } from "@/components/DashboardContainer";
import ErrorMessage from "@/components/messages/ErrorMessage";
import DraftPopup from "@/components/DraftPopup";
import '../../../../styles/_forms.scss'
import '../../../../styles/generalIncident.scss'
// import RichTexField from "./inputs/richTexField";

const GeneralIncidentForm = ({ togglePopup }) => {
  const [restraintOn, setRestraintOn] = useState([]);

  const [specimen, setSpecimen] = useState([]);
  const [showSpecimen, setshowSpecimen] = useState(false);
  const [showRestrainOptions, setShowRestrainOptions] = useState(false);
  const [statusPrior, setStatusPrior] = useState([]);
  const [showPriorStatusOtherInput, setShowPriorStatusOtherInput] =
    useState("");
  const [statusPriorOtherInput, setStatusPriorOtherInput] = useState("");
  const [currentStep, setCurrentStep] = useState(4);
  const currentStepRef = useRef(currentStep);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl or Alt key is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepRef.current < 7) {
          document.getElementById("continue-button").click();
        } else if (currentStepRef.current === 7) {
          document.getElementById("save-button").click();
        } else {
          return;
        }
      }

      if (event.ctrlKey || event.altKey) {
        switch (event.key) {
          case "s": // Ctrl + S
            event.preventDefault(); // Prevent default browser action
            if (currentStepRef.current < 7) {
              document.getElementById("continue-button").click();
            } else if (currentStepRef.current === 7) {
              document.getElementById("save-button").click();
            } else {
              return;
            }
            break;
          case "b":
            event.preventDefault();
            if (currentStepRef.current > 1 && currentStepRef.current <= 7) {
              document.getElementById("back-button").click();
            }
            console.log(currentStepRef.current);
            break;
          case "f": // Ctrl + F
            event.preventDefault(); // Prevent default browser action
            document.getElementById("patientVisitorFirstName").focus();
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
  const handleFileChange = (event) => {
    setFiles(event.target.files);
  };
  const handleCheckboxChange = (option) => {
    let updatedOptions;
    console.log(option);
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

  const [isLoading, setIsLoading] = useState(false);

  // form
  const [category, setCategory] = useState("");
  const [profileType, setProfileType] = useState("")
  const [patientVisitorFirstName, setPatientVisitorFirstName] = useState("");
  const [patientVisitorLastName, setPatientVisitorLastName] = useState("");
  const [suggestions, setSuggestions] = useState({});
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [medicalRecordNumber, setMedicalRecordNumber] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [userId, setUserId] = useState();
  // Incident Location

  const [location, setLocation] = useState("");
  const [contributingDiagnosis, setContributingDiagnosis] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [fallType, setFallType] = useState("");

  const [selectedTreatment, setSelectedTreatment] = useState("");
  const [agreement, setAgreement] = useState([]);
  const [treatmentRelated, setTreatmentRelated] = useState("");
  const [equipmentMalfunction, setEquipmentMalfunction] = useState("");
  const [outCome, setOutCome] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [adverseDrugReaction, setAdverseDrugReaction] = useState("");
  const [otherTypes, setOtherTypes] = useState("");
  const [outComeType, setOutComeType] = useState("mild");
  const [maintenanceNotified, setMaintenanceNotified] = useState("");
  const [removedFromService, setRemovedFromService] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [equipmentManuFacture, setEquipmentManuFacture] = useState("");
  const [equipmentModel, setEquipmentModel] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [missingFields, setMissingFields] = useState([]);
  const [morseFallScore, setMorseFallScore] = useState("");
  const [others, setOthers] = useState([]);
  const [selectedOutcome, setSelectedOutcome] = useState("");
  const [briefSummary, setBriefSummary] = useState("");
  const [immediateActionsTaken, setImmediateActionsTaken] = useState("");
  const [physicianNotifiedFirstName, setPhysicianNotifiedFirstName] =
    useState("");
  const [physicianNotifiedLastName, setPhysicianNotifiedLastName] =
    useState("");
  const [errorFetching, setErrorFetching] = useState("");
  const [physcianDate, setPhyscianDate] = useState("");
  const [physcianTime, setPhyscianTime] = useState("");
  const [familyNotifiedFirstName, setFamilyNotifiedFirstName] = useState("");
  const [familyNotifiedLastName, setFamilyNotifiedLastName] = useState("");
  const [otherOutcome, setOtherOutcome] = useState("");
  const [familyDate, setFamilyDate] = useState("");
  const [familyTime, setFamilyTime] = useState("");
  const [notifiedByFirstName, setNotifiedByFirstName] = useState("");
  const [notifiedByLastName, setNotifiedByLastName] = useState("");
  const [selectedOthers, setSelectedOthers] = useState("");
  const [specialChecked, setSpecialChecked] = useState({});
  const [errors, setErrors] = useState({});
  const [fallFromDetails, setFallFromDetails] = useState("");
  const [fallRelated, setFallRelated] = useState("");
  const [otherTreatment, setOtherTreatment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(null);
  const [fallTypeOther, setFallTypeOther] = useState("");
  const [patientId, setPatientId] = useState();

  const specialTypes = ["Unusable", "Mislabeled", "Missing"];

  const handleDateOfBirth = (date) => {
    const calculatedAge = calculateAge(date);
    setDateOfBirth(date);
    setAge(calculatedAge);
  };

  // fell off of

  const [fellOffOf, setFellOffOf] = useState([]);

  // const handleIsAnonymous = (e) => {
  //   setIsAnonymous(e.target.value === "true");
  // };

  const handleFellOff = (value) => {
    if (!fellOffOf.includes(value)) {
      // Add value to the array
      setFellOffOf((prevState) => [...prevState, value]);
    } else {
      // Remove the value from the array
      setFellOffOf((prevState) => prevState.filter((item) => item !== value));
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
    setProfileType(value);
  };

  const handleRemovedFromService = (checked) => {
    setRemovedFromService(checked);
  };

  const handleMaintenanceNotified = (checked) => {
    setMaintenanceNotified(checked);
  };

  const updateIncident = async (incidentPostData, incidentId) => {
    try {
      setIsLoading(true);

      console.log("Updating incident with data:", incidentPostData);

      const response = await api.put(
        `${API_URL}/incidents/general-visitor/${incidentId}/`,
        incidentPostData
      );

      console.log("Response:", response);

      if (response.status === 200) {
        setCurrentStep(currentStep + 1);
        console.log("Incident updated successfully:", response.data);
        window.customToast.success("Data posted successfully");
      } else {
        console.log("Unexpected status code:", response.status);
        window.customToast.error(`Unexpected status code: ${response.status}`);
      }
    } catch (error) {
      if (error.response) {
        console.error("API error:", error.response.data);
        console.log(error);
        // setErrorFetching(error.response.data.error);
        window.customToast.error(
          error.response.data.message || "API error occurred"
        );
      } else {
        console.error("Unexpected error:", error);
        window.customToast.error("Something went wrong");
        // setErrorFetching("An error occurred while posting incident data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewGeneralIncident = async (incidentData) => {
    console.log("Incident data", incidentData, "currentStep: " + currentStep);
    try {
      setIsLoading(true);
      const response = await api.post(
        `${API_URL}/incidents/general-visitor/`,

        cleanedData(incidentData)
      );
      if (response.status === 201) {
        localStorage.setItem("generalIncidentId", response?.data?.id);
        setPatientId(response?.data?.patient_visitor?.id);
        localStorage.setItem("patientId", response?.data?.patient_visitor?.id);
        console.log(response.data);
        setUserId(response?.data?.created_by);
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
        window.customToast.success("Data posted successfully");
        localStorage.setItem("updateNewIncident", "true");
        console.log(localStorage.getItem("updateNewIncident"));
        postDocumentHistory(
          response?.data?.id,
          "added a new incident",
          "create"
        );
      }
    } catch (error) {
      console.log("Error:", error);

      setIsLoading(false);
      if (error?.response?.data) {
        // setErrorFetching(error?.response?.data?.error);
        window.customToast.error(
          error?.response?.data?.message ||
          "Error while creating new incident, please try again"
        );
        return;
      } else {
        window.customToast.error("Something went wrong");
        // setErrorFetching("An error occurred while posting incident data.");
        return;
      }
    }
  };

  async function handleFileSubmit(incidentId) {
    const formData = new FormData();
    for (const file of files) {
      formData.append("files", file);
    }
    try {
      const response = await mediaAPI.post(
        `${API_URL}/incidents/general/${incidentId}/documents/new/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        window.customToast.success("Media Posted Successfully");
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleSaveChange = async () => {
    const incident_id = localStorage.getItem("generalIncidentId");
    if (currentStep === 6) {
      const data = {
        current_step: currentStep,
        user_id: userId,
        // anonymous: isAnonymous,
        brief_summary_of_incident: briefSummary,
        immediate_action_taken: immediateActionsTaken,
        status: "Open",
      };
      try {
        const response = await api.put(
          `${API_URL}/incidents/general-visitor/${incident_id}/`,

          data
        );

        if (response.status === 201 || response.status === 200) {
          localStorage.setItem("generalIncidentId", response?.data?.id);
          localStorage.setItem("updateNewIncident", "false");
          setCurrentStep(currentStep + 1);
          setIsLoading(false);
          window.customToast.success("Data posted successfully");

          handleFileSubmit(response?.data?.id);
        }
      } catch (error) {
        if (error.response) {
          console.error("API error:", error.response.data);
          console.log(error);
          // setErrorFetching(error.response.data.error);
          window.customToast.error(
            error.response.data.message || "API error occurred"
          );
        } else {
          console.error("Unexpected error:", error);
          window.customToast.error("Something went wrong");
          // setErrorFetching("An error occurred while posting incident data.");
        }
      }
    }
  };

  const handleNextStep = () => {
    let isValid = true;

    if (currentStep === 1) {
      isValid = validateStep({
        profile_type: profileType,
        "patient visitor first name": patientVisitorFirstName,
        "patient visitor last name": patientVisitorFirstName,
        "incident date": incidentDate,
        status: "Draft",

        address: address,
        state: state,
        "zip code": zipCode,
        city: city,
        "phone number": phoneNumber,
        gender: sex,
      });

      console.log("Facility ID", checkCurrentAccount());
      if (isValid) {
        const incidentPostData = {
          facility_id: checkCurrentAccount(),
          status: "Draft",
          current_step: currentStep,
          category: category,
          incident_date: incidentDate,
          incident_time: incidentTime,
          report_facility_id: checkCurrentAccount(),
          patient_visitor: {
            first_name: patientVisitorFirstName,
            last_name: patientVisitorLastName,
            medical_record_number: medicalRecordNumber || null,
            address: address,
            state: state,
            gender: sex,
            age: age,
            date_of_birth: dateOfBirth,
            zip_code: zipCode,
            city: city,
            phone_number: phoneNumber,
            profile_type: profileType,
          },
        };
        console.log(incidentPostData);
        if (localStorage.getItem("updateNewIncident") === "false") {
          handleNewGeneralIncident(
            cleanedData(incidentPostData),
            localStorage.getItem("generalIncidentId")
          );
        }

        if (localStorage.getItem("updateNewIncident") === "true") {
          updateIncident(
            cleanedData(incidentPostData),
            localStorage.getItem("generalIncidentId")
          );
        }
      } else {
        return;
      }
    } else if (currentStep === 2) {
      isValid = validateStep({
        "incident location": location,

        "patient status prior list": statusPrior,
      });

      if (statusPrior.length === 0) {
        window.customToast.error("Please select at least one status");
        isValid = false;
      }

      if (selectedStatus === "others" && !otherStatus) {
        window.customToast.error("Please enter a status for 'others'");
        isValid = false;
      }
      let statusPriorUpdatedOptions = [...statusPrior];

      if (showPriorStatusOtherInput && statusPriorOtherInput.trim() !== "") {
        statusPriorUpdatedOptions.push(statusPriorOtherInput.trim());
      }
      if (isValid) {
        let incidentPostData = {
          current_step: currentStep,

          location: location,
          consulting_diagnosis: contributingDiagnosis,
          patient_status_prior: statusPriorUpdatedOptions.join(", "),
        };

        console.log(incidentPostData);

        if (selectedStatus === "others") {
          incidentPostData.other_status = otherStatus;
        }

        updateIncident(
          cleanedData(incidentPostData),
          localStorage.getItem("generalIncidentId")
        );
      } else {
        return;
      }
    } else if (currentStep === 3) {
      if (incidentType === "Fall related") {
        const type = "Fall related";
        isValid = validateStep({
          incidentType: incidentTypesData,
          "Fall related type": fallType,
          "Morse fall score": morseFallScore,
        });

        if (fallType === "Other") {
          validateStep({
            "Other fall type": fallTypeOther,
          });
        }

        if (!agreement) {
          window.customToast.error("Please indicate your agreement");
          isValid = false;
        }
        if (fallType === "Fall from" && !fallFromDetails) {
          console.log("Fall from details is missing");
          window.customToast.error("Specify all the equipment");
          isValid = false;
        }

        if (isValid) {
          const incidentPostData = {
            status: "Draft",
            current_step: currentStep,
            user_id: userId,
            incident_type: type,
            fall_related_type: fallType,
            morse_fall_score: morseFallScore,
            fell_from: fallFromDetails,
            fall_type_other: fallType === "Other" ? fallTypeOther : null,
            fall_type_agreement: agreement.join(", "),
          };

          if (fallType === "Fall from" && !fallFromDetails) {
            window.customToast.error("Specify all the required places");
            isValid = false;
          }
          console.log("Fall Related Data:", incidentPostData);
          updateIncident(
            cleanedData(incidentPostData),
            localStorage.getItem("generalIncidentId")
          );
        } else {
          return;
        }
      } else if (incidentType === "Treatment related") {
        const type = "treatment";
        isValid = validateStep({
          "Selected treatment": selectedTreatment,
        });

        if (isValid) {
          const incidentPostData = {
            current_step: currentStep,
            user_id: userId,
            treatment_type: type,
            status: "Draft",
          };
          console.log("Treatment Related Data:", incidentPostData);
          updateIncident(
            incidentPostData,
            localStorage.getItem("generalIncidentId")
          );
        } else {
          return;
        }
      } else if (incidentType === "equipment malfunction") {
        const type = "equipment";
        isValid = validateStep({
          incident_type: incidentTypesData,
          equipment_type: equipmentType,
          removed_from_service: removedFromService,
          equipment_serial_number: serialNumber,
          equipment_lot_number: lotNumber,
          equipment_manufacturer: equipmentManuFacture,
          equipment_model: equipmentModel,
        });

        if (isValid) {
          const incidentPostData = {
            status: "Draft",
            current_step: currentStep,
            user_id: userId,
            "incident type": type,
            "equipment Type": equipmentType,
            "equipment ManuFacture": equipmentManuFacture,
            "equipment Model": equipmentModel,
            "serial Number": serialNumber,
            "lot Number": lotNumber,
            checkboxes: removedFromService || maintenanceNotified,
          };
          console.log("Equipment Malfunction Data:", incidentPostData);
          updateIncident(
            cleanedData(incidentPostData),
            localStorage.getItem("generalIncidentId")
          );
        } else {
          window.customToast.error(
            "Please fill in all required fields for equipment malfunction."
          );
          return;
        }
      } else if (incidentType === "Other") {
        setIncidentType("Other");
        isValid = validateStep({
          "Other type specimen other": otherTypes,
        });

        if (isValid) {
          const incidentPostData = {
            current_step: currentStep,
            user_id: userId,
            other_type_specimen_other: otherTypes,
            status: "Draft",
          };
          console.log("Others Data:", incidentPostData);
          updateIncident(
            incidentPostData,
            localStorage.getItem("generalIncidentId")
          );
        } else {
          return;
        }
      }
    } else if (currentStep === 4) {
      isValid = validateStep({
        "selected outcome": selectedOutcome,
      });

      if (selectedOutcome === "Other" && !otherOutcome) {
        window.customToast.error(
          "Please enter a description for the selected outcome"
        );
        isValid = false;
      }

      if (isValid) {
        const incidentPostData = {
          status: "Draft",
          current_step: currentStep,
          user_id: userId,
          outcome: selectedOutcome,
          outcome_actions_taken: actionsTaken,
        };

        if (selectedOutcome === "Other") {
          incidentPostData.reason_for_escalation = otherOutcome;
        }

        updateIncident(
          cleanedData(incidentPostData),
          localStorage.getItem("generalIncidentId")
        );
      } else {
        return;
      }
    } else if (currentStep === 5) {
      isValid = validateStep({
        "physician notified first name": physicianNotifiedFirstName,
        "physician notified last name": physicianNotifiedLastName,
        "physcian date": physcianDate,
        "physcian time": physcianTime,

        "notified by first name": notifiedByFirstName,
        "notified by last name": notifiedByLastName,
      });

      if (isValid) {
        const incidentPostData = {
          current_step: currentStep,
          user_id: userId,
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
        };

        console.log(incidentPostData);
        updateIncident(
          cleanedData(incidentPostData),
          localStorage.getItem("generalIncidentId")
        );
      } else {
        return;
      }
    }
  };
  const validateFallFrom = (data) => {
    let isValid = true;
    if (data.fall_related_type === "fall from" && !data.fell_from) {
      window.customToast.error("Specify the equipment you fell from");
      isValid = false;
    }

    return isValid;
  };

  const handlePreviousStep = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
  };

  const handleSuggestion = (suggestion) => {
    console.log(suggestion);
    // setPatientVisitorName(
    //   `${suggestion.user.first_name} ${suggestion.user.last_name}`
    // );
    setPhoneNumber(suggestion.phone_number);
    setZipCode(suggestion.zip_code);
    setCity(suggestion.city);
    setState(suggestion.state);
    setAddress(suggestion.address);
    setSex(suggestion.gender);
    setUserId(suggestion.user.id);
    setDateOfBirth(suggestion.date_of_birth);
    setAge(suggestion.age);

    setShowSuggestions(false);
  };

  const handleShowPatientSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  useEffect(() => {
    localStorage.setItem("updateNewIncident", "false");
    console.log(localStorage.getItem("updateNewIncident"));
    const fetchSuggestions = async () => {
      try {
        setFetchingSuggestions(true);
        const response = await api.get(`/accounts/patients/`);
        if (response.status === 200) {
          setSuggestions(response.data);
          setFetchingSuggestions(false);
        } else {
          console.error(response.data);
        }
      } catch (error) {
        setFetchingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleFilter = (string) => {
    // setPatientVisitorName(string);
    const results = suggestions.filter(
      (suggestion) =>
        suggestion.user &&
        suggestion.user?.first_name.toLowerCase().includes(string.toLowerCase())
    );

    if (Object.keys(string).length <= 0) {
      setFilteredSuggestions(suggestions);
    } else {
      setFilteredSuggestions(results);
    }
  };
  return (
    <div className="forms-container">
      <div className="forms-header">
        <h2>Add new incident</h2>
        <X
          onClick={() => {
            togglePopup();
            localStorage.setItem("updateNewIncident", "false");
          }}
          className="close-icon"
        />

        {errorFetching && <ErrorMessage errorFetching={errorFetching} />}

        <div className="form-steps">
          {currentStep < 5 ? (
            <>
              <div className={currentStep === 1 ? "step current-step" : "step"}>
                <div className="icon">
                  <CircleCheck />
                </div>
                <div className="name">
                  <p className="step-name">Step 1/7</p>
                  <p className="step-details">Incident Information</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className={currentStep === 2 ? "step current-step" : "step"}>
                <div className="icon">
                  <CircleCheck />
                </div>
                <div className="name">
                  <p className="step-name">Step 2/7</p>
                  <p className="step-details">Location and status</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className={currentStep === 3 ? "step current-step" : "step"}>
                <div className="icon">
                  <CircleCheck />
                </div>
                <div className="name">
                  <p className="step-name">Step 3/7</p>
                  <p className="step-details">Incident type</p>
                </div>
              </div>
              <div className="divider"></div>
              <div className={currentStep === 4 ? "step current-step" : "step"}>
                <div className="icon">
                  <CircleCheck />
                </div>
                <div className="name">
                  <p className="step-name">Step 4/7</p>
                  <p className="step-details">Outcome</p>
                </div>
              </div>{" "}
            </>
          ) : (
            <>
              <div
                className={
                  currentStep === 5 || currentStep === 6 || currentStep === 7
                    ? "step current-step"
                    : "step"
                }
              ></div>
              <div className={currentStep === 5 ? "step current-step" : "step"}>
                <div className="icon">
                  <CircleCheck />
                </div>
                <div className="name">
                  <p className="step-name">Step 5/7</p>
                  <p className="step-details">Notification</p>
                </div>
              </div>
              <div className={currentStep === 6 ? "step current-step" : "step"}>
                <div className="icon">
                  <CircleCheck />
                </div>
                <div className="name">
                  <p className="step-name">Step 6/7</p>
                  <p className="step-details">Notification</p>
                </div>
              </div>
              <div className={currentStep === 7 ? "step current-step" : "step"}>
                <div className="icon">
                  <CircleCheck />
                </div>
                <div className="name">
                  <p className="step-name">Step 7/7</p>
                  <p className="step-details">Success message</p>
                </div>
              </div>{" "}
            </>
          )}
        </div>
        <FacilityCard />
        <DraftPopup incidentString="general" incidentType="general_incident" />
      </div>
      <form className="newIncidentForm">
        {currentStep === 1 ? (
          <div className="step incident-info">
            <h4>Select type</h4>
            <div className="types field radio">
              <div className="type">
                <input
                  onChange={(e) => handleCategory("Inpatient")}
                  type="radio"
                  name="category"
                  id="Inpatient"
                  checked={profileType === "Inpatient"}
                  value="Inpatient"
                />
                <label htmlFor="Inpatient">Inpatient</label>
              </div>

              <div className="type">
                <input
                  onChange={(e) => handleCategory("Outpatient")}
                  type="radio"
                  name="category"
                  id="Outpatient"
                  checked={profileType === "Outpatient"}
                  value="Outpatient"
                />
                <label htmlFor="Outpatient">Outpatient</label>
              </div>

              <div className="type">
                <input
                  onChange={(e) => handleCategory("ER")}
                  type="radio"
                  name="category"
                  id="ER"
                  checked={profileType === "ER"}
                  value="ER"
                />
                <label htmlFor="ER">ER</label>
              </div>

              <div className="type">
                <input
                  onChange={(e) => handleCategory("Visitor")}
                  type="radio"
                  name="category"
                  id="Visitor"
                  checked={profileType === "Visitor"}
                  value="Visitor"
                />
                <label htmlFor="Visitor">Visitor</label>
              </div>
            </div>

            <div className="form-half">
              <div
                className={`field name ${showSuggestions ? "suggestions-field" : ""
                  }`}
              >
                <label htmlFor="patientName">Patient/Visitor first name</label>
                <input
                  // onClick={handleShowPatientSuggestions}
                  onChange={(e) => setPatientVisitorFirstName(e.target.value)}
                  value={patientVisitorFirstName}
                  type="text"
                  name="patientVisitorFirstName"
                  id="patientVisitorFirstName"
                  placeholder="Patient or visitors first name"
                  className="name-input"
                />
              </div>
              <div
                className={`field name ${showSuggestions ? "suggestions-field" : ""
                  }`}
              >
                <label htmlFor="patientName">Patient/Visitor last name</label>
                <input
                  onChange={(e) => setPatientVisitorLastName(e.target.value)}
                  value={patientVisitorLastName}
                  type="text"
                  name="patientVisitorLastName"
                  id="patientVisitorLastName"
                  placeholder="Patient or visitors last name"
                  className="name-input"
                />
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

            <div className="form-half">
              <div className="incident-date field">
                <label htmlFor="incidentDate">Date of birth</label>
                <CustomDatePicker
                  setSelectedDate={handleDateOfBirth}
                  selectedDate={dateOfBirth}
                />
              </div>

              <div className="age field">
                <label htmlFor="">Age</label>
                <input
                  type="number"
                  placeholder="Enter age"
                  value={age || ''}
                  onChange={(e) => {
                    const value = e.target.value
                    if (value === '' || !isNaN(value)) {
                      setAge(value === '' ? '' : parseInt(value, 10))
                    }
                  }}
                  className="name-input"
                />
              </div>
            </div>

            <div className="form-half">
              <div className="incident-date field">
                <label htmlFor="incidentDate">Incident Date</label>
                <CustomDatePicker
                  // selectedDate={incidentDate}
                  setSelectedDate={setIncidentDate}
                  selectedDate={incidentDate}
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

            <div className="form-half">
              <div>
                <label htmlFor="incidentMr">Medical Record Number (if any)</label>
                <input
                  onChange={(e) => setMedicalRecordNumber(e.target.value)}
                  value={medicalRecordNumber}
                  type="text"
                  name="medicalRecoredNumber"
                  id="medicalRecoredNumber"
                  placeholder="Enter MR"
                  className="name-input"
                />
              </div>
            </div>

            <div className="form-half field one">
              <div className="address">
                <label htmlFor="address">Address</label>
                <input
                  onChange={(e) => setAddress(e.target.value)}
                  value={address}
                  type="text"
                  name="address"
                  placeholder="Enter  patient or visitor address"
                  className="name-input"
                />
              </div>

              <div className="city address">
                <label htmlFor="city">City</label>
                <input
                  onChange={(e) => setCity(e.target.value)}
                  value={city}
                  type="text"
                  name="city"
                  id="city"
                  placeholder="City"
                  className="name-input"
                />
              </div>

              <div className="state">
                <label htmlFor="state">State</label>
                <input
                  onChange={(e) => setState(e.target.value)}
                  value={state}
                  type="text"
                  name="state"
                  id="state"
                  placeholder="Enter  patient or visitor state"
                  className="name-input"
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
                  className="name-input"
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
                  className="name-input"
                />
              </div>
            </div>
          </div>
        ) : currentStep === 2 ? (
          <div className="step location-status">
            <h3>Location and status</h3>
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
            <div className="statuses">
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
                      <SquareCheckBig />
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
        ) : currentStep === 3 ? (
          <div className="incident-type">
            Incident type
            <div className="field name">
              <CustomSelectInput
                options={[
                  "Fall related",
                  "Treatment related",
                  "Equipment malfunction",
                  "Other",
                ]}
                value={incidentType}
                placeholder={"incident type"}
                selected={incidentType}
                setSelected={setIncidentType}
              />
            </div>
            <div className="incident-types">
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
                          "Fall from",
                          "Fell of off",
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

                    {fallType === "Fall from" && (
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
                  {fallType === "Fell off of" ? (
                    <div className="field name">
                      <label htmlFor="morseFallScore">
                        Please select all applicable
                      </label>
                      <div className="types">
                        {incidentTypesData.fell_of_of.map((type, index) => (
                          <div
                            onClick={() => handleFellOff(type.name)}
                            className={
                              fellOffOf?.includes(type.name)
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
                      Please select all applicable
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
                            {incidentTypesData.agreements.map((type, index) => {
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
                            })}
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
                      {incidentTypesData.treatment_related.map((treatment) => (
                        <div
                          onClick={() => setSelectedTreatment(treatment.name)}
                          className={
                            selectedTreatment === treatment.name
                              ? "status selected"
                              : "status"
                          }
                          key={treatment.name}
                        >
                          <p>{treatment.name}</p>
                        </div>
                      ))}
                      {selectedTreatment === "Other" ? (
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
              ) : incidentType === "Equipment malfunction" ? (
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
              ) : incidentType === "Injury or outcome" ? (
                <div className="treatment-related">
                  <h1>Treatment related</h1>
                  <div className="types">
                    {incidentTypesData.injury_or_outcome.map((type, index) => (
                      <div
                        onClick={() => setOutCome(type.name)}
                        className={
                          outCome === type.name ? "type selected" : "type"
                        }
                      >
                        <p>{type.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : incidentType === "Adverse drug reaction" ? (
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
              ) : incidentType === "Other" ? (
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

                  {otherTypes === "Other" && (
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
        ) : currentStep === 4 ? (
          <div className="step location-status">
            <h3>Select Outcome</h3>
            <div className="statuses">
              <label htmlFor="statuses"></label>
              {/* <CustomSelectInput
                options={generalOutcomeOptions.map((outcome) => outcome.value)}
                selected={selectedOutcome}
                setSelected={setSelectedOutcome}
              /> */}
              <div className="status-choices grid-choices">
                {generalOutcomeOptions.map((outcome, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedOutcome(outcome.value)}
                    className={
                      selectedOutcome === outcome.value
                        ? "outcome selected status"
                        : "status"
                    }
                  >
                    <p>{outcome.label}</p>
                  </div>
                ))}
              </div>
            </div>
            {selectedOutcome === "Other" && (
              <div className="other-field">
                <div className="field name">
                  <input
                    onChange={(e) => setOtherOutcome(e.target.value)}
                    value={otherOutcome}
                    type="text"
                    name="otherOutcome"
                    id="otherOutcome"
                    placeholder="Explain"
                  />
                </div>
              </div>
            )}
          </div>
        ) : currentStep === 5 ? (
          <div className="other-info">
            <h1>Notification</h1>

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
                  onChange={(e) => setPhysicianNotifiedLastName(e.target.value)}
                  type="text"
                  name="physicianNotifiedLastName"
                  id="physicianNotifiedLastName"
                  placeholder="Enter last name"
                  value={physicianNotifiedLastName}
                />
              </div>
            </div>

            <div className="half">
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
            </div>

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
              <div className="half">
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
              </div>
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
        ) : currentStep === 6 ? (
          <div className="step">
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
                Immediate actions taken
              </label>
              <RichTexField
                value={immediateActionsTaken}
                onEditorChange={setImmediateActionsTaken}
              />
            </div>
            <div className="field">
              <input
                type="file"
                onChange={handleFileChange}
                name="files"
                id="files"
                multiple
              />
            </div>
          </div>
        ) : currentStep === 7 ? (
          // Display the success message
          <FormCompleteMessage title={"General incident has been submitted"} />
        ) : (
          ""
        )}
      </form>

      <div className="buttons">
        {currentStep > 1 && currentStep < 7 ? (
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

        {currentStep > 5 && currentStep < 7 ? (
          <button
            onClick={handleSaveChange}
            className="primary-button"
            disabled={isLoading}
            id="save-button"
          >
            <span>{isLoading ? "Saving..." : "Save Incident"}</span>
            <i
              className={`fa-solid fa-arrow-right ${isLoading ? "loading" : ""
                }`}
            ></i>
          </button>
        ) : currentStep < 7 ? (
          <button
            onClick={handleNextStep}
            id="continue-button"
            className="primary-button"
          >
            <span>{isLoading ? "Processing..." : "Save & Continue"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          " "
        )}
      </div>
    </div>
  );
};

export default GeneralIncidentForm;

export const UserSuggestions = ({
  suggestions,
  string,
  handleSuggestion,
  filteredSuggestions,
  isLoading,
}) => {
  return (
    <div className="suggestions-container">
      {isLoading ? (
        <div className="loading-suggestions">
          <LoaderCircle size={18} className="loading-icon" />
        </div>
      ) : (
        <>
          Click to select
          <div className="list">
            {filteredSuggestions &&
              filteredSuggestions.map((suggestion) => (
                <div
                  onClick={() => handleSuggestion(suggestion)}
                  className="suggestion"
                >
                  <p>{suggestion.user?.first_name}</p>
                  <div className="more-info">
                    <small>{suggestion.user?.email}</small>
                    <small>{suggestion.address}</small>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

