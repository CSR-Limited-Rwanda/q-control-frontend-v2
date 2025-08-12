"use client";
import React, { useState, useEffect } from "react";
import api, { cleanedData } from "@/utils/api";
import { useParams } from "react-router-dom";
import { SaveAll, LoaderCircle } from "lucide-react";
import { injuresTypes, sourcesOfInformation } from "@/constants/constants";
import RichTexField from "@/components/forms/RichTextField";
// import "../../../../assets/css/forms/forms.css";
import "../../../styles/_forms.scss";
import CustomSelectInput from "@/components/CustomSelectInput";
import CustomDatePicker from "@/components/CustomDatePicker";
import mediaAPI from "@/utils/mediaApi";
import { CirclePlus, CircleMinus } from "lucide-react";
import postDocumentHistory from "../documentHistory/postDocumentHistory";
import FilesList from "../documentHistory/FilesList";
import CustomTimeInput from "@/components/CustomTimeInput";
import { useDepartments, usePermission } from "@/context/PermissionsContext";
import CantModify from "@/components/CantModify";
import { useAuthentication } from "@/context/authContext";
import '@/styles/_modifyIncident.scss';
import BackToPage from "@/components/BackToPage";

const ModifyWorkplaceIncident = ({ data }) => {
  const { user } = useAuthentication()
  const { incidentId } = useParams();
  const [incident, setIncident] = useState(data);
  const [departmentId, setDepartmentId] = useState(
    localStorage.getItem("departmentId")
  );

  const [isLoading, setIsLoading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [victimAlone, setVictimAlone] = useState(incident?.victim_was_alone);

  // forms
  const [severityRating, setSeverityRating] = useState(
    incident?.severity_rating
  );
  const [status, setStatus] = useState(incident?.status);
  const [selfInjury, setSelfInjury] = useState(
    incident?.type_of_incident &&
    JSON.parse(incident.type_of_incident).incidents.includes("Other Types")
  );
  const [otherType, setOtherType] = useState(false);
  const [otherExplain, setOtherExplain] = useState(false);
  const [otherAssailant, setOtherAssailant] = useState(false);
  const [showWitnesses, setShowWitnesses] = useState(false);
  const [isOtherTerminationOfContract, setIsOtherTerminationOfContract] =
    useState("");
  const [departmentManagerNotified, setDepartmentManagerNotified] = useState(
    data.immediate_supervisor
  );
  const [date, setDate] = useState(data.date_of_incident);
  const [detail, setDetail] = useState(data.description);
  const [time, setTime] = useState(data.time_of_incident);
  const [notificationTime, setNotificationTime] = useState(data.time_notified);

  const [firstName, setFirstName] = useState(
    incident?.name_of_supervisor?.first_name
  );
  const [lastName, setLastName] = useState(
    incident?.name_of_supervisor?.last_name
  );
  const [title, setTitle] = useState(incident?.title_of_supervisor);
  const [typeOfContact, setTypeOfContact] = useState(incident?.type_of_contact);
  const [location, setLocation] = useState(incident?.location);
  const [threats, setThreats] = useState(incident?.there_was_threats_before);
  const [violence, setViolence] = useState(incident?.staff_member_reported);
  const [address, setAddress] = useState("");
  const [termination, setTermination] = useState("");
  const [action, setAction] = useState(incident?.action_taken);
  const [suggestions, setSuggestions] = useState(
    incident?.prevention_suggestion
  );
  const [explainselfinjury, setExplainSelfInjury] = useState(
    incident?.type_of_incident &&
    JSON.parse(incident?.type_of_incident).explanation
  );
  const [otherinjury, setOtherInjury] = useState("");
  const [background, setBackground] = useState("");
  const [assailant, setAssailant] = useState("");
  const [selectedType, setSelectedType] = useState(incident?.incident_type);
  const [selectedInjuries, setSelectedInjuries] = useState(
    (incident?.physical_injury_description &&
      incident?.physical_injury_description.split(", ")) ||
    []
  );
  const [selectedRelationship, setSelectedRelationship] = useState("");
  const [selectedBackground, setSelectedBackground] = useState(
    (incident?.type_of_incident &&
      JSON.parse(incident?.type_of_incident).incidents) ||
    []
  );
  const [weapons, setWeapons] = useState(data.weapons_were_involved);
  const [previousContact, setPreviousContact] = useState(
    incident?.victim_has_contact_with_assailant
  );
  const [reportedByFirstName, setReportedByFirstName] = useState(
    incident?.reported_by?.first_name
  );
  const [reportedByLastName, setReportedByLastName] = useState(
    incident?.reported_by?.last_name
  );
  const [reportedTitle, setreportedTitle] = useState(
    incident?.reported_by_title
  );
  const [dateReported, setdateReported] = useState(incident?.date_reported);
  const [timeReported, setTimeReported] = useState(incident?.time_reported);

  const [securityalert, setSecurityAlert] = useState(incident?.notification);
  const [injuryDetails, setInjuryDetails] = useState("");
  const [personInjured, setPersonInjured] = useState(incident?.person_injured);
  const [weaponField, setWeaponField] = useState(incident?.weapon_used);
  const [selectedIncidents, setSelectedIncidents] = useState(
    incident?.type_of_incident
      ? JSON.parse(incident?.type_of_incident).incidents
      : []
  );

  const [otherExplanation, setOtherExplanation] = useState("");
  let initialTerminationIncidents = [];

  try {
    const parsed = JSON.parse(incident?.termination_of_incident);
    if (parsed && Array.isArray(parsed.description)) {
      initialTerminationIncidents = parsed.description;
    }
  } catch (e) {
    // fallback if it's just a plain string or invalid JSON
    initialTerminationIncidents = [];
  }

  const [terminationIncidents, setTerminationIncidents] = useState(
    initialTerminationIncidents
  );

  const [currentInjury, setCurrentInjury] = useState({
    first_name: "",
    last_name: "",
    email: "",
    profile_type: "Victim",
    injury_description: "",
  });

  const [injuryCheck, setInjuryCheck] = useState(data.there_were_injuries);
  const [injuries, setInjuries] = useState(
    incident?.persons_injured?.map((person) => ({
      id: person.id,
      injury_description: person?.injury_description ?? "",
      first_name: person?.first_name ?? "",
      last_name: person?.last_name ?? "",
      email: person?.email ?? null,
      profile_type: "Victim",
    })) || []
  );

  const [success, setSuccess] = useState(false);
  const [newInjury, setNewInjury] = useState({
    first_name: "",
    last_name: "",
    injury_description: "",
  });
  const [currentWitness, setCurrentWitness] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    profile_type: "Witness",
  });
  const [newWitness, setNewWitness] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    profile_type: "Witness",
  });
  const [currentParty, setCurrentParty] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    title: "",
    assailant_relationship_to_patient: "",
    assailant_background: "",
    profile_type: "Victim",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [witnesses, setWitnesses] = useState(
    incident?.incident_witness?.map((witness) => ({

      first_name: witness?.first_name ?? "",
      last_name: witness?.last_name ?? "",
      email: witness?.email ?? "",
      phone_number: witness?.phone_number ?? "",
      address: witness?.address ?? "",
      profile_type: "Witness",
    })) || []
  );

  const [currentType, setCurrentType] = useState("Assailant");
  const [workplaceViolenceId, setWorkPlaceViolenceId] = useState(
    localStorage.getItem("workplaceViolenceId")
  );

  const handleInjuryCheckChange = (value) => {
    setInjuryCheck(value);
  };
  useEffect(() => {
    // get documents
    const fetchIncidentDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/workplace-violence/${workplaceViolenceId}/documents/`
        );
        if (response.status === 200) {
          setUploadedFiles(response.data.results);

        }
      } catch (error) {

      }
    };

    fetchIncidentDocuments();
  }, []);

  const handlePreviousContact = (value) => {
    setPreviousContact(value);
  };
  const handleFileChange = async (event) => {
    const formData = new FormData();
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setUploadingDocuments(true);

      const response = await mediaAPI.post(
        `/incidents/workplace-violence/${workplaceViolenceId}/documents/`,
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

  const handleThreatsChange = (value) => {
    if (value === "Yes") {
      setThreats("Yes");
    } else if (value === "No") {
      setThreats("No");
    } else if (value === "Unknown") {
      setThreats("Unknown");
    }
  };

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const list = [...injuries];
    list[index][name] = value;
    setNewInjury({
      ...newInjury,
      [name]: value,
    });
    setInjuries(list);
  };
  const handleAddInjury = () => {

    if (
      currentInjury.first_name &&
      currentInjury.last_name &&
      currentInjury.injury_description
    ) {
      setInjuries([...injuries, currentInjury]);
      setCurrentInjury({
        first_name: "",
        last_name: "",
        injury_description: "",
      });
    } else {
      window.customToast.error(
        "Please fill in both person injured and injury details"
      );
    }
  };

  const handleRemoveInjury = (index) => {
    setInjuries(injuries.filter((_, i) => i !== index));
  };

  // const handleWitnessChange = (index, event) => {
  //   const { name, value } = event.target;
  //   const newWitnesses = [...witnesses];
  //   newWitnesses[index][name] = value;
  //   setWitnesses(newWitnesses);
  // };

  const handleAddWitness = () => {

    if (
      currentWitness.first_name &&
      currentWitness.last_name &&
      currentWitness.phone_number &&
      currentWitness.address
    ) {
      setWitnesses([...witnesses, currentWitness]);
      setCurrentWitness({
        first_name: "",
        last_name: "",
        phone_number: "",
        address: "",
      });

    }
  };

  const handleRemoveWitness = (index) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };
  const addPerson = () => {
    if (
      currentParty.first_name.trim() !== "" &&
      currentParty.last_name.trim() !== "" &&
      currentParty.title.trim() !== "" &&
      currentParty.phone_number.trim() !== "" &&
      currentParty.email.trim() !== "" &&
      selectedBackground.length > 0 &&
      selectedRelationship.length > 0
    ) {
      setParties((prevParties) => ({
        ...prevParties,
        [currentType]: [...prevParties[currentType], { ...currentParty }],
      }));
      setCurrentParty({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        title: "",
        assailant_relationship_to_patient: "",
        assailant_background: "",
      });
      setSelectedBackground([]);
      setSelectedRelationship([]);
    } else {
      window.customToast.error(
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

  const removePerson = (type, index) => {
    setParties((prevParties) => ({
      ...prevParties,
      [type]: prevParties[type].filter((_, i) => i !== index),
    }));
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
    if (injury === "Other") {
      // Toggle otherType and set selectedInjuries to otherExplanation
      setOtherType(!otherType);
      setSelectedInjuries([otherExplanation]);
    } else {
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
    if (value === "selfInjury" || value === "Other Types") {
      setSelfInjury(true);
    }
    if (!checked && (value === "selfInjury" || value === "Other Types")) {
      setSelfInjury(false);
      setExplainSelfInjury("");
    }
  };
  const handleViolenceChange = (value) => {
    setViolence(value);
  };
  const handleVictimChange = (e) => {
    setVictimAlone(e.target.checked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
    let dataToStringify;

    if (
      selectedIncidents &&
      (selectedIncidents.some((el) => el === "selfInjury") ||
        selectedIncidents.some((el) => el === "Other Types"))
    ) {
      dataToStringify = {
        type: "selfInjuryOrOther",
        incidents: selectedIncidents,
        explanation: explainselfinjury,
      };
    } else {
      dataToStringify = {
        type: "selectedIncidents",
        incidents: selectedIncidents,
      };
    }

    let stringifiedTermination;

    stringifiedTermination = { description: terminationIncidents };

    const jsonTermination = JSON.stringify(stringifiedTermination);
    const jsonData = JSON.stringify(dataToStringify);
    let injuryData;
    if (injuryCheck === "Yes") {
      injuryData = {
        there_were_injuries: injuryCheck,
        persons_injured: injuries.map((injury) => ({
          id: injury.id,
          injury_description: injury.injury_description,
          first_name: injury?.first_name,
          last_name: injury?.last_name,
          email: injury?.email,
          profile_type: "Victim",
        })),
      };

    } else {
      injuryData = {
        there_were_injuries: injuryCheck,
      };
    }

    const incidentData = {
      action: "modify",
      report_facility: user.facility.id,
      department: user.department.id,
      injuryData,
      victim_has_contact_with_assailant: previousContact,
      type_of_incident: jsonData,
      physical_injury_description: selectedInjuries.join(", "),
      incident_type: selectedType,
      date_of_incident: date,
      time_of_incident: time,
      description: detail,
      // initiated_by: [
      //     ...parties["Assailant"].map((party) => ({
      //         party_type: "Assailant",
      //         first_name: party.first_name,
      //         last_name: party.last_name,
      //         email: party.email,
      //         phone_number: party.phone_number,
      //         title: party.title,
      //         assailant_relationship_to_patient:
      //             party.assailant_relationship_to_patient,
      //         assailant_background: party.assailant_background,
      //         profile_type: "Assailant"
      //     })),
      //     ...parties["Victim"].map((party) => ({
      //         party_type: "Victim",
      //         first_name: party.first_name,
      //         last_name: party.last_name,
      //         email: party.email,
      //         phone_number: party.phone_number,
      //         title: party.title,
      //         assailant_relationship_to_patient:
      //             party.assailant_relationship_to_patient,
      //         assailant_background: party.assailant_background,
      //         profile_type: "Victim"
      //     })),
      // ],
      type_of_contact: typeOfContact,
      victim_was_alone: victimAlone,
      location: location,
      there_was_threats_before: threats,
      staff_member_reported: violence,
      weapons_were_involved: weapons,
      weapon_used: weaponField,
      there_were_injuries: injuryCheck,
      time_notified: notificationTime,
      persons_injured:
        injuryCheck === "Yes"
          ? injuries.map((injury) => ({
            first_name: injury.first_name,
            last_name: injury.last_name,
            injury_description: injury.injury_description,
            profile_type: "Victim",
          }))
          : [
            {
              first_name: "N/A",
              last_name: "N/A",
              injury_description: "N/A",
              profile_type: "Victim",
            },
          ],
      notification: securityalert,
      incident_witnesses: witnesses.map((witness) => ({
        id: witness?.id ?? null,
        first_name: witness?.first_name,
        last_name: witness?.last_name,
        email: witness?.email,
        phone_number: witness?.phone_number,
        address: witness?.address,
        profile_type: "Witness",
      })),
      termination_of_incident: jsonTermination,
      immediate_supervisor: departmentManagerNotified,
      name_of_supervisor:
        firstName && lastName
          ? {
            first_name: firstName,
            last_name: lastName,
            profile_type: "Supervisor",
          }
          : null,
      title_of_supervisor: title,
      date_notified: date,
      notification_time: notificationTime,
      action_taken: action,
      prevention_suggestion: suggestions,
      reported_by:
        reportedByFirstName && reportedByLastName
          ? {
            first_name: reportedByFirstName,
            last_name: reportedByLastName,
            profile_type: "Reporter",
          }
          : null,
      reported_by_title: reportedTitle,
      date_reported: dateReported,
      time_reported: timeReported,
      status: incidentStatus,
    };

    try {

      const response = await api.patch(
        `incidents/workplace-violence/${workplaceViolenceId}/`,
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

      if (error.response) {
        window.customToast.error(
          error.response.data?.message ||
          error.response.data?.error ||
          "Error while updating the incident"
        );
      } else {
        window.customToast.error("Unknown error while updating the incident");
      }
    }
  };
  return data.is_resolved ? (
    <CantModify />
  ) : (
    <div className="modify-page-content">
      <div className="modify-page-header">
        <BackToPage
          link={"/incidents/workplace-violence/"}
          pageName={"Workplace violence incident"}
        />
        <h2 className="title">Modifying Workplace Violence Incident</h2>
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
            <h4>
              Type of incident{" "}
              <span>
                <small>(check all that apply)</small>
              </span>
            </h4>
            <div className="straight-checkings">
              <div className="check-box">
                <input
                  type="checkbox"
                  name="incidentType"
                  value="Verbal"
                  id="verbal"
                  onChange={handleCheckboxChange}
                  checked={
                    selectedIncidents && selectedIncidents.includes("Verbal")
                  }
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
                  checked={
                    selectedIncidents &&
                    selectedIncidents.includes("Verbal Threat")
                  }
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
                  checked={
                    selectedIncidents &&
                    selectedIncidents.includes("Physical Assault")
                  }
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
                  checked={
                    selectedIncidents &&
                    selectedIncidents.includes("Self Injury")
                  }
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
                  checked={
                    selectedIncidents &&
                    selectedIncidents.includes("Property Damage")
                  }
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
                  checked={
                    selectedIncidents &&
                    selectedIncidents.includes("Other Types")
                  }
                />
                <label htmlFor="otherTypes">Other(Describe)</label>
              </div>
            </div>

            {selfInjury && (
              <>
                <input
                  type="text"
                  name="selfInjuryExplanation"
                  id="selfInjuryExplanation"
                  placeholder="Please explain"
                  value={explainselfinjury}
                  onChange={(e) => setExplainSelfInjury(e.target.value)}
                />
              </>
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
          <div className="step inputs-group">
            <h4>Select Incident type</h4>
            <div className="types checkbox-grid">
              <div
                className={`type full-width-type ${selectedType === "Type 1" ? "selected" : ""
                  }`}
                onClick={() => handleSelection("Type 1")}
              >
                <h5>Type 1 (Criminal Intent/External)</h5>
                Violence by strangers/individuals who have no other connection
                with the workplace.
              </div>

              <div
                className={`type full-width-type ${selectedType === "Type 2" ? "selected" : ""
                  }`}
                onClick={() => handleSelection("Type 2")}
              >
                <h5>Type 2 (Patient/Family/Guest)</h5>
                Violence against staff by patients, customers, or others with a
                business relationship.
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
                there but has a personal relationship with the worker /such as
                an abusive spouse or domestic partner.
              </div>

              <div
                className={`type full-width-type ${selectedType === "Type 5" ? "selected" : ""
                  }`}
                onClick={() => handleSelection("Type 5")}
              >
                <h5>Type 5 (ideological)</h5>
                Violence in the workplace that is directed at an organization, a
                group of people, and/or its property for ideological, religious,
                or political reasons.
              </div>
            </div>
          </div>
          <div className="step inputs-group">
            <div className="half">
              <div className="field flex-column">
                <label htmlFor="dateOfIncident">Date of incident</label>
                <CustomDatePicker
                  selectedDate={date}
                  setSelectedDate={setDate}
                />
              </div>
              <div className="field flex-column">
                <label htmlFor="dateOfIncident">Time of incident</label>
                <CustomTimeInput setTime={setTime} defaultTime={time} />
              </div>
            </div>
            <div className="field flex-column">
              <label htmlFor="incidentDescription">
                Detailed description of the observation, threat, incident, or
                activity
              </label>
              <RichTexField value={detail} onEditorChange={setDetail} />
            </div>
          </div>
          <div className="step inputs-group">
            <h4>Part 2: Incident Directed at and Initiated/Committed By</h4>

            {/* <div className="tabs-content">
                            <div className="types">
                                {["Assailant", "Victim"].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setPartiesType(type)}
                                        className={`type ${currentType === type ? "selected" : ""}`}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>

                            <div className="field name flex-column">
                                <div
                                    className="parties"
                                    style={{ flexDirection: "row", flexWrap: "wrap" }}
                                >
                                    {parties[currentType]
                                        .filter((party) => !party.isInitial)
                                        .map((party, index) => (
                                            <button
                                                key={index}
                                                className="new-party"
                                                onClick={() => removePerson(currentType, index)}
                                            >
                                                {party?.user_data?.first_name}{" "}
                                                {party?.user_data?.last_name}
                                                <CircleMinus />
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
                                                        assailant_relationship_to_patient: e.target.value,
                                                    }));
                                                }}
                                            />
                                        )}
                                    </div>

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
                                            "Other (explain)",
                                            "Interpersonal conflict",
                                            "Prior history of violence",
                                        ].map((type) => (
                                            <div
                                                key={type}
                                                className={`type ${selectedBackground &&
                                                    selectedBackground.includes(type)
                                                    ? "selected"
                                                    : ""
                                                    }`}
                                                onClick={() => {
                                                    handleBackground(type);
                                                    if (type === "Other (explain)") handleOtherExplain();
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

                                    {selectedBackground &&
                                        selectedBackground.includes("Other (explain)") && (
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
                                            onChange={(e) => handlePreviousContact(e.target.value)}
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
                                            onChange={(e) => handlePreviousContact(e.target.value)}
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
                                            onChange={(e) => handlePreviousContact(e.target.value)}
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
                                            onChange={(e) => handlePreviousContact(e.target.value)}
                                            required
                                        />
                                        <label htmlFor="unknownContact">Unknown</label>
                                    </div>
                                </div>
                            </div>
                        </div> */}
          </div>

          <div className="step inputs-group">
            <div className="field flex-column">
              <label htmlFor="typeIfContact">Type of contact</label>
              <CustomSelectInput
                options={[
                  "In person",
                  "Telephone",
                  "Email",
                  "Social Media",
                  "Fax",
                ]}
                placeholder={"Type of contact"}
                selected={typeOfContact}
                setSelected={setTypeOfContact}
              />
            </div>
            <div className="field flex-column">
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

            <div className="field flex-column">
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
            <div className="field flex-column">
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
                    onChange={(e) => handleThreatsChange(e.target.value)}
                    checked={threats === "Unknown"}
                    required
                  />
                  <label htmlFor="unknownThreats">Unknown</label>
                </div>
              </div>
            </div>

            <div className="field flex-column">
              <label htmlFor="incidentViolent">
                Did the staff member ever report they were threatened, harassed,
                or suspicious that the assailant may become violent?
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

            <div className="field flex-column">
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

                {weapons && (
                  <div className="field flex-column">
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
          </div>
          <div className="step inputs-group">
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
                        {injury?.first_name} {injury?.last_name}{" "}
                        <CircleMinus />
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
                      value={currentInjury?.first_name ?? ""}
                      onChange={(e) =>
                        setCurrentInjury({
                          ...currentInjury,
                          first_name: e.target.value, // Correctly updates first name
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
                      value={currentInjury?.last_name ?? ""}
                      onChange={(e) =>
                        setCurrentInjury({
                          ...currentInjury,
                          last_name: e.target.value,
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
          <div className="step inputs-group">
            <h4>Witnesses to the incident:</h4>
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
                        {witness?.first_name} {witness?.last_name}{" "}
                        <CircleMinus />
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
                      value={currentWitness?.first_name ?? ""}
                      onChange={(e) =>
                        setCurrentWitness({
                          ...currentWitness,
                          first_name: e.target.value,
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
                      value={currentWitness?.last_name ?? ""}
                      onChange={(e) =>
                        setCurrentWitness({
                          ...currentWitness,
                          last_name: e.target.value,
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
                      value={currentWitness?.phone_number ?? ""}
                      onChange={(e) =>
                        setCurrentWitness({
                          ...currentWitness,
                          phone_number: e.target.value,
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
                      value={currentWitness?.address}
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
            <div className="field flex-column">
              <div className="check-boxes">
                <div className="check-box">
                  <input
                    type="radio"
                    name="securityOption"
                    id="securityAlertCalled"
                    checked={securityalert === "Security alert called"}
                    onChange={() => setSecurityAlert("Security alert called")}
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
                    checked={securityalert === "Law enforcement called"}
                    onChange={() => setSecurityAlert("Law enforcement called")}
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
                    checked={securityalert === "Administration called"}
                    onChange={() => setSecurityAlert("Administration called")}
                  />
                  <label htmlFor="administrationCalled">
                    Administrator/AOC called?
                  </label>
                </div>
              </div>
            </div>
          </div>
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
                  checked={terminationIncidents?.includes("assailantArrested")}
                />
                <label htmlFor="assailantArrested">Assailant arrested </label>
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
                  checked={terminationIncidents?.includes("stayedOnPremise")}
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
          <div className="step inputs-group">
            <h4>Was the immediate supervisor/department manager notified? </h4>
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

                <div className="half">
                  <div className="field flex-column">
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
                </div>

                <div className="half">
                  <div className="field flex-column">
                    <label htmlFor="dateOfNotification">Date</label>
                    <CustomDatePicker
                      selectedDate={date}
                      setSelectedDate={setDate}
                    />
                  </div>

                  <div className="field flex-column">
                    <label htmlFor="timeOfNotification">Time</label>
                    <CustomTimeInput
                      setTime={setNotificationTime}
                      defaultTime={notificationTime}
                    />
                  </div>
                </div>

                <div className="field flex-column">
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
            <div className="field flex-column">
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
          <div className="step inputs-group grid">
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

            <div className="field flex-column">
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

            <div className="field flex-column">
              <label htmlFor="datereported">Date report Open</label>
              <CustomDatePicker
                selectedDate={dateReported}
                setSelectedDate={setdateReported}
              />
            </div>

            <div className="field flex-column">
              <label htmlFor="timeReported">Time report Open</label>
              <CustomTimeInput
                setTime={setTimeReported}
                defaultTime={timeReported}
              />
            </div>
          </div>
          {/* {(permission.includes("Super User") ||
                        permission.includes("Admin") ||
                        (permission.includes("Manager") &&
                            department.includes(incident.department)) ||
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
      }
    </div>
  );
};

export default ModifyWorkplaceIncident;
