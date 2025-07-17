import React, { useEffect, useState } from "react";
import { useRef } from "react";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
import api, {
  API_URL,
  checkCurrentAccount,
  calculateAge,
  cleanedData,
} from "@/utils/api";
import toast from "react-hot-toast";
import "@/styles/_drugReactionIncidentForm.scss";

import { X, CheckSquare, Square, SquareIcon } from "lucide-react";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomDatePicker from "@/components/CustomDatePicker";
import RichTexField from "@/components/forms/RichTextField";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";
import {
  drugRoutes,
  incidentTypesData,
  outComeData,
  outcomeReasons,
} from "@/constants/constants";
import CustomTimeInput from "@/components/CustomTimeInput";
import { FacilityCard } from "@/components/DashboardContainer";
import DraftPopup from "@/components/DraftPopup";

const DrugReactionForm = ({ togglePopup }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);
  const [isLoading, setIsLoading] = useState(false);

  // form
  const [outComeType, setOutComeType] = useState("mild");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [sex, setSex] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [incidentTime, setIncidentTime] = useState("");
  const [incidentMr, setIncidentMr] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [victimType, setVictimType] = useState("");
  const [otherStatus, setOtherStatus] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [location, setLocation] = useState("");
  const [contributingDiagnosis, setContributingDiagnosis] = useState("");
  const [isIv, setIsIv] = useState(false);
  const [isReactionTreated, setIsReactionTreated] = useState(false);
  const [provider, setProvider] = useState("");
  const [observersFirstName, setObserversFirstName] = useState("");
  const [observersLastName, setObserversLastName] = useState("");

  const [observersNameArray, setObserversNameArray] = useState([]);
  const [timeOfReport, setTimeOfReport] = useState("");
  const [dateOfReport, setDateOfReport] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [suspectedMedication, setSuspectedMeedication] = useState("");
  const [dose, setDose] = useState("");
  const [frequency, setFrequency] = useState("");
  const [route, setRoute] = useState("");
  const [rateOfAdministration, setRateOfAdministration] = useState("");
  const [dateOfMedicationOrder, setDateOfMedicationOrder] = useState("");
  const [dateInformation, setDateInformation] = useState("");
  const [reaction, setReaction] = useState("");
  const [adverseReactionDate, setAdverseReactionDate] = useState("");
  const [reactionSetTime, setReactionSetTime] = useState("");
  const [selectedAgreements, setSelectedAgreements] = useState([]);
  const [physicianNotifiedFirstName, setPhysicianNotifiedFirstName] =
    useState("");
  const [physicianNotifiedLastName, setPhysicianNotifiedLastName] =
    useState("");
  const [physcianDate, setPhyscianDate] = useState("");
  const [physcianTime, setPhyscianTime] = useState("");
  const [familyNotifiedFirstName, setFamilyNotifiedFirstName] = useState("");
  const [familyNotifiedLastName, setFamilyNotifiedLastName] = useState("");
  const [otherOutcome, setOtherOutcome] = useState("");
  const [familyDate, setFamilyDate] = useState("");
  const [familyTime, setFamilyTime] = useState("");
  const [notifiedByFirstName, setNotifiedByFirstName] = useState("");
  const [notifiedByLastName, setNotifiedByLastName] = useState("");
  const [briefSummary, setBriefSummary] = useState("");
  const [immediateActionsTaken, setImmediateActionsTaken] = useState("");
  const [description, setDescription] = useState("");
  const [selectedNote, setSelectedNote] = useState(""); // "Nurse note", "Progress note", "Other note"
  const [otherNoteDescription, setOtherNoteDescription] = useState("");
  const [treatmentDescription, setTreatmentDescription] = useState("");
  const [agreementDescription, setAgreementDescription] = useState("");
  const [outcomeType, setOutcomeType] = useState("");
  const [outcomeDescription, setOutcomeDescription] = useState("");
  const [selectedDescription, setSelectedDescription] = useState([]);
  const [adrOutcome, setAdrOutcome] = useState([]);
  const [fdaReported, setFdaReported] = useState(false);
  const [drugReactionData, setDrugReactionData] = useState();
  const [popupOpen, setPopupOpen] = useState(false);
  const [facilityId, setFacilityId] = useState(
    localStorage.getItem("facilityId")
  );

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

    const fetchDrafts = async () => {
      // API call to fetch drafts data
      try {
        const response = await api.get(`incidents/overview/draft/user/`);
        if (response.status === 200) {
          setDrugReactionData(response.data.adverse_drug_reaction);
          setPopupOpen(
            response.data.adverse_drug_reaction.length > 0 ? true : false
          );

          console.log(response.data);
        }
      } catch (error) {
        window.customToast.error(error.message);
        console.error(error);
      }
    };

    fetchDrafts();
    // Add event listener when component mounts
    document.addEventListener("keydown", handleKeyDown);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleVictimType = (value) => {
    setVictimType(value);
  };

  const nurseNote = selectedNote === "Nurse note";
  const progressNote = selectedNote === "Progress note";
  const otherNote = selectedNote === "Other note";
  const handleNoteChange = (value) => {
    setSelectedNote(value);

    // Optionally clear otherNoteDescription when deselecting "Other note"
    if (value !== "Other note") {
      setOtherNoteDescription("");
    }
  };

  const handleReactionTreated = () => {
    setIsReactionTreated(!isReactionTreated);
    setTreatmentDescription("");
  };

  const handleOutcomeType = (value) => {
    setOutcomeType(value);
    setOutcomeDescription("");
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
    console.log(selectedDescription);
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
    console.log(selectedDescription);
  };

  const handleRouteChange = (e) => {
    setRoute(e.target.value);
  };
  const handleAgreementChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedAgreements([...selectedAgreements, value]);
    } else {
      setSelectedAgreements(
        selectedAgreements.filter((agreement) => agreement !== value)
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

  async function handleNewDrugAdverseReaction(drugReactionData) {
    try {
      setIsLoading(true);
      const response = await api.post(
        `${API_URL}/incidents/adverse-drug-reaction/`,
        cleanedData(drugReactionData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        const id = response.data.id;
        localStorage.setItem("drugReactionId", id.toString());
        localStorage.setItem("updateNewIncident", "true");
        console.log(localStorage.getItem("updateNewIncident"));
        window.customToast.success("Successfully posted data");
        setCurrentStep(currentStep + 1);
        console.log(response.data.data);
        postDocumentHistory(id, "added a new incident", "create");
      }
    } catch (error) {
      if (error?.response?.data.data) {
        window.customToast.error(
          error.response.data.message ||
            "Error while creating new incident, please try again"
        );
      } else {
        window.customToast.error("Something went wrong");
      }
      console.error(error);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  async function updateDrugAdverseReaction(drugReactionData) {
    try {
      setIsLoading(true);
      const id = localStorage.getItem("drugReactionId");
      console.log(id);
      const response = await api.put(
        `${API_URL}/incidents/adverse-drug-reaction/${id}/`,
        cleanedData(drugReactionData),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        if (currentStep === 8) {
          window.customToast.success("Incident Saved Successfully");
          setCurrentStep(currentStep + 1);

          postDocumentHistory(id, "added a new incident", "create");
        } else {
          setCurrentStep(currentStep + 1);
          window.customToast.success("Data posted Successfully");
        }
        if (currentStep === 9) {
          localStorage.setItem("updateNewIncident", "false");
        }
        console.log(response.data);
      }
    } catch (error) {
      if (error.response.data) {
        window.customToast.error(
          error.response.data.message ||
            "Failed to update the data. Please try again."
        );
      } else {
        window.customToast.error("Something went wrong");
      }
      console.error(error);
      return;
    } finally {
      setIsLoading(false);
    }
  }

  const handleNextStep = () => {
    let isValid = true;
    let drugReactionData;

    if (currentStep === 1) {
      isValid = validateStep({
        "Incident Type": victimType,
        "Patient or visitor first name": firstName,
        "Patient or visitor last name": lastName,
        "Incident Date": incidentDate,
        "Incident Time": incidentTime,
        gender: sex,

        Address: address,
        State: state,
        "Zip Code": zipCode,
        "Phone Number": phoneNumber,
      });

      if (isValid) {
        drugReactionData = {
          current_step: currentStep,
          patient_type: victimType,
          facility: facilityId,
          report_facility: facilityId,
          patient_name: {
            first_name: firstName,
            last_name: lastName,
            profile_type: "Patient",

            gender: sex,
            address: address,
            state: state,
            zip_code: zipCode,
            city: city,
            phone_number: phoneNumber,
            medical_record_number: incidentMr,
          },

          incident_date: incidentDate,
          incident_time: incidentTime,

          status: "Draft",
        };
        console.log("Drug reaction data: ", drugReactionData);

        if (localStorage.getItem("updateNewIncident") === "false") {
          handleNewDrugAdverseReaction(cleanedData(drugReactionData));
        }

        if (localStorage.getItem("updateNewIncident") === "true") {
          updateDrugAdverseReaction(cleanedData(drugReactionData));
        }
      }
    }
    if (currentStep === 2) {
      isValid = validateStep({
        provider: provider,
        "observers first name": observersFirstName,
        "observers last name": observersLastName,
        "time of report": timeOfReport,
        "date of report ": dateOfReport,
        "event details": eventDetails,
      });

      if (isValid) {
        drugReactionData = {
          provider: provider,
          observers_name: {
            first_name: observersFirstName,
            last_name: observersLastName,
            profile_type: "Staff",
          },
          time_of_report: timeOfReport,
          date_of_report: dateOfReport,
          event_detail: eventDetails,
        };

        updateDrugAdverseReaction(drugReactionData);
      }
    }
    if (currentStep === 3) {
      if (route === "IV Push" || route === "IV Drip") {
        isValid = validateStep({
          "suspected medication": suspectedMedication,
          dose: dose,
          frequency: frequency,
          route: route,
          "rate of administration": rateOfAdministration,
          "date of medication order": dateOfMedicationOrder,
          description: description,
        });
      } else {
        isValid = validateStep({
          "suspected medication": suspectedMedication,
          dose: dose,
          frequency: frequency,
          route: route,

          "date of medication order": dateOfMedicationOrder,
        });
      }

      if (isValid) {
        drugReactionData = {
          current_step: currentStep,
          suspected_medication: suspectedMedication,
          dose: dose,
          frequency: frequency,
          route: route,
          rate_of_administration: rateOfAdministration,
          date_of_medication_order: dateOfMedicationOrder,
          other_route_description: description,
        };

        updateDrugAdverseReaction(drugReactionData);
      }
    }
    if (currentStep === 4) {
      if (otherNote && isReactionTreated) {
        isValid = validateStep({
          "Date information": dateInformation,
          reaction: reaction,
          "adverse reaction date": adverseReactionDate,
          "reaction set time": reactionSetTime,
          note: otherNote,
          "other note description": otherNoteDescription,
          "reaction was treated description": treatmentDescription,
        });
      } else if (otherNote) {
        isValid = validateStep({
          "Date information": dateInformation,
          reaction: reaction,
          "adverse reaction date": adverseReactionDate,
          "reaction set time": reactionSetTime,
          note: otherNote,
          "other note description": otherNoteDescription,
        });
      } else if (isReactionTreated) {
        isValid = validateStep({
          "Date information": dateInformation,
          reaction: reaction,
          "adverse reaction date": adverseReactionDate,
          "reaction set time": reactionSetTime,
          note: nurseNote || progressNote,
          "reaction was treated description": treatmentDescription,
        });
      } else {
        isValid = validateStep({
          "Date information": dateInformation,
          reaction: reaction,
          "adverse reaction date": adverseReactionDate,
          "reaction set time": reactionSetTime,
          note: nurseNote || progressNote,
        });
      }

      if (isValid) {
        drugReactionData = {
          current_step: currentStep,
          date_of_information: dateInformation,
          information_reaction: reaction,
          date_of_adverse_reaction: adverseReactionDate,
          reaction_on_settime: reactionSetTime,
          nurse_note: nurseNote,
          progress_note: progressNote,
          other_information_can_be_found_in: otherNote,
          other_information_description: otherNoteDescription,
          reaction_was_treated: isReactionTreated,
          treatment_description: treatmentDescription,
        };
        console.log("Drug reaction data: ", drugReactionData);
        updateDrugAdverseReaction(drugReactionData);
      }
    }
    if (currentStep === 5) {
      const isAnySelected = selectedAgreements.length > 0;
      if (selectedAgreements.includes("other (describe)")) {
        isValid = validateStep({
          description: agreementDescription,
        });
      } else {
        setAgreementDescription("");
      }

      if (!isAnySelected) {
        window.customToast.error("Please select at least one option");
        isValid = false;
      }

      if (isValid) {
        drugReactionData = {
          current_step: currentStep,
          incident_type_classification: selectedAgreements.includes(
            "other (describe)"
          )
            ? selectedAgreements
                .filter((el) => el !== "other (describe)")
                .join(", ") +
              ", " +
              agreementDescription
            : selectedAgreements.join(", "),
        };
        updateDrugAdverseReaction(drugReactionData);
      }
    }
    if (currentStep === 6) {
      if (outcomeType !== "mild") {
        isValid = validateStep({
          "outcome type": outcomeType,
          "outcome description": selectedDescription,
          "Anaphylaxis outcome": adrOutcome.length > 0 ? true : false,

          // "ADR Outcome": adrOutcome,
        });
      } else {
        isValid = validateStep({
          "outcome type": outcomeType,
          // "ADR Outcome": adrOutcome,
        });
      }
      if (isValid) {
        drugReactionData = {
          current_step: currentStep,
          outcome_type: outcomeType,
          description: selectedDescription.join(", "),
          anaphylaxis_outcome: adrOutcome.join(", "),
          adverse_event_to_be_reported_to_FDA: fdaReported,
        };
        updateDrugAdverseReaction(drugReactionData);
      }
    }

    if (currentStep === 7) {
      isValid = validateStep({
        "physician notified first name": physicianNotifiedFirstName,
        "physician notified last name": physicianNotifiedLastName,

        "physcian date ": physcianDate,
        "physcian time": physcianTime,

        "notified by": notifiedByFirstName && notifiedByLastName,
      });

      if (isValid) {
        drugReactionData = {
          current_step: currentStep,
          incident_type_outcome: {
            outcome_type: outcomeType,
            description: JSON.stringify(selectedDescription),

            name_of_physician_notified: {
              first_name: physicianNotifiedFirstName,
              last_name: physicianNotifiedLastName,
              profile_type: "Physician",
            },
            date_physician_was_notified: physcianDate,
            time_physician_was_notified: physcianTime,
            name_of_family_notified: {
              first_name: familyNotifiedFirstName,
              last_name: familyNotifiedLastName,
              profile_type: "Family",
            },
            date_family_was_notified: familyDate,
            time_family_was_notified: familyTime,
            notified_by: {
              first_name: notifiedByFirstName,
              last_name: notifiedByLastName,
              profile_type: "Nurse",
            },
          },
        };

        updateDrugAdverseReaction(drugReactionData);
      }
    }
    if (currentStep === 8) {
      isValid = validateStep({
        "brief summary": briefSummary,
        "immediate actions taken": immediateActionsTaken,
      });

      if (isValid) {
        drugReactionData = {
          current_step: currentStep,
          brief_summary_incident: briefSummary,
          immediate_actions_taken: immediateActionsTaken,
          status: "Open",
        };

        updateDrugAdverseReaction(drugReactionData);
      }
    }
  };
  const handlePreviousStep = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
  };

  return (
    <div className="forms-container">
      <div className="forms-header">
        <X className="close-popup" onClick={togglePopup} />
        <h2>Anaphylaxis/Adverse Drug Reaction Report</h2>
        {currentStep < 5 ? (
          <div className="form-steps">
            <div className={currentStep === 1 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 1/8</p>
                <p className="step-details">Incident Info</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 2 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 2/8</p>
                <p className="step-details">Event Details</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 3 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 3/8</p>
                <p className="step-details">Medication and dose</p>
              </div>
            </div>
            <div className="divider"></div>
            <div className={currentStep === 4 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 4/8</p>
                <p className="step-details">Incident type</p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}

        {currentStep >= 5 ? (
          <div className="form-steps">
            <div className={currentStep === 5 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 5/8</p>
                <p className="step-details">Incident type</p>
              </div>
            </div>
            <div className="divider"></div>

            <div className={currentStep === 6 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 6/8</p>
                <p className="step-details">Incident type</p>
              </div>
            </div>
            <div className="divider"></div>

            <div className={currentStep === 7 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 7/8</p>
                <p className="step-details">Incident type</p>
              </div>
            </div>
            <div className="divider"></div>

            <div className={currentStep === 8 ? "step current-step" : "step"}>
              <div className="icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="name">
                <p className="step-name">Step 8/8</p>
                <p className="step-details">Summary</p>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        <FacilityCard />
        <DraftPopup
          incidentString="adverse_drug_reaction"
          incidentType="adverse_drug_reaction"
        />
      </div>

      <form className="newIncidentForm">
        {currentStep === 1 ? (
          <div className="step incident-info">
            <h4>Select type</h4>
            <div className="types ">
              <div className="type">
                <input
                  onChange={(e) => handleVictimType("Inpatient")}
                  type="radio"
                  name="victimType"
                  checked={victimType === "Inpatient"}
                  id="Inpatient"
                  value={"In Patient"}
                />
                <label htmlFor="Inpatient">Inpatient</label>
              </div>

              <div className="type">
                <input
                  onChange={(e) => handleVictimType("Outpatient")}
                  type="radio"
                  name="victimType"
                  id="Outpatient"
                  checked={victimType === "Outpatient"}
                  value={"Outpatient"}
                />
                <label htmlFor="Outpatient">Outpatient</label>
              </div>

              <div className="type">
                <input
                  onChange={(e) => handleVictimType("ER")}
                  type="radio"
                  name="victimType"
                  id="ER"
                  checked={victimType === "ER"}
                  value={"ER"}
                />
                <label htmlFor="ER">ER</label>
              </div>

              <div className="type">
                <input
                  onChange={(e) => handleVictimType("Visitor")}
                  type="radio"
                  name="victimType"
                  id="Visitor"
                  checked={victimType === "Visitor"}
                  value={"Visitor"}
                />
                <label htmlFor="Visitor">Visitor</label>
              </div>
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

            <div className="half">
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

            <div className="mr field">
              <label htmlFor="incidentMr">Medical Record Number (if any)</label>
              <input
                onChange={(e) => setIncidentMr(e.target.value)}
                value={incidentMr}
                type="text"
                name="incidentMr"
                id="incidentMr"
                placeholder="Enter MR"
              />
            </div>

            <div className="half spacer">
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
          </div>
        ) : currentStep === 2 ? (
          <div className="step location-status">
            <div className="field name">
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

            <div className="half">
              <div className="field">
                <label htmlFor="dateOfReport">Date</label>
                <CustomDatePicker
                  selectedDate={dateOfReport}
                  setSelectedDate={setDateOfReport}
                />
              </div>
              <div className="field">
                <label htmlFor="timeOfReport">Time</label>
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
          <div className="step">
            <div className="half">
              <div className="field">
                <label htmlFor="suspectedMedication">
                  Suspected medication
                </label>
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
            </div>

            <div className="half spacer">
              <div className="field name">
                <label htmlFor="incidentLocation">Route</label>
                <CustomSelectInput
                  options={drugRoutes.map((route) => route.label)}
                  selected={route}
                  setSelected={setRoute}
                  placeholder={"route"}
                />
              </div>

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

              {route &&
                (route === "others" ||
                  route === "IV Push" ||
                  route === "IV Drip") && (
                  <div className="field">
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
            </div>

            <div className="half">
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
          </div>
        ) : currentStep === 4 ? (
          <div className="step">
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
              <div className="check-boxes">
                <div className="check-box">
                  <input
                    type="radio"
                    name="informationIn"
                    id="nurseNote"
                    onChange={(e) => handleNoteChange(e.target.value)}
                    checked={selectedNote === "Nurse note"}
                    value="Nurse note"
                  />
                  <label htmlFor="nurseNote">Nurse note</label>
                </div>
                <div className="check-box">
                  <input
                    type="radio"
                    name="informationIn"
                    id="progressNote"
                    onChange={(e) => handleNoteChange(e.target.value)}
                    checked={selectedNote === "Progress note"}
                    value="Progress note"
                  />
                  <label htmlFor="progressNote">Progress note</label>
                </div>
                <div className="check-box">
                  <input
                    type="radio"
                    name="informationIn"
                    id="otherLocationIn"
                    onChange={(e) => handleNoteChange(e.target.value)}
                    checked={selectedNote === "Other note"}
                    value="Other note"
                  />
                  <label htmlFor="otherLocationIn">Other</label>
                </div>
              </div>
            </div>

            {otherNote && (
              <textarea
                placeholder="Enter note"
                rows={3}
                value={otherNoteDescription}
                onChange={(e) => setOtherNoteDescription(e.target.value)}
              />
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

              <div className="half">
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
              </div>
              <div className="field">
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
        ) : currentStep === 5 ? (
          <div className="step">
            <h4>General Classification of Reaction</h4>
            <p>Check all that apply</p>
            <div className="grid-container">
              {incidentTypesData.incident_agreement.map((agreement, index) => (
                <div key={index} className={`type grid-item`}>
                  <div
                    onClick={() => handleSelection(agreement.name)}
                    className="field checkbox"
                  >
                    {selectedAgreements.includes(agreement.name) ? (
                      <CheckSquare size={20} />
                    ) : (
                      <SquareIcon size={20} />
                    )}
                    <p>{agreement.name}</p>
                  </div>
                </div>
              ))}
            </div>
            {selectedAgreements.includes("other (describe)") ? (
              <>
                <RichTexField
                  value={agreementDescription}
                  onEditorChange={setAgreementDescription}
                />
              </>
            ) : null}
          </div>
        ) : currentStep === 6 ? (
          <div className="other-info">
            <h2>Outcome</h2>
            <div className="check-boxes-container">
              <div className="check-box">
                <input
                  type="radio"
                  name="mildAdmission"
                  id="mildAdmission"
                  checked={outcomeType === "mild"}
                  onChange={() => handleOutcomeType("mild")}
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
                        />
                        <label htmlFor={el.name}>{el.name}</label>
                      </div>
                    ))
                  : null}
              </div>

              <div className="check-boxes-container">
                <h3>Anaphylaxis /ADR Outcome</h3>
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
                        />
                        <label htmlFor={el.name}>{el.name}</label>
                      </div>
                    ))}
                </div>
              </div>

              <div className="check-box separator">
                <input
                  type="checkbox"
                  name="reportedToFDA"
                  id="reportedToFDA"
                  onChange={() => setFdaReported(!fdaReported)}
                  value={fdaReported}
                />
                <label htmlFor="reportedToFDA">
                  Adverse event to be reported to fda
                </label>
              </div>
            </div>
          </div>
        ) : currentStep === 7 ? (
          <div className="other-info">
            <h1>Notification</h1>

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

            <div className="half">
              <div className="field">
                <label htmlFor="notifiedByFirstName">
                  Notified by First Name{" "}
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
                  Notified by Last Name{" "}
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
        ) : currentStep === 8 ? (
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
                Immediate actions taken,
              </label>
              <RichTexField
                value={immediateActionsTaken}
                onEditorChange={setImmediateActionsTaken}
              />
            </div>
          </div>
        ) : (
          <FormCompleteMessage
            title={"Anaphylaxis/Adverse drug reaction Form"}
            message={"Excellent Job on the Form! Your Input is Highly Regarded"}
          />
        )}
      </form>

      <div className="buttons">
        {currentStep > 1 && currentStep < 8 ? (
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

        {currentStep === 8 ? (
          <button
            className="primary-button"
            id="save-button"
            onClick={handleNextStep}
          >
            <span>{isLoading ? "Processing..." : "Save Incident"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : currentStep < 8 ? (
          <button
            onClick={handleNextStep}
            id="continue-button"
            className="primary-button"
          >
            <span>{isLoading ? "Processing..." : "Save & Continue"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default DrugReactionForm;
