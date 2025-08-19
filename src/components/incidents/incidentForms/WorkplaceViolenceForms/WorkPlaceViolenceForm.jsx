"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
import api, { API_URL, checkCurrentAccount, cleanedData } from "@/utils/api";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomDatePicker from "@/components/CustomDatePicker";
import RichTexField from "@/components/forms/RichTextField";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";
import {
  CirclePlus,
  X,
  Minus,
  CircleCheck,
  MoveRight,
  MoveLeft,
} from "lucide-react";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";
import { injuresTypes } from "@/constants/constants";
import CustomTimeInput from "@/components/CustomTimeInput";
import { FacilityCard } from "@/components/DashboardContainer";
import ErrorMessage from "@/components/messages/ErrorMessage";
import DraftPopup from "@/components/DraftPopup";
import { useAuthentication } from "@/context/authContext";
import CloseIcon from "@/components/CloseIcon";
import MessageDisplay from "@/components/MessageDisplay";
import MessageComponent from "@/components/MessageComponet";


const WorkplaceViolenceIncidentForm = ({ togglePopup }) => {

  const { user } = useAuthentication();
  const [currentFacility, setCurrentFacility] = useState(user.facility);
  const [facilityId, setFacilityId] = useState(
    localStorage.getItem("facilityId")
  );
  const [departmentId, setDepartmentId] = useState(
    localStorage.getItem("departmentId")
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [victimAlone, setVictimAlone] = useState(false);
  const [errorFetching, setErrorFetching] = useState([]);
  // forms
  const [selfInjury, setSelfInjury] = useState(false);
  const [otherType, setOtherType] = useState(false);
  const [otherExplain, setOtherExplain] = useState(false);
  const [otherAssailant, setOtherAssailant] = useState(false);
  const [showWitnesses, setShowWitnesses] = useState(false);
  const [isOtherTerminationOfContract, setIsOtherTerminationOfContract] =
    useState("");
  const [departmentManagerNotified, setDepartmentManagerNotified] =
    useState("");
  const [date, setDate] = useState(null);
  const [notificationDate, setNotificationDate] = useState(null);
  const [detail, setDetail] = useState("");
  const [time, setTime] = useState("");
  const [notificationTime, setNotificationTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [title, setTitle] = useState("");
  const [typeOfContact, setTypeOfContact] = useState();
  const [location, setLocation] = useState("");
  const [threats, setThreats] = useState("");
  const [violence, setViolence] = useState(false);
  const [address, setAddress] = useState("");
  const [termination, setTermination] = useState("");
  const [action, setAction] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [explainselfinjury, setExplainSelfInjury] = useState("");
  const [otherinjury, setOtherInjury] = useState("");
  const [background, setBackground] = useState("");
  const [assailant, setAssailant] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedInjuries, setSelectedInjuries] = useState([]);
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedBackground, setSelectedBackground] = useState([]);
  const [weapons, setWeapons] = useState(false);
  const [reportedByFirstName, setReportedByFirstName] = useState("");
  const [reportedByLastName, setReportedByLastName] = useState("");
  const [reportedTitle, setreportedTitle] = useState("");
  const [dateReported, setdateReported] = useState("");
  const [timeReported, setTimeReported] = useState("");
  const [previousContact, setPreviousContact] = useState("yes");
  const [securityalert, setSecurityAlert] = useState("");

  const [weaponField, setWeaponField] = useState("");
  const [selectedIncidents, setSelectedIncidents] = useState([]);
  const [otherExplanation, setOtherExplanation] = useState("");
  const [terminationIncidents, setTerminationIncidents] = useState([]);
  const [currentInjury, setCurrentInjury] = useState({
    user_data: {
      first_name: "",
      last_name: "",
    },
    injury_description: "",
  });
  const [injuryCheck, setInjuryCheck] = useState("");
  const [injuries, setInjuries] = useState([]);
  const [success, setSuccess] = useState(false);
  const [newInjury, setNewInjury] = useState({
    user_data: {
      first_name: "",
      last_name: "",
    },
    injury_description: "",
  });
  const [currentWitness, setCurrentWitness] = useState({
    user_data: {
      first_name: "",
      last_name: "",
    },

    profile_data: {
      phone_number: "",
    },

    address: "",
  });
  const [currentParty, setCurrentParty] = useState({
    user_data: {
      first_name: "",
      last_name: "",
      email: "",
    },

    profile_data: {
      phone_number: "",
    },
    title: "",
    assailant_relationship_to_patient: "",
    assailant_background: "",
  });
  const currentStepRef = useRef(currentStep);

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl or Alt key is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepRef.current < 10) {
          document.getElementById("continue-button").click();
        } else if (currentStepRef.current === 10) {
          document.getElementById("save-button").click();
        } else {
          return;
        }
      }

      if (event.ctrlKey || event.altKey) {
        switch (event.key) {
          case "s": // Ctrl + S
            event.preventDefault(); // Prevent default browser action
            if (currentStepRef.current < 10) {
              document.getElementById("continue-button").click();
            } else if (currentStepRef.current === 10) {
              document.getElementById("save-button").click();
            } else {
              return;
            }
            break;
          case "b":
            event.preventDefault();
            if (currentStepRef.current > 1 && currentStepRef.current <= 10) {
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
  const handleInjuryCheckChange = (value) => {
    setInjuryCheck(value);
  };

  const handleThreatsChange = (value) => {
    if (value === "Yes") {
      setThreats("Yes");
    } else if (value === "No") {
      setThreats("No");
    } else if (value === "Unknown") {
      setThreats("Unknown");
    }
  };

  // const handleInputChange = (index, event) => {
  //   const { name, value } = event.target;
  //   const list = [...injuries];
  //   list[index][name] = value;
  //   setNewInjury({
  //     ...newInjury,
  //     [name]: value,
  //   });
  //   setInjuries(list);
  // };

  const handleAddInjury = () => {
    if (
      currentInjury.user_data.first_name &&
      currentInjury.user_data.last_name &&
      currentInjury.injury_description
    ) {
      setInjuries([...injuries, currentInjury]);
      setCurrentInjury({
        user_data: {
          first_name: "",
          last_name: "",
        },
        injury_description: "",
      });
    } else {
      toast.error(
        "Please fill in both person injured and injury details"
      );
    }
  };

  const handleRemoveInjury = (index) => {
    setInjuries(injuries.filter((_, i) => i !== index));
  };

  const [parties, setParties] = useState({
    Assailant: [],
    Victim: [],
    Witness: [],
  });

  const [witnesses, setWitnesses] = useState([]);

  const handleAddWitness = () => {
    if (
      currentWitness.user_data.first_name.trim() &&
      currentWitness.user_data.last_name.trim() !== ""
    ) {
      setWitnesses([...witnesses, currentWitness]);
      setCurrentWitness({
        user_data: { first_name: "", last_name: "" },
        profile_data: { phone_number: "" },
        address: "",
      });
    }
  };

  const handleRemoveWitness = (index) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const [currentType, setCurrentType] = useState("Assailant");

  const addPerson = () => {
    if (
      currentParty.user_data.first_name.trim() !== "" &&
      currentParty.user_data.last_name.trim() !== "" &&
      currentParty.title.trim() !== "" &&
      currentParty.profile_data.phone_number.trim() !== "" &&
      currentParty.user_data.email.trim() !== "" &&
      selectedBackground.length > 0 &&
      selectedRelationship.length > 0
    ) {
      setParties((prevParties) => ({
        ...prevParties,
        [currentType]: [...prevParties[currentType], { ...currentParty }],
      }));
      setCurrentParty({
        user_data: {
          first_name: "",
          last_name: "",
          email: "",
        },

        profile_data: {
          phone_number: "",
        },
        title: "",
        assailant_relationship_to_patient: "",
        assailant_background: "",
      });
      setSelectedBackground([]);
      setSelectedRelationship([]);
    } else {
      toast.error(
        "Please fill all fields before adding a person."
      );
    }
  };

  const handleChange = (type, index, field, value) => {
    setParties((prev) => ({
      ...prev,
      [type]: prev[type].map((party, i) =>
        i === index ? { ...party, [field]: value } : party
      ),
    }));
  };

  const setPartiesType = (type) => {
    setCurrentType(type);
  };

  const removePerson = (type, index, e) => {
    e.preventDefault();
    setParties((prevParties) => ({
      ...prevParties,
      [type]: prevParties[type].filter((_, i) => i !== index),
    }));
  };

  const validateInputFields = () => {
    const isAssailantFieldsFilled = parties["Assailant"].length > 0;
    const isVictimFieldsFilled = parties["Victim"].length > 0;
    const isBackgroundFieldsFilled = selectedBackground.length > 0;
    const isRelationshipFieldsFilled = selectedRelationship.length > 0;

    return {
      isAssailantFieldsFilled,
      isVictimFieldsFilled,
      isBackgroundFieldsFilled,
      isRelationshipFieldsFilled,
    };
  };
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedIncidents((prevSelected) => [...prevSelected, value]);
    } else {
      setSelectedIncidents((prevSelected) =>
        prevSelected.filter((item) => item !== value)
      );
    }
  };

  const handleTerminationChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setTerminationIncidents((prevSelected) => [...prevSelected, value]);
    } else {
      setTerminationIncidents((prevSelected) =>
        prevSelected.filter((item) => item !== value)
      );
    }
  };

  const handleWeaponChange = () => {
    setWeapons((prevWeapons) => !prevWeapons);
    if (weapons) {
      setWeaponField("");
    }
  };
  const handleTerminationOfContract = () => {
    setIsOtherTerminationOfContract(!isOtherTerminationOfContract);
  };
  const handleShowWitnesses = () => {
    setShowWitnesses(!showWitnesses);
  };

  const handleSelfInjury = () => {
    setSelfInjury(!selfInjury);
  };

  const handleOtherExplain = () => [setOtherExplain(!otherExplain)];

  const handleOtherAssailant = () => [setOtherAssailant(!otherAssailant)];

  const handleTypeSelection = (injury) => {
    // Check if the injury is already in the array
    if (!selectedInjuries.includes(injury)) {
      // Add the injury to the array
      setSelectedInjuries((prevInjuries) => [...prevInjuries, injury]);
    } else {
      // If the injury is already in the array, remove it
      setSelectedInjuries((prevInjuries) =>
        prevInjuries.filter((item) => item !== injury)
      );
    }
  };

  const showOtherInjuryType = () => {
    setOtherType(!otherType);
  };

  const handleOtherTypeOfInjury = () => {
    if (!selectedInjuries.includes(otherExplanation)) {
      // Add the injury to the array
      setSelectedInjuries((prevInjuries) => [
        ...prevInjuries,
        otherExplanation,
      ]);
      injuresTypes.push(otherExplanation);
      setOtherExplanation("");
    } else {
      // If the injury is already in the array, remove it
      setSelectedInjuries((prevInjuries) =>
        prevInjuries.filter((item) => item !== otherExplanation)
      );
      setOtherExplanation("");
    }
  };

  const handleSelection = (type) => {
    setSelectedType(type === selectedType ? null : type);
  };
  const validateInjuries = (injuries) => {
    if (injuryCheck !== "Yes") return true;
    return (
      injuries.length > 0 &&
      injuries.every(
        (injury) =>
          injury.user_data.first_name &&
          injury.user_data.last_name &&
          injury.injury_description
      )
    );
  };

  // const handleRelationshipVictim = (relationship) => {
  //   setSelectedRelationship(relationship);
  //   if (relationship === "Other (explain)") {
  //     setOtherAssailant(true);
  //   } else {
  //     setOtherAssailant(false);
  //   }
  // };

  const handleRelationshipVictim = (relationship) => {
    // Update the currentParty state with the selected relationship
    setCurrentParty((prevParty) => ({
      ...prevParty,
      assailant_relationship_to_patient:
        relationship === "Other (explain)" ? assailant : relationship,
    }));

    // Set selected relationship for rendering
    setSelectedRelationship(relationship); // Only one can be selected
    setOtherAssailant(relationship === "Other (explain)");
  };
  const handleBackground = (type) => {
    setSelectedBackground((prevSelected) => {
      const index = prevSelected.indexOf(type);
      const newSelected =
        index === -1
          ? [...prevSelected, type]
          : prevSelected.filter((item) => item !== type);

      // Update currentParty state with the selected backgrounds as a JSON string
      setCurrentParty((prevParty) => ({
        ...prevParty,
        assailant_background: JSON.stringify(newSelected), // Stringify the array
      }));

      return newSelected;
    });

    // Manage the state for the "Other (explain)" input
    if (type === "Other (explain)") {
      setOtherExplain(true);
    } else if (otherExplain) {
      setOtherExplain(false);
    }
  };
  const handleCheckboxAndSelfInjury = (event) => {
    const { value, checked } = event.target;
    handleCheckboxChange(event);
    if (value === "selfInjury" || value === "otherTypes") {
      handleSelfInjury();
    }
    if (!checked && (value === "selfInjury" || value === "otherTypes")) {
      setSelfInjury(false);
      setExplainSelfInjury("");
    }
  };
  const handleViolenceChange = (value) => {
    setViolence(value);
  };

  const handlePreviousContact = (value) => {
    setPreviousContact(value);
  };
  const handleVictimChange = (e) => {
    setVictimAlone(e.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleSaveChange = async () => {
    const workplace_violence_id = localStorage.getItem("workplaceViolenceId");
    if (currentStep === 10) {
      const isValid = validateStep({
        "Reported by first name": reportedByFirstName,
        "Reported by last name": reportedByLastName,
        Title: reportedTitle,
        "Date reported": dateReported,
        "Time reported": timeReported,
      });

      if (isValid) {
        const data = {
          current_step: currentStep,
          facility_id: user.facility.id,
          report_facility_id: currentFacility?.id,
          reported_by: {
            first_name: reportedByFirstName,
            last_name: reportedByLastName,
            profile_type: "Staff",
          },
          reported_by_title: reportedTitle,
          date_reported: dateReported,
          time_reported: timeReported,
          status: "Open",
        };
        try {
          setIsLoading(true);
          const response = await api.put(
            `${API_URL}/incidents/workplace-violence/${workplace_violence_id}/`,
            cleanedData(data)
          );

          if (response.status === 200) {
            setCurrentStep(currentStep + 1);
            toast.success("Data posted successfully");
            setIsLoading(false);
            setSuccess(true);
          }
        } catch (error) {
          toast.error("Error posting data please try again");
          setIsLoading(false);
          console.error(error);
        }
      } else {
        toast.error("Please fill in all required fields.");
      }
    }
  };

  const appendError = (error) => {
    setErrorFetching((prevList) => [...prevList, error]);
  };

  const removeError = (error) => {
    setErrorFetching((prevList) => prevList.filter((err) => err !== error));
  };

  const handleNextStep = () => {
    let isValid = true;

    let incidentPostData = {};
    const handleNewWorkPlaceViolence = async (incidentData) => {
      try {
        setIsLoading(true);
        // return
        const payload = {
          department: checkCurrentAccount(),
          ...incidentData,
        };

        const response = await api.post(
          `${API_URL}/incidents/workplace-violence/`,
          cleanedData(payload)
        );
        if (response.status === 201) {
          localStorage.setItem("workplaceViolenceId", response.data.id);
          removeError(errorFetching);

          setCurrentStep(currentStep + 1);
          setIsLoading(false);

          postDocumentHistory(
            response.data.id,
            "added a new incident",
            "create"
          );

          toast.success("Data posted successfully");
        }
      } catch (error) {
        setIsLoading(false);

        if (error.message) {
          appendError(error.message);
          toast.error(
            error.message ||
            "Error while creating new incident, please try again"
          );
          return;
        } else {
          toast.error("Something went wrong");
          appendError("An error occurred while posting incident data.");
          return;
        }
      }
    };

    const updateIncident = async (incidentPostData, incidentId) => {
      try {
        setIsLoading(true);
        const response = await api.put(
          `${API_URL}/incidents/workplace-violence/${incidentId}/`,
          cleanedData(incidentPostData)
        );

        if (response.status === 200) {
          setCurrentStep(currentStep + 1);
          toast.success("Data posted successfully");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        if (error.response?.data) {
          appendError(error.response.data.error);
          toast.error("Error posting data please try again");

          return;
        } else {
          toast.error("Something went wrong");
          appendError("An error occurred while posting incident data.");
          return;
        }
      }
    };
    if (currentStep === 1) {
      isValid = validateStep({
        "Check at least one type of incident": selectedIncidents.length > 0,
        "Check at least one physical injury": selectedInjuries,
      });

      if (selfInjury && !explainselfinjury) {
        toast.error("Please Explain");
        isValid = false;
      }

      if (selectedInjuries.type === "Other" && !selectedInjuries.explanation) {
        toast.error("Explain other types of injury");
        isValid = false;
      }

      if (isValid) {
        let dataToStringify;
        if (
          selectedIncidents.some((el) => el === "selfInjury") ||
          selectedIncidents.some((el) => el === "otherTypes")
        ) {
          dataToStringify = {
            type: "selfInjuryOrOther",
            explanation: explainselfinjury,
          };
        } else {
          dataToStringify = {
            type: "selectedIncidents",
            incidents: selectedIncidents,
          };
        }

        const jsonData = JSON.stringify(dataToStringify);

        const incidentData = {
          report_facility: checkCurrentAccount(),
          type_of_incident: jsonData,
          physical_injury_description: selectedInjuries.join(", "),
          status: "Draft",
          current_step: currentStep,
        };

        handleNewWorkPlaceViolence(incidentData);
      } else {
        toast.error("Please fill in all required fields.");
      }
    } else if (currentStep === 2) {
      isValid = validateStep({
        "Select Incident type": selectedType,
      });

      if (isValid) {
        incidentPostData = {
          incident_type: selectedType,
          current_step: currentStep,
        };
        updateIncident(
          incidentPostData,
          localStorage.getItem("workplaceViolenceId")
        );
      } else {
        toast.error("Please fill in all required fields.");
      }
    } else if (currentStep === 3) {
      isValid = validateStep({
        "Date of Incident": date,
        "Time of incident": time,
        Details: detail,
      });

      if (isValid) {
        incidentPostData = {
          date_of_incident: date,
          time_of_incident: time,
          description: JSON.stringify(detail),
          current_step: currentStep,
        };
        updateIncident(
          incidentPostData,
          localStorage.getItem("workplaceViolenceId")
        );
      } else {
        toast.error("Please fill in all required fields.");
      }
    } else if (currentStep === 4) {
      const {
        isAssailantFieldsFilled,
        isVictimFieldsFilled,
        isBackgroundFieldsFilled,
        isRelationshipFieldsFilled,
      } = validateInputFields();

      if (parties["Assailant"].length > 0 && parties["Victim"].length > 0) {
        isValid = validateStep({
          parties,
          previousContact,
        });

        let hasError = false;

        if (selectedRelationship === "Other (explain)" && !assailant.trim()) {
          toast.error("Explain Relationship to assailant");
          hasError = true;
        }

        if (
          selectedBackground.includes("Other (explain)") &&
          !background.trim()
        ) {
          toast.error("Explain Background");
          hasError = true;
        }

        if (isValid && !hasError) {
          incidentPostData = {
            initiated_by: [
              ...parties["Assailant"].map((party) => ({
                party_type: "Assailant",
                user_data: {
                  first_name: party.user_data.first_name,
                  last_name: party.user_data.last_name,
                  email: party.user_data.email,
                },
                profile_data: {
                  phone_number: party.profile_data.phone_number,
                },
                title: party.title,

                assailant_relationship_to_patient:
                  party.assailant_relationship_to_patient,
                assailant_background: party.assailant_background,
              })),
              ...parties["Victim"].map((party) => ({
                party_type: "Victim",
                user_data: {
                  first_name: party.user_data.first_name,
                  last_name: party.user_data.last_name,
                  email: party.user_data.email,
                },
                profile_data: {
                  phone_number: party.profile_data.phone_number,
                },
                title: party.title,

                assailant_relationship_to_patient:
                  party.assailant_relationship_to_patient,
                assailant_background: party.assailant_background,
              })),
            ],
            victim_has_contact_with_assailant: previousContact,
            current_step: currentStep,
          };

          updateIncident(
            incidentPostData,
            localStorage.getItem("workplaceViolenceId")
          );
        }
      } else {
        if (!isAssailantFieldsFilled) {
          toast.error("Please fill out all fields for Assailant.");
        }
        if (!isVictimFieldsFilled) {
          toast.error("Please fill out all fields for Victim.");
        }

        return;
      }
    } else if (currentStep === 5) {
      isValid = validateStep({
        "Type of contact": typeOfContact,
        Location: location,
        "Check if reported!": violence,
      });

      if (isValid) {
        incidentPostData = {
          type_of_contact: typeOfContact,
          victim_was_alone: victimAlone,
          location: location,
          there_was_threats_before: threats,
          staff_member_reported: violence,
          weapons_were_involved: weapons,
          weapon_used: weaponField,
          current_step: currentStep,
        };
        updateIncident(
          incidentPostData,
          localStorage.getItem("workplaceViolenceId")
        );
      } else {
        toast.error("Please fill in all required fields.");
      }
    } else if (currentStep === 6) {
      if (injuryCheck === null) {
        toast.error("Please select whether there were injuries");
        return;
      }

      if (injuryCheck && !validateInjuries(injuries)) {
        toast.error(
          "Please add at least one injury with all fields filled"
        );
        return;
      }

      let injuryData;
      if (injuryCheck === "Yes") {
        injuryData = {
          there_were_injuries: injuryCheck,
          persons_injured: injuries.map((injury) => ({
            profile_type: "Victim",
            first_name: injury.user_data.first_name,
            last_name: injury.user_data.last_name,

            injury_description: injury.injury_description,
          })),
          current_step: currentStep,
        };
      } else {
        injuryData = {
          there_were_injuries: injuryCheck,
          current_step: currentStep,
        };
      }

      updateIncident(injuryData, localStorage.getItem("workplaceViolenceId"));
    } else if (currentStep === 7) {
      let isValid = true;
      let hasError = false;

      witnesses.forEach((witness, index) => {
        const witnessValid = validateStep({
          [`Witness First Name`]: witness.user_data.first_name,
          [`Witness Last Name`]: witness.user_data.last_name,
          [`Witness Phone Number`]: witness.profile_data.phone_number,
          [`Witness Address`]: witness.address,
        });
      });

      if (!securityalert) {
        toast.error("Please select an option for security alert.");
        return;
      }

      incidentPostData = {
        notification: securityalert,
        incident_witnesses: witnesses.map((witness) => ({
          first_name: witness.user_data.first_name,
          last_name: witness.user_data.last_name,
          profile_type: "Witness",
          phone_number: witness.profile_data.phone_number,
          address: witness.address,
        })),
        current_step: currentStep,
      };
      updateIncident(
        incidentPostData,
        localStorage.getItem("workplaceViolenceId")
      );
    } else if (currentStep === 8) {
      isValid = validateStep({
        "Check atleast one": termination,
      });
      let stringifiedTermination;

      stringifiedTermination = { description: terminationIncidents };
      const jsonTermination = JSON.stringify(stringifiedTermination);
      if (isValid) {
        incidentPostData = {
          termination_of_incident: jsonTermination,
          current_step: currentStep,
        };
        updateIncident(
          incidentPostData,
          localStorage.getItem("workplaceViolenceId")
        );
      } else {
        toast.error("Please fill in all required fields.");
      }
    } else if (currentStep === 9) {
      if (departmentManagerNotified === null) {
        toast.error(
          "Please select whether the department manager was notified."
        );
        return;
      }
      isValid = validateStep(
        departmentManagerNotified
          ? {
            "First name": firstName,
            "Last name": lastName,
            "Title/Department": title,
            Date: notificationDate,
            Time: notificationTime,
            "Enter action taken": action,
            "Enter suggestions": suggestions,
          }
          : {
            "Enter suggestions": suggestions,
          }
      );
      if (isValid) {
        if (departmentManagerNotified) {
          incidentPostData = {
            immediate_supervisor: departmentManagerNotified,
            name_of_supervisor: {
              first_name: firstName,
              last_name: lastName,
              profile_type: "Supervisor",
            },
            title_of_supervisor: title,
            date_notified: notificationDate,
            notification_time: notificationTime,
            time_notified: notificationTime,
            action_taken: action,
            prevention_suggestion: suggestions,
            current_step: currentStep,
          };
        } else {
          incidentPostData = {
            immediate_supervisor: departmentManagerNotified,
            prevention_suggestion: suggestions,
            current_step: currentStep,
          };
        }

        updateIncident(
          incidentPostData,
          localStorage.getItem("workplaceViolenceId")
        );
      } else {
        toast.error("Please fill in all required fields.");
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
  };

  return (
    <div className="form-container">
      <div className="forms-header">
        <h2>Workplace Violence Incident</h2>
        <CloseIcon onClick={togglePopup} />
        {errorFetching.length > 0 && (
          <ErrorMessage errorFetching={errorFetching} />
        )}
        {currentStep <= 4 ? (
          <div className="form-steps">
            {[1, 2, 3, 4].map((step) => (
              <React.Fragment key={step}>
                {step > 1 && <div className="divider"></div>}
                <div
                  className={
                    currentStep === step ? "step current-step" : "step"
                  }
                >
                  <div className="icon">
                    <CircleCheck />
                  </div>
                  <div className="name">
                    <p className="step-name">Step {step}/10</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : currentStep <= 8 ? (
          <div className="form-steps">
            {[5, 6, 7, 8].map((step) => (
              <React.Fragment key={step}>
                <div className="divider"></div>
                <div
                  className={
                    currentStep === step ? "step current-step" : "step"
                  }
                >
                  <div className="icon">
                    <CircleCheck />
                  </div>
                  <div className="name">
                    <p className="step-name">Step {step}/10</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : currentStep <= 10 ? (
          <div className="form-steps">
            {[9, 10].map((step) => (
              <React.Fragment key={step}>
                <div className="divider"></div>
                <div
                  className={
                    currentStep === step ? "step current-step" : "step"
                  }
                >
                  <div className="icon">
                    <CircleCheck />
                  </div>
                  <div className="name">
                    <p className="step-name">Step {step}/10</p>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        ) : (
          " "
        )}
        <DraftPopup
          incidentString="workplace_violence"
          incidentType="workplace_violence"
        />
      </div>
      {currentStep === 1 && (
        <select
          className="facility-card"
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

      {success ? (
        <FormCompleteMessage title="Workplace Violence" />
      ) : (
        <>
          <form className="newIncidentForm" onSubmit={handleSubmit}>
            {currentStep === 1 ? (
              <div className="step">
                <h4>
                  Type of incident{" "}
                  <span>
                    <small>(check all that apply)</small>
                  </span>
                </h4>
                <div className="checkings">
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="incidentType"
                      value="Verbal"
                      id="verbal"
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="verbal">
                      Verbal harassment/manipulation/intimidation
                    </label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="incidentType"
                      value="Verbal Threat"
                      id="verbalThreat"
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="verbalThreat">
                      Verbal threat of physical assault
                    </label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="incidentType"
                      value="Physical Assault"
                      id="physicalAssault"
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="physicalAssault">Physical assault</label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="incidentType"
                      value="Self Injury"
                      id="selfInjury"
                      onChange={handleCheckboxAndSelfInjury}
                    />
                    <label htmlFor="selfInjury">Self-injury</label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="incidentType"
                      value="Property Damage"
                      id="propertyDamage"
                      onChange={handleCheckboxChange}
                    />
                    <label htmlFor="propertyDamage">Damage to property</label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="incidentType"
                      value="Other Types"
                      id="otherTypes"
                      onChange={handleCheckboxAndSelfInjury}
                    />
                    <label htmlFor="otherTypes">Other(Describe)</label>
                  </div>
                </div>

                {selfInjury && (
                  <input
                    type="text"
                    name="selfInjuryExplanation"
                    id="selfInjuryExplanation"
                    placeholder="Please explain"
                    value={explainselfinjury}
                    onChange={(e) => setExplainSelfInjury(e.target.value)}
                  />
                )}

                <h4>Describe the physical injury</h4>
                <div className="types">
                  {injuresTypes.map((injury) => (
                    <div
                      key={injury}
                      className={`type ${selectedInjuries.includes(injury) ? "selected" : ""
                        }`}
                      onClick={() => handleTypeSelection(injury)}
                    >
                      <p>{injury}</p>
                    </div>
                  ))}
                  <p onClick={showOtherInjuryType} className="type">
                    Other
                  </p>
                </div>

                {otherType && (
                  <>
                    <input
                      type="text"
                      name="otherTypesInput"
                      id="otherTypesInput"
                      placeholder="Please explain"
                      value={otherExplanation}
                      onChange={(e) => setOtherExplanation(e.target.value)}
                    />
                    <button onClick={handleOtherTypeOfInjury} type="button">
                      Add new
                    </button>
                  </>
                )}
              </div>
            ) : currentStep === 2 ? (
              <div className="step">
                <h4>Select Incident type</h4>
                <div className="types">
                  <div
                    className={`type full-width-type ${selectedType === "Type 1" ? "selected" : ""
                      }`}
                    onClick={() => handleSelection("Type 1")}
                  >
                    <h5>Type 1 (Criminal Intent/External)</h5>
                    Violence by strangers/individuals who have no other
                    connection with the workplace.
                  </div>

                  <div
                    className={`type full-width-type ${selectedType === "Type 2" ? "selected" : ""
                      }`}
                    onClick={() => handleSelection("Type 2")}
                  >
                    <h5>Type 2 (Patient/Family/Guest)</h5>
                    Violence against staff by patients, customers, or others
                    with a business relationship.
                  </div>

                  <div
                    className={`type full-width-type ${selectedType === "Type 3" ? "selected" : ""
                      }`}
                    onClick={() => handleSelection("Type 3")}
                  >
                    <h5>Type 3 (Worker on Worker)</h5>
                    Violence against staff members, managers or supervisors by a
                    current or former staff member.
                  </div>

                  <div
                    className={`type full-width-type ${selectedType === "Type 4" ? "selected" : ""
                      }`}
                    onClick={() => handleSelection("Type 4")}
                  >
                    <h5>Type 4 (Domestic/Intimate Parter)</h5>
                    Violence in the workplace by an individual who does not work
                    there but has a personal relationship with the worker /such
                    as an abusive spouse or domestic partner.
                  </div>

                  <div
                    className={`type full-width-type ${selectedType === "Type 5" ? "selected" : ""
                      }`}
                    onClick={() => handleSelection("Type 5")}
                  >
                    <h5>Type 5 (ideological)</h5>
                    Violence in the workplace that is directed at an
                    organization, a group of people, and/or its property for
                    ideological, religious, or political reasons.
                  </div>
                </div>
              </div>
            ) : currentStep === 3 ? (
              <div className="step">
                <div className="half">
                  <div className="field">
                    <label htmlFor="dateOfIncident">Date of incident</label>
                    <CustomDatePicker
                      selectedDate={date}
                      setSelectedDate={setDate}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="dateOfIncident">Time of incident</label>
                    <CustomTimeInput setTime={setTime} defaultTime={time} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="incidentDescription">
                    Detailed description of the observation, threat, incident,
                    or activity
                  </label>
                  <RichTexField value={detail} onEditorChange={setDetail} />
                </div>
              </div>
            ) : currentStep === 4 ? (
              <div className="step">
                <h4>Part 2: Incident Directed at and Initiated/Committed By</h4>

                <div className="tabs-content">
                  <div className="types">
                    {["Assailant", "Victim"].map((type) => (
                      <div
                        key={type}
                        onClick={() => setPartiesType(type)}
                        className={`type ${currentType === type ? "selected" : ""
                          }`}
                      >
                        {type}
                      </div>
                      // comments
                    ))}
                  </div>
                  <br />
                  <span className="warning-message">
                    Add {currentType} details and click "Add {currentType}"
                  </span>
                  <br />
                  <br />
                  <div className="field name">
                    <div
                      className="parties"
                      style={{ flexDirection: "row", flexWrap: "wrap" }}
                    >
                      {parties[currentType]
                        .filter((party) => !party.isInitial)
                        .map((party, index) => (
                          <button key={index} className="new-party">
                            {party.user_data.first_name}{" "}
                            {party.user_data.last_name}
                            <Minus
                              onClick={(e) =>
                                removePerson(currentType, index, e)
                              }
                            />
                          </button>
                        ))}
                    </div>
                    <label htmlFor={`${currentType.toLowerCase()}Name`}>
                      {currentType} Names
                    </label>

                    <div className="half">
                      <input
                        type="text"
                        name="firstName"
                        id={`${currentType.toLowerCase()}Name`}
                        placeholder={`Enter ${currentType.toLowerCase()} first name`}
                        value={currentParty.user_data.first_name}
                        onChange={(e) =>
                          setCurrentParty({
                            ...currentParty,
                            user_data: {
                              ...currentParty.user_data,
                              first_name: e.target.value,
                            },
                          })
                        }
                      />
                      <input
                        type="text"
                        name="lastName"
                        id={`${currentType.toLowerCase()}Name`}
                        placeholder={`Enter ${currentType.toLowerCase()} last name`}
                        value={currentParty.user_data.last_name}
                        onChange={(e) =>
                          setCurrentParty({
                            ...currentParty,
                            user_data: {
                              ...currentParty.user_data,
                              last_name: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="half">
                      <div className="field">
                        <label htmlFor={`${currentType.toLowerCase()}Title`}>
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          id={`${currentType.toLowerCase()}Title`}
                          placeholder="Enter title"
                          value={currentParty.title}
                          onChange={(e) =>
                            setCurrentParty({
                              ...currentParty,
                              title: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor={`${currentType.toLowerCase()}Phone`}>
                          Phone number
                        </label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id={`${currentType.toLowerCase()}Phone`}
                          placeholder="Enter phone number"
                          value={currentParty.profile_data.phone_number}
                          onChange={(e) =>
                            setCurrentParty({
                              ...currentParty,
                              profile_data: {
                                ...currentParty.profile_data,
                                phone_number: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor={`${currentType.toLowerCase()}Email`}>
                        Email
                      </label>
                      <input
                        type="email"
                        name="emailAddress"
                        id={`${currentType.toLowerCase()}Email`}
                        placeholder="Enter email address"
                        value={currentParty.user_data.email}
                        onChange={(e) =>
                          setCurrentParty({
                            ...currentParty,
                            user_data: {
                              ...currentParty.user_data,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="step">
                      <h4>Assailant Relationship to Victim(s):</h4>
                      <div className="types">
                        {[
                          "Staff member/ current employee",
                          "Patient",
                          "Stranger",
                          "Former staff member",
                          "Family to patient",
                          "Spouse/Significant other",
                          "Supervisor/Manager",
                          "Acquaintance",
                          "Contractor/Vendor",
                          "Other (explain)",
                        ].map((relationship) => (
                          <div
                            key={relationship}
                            className={`type ${selectedRelationship.includes(relationship)
                              ? "selected"
                              : ""
                              }`}
                            onClick={() => {
                              handleRelationshipVictim(relationship);
                              if (relationship === "Other (explain)")
                                handleOtherAssailant();
                            }}
                          >
                            <p>
                              {relationship === "Family to patient"
                                ? "Patient’s family"
                                : relationship}
                            </p>
                          </div>
                        ))}

                        {otherAssailant && (
                          <input
                            type="text"
                            name="otherTypesInput"
                            id="otherTypesInput"
                            placeholder="Explain"
                            value={assailant}
                            onChange={(e) => {
                              setAssailant(e.target.value);
                              setCurrentParty((prevParty) => ({
                                ...prevParty,
                                assailant_relationship_to_patient:
                                  e.target.value,
                              }));
                            }}
                          />
                        )}
                      </div>
                      {/* <div className="types">
                        <div
                          className={`type ${
                            selectedRelationship.includes(
                              "Staff member/ current employee"
                            )
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleRelationshipVictim(
                              "Staff member/ current employee"
                            )
                          }
                        >
                          <p>Staff member/ current employee</p>
                        </div>
                        <div
                          className={`type ${
                            selectedRelationship.includes("Patient")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleRelationshipVictim("Patient")}
                        >
                          <p>Patient</p>
                        </div>
                        <div
                          className={`type ${
                            selectedRelationship.includes("Stranger")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => handleRelationshipVictim("Stranger")}
                        >
                          <p>Stranger</p>
                        </div>
                        <div
                          className={`type full-width-type ${
                            selectedRelationship.includes("Former staff member")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleRelationshipVictim("Former staff member")
                          }
                        >
                          <p>Former staff member</p>
                        </div>
                        <div
                          className={`type full-width-type ${
                            selectedRelationship.includes("Family to patient")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleRelationshipVictim("Family to patient")
                          }
                        >
                          <p>Patient’s family</p>
                        </div>
                        <div
                          className={`type full-width-type ${
                            selectedRelationship.includes(
                              "Spouse/Significant other"
                            )
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleRelationshipVictim("Spouse/Significant other")
                          }
                        >
                          <p>Spouse/Significant other</p>
                        </div>
                        <div
                          className={`type full-width-type ${
                            selectedRelationship.includes("Supervisor/Manager")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleRelationshipVictim("Supervisor/Manager")
                          }
                        >
                          <p>Supervisor/Manager</p>
                        </div>
                        <div
                          className={`type full-width-type ${
                            selectedRelationship.includes("Acquaintance")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleRelationshipVictim("Acquaintance")
                          }
                        >
                          <p>Acquaintance</p>
                        </div>
                        <div
                          className={`type full-width-type ${
                            selectedRelationship.includes("Contractor/Vendor")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleRelationshipVictim("Contractor/Vendor")
                          }
                        >
                          <p>Contractor/Vendor</p>
                        </div>
                        <div
                          className={`type full-width-type ${
                            selectedRelationship.includes("Other (explain)")
                              ? "selected"
                              : ""
                          }`}
                          onClick={() => {
                            handleRelationshipVictim("Other (explain)");
                            handleOtherAssailant();
                          }}
                        >
                          <p>Other (explain)</p>
                        </div>
                        {otherAssailant ? (
                          <input
                            type="text"
                            name="otherTypesInput"
                            id="otherTypesInput"
                            placeholder="Explain"
                            value={assailant}
                            onChange={(e) => setAssailant(e.target.value)}
                          />
                        ) : (
                          ""
                        )}
                      </div> */}

                      <h4>
                        Background (
                        <span>
                          <small>if known, check all that apply</small>
                        </span>
                        )
                      </h4>
                      <div className="types">
                        {[
                          "Consequences of patient condition/disability",
                          "Grief",
                          "Occured while processing patient information",
                          "Dissatisfied with care/service",
                          "Suspected substance abuse",
                          "Occured while providing patient care",
                          "Employment related",
                          "Interpersonal conflict",
                          "Prior history of violence",
                          "Other (explain)",
                        ].map((type) => (
                          <div
                            key={type}
                            className={`type ${selectedBackground.includes(type)
                              ? "selected"
                              : ""
                              }`}
                            onClick={() => {
                              handleBackground(type);
                              if (type === "Other (explain)")
                                handleOtherExplain();
                            }}
                          >
                            <p>
                              {type ===
                                "Consequences of patient condition/disability"
                                ? "Consequences of patient condition/disability"
                                : type}
                            </p>
                          </div>
                        ))}
                      </div>

                      {selectedBackground.includes("Other (explain)") && (
                        <input
                          type="text"
                          name="otherTypesInput"
                          id="otherTypesInput"
                          placeholder="Enter Background"
                          value={background}
                          onChange={(e) => {
                            setBackground(e.target.value);
                            setCurrentParty((prevParty) => ({
                              ...prevParty,
                              assailant_background: e.target.value,
                            }));
                          }}
                        />
                      )}
                    </div>
                    <div className="parties">
                      <button
                        type="button"
                        className="new-party"
                        onClick={addPerson}
                      >
                        <CirclePlus />
                        Add {currentType}
                      </button>
                    </div>
                    <h4>
                      Did the victim have previous contact with the assailant?
                    </h4>
                    <div className="check-boxes">
                      <div className="check-box">
                        <input
                          type="radio"
                          name="victim_has_contact_with_assailant"
                          id="yesContact"
                          value="Yes"
                          required
                          checked={previousContact === "Yes"}
                          onChange={(e) =>
                            handlePreviousContact(e.target.value)
                          }
                        />
                        <label htmlFor="yesContact">Yes</label>
                      </div>
                      <div className="check-box">
                        <input
                          type="radio"
                          name="victim_has_contact_with_assailant"
                          id="noContact"
                          value="No"
                          required
                          checked={previousContact === "No"}
                          onChange={(e) =>
                            handlePreviousContact(e.target.value)
                          }
                        />
                        <label htmlFor="noContact">No</label>
                      </div>
                      <div className="check-box">
                        <input
                          type="radio"
                          name="victim_has_contact_with_assailant"
                          id="maybeContact"
                          value="Maybe"
                          required
                          checked={previousContact === "Maybe"}
                          onChange={(e) =>
                            handlePreviousContact(e.target.value)
                          }
                        />
                        <label htmlFor="maybeContact">Maybe</label>
                      </div>
                      <div className="check-box">
                        <input
                          type="radio"
                          name="victim_has_contact_with_assailant"
                          id="unknownContact"
                          value="Unknown"
                          checked={previousContact === "Unknown"}
                          onChange={(e) =>
                            handlePreviousContact(e.target.value)
                          }
                          required
                        />
                        <label htmlFor="unknownContact">Unknown</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentStep === 5 ? (
              <div className="step">
                <div className="field">
                  <label htmlFor="typeIfContact">Type of contact</label>
                  <CustomSelectInput
                    options={[
                      "In person",
                      "Telephone",
                      "Email",
                      "Social Media",
                      "Fax",
                      "Mail",
                      "Recording",
                      "Other",
                    ]}
                    placeholder={"Type of contact"}
                    selected={typeOfContact}
                    setSelected={setTypeOfContact}
                  />
                </div>
                <div className="field">
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="victimWasAlone"
                      id="victimWasAlone"
                      checked={victimAlone}
                      onChange={handleVictimChange}
                    />
                    <label htmlFor="victimWasAlone">
                      Check if the victim was alone at the time of the incident.
                    </label>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="incidentLocation">Location</label>
                  <input
                    type="text"
                    name="incidentLocation"
                    id="incidentLocation"
                    placeholder="Dept.Room Number"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label htmlFor="incidentThreats">
                    Were any threats made before the incident occurred?
                  </label>
                  <div className="check-boxes">
                    <div className="check-box">
                      <input
                        type="radio"
                        name="incidentThreats"
                        id="yesThreats"
                        value="Yes"
                        required
                        checked={threats === "Yes"}
                        onChange={(e) => handleThreatsChange(e.target.value)}
                      />
                      <label htmlFor="yesThreats">Yes</label>
                    </div>
                    <div className="check-box">
                      <input
                        type="radio"
                        name="incidentThreats"
                        id="noThreats"
                        value="No"
                        required
                        checked={threats === "No"}
                        onChange={(e) => handleThreatsChange(e.target.value)}
                      />
                      <label htmlFor="noThreats">No</label>
                    </div>
                    <div className="check-box">
                      <input
                        type="radio"
                        name="incidentThreats"
                        id="unknownThreats"
                        value="Unknown"
                        checked={threats === "Unknown"}
                        onChange={(e) => handleThreatsChange(e.target.value)}
                        required
                      />
                      <label htmlFor="unknownThreats">Unknown</label>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="incidentViolent">
                    Did the staff member ever report they were threatened,
                    harassed, or suspicious that the assailant may become
                    violent?
                  </label>
                  <div className="check-boxes">
                    <div className="check-box">
                      <input
                        type="radio"
                        name="violent"
                        id="yesViolent"
                        value="Yes"
                        checked={violence === "Yes"}
                        onChange={(e) => handleViolenceChange(e.target.value)}
                      />
                      <label htmlFor="yesViolent">Yes</label>
                    </div>
                    <div className="check-box">
                      <input
                        type="radio"
                        name="violent"
                        id="noViolent"
                        value="No"
                        checked={violence === "No"}
                        onChange={(e) => handleViolenceChange(e.target.value)}
                      />
                      <label htmlFor="noViolent">No</label>
                    </div>
                    <div className="check-box">
                      <input
                        type="radio"
                        name="violent"
                        id="unknownViolent"
                        value="Unknown"
                        checked={violence === "Unknown"}
                        onChange={(e) => handleViolenceChange(e.target.value)}
                      />
                      <label htmlFor="unknownViolent">Unknown</label>
                    </div>
                    <div className="check-box">
                      <input
                        type="radio"
                        name="violent"
                        id="unknownNA"
                        value="N/A"
                        checked={violence === "N/A"}
                        onChange={(e) => handleViolenceChange(e.target.value)}
                      />
                      <label htmlFor="unknownNA">N/A</label>
                    </div>
                  </div>
                </div>

                <div className="field">
                  <div className="check-boxes">
                    <div className="check-box">
                      <input
                        type="checkbox"
                        name="weaponsInvolved"
                        id="weaponsInvolved"
                        checked={weapons}
                        onChange={handleWeaponChange}
                      />
                      <label htmlFor="weaponsInvolved">
                        Check if any weapons were involved in this incident.
                      </label>
                    </div>
                  </div>
                  {weapons && (
                    <div className="field">
                      <label htmlFor="nameOfWeaponInvolved">Weapon used</label>
                      <input
                        type="text"
                        name="nameOfWeaponInvolved"
                        id="nameOfWeaponInvolved"
                        placeholder="Enter description"
                        value={weaponField}
                        onChange={(e) => setWeaponField(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : currentStep === 6 ? (
              <div className="step">
                <label htmlFor="forInjuries">Were there injuries?</label>
                <div className="check-boxes">
                  <div className="check-box">
                    <label htmlFor="yesInjury">Yes</label>
                    <input
                      type="radio"
                      name="injury"
                      id="yesInjury"
                      value="Yes"
                      checked={injuryCheck === "Yes"}
                      onChange={(e) => handleInjuryCheckChange(e.target.value)}
                    />
                  </div>
                  <div className="check-box">
                    <label htmlFor="noInjury">No</label>
                    <input
                      type="radio"
                      name="injury"
                      id="noInjury"
                      value="No"
                      checked={injuryCheck === "No"}
                      onChange={(e) => handleInjuryCheckChange(e.target.value)}
                    />
                  </div>
                  <div className="check-box">
                    <label htmlFor="NAInjury">N/A</label>
                    <input
                      type="radio"
                      name="injury"
                      id="NAInjury"
                      value="N/A"
                      checked={injuryCheck === "N/A"}
                      onChange={(e) => handleInjuryCheckChange(e.target.value)}
                    />
                  </div>
                </div>

                {injuryCheck === "Yes" && (
                  <div className="field name">
                    <span className="warning-message">
                      Add the person injured details and click "Add Injury"
                    </span>
                    <div
                      className="parties"
                      style={{ flexDirection: "row", flexWrap: "wrap" }}
                    >
                      {injuries.length > 0
                        ? injuries.map((injury, index) => (
                          <button
                            key={index}
                            className="new-party"
                            onClick={() => handleRemoveInjury(index)}
                          >
                            {injury.user_data.first_name}{" "}
                            {injury.user_data.last_name}
                            <Minus />
                          </button>
                        ))
                        : null}
                    </div>
                    <label htmlFor="personInjured">Who was injured</label>
                    <div className="half">
                      <div className="field">
                        <label htmlFor="personInjuredFirstName">
                          Person injured first name
                        </label>
                        <input
                          type="text"
                          name="personInjuredFirstName"
                          id="personInjuredFirstName"
                          placeholder="Enter first name"
                          value={currentInjury.user_data.first_name}
                          onChange={(e) =>
                            setCurrentInjury({
                              ...currentInjury,
                              user_data: {
                                ...currentInjury.user_data,
                                first_name: e.target.value, // Correctly updates first name
                              },
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="personInjuredLastName">
                          Person injured last name
                        </label>
                        <input
                          type="text"
                          name="personInjuredLastName"
                          id="personInjuredLastName"
                          placeholder="Enter last name"
                          value={currentInjury.user_data.last_name}
                          onChange={(e) =>
                            setCurrentInjury({
                              ...currentInjury,
                              user_data: {
                                ...currentInjury.user_data,
                                last_name: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="field">
                      <label htmlFor="injuryDetails">Injury description</label>
                      <input
                        type="text"
                        name="injuryDetails"
                        id="injuryDetails"
                        placeholder="Enter Description"
                        value={currentInjury.injury_description}
                        onChange={(e) =>
                          setCurrentInjury({
                            ...currentInjury,
                            injury_description: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="parties">
                      <button
                        type="button"
                        className="new-party"
                        onClick={handleAddInjury}
                      >
                        <CirclePlus />
                        Add Injury
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : currentStep === 7 ? (
              <div className="step">
                <h4>Witnesses to the incident:</h4>
                <span className="warning-message">
                  Add witnesses details and click "Add Witness"
                </span>

                <div className="tabs-content">
                  <div className="field name">
                    <div
                      className="parties"
                      style={{ flexDirection: "row", flexWrap: "wrap" }}
                    >
                      {witnesses.length > 0
                        ? witnesses.map((witness, index) => (
                          <button
                            key={index}
                            className="new-party"
                            onClick={() => handleRemoveWitness(witness)}
                          >
                            {witness.user_data.first_name}{" "}
                            {witness.user_data.last_name}
                            <Minus />
                          </button>
                        ))
                        : null}
                    </div>
                    <label htmlFor="witnessName">Witness</label>
                    <div className="half">
                      <div className="field">
                        <label htmlFor="witnessFirstName">First name</label>
                        <input
                          type="text"
                          name="witnessFirstName"
                          id="witnessFirstName"
                          placeholder="Enter witness first name"
                          value={currentWitness.user_data.first_name}
                          onChange={(e) =>
                            setCurrentWitness({
                              ...currentWitness,
                              user_data: {
                                ...currentWitness.user_data,
                                first_name: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="">Last name</label>
                        <input
                          type="text"
                          name="witnessLastName"
                          id="witnessLastName"
                          placeholder="Enter witness last name"
                          value={currentWitness.user_data.last_name}
                          onChange={(e) =>
                            setCurrentWitness({
                              ...currentWitness,
                              user_data: {
                                ...currentWitness.user_data,
                                last_name: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="half">
                      <div className="field">
                        <label htmlFor="witnessPhone">Phone</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          id="witnessPhone"
                          placeholder="Phone number"
                          value={currentWitness.profile_data.phone_number}
                          onChange={(e) =>
                            setCurrentWitness({
                              ...currentWitness,
                              profile_data: {
                                ...currentWitness.profile_data,
                                phone_number: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="witnessAddress">Address</label>
                        <input
                          type="text"
                          name="address"
                          id="witnessAddress"
                          placeholder="Address"
                          value={currentWitness.address}
                          onChange={(e) =>
                            setCurrentWitness({
                              ...currentWitness,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div className="parties">
                      <button
                        type="button"
                        className="new-party"
                        onClick={handleAddWitness}
                      >
                        <CirclePlus />
                        Add Witness
                      </button>
                    </div>
                  </div>
                </div>

                <h4>Notification: </h4>
                <div className="field">
                  <div className="check-boxes">
                    <div className="check-box">
                      <input
                        type="radio"
                        name="securityOption"
                        id="securityAlertCalled"
                        checked={securityalert === "securityAlertCalled"}
                        onChange={() => setSecurityAlert("securityAlertCalled")}
                      />
                      <label htmlFor="securityAlertCalled">
                        Security Alert Code called?
                      </label>
                    </div>
                    <div className="check-box">
                      <input
                        type="radio"
                        name="securityOption"
                        id="lawEnforcementCalled"
                        checked={securityalert === "lawEnforcementCalled"}
                        onChange={() =>
                          setSecurityAlert("lawEnforcementCalled")
                        }
                      />
                      <label htmlFor="lawEnforcementCalled">
                        Law Enforcement called to intervene?
                      </label>
                    </div>
                    <div className="check-box">
                      <input
                        type="radio"
                        name="securityOption"
                        id="administrationCalled"
                        checked={securityalert === "administrationCalled"}
                        onChange={() =>
                          setSecurityAlert("administrationCalled")
                        }
                      />
                      <label htmlFor="administrationCalled">
                        Administrator/AOC called?
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ) : currentStep === 8 ? (
              <div
                className="step inputs-group"
                value={termination}
                onChange={(e) => setTermination(e.target.value)}
              >
                <h4>
                  Termination of incident{" "}
                  <span>
                    <small>(check all that apply)</small>
                  </span>
                </h4>
                <div className="check-boxes">
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="incidentDeescalated"
                      id="incidentDeescalated"
                      value="incidentDeescalated"
                      onChange={handleTerminationChange}
                      checked={terminationIncidents?.includes(
                        "incidentDeescalated"
                      )}
                    />
                    <label htmlFor="incidentDeescalated">
                      Incident de-escalated{" "}
                    </label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="assailantEscortedOffPremises"
                      id="assailantEscortedOffPremises"
                      value="assailantEscortedOffPremises"
                      onChange={handleTerminationChange}
                      checked={terminationIncidents?.includes(
                        "assailantEscortedOffPremises"
                      )}
                    />
                    <label htmlFor="assailantEscortedOffPremises">
                      Assailant escorted off premises
                    </label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="assailantArrested"
                      id="assailantArrested"
                      value="assailantArrested"
                      onChange={handleTerminationChange}
                      checked={terminationIncidents?.includes(
                        "assailantArrested"
                      )}
                    />
                    <label htmlFor="assailantArrested">
                      Assailant arrested{" "}
                    </label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="letOnOwn"
                      id="letOnOwn"
                      value="leftOnOwn"
                      onChange={handleTerminationChange}
                      checked={terminationIncidents?.includes("leftOnOwn")}
                    />
                    <label htmlFor="letOnOwn">Left on own</label>
                  </div>

                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="stayedOnPremise"
                      id="stayedOnPremise"
                      value="stayedOnPremise"
                      onChange={handleTerminationChange}
                      checked={terminationIncidents?.includes(
                        "stayedOnPremise"
                      )}
                    />
                    <label htmlFor="stayedOnPremise">Stayed on premises</label>
                  </div>

                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="assailantRestrained"
                      id="assailantRestrained"
                      value="assailantRestrained"
                      onChange={handleTerminationChange}
                      checked={terminationIncidents?.includes(
                        "assailantRestrained"
                      )}
                    />
                    <label htmlFor="assailantRestrained">
                      Assailant restrained
                    </label>
                  </div>

                  <div className="check-box">
                    <input
                      onClick={() => handleTerminationOfContract("other")}
                      value={isOtherTerminationOfContract}
                      type="checkbox"
                      name="otherTermination"
                      id="otherTermination"
                    />
                    <label htmlFor="otherTermination">Other</label>
                  </div>

                  {isOtherTerminationOfContract ? (
                    <div className="field">
                      <input
                        type="text"
                        name="otherTerminationOfContract"
                        id="otherTerminationOfContract"
                        placeholder="Please explain"
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            ) : currentStep === 9 ? (
              <div className="step">
                <h4>
                  Was the immediate supervisor/department manager notified?{" "}
                </h4>
                <div className="check-boxes">
                  <div className="check-box">
                    <input
                      type="radio"
                      name="departmentManagerNotified"
                      id="YesDepartmentManagerNotified"
                      checked={departmentManagerNotified === true}
                      onChange={() => setDepartmentManagerNotified(true)}
                    />
                    <label htmlFor="YesDepartmentManagerNotified">Yes</label>
                  </div>
                  <div className="check-box">
                    <input
                      type="radio"
                      name="departmentManagerNotified"
                      id="noDepartmentManagerNotified"
                      checked={departmentManagerNotified === false}
                      onChange={() => setDepartmentManagerNotified(false)}
                    />
                    <label htmlFor="noDepartmentManagerNotified">No</label>
                  </div>
                </div>

                {departmentManagerNotified ? (
                  <div>
                    <div className="half">
                      <div className="field">
                        <label htmlFor="departmentNotifiedFirstName">
                          First name
                        </label>
                        <input
                          type="text"
                          name="departmentNotifiedFirstName"
                          id="departmentNotifiedFirstName"
                          placeholder="Enter first name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="departmentNotifiedLastName">
                          Last name
                        </label>
                        <input
                          type="text"
                          name="departmentNotifiedLastName"
                          id="departmentNotifiedLastName"
                          placeholder="Enter last name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="departmentNotifiedTitle">
                        Title/Department
                      </label>
                      <input
                        type="text"
                        name="departmentNotifiedTitle"
                        id="departmentNotifiedTitle"
                        placeholder="Enter title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </div>
                    <div className="half">
                      <div className="field">
                        <label htmlFor="dateOfNotification">Date</label>
                        <CustomDatePicker
                          selectedDate={notificationDate}
                          setSelectedDate={setNotificationDate}
                        />
                      </div>

                      <div className="field">
                        <label htmlFor="timeOfNotification">Time</label>
                        <CustomTimeInput
                          setTime={setNotificationTime}
                          defaultTime={notificationTime}
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label htmlFor="departmentAction">
                        What action was/has been taken by immediate
                        supervisor/department manager and/or Hospital
                        administration?
                      </label>
                      <input
                        type="text"
                        name="departmentAction"
                        id="departmentAction"
                        placeholder="Enter action(s)"
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  ""
                )}
                <div className="field">
                  <label htmlFor="suggestionOfPrevention">
                    Suggestions for preventing a similar incident in the future?
                  </label>
                  <input
                    type="text"
                    name="suggestionOfPrevention"
                    id="suggestionOfPrevention"
                    placeholder="Enter suggestion(s)"
                    value={suggestions}
                    onChange={(e) => setSuggestions(e.target.value)}
                  />
                </div>
              </div>
            ) : currentStep === 10 ? (
              <div className="step">
                <div className="half">
                  <div className="field">
                    <label htmlFor="departmentActionFirstName">
                      Report opened by first name
                    </label>
                    <input
                      type="text"
                      name="reportedbyFirstName"
                      id="reportedbyFirstName"
                      placeholder="Enter first name"
                      value={reportedByFirstName}
                      onChange={(e) => setReportedByFirstName(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="departmentActionLastName">
                      Report opened by last name
                    </label>
                    <input
                      type="text"
                      name="departmentActionLastName"
                      id="departmentActionLastName"
                      placeholder="Enter last name"
                      value={reportedByLastName}
                      onChange={(e) => setReportedByLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div className="half">
                  <div className="field">
                    <label htmlFor="reprtedtitle">Title</label>
                    <input
                      type="text"
                      name="reprtedtitle"
                      id="reprtedtitle"
                      placeholder="Enter title/dept"
                      value={reportedTitle}
                      onChange={(e) => setreportedTitle(e.target.value)}
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="datereported">Date report open</label>
                    <CustomDatePicker
                      selectedDate={dateReported}
                      setSelectedDate={setdateReported}
                    />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="timeReported">Time report open</label>
                  <CustomTimeInput
                    setTime={setTimeReported}
                    defaultTime={timeReported}
                  />
                </div>
              </div>
            ) : currentStep > 10 ? (
              <FormCompleteMessage />
            ) : (
              ""
            )}
          </form>
          <div className="incident-form-buttons">
            {currentStep > 1 && currentStep <= 10 ? (
              <button
                onClick={handlePreviousStep}
                id="back-button"
                className="incident-back-btn"
              >
                <i className="fa-solid fa-arrow-left"></i>
                <span>back</span>
              </button>
            ) : (
              ""
            )}

            {currentStep === 10 ? (
              <button
                className="primary-button"
                onClick={() => handleSaveChange()}
                id="save-button"
              >
                <span>{isLoading ? "Processing..." : "Save Incident"}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                id="continue-button"
                className="primary-button"
              >
                <span>{isLoading ? "Processing..." : "Save & Continue"}</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default WorkplaceViolenceIncidentForm;
