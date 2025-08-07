'use client'
import React, { useState, useEffect } from "react";
import { useRef } from "react";
import postDocumentHistory from "../../documentHistory/postDocumentHistory.jsx";
import { validateStep } from "../../validators/GeneralIncidentFormValidator.js";
import api, { API_URL, cleanedData } from "@/utils/api.js";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage.jsx";
import CustomSelectInput from "@/components/CustomSelectInput.jsx";
import CustomDatePicker from "@/components/CustomDatePicker.jsx";
import RichTexField from "@/components/forms/RichTextField.jsx";
import { CircleMinus } from 'lucide-react';
import CustomTimeInput from "@/components/CustomTimeInput.jsx";
import { Form } from "react-router-dom";

const HealthIncidentInvestigationForm = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const currentStepRef = useRef(currentStep);
    const [savingDraft, setSavingDraft] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [showWitnessList, setShowWitnessList] = useState(false);
    // const [safetyRegulationsUser, setSafetyRegulationsUser] = useState("")
    const [employeeSeenDoctor, setEmployeeSeenDoctor] = useState(false);
    const [nameOfStaff, setNameOfStaff] = useState({
        first_name: "",
        last_name: "",
        profile_type: "Staff"
    });
    const [injuredStaffFirstName, setInjuredStaffFirstName] = useState("")
    const [injuredStaffLastName, setInjuredStaffLastName] = useState("")
    const [dateOfHire, setOfHire] = useState("");
    const [dateOfBirth, setdateOfBirth] = useState("");
    const [employeeAddress, setemployeeAddress] = useState("");
    const [employeeCity, setemployeeCity] = useState("");
    const [employeeState, setemployeeState] = useState("");
    const [employeeZip, setemployeeZip] = useState("");
    const [partOfBodyInjured, setpartOfBodyInjured] = useState("");
    const [natureOfInjury, setnatureOfInjury] = useState("");
    const [accidentHappened, setaccidentHappened] = useState("");
    const [sex, setSex] = useState();
    const [status, setstatus] = useState();
    const [activityPriorToEvent, setactivityPriorToEvent] = useState();
    const [equipmentInUse, setequipmentInUse] = useState();
    const [EventPlace, setEventPlace] = useState();
    const [Regulations, setRegulations] = useState();
    const [SafetyRegulationsUser, setSafetyUser] = useState("");
    // const [whatWasWrong, setwhatWasWrong] = useState("")
    const [dateClaimNotified, setdateClaimNotified] = useState("");
    const [Claim, setClaim] = useState("");
    const [doctorsFirstName, setdoctorsFirstName] = useState("");
    const [doctorsLastName, setdoctorsLastName] = useState("");
    const [hospitalName, sethospitalName] = useState("");
    const [preventions, setpreventions] = useState("");
    const [safetyRegulationsUser, setSafetyRegulationsUser] = useState("");
    const [whatWasWrong, setWhatWasWrong] = useState("");
    const [incidentId, setIncidentId] = useState("");
    const [witness, setWitness] = useState("");
    const [dateOfEvent, setdateOfEvent] = useState("");
    const [timeOfEvent, settimeOfEvent] = useState("");
    const [eventLocation, seteventLocation] = useState("");
    const [success, setSuccess] = useState(false);
    const [witnessNameArray, setwitnessNameArray] = useState([]);
    const [staffIncidentId, setStaffIncidentId] = useState(localStorage.getItem("staffIncidentId"))

    useEffect(() => {
        currentStepRef.current = currentStep;
    }, [currentStep]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if Ctrl or Alt key is pressed
            if (event.key === "Enter") {
                event.preventDefault();
                if (currentStepRef.current < 3) {
                    document.getElementById("continue-button").click();
                } else if (currentStepRef.current === 3) {
                    document.getElementById("save-button").click();
                } else {
                    return;
                }
            }

            if (event.ctrlKey || event.altKey) {
                switch (event.key) {
                    case "s": // Ctrl + S
                        event.preventDefault(); // Prevent default browser action
                        if (currentStepRef.current < 3) {
                            document.getElementById("continue-button").click();
                        } else if (currentStepRef.current === 3) {
                            document.getElementById("save-button").click();
                        } else {
                            return;
                        }
                        break;
                    case "b":
                        event.preventDefault();
                        if (currentStepRef.current > 1 && currentStepRef.current <= 3) {
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
    const handleEmployeeSeenDoctor = () => {
        setEmployeeSeenDoctor(!employeeSeenDoctor);
    };

    const handleWitnessNameArray = (e, value) => {
        e.preventDefault();
        if (!value.trim().length) return;
        setwitnessNameArray((witnessNameArray) => [...witnessNameArray, value]);
        setWitness("");
    };

    const handleRemoveWitnessName = (e, name) => {
        e.preventDefault();
        setwitnessNameArray((witnessNameArray) =>
            witnessNameArray.filter((el) => el !== name)
        );
    };

    const handleSaveChange = async () => {
        if (currentStep === 3) {
            const fieldsToValidate = {
                "Enter Place": eventLocation,
            };

            if (safetyRegulationsUser === "no") {
                fieldsToValidate["What was Wrong"] = whatWasWrong;
            }

            const isValid = validateStep(fieldsToValidate);

            if (!isValid) {
                window.customToast.error("Please fill out all required fields.");
                return;
            }

            if (
                employeeSeenDoctor &&
                (!doctorsFirstName || !doctorsLastName || !hospitalName || !preventions)
            ) {
                window.customToast.error(
                    "Please enter the Doctor's name, Hospital's name, and description."
                );
                return;
            }

            if (!incidentId) {
                window.customToast.error("Missing incident ID. Please start over.");
                return;
            }

            setIsLoading(true);

            handleStepThreeSubmit();
        }
    };

    const handleNextStep = async () => {
        if (currentStep === 1) {
            const isValid = validateStep({
                Name: nameOfStaff,
                "Date of Hire": dateOfHire,
                "Date of Birth": dateOfBirth,
                "Add your Address": employeeAddress,
                "Add your City": employeeCity,
                "Add your State": employeeState,
                "Add your Zip Code": employeeZip,
                "part of Body in jured": partOfBodyInjured,
                "Enter description": natureOfInjury,
                "Add your description": accidentHappened,
                "Add Sex": sex,
                "Add Status": status,
            });

            if (isValid) {
                setIsLoading(true);

                handleStepOneSubmit();
            }
        } else if (currentStep === 2) {
            const isValid = validateStep({
                "Enter description": activityPriorToEvent,
                "Add description": equipmentInUse,
                "Add date of Event": dateOfEvent,
                "Add Time of Event": timeOfEvent,
                "Add event Location": eventLocation,
            });

            if (isValid) {
                if (!incidentId) {
                    window.customToast.error("Missing incident ID. Please start over.");
                    return;
                }
                setIsLoading(true);

                handleStepTwoSubmit();
            } else {
                return;
            }
        }
    };
    const handlePreviousStep = () => {
        currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
    };

    const handleStepOneSubmit = async () => {
        try {

            const res = await api.post(
                `${API_URL}/incidents/staff-incident/${staffIncidentId}/investigation/`,
                {
                    name_of_injured_staff:
                        injuredStaffFirstName && injuredStaffLastName
                            ? {
                                first_name: injuredStaffFirstName,
                                last_name: injuredStaffLastName,
                                profile_type: "Staff"
                            } : null,
                    date_of_hire: dateOfHire,
                    part_of_body_injured: partOfBodyInjured,
                    nature_of_injury: natureOfInjury,
                    accident_details: accidentHappened,
                    marital_status: status,
                }
            );

            if (res.status === 201 || res.status === 200) {

                localStorage.setItem("employee_investigation_id", res.data.id);
                setIncidentId(res.data.id);
                setCurrentStep(currentStep + 1);
                window.customToast.success("Data posted successfully");
                setIsLoading(false);
                return res.data.id;
            }
        } catch (error) {
            const serverError = error?.response?.data?.error;
            if (typeof serverError === "string") {
                window.customToast.error(serverError);
            } else if (
                typeof serverError === "object" &&
                serverError !== null
            ) {
                const messages = Object.entries(serverError).map(
                    ([key, value]) => `${key}: ${value.join(", ")}`
                );
                messages.forEach((msg) => window.customToast.error(msg));
            } else {
                window.customToast.error("Something went wrong. Please try again.");
            }
            console.error("Error submitting step 1: ", error);
            setIsLoading(false);
            setSavingDraft(false);
            return;
        }
    };

    const handleStepTwoSubmit = async () => {
        if (!incidentId) {
            setIsLoading(false);
            throw new Error("Incident ID is missing");
        }

        try {
            const res = await api.put(
                `${API_URL}/incidents/staff-incident/${staffIncidentId}/investigation/${incidentId}/`,
                {
                    employee_prior_activity: activityPriorToEvent,
                    equipment_or_tools: equipmentInUse,
                    date_of_event: dateOfEvent,
                    time_of_event: timeOfEvent,
                    event_location: eventLocation,
                    witnesses: witnessNameArray.join(", "),
                    status: "Draft",
                }
            );

            if (res.status === 201 || res.status === 200) {

                setIncidentId(res.data.id);
                setCurrentStep(currentStep + 1);
                setIsLoading(false);
                window.customToast.success("Data posted successfully");
                return res.data.id;
            }
        } catch (error) {
            console.error("Error submitting step 2: ", error);
            setIsLoading(false);
            throw error;
        }
    };

    const handleStepThreeSubmit = async () => {
        if (!incidentId) {
            throw new Error("Incident ID is missing");
        }
        try {
            const data = {
                event_location: eventLocation,
                safety_regulations: safetyRegulationsUser,
                cause_of_event: whatWasWrong,
                date_claim_notified: dateClaimNotified,
                claim: Claim,
                went_to_doctor_or_hospital: employeeSeenDoctor,
                doctor_info:
                    doctorsFirstName && doctorsLastName
                        ? {
                            first_name: doctorsFirstName,
                            last_name: doctorsLastName,
                            profile_type: "Doctor"
                        }
                        : null,
                hospital_name: hospitalName,
                recommendations: preventions,
                status: "Open",
            };
            const res = await api.put(
                `${API_URL}/incidents/staff-incident/${staffIncidentId}/investigation/${incidentId}/`,
                cleanedData(data)
            );

            if (res.status === 200 || res.status === 201) {
                postDocumentHistory(incidentId, "added a new investigation", "create");
                window.customToast.success("Data posted successfully");
                setIsLoading(false);
                setSuccess(true);
            }
            return res.data;
        } catch (error) {
            console.error("Error submitting step 3: ", error);
            setIsLoading(false);
            throw error;
        }
    };
    return (
        <div className="forms-container">
            <h2>Employee Health Incident Investigation</h2>
            {success ? (
                <FormCompleteMessage title="Health Incident Investigation" />
            ) : (
                <>
                    <div className="form-steps">
                        <div className={currentStep === 1 ? "step current-step" : "step"}>
                            <div className="icon">
                                <i className="fa-solid fa-circle-check"></i>
                            </div>
                            <div className="name">
                                <p className="step-name">Step 1/3</p>
                                <p className="step-details">Incident Info</p>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className={currentStep === 2 ? "step current-step" : "step"}>
                            <div className="icon">
                                <i className="fa-solid fa-circle-check"></i>
                            </div>
                            <div className="name">
                                <p className="step-name">Step 2/3</p>
                                <p className="step-details">Location & status</p>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className={currentStep === 3 ? "step current-step" : "step"}>
                            <div className="icon">
                                <i className="fa-solid fa-circle-check"></i>
                            </div>
                            <div className="name">
                                <p className="step-name">Step 3/3</p>
                                <p className="step-details">Incident type</p>
                            </div>
                        </div>
                    </div>
                    <form className="newIncidentForm">
                        {currentStep === 1 ? (
                            <div className="step1">
                                <div className="half">
                                    <div className="field">
                                        <label htmlFor="">Injured staff First name</label>
                                        <input
                                            value={injuredStaffFirstName}
                                            onChange={(e) =>
                                                setInjuredStaffFirstName(e.target.value)
                                            }
                                            type="text"
                                            name=""
                                            id=""
                                            placeholder="First name"
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="">Injured staff Last name</label>
                                        <input
                                            value={injuredStaffLastName}
                                            onChange={(e) =>
                                                setInjuredStaffLastName(e.target.value)
                                            }
                                            type="text"
                                            name=""
                                            id=""
                                            placeholder="Last name"
                                        />
                                    </div>
                                </div>
                                <div className="half">
                                    <div className="field">
                                        <label htmlFor="dateOfHire">Date of Hire</label>
                                        <CustomDatePicker
                                            selectedDate={dateOfHire}
                                            setSelectedDate={setOfHire}
                                        />
                                    </div>
                                </div>
                                <div className="half">
                                    <div className="field">
                                        <label htmlFor="nameOfInjuredStaff">Sex</label>
                                        <CustomSelectInput
                                            options={["Male", "Female", "Other"]}
                                            placeholder={"sex"}
                                            selected={sex}
                                            setSelected={setSex}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="dateOfBirth">Date of birth</label>
                                        <CustomDatePicker
                                            selectedDate={dateOfBirth}
                                            setSelectedDate={setdateOfBirth}
                                        />
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="nameOfInjuredStaff">Marital status</label>
                                    <CustomSelectInput
                                        options={["single", "married", "other"]}
                                        placeholder={"status"}
                                        selected={status}
                                        setSelected={setstatus}
                                    />
                                </div>
                                <div className="half">
                                    <div className="field">
                                        <label htmlFor="employeeAddress">Address</label>
                                        <input
                                            type="text"
                                            name="employeeAddress"
                                            id="employeeAddress"
                                            placeholder="Address"
                                            value={employeeAddress}
                                            onChange={(e) => setemployeeAddress(e.target.value)}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="employeeCity">City</label>
                                        <input
                                            type="text"
                                            name="employeeCity"
                                            id="employeeCity"
                                            placeholder="City"
                                            value={employeeCity}
                                            onChange={(e) => setemployeeCity(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="half">
                                    <div className="field">
                                        <label htmlFor="employeeState">State</label>
                                        <input
                                            type="text"
                                            name="employeeState"
                                            id="employeeState"
                                            placeholder="State"
                                            value={employeeState}
                                            onChange={(e) => setemployeeState(e.target.value)}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="employeeZip">Zip code</label>
                                        <input
                                            type="text"
                                            name="employeeZip"
                                            id="employeeZip"
                                            placeholder="Zip"
                                            value={employeeZip}
                                            onChange={(e) => setemployeeZip(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="description-fields">
                                    <div className="field">
                                        <label htmlFor="partOfBodyInjured">
                                            What part of the body was injured? Describe in detail:
                                        </label>
                                        <RichTexField
                                            value={partOfBodyInjured}
                                            onEditorChange={setpartOfBodyInjured}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="natureOfInjury">
                                            What was the nature of the injury? Describe in detail:
                                        </label>
                                        <RichTexField
                                            value={natureOfInjury}
                                            onEditorChange={setnatureOfInjury}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="accidentHappened">
                                            Describe fully how the accident happened?
                                        </label>
                                        <RichTexField
                                            value={accidentHappened}
                                            onEditorChange={setaccidentHappened}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : currentStep === 2 ? (
                            <div>
                                <div className="field">
                                    <label htmlFor="activityPriorToEvent">
                                        What was employee doing prior to the event?
                                    </label>
                                    <RichTexField
                                        value={activityPriorToEvent}
                                        onEditorChange={setactivityPriorToEvent}
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="equipmentInUse">
                                        What equipment or tools being using?
                                    </label>
                                    <RichTexField
                                        value={equipmentInUse}
                                        onEditorChange={setequipmentInUse}
                                    />
                                </div>
                                {/* <div className="tabs">
                                    <div
                                        onClick={() => setShowWitnessList(false)}
                                        className={`tab ${!showWitnessList ? "active" : ""}`}
                                    >
                                        <p>Add witness</p>
                                    </div>
                                    <div
                                        onClick={() => setShowWitnessList(true)}
                                        className={`tab ${showWitnessList ? "active" : ""}`}
                                    >
                                        <p>Witness List</p>
                                    </div>
                                </div> */}

                                <div className="tabs-content">

                                    <div className="witness-list">
                                        <div className="parties" style={{ flexDirection: "row" }}>
                                            {witnessNameArray.length
                                                ? witnessNameArray.map((witness, index) => (
                                                    <button
                                                        key={index}
                                                        className="new-party"
                                                        onClick={(e) =>
                                                            handleRemoveWitnessName(e, witness)
                                                        }
                                                    >
                                                        {witness}
                                                        <CircleMinus />
                                                    </button>
                                                ))
                                                : null}
                                        </div>
                                    </div>

                                    <div className="step">
                                        <div className="field">
                                            <label htmlFor="witnessName">Witness Name</label>
                                            <input
                                                type="text"
                                                name="witnessName"
                                                id="witnessName"
                                                placeholder="Witness name"
                                                value={witness}
                                                onChange={(e) => setWitness(e.target.value)}
                                            />
                                        </div>
                                        <div className="parties">
                                            <button
                                                className="new-party"
                                                onClick={(e) => handleWitnessNameArray(e, witness)}
                                            >
                                                {" "}
                                                + Add Witness
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="half">
                                    <div className="field">
                                        <label htmlFor="dateOfEvent">Date of event</label>
                                        <CustomDatePicker
                                            selectedDate={dateOfEvent}
                                            setSelectedDate={setdateOfEvent}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="timeOfEvent">Time of event</label>
                                        <CustomTimeInput setTime={settimeOfEvent} />
                                    </div>
                                </div>
                                <div className="field">
                                    <label htmlFor="eventLocation">Event location</label>
                                    <input
                                        type="text"
                                        name="eventLocation"
                                        id="eventLocation"
                                        placeholder="Enter patient or visitor address"
                                        value={eventLocation}
                                        onChange={(e) => seteventLocation(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : currentStep === 3 ? (
                            <div className="step">
                                <div className="field">
                                    <label htmlFor="causeOfEvent">What caused the event:</label>
                                    <input
                                        type="text"
                                        name="causeOfEvent"
                                        id="causeOfEvent"
                                        placeholder="Enter Description"
                                        value={whatWasWrong}
                                        onChange={(e) => setWhatWasWrong(e.target.value)}
                                    />
                                </div>

                                <div className="field">
                                    <h4>
                                        Were safety regulations in place and used? If not, what was
                                        wrong?{" "}
                                    </h4>
                                    <div className="check-boxes">
                                        <div className="check-box">
                                            <input
                                                type="radio"
                                                name="SafetyRegulationsUser"
                                                id="yes"
                                                value="Yes"
                                                checked={safetyRegulationsUser === "Yes"}
                                                onChange={(e) =>
                                                    setSafetyRegulationsUser(e.target.value)
                                                }
                                            />
                                            <label htmlFor="yes">Yes</label>
                                        </div>
                                        <div className="check-box">
                                            <input
                                                type="radio"
                                                name="SafetyRegulationsUser"
                                                id="no"
                                                value="No"
                                                checked={safetyRegulationsUser === "No"}
                                                onChange={(e) =>
                                                    setSafetyRegulationsUser(e.target.value)
                                                }
                                            />
                                            <label htmlFor="no">No</label>
                                        </div>
                                    </div>
                                    {safetyRegulationsUser === "No" && (
                                        <div className="field">
                                            <label htmlFor="whatWasWrong">What was wrong?</label>
                                            <RichTexField
                                                value={whatWasWrong}
                                                onEditorChange={setWhatWasWrong}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="half">
                                    <div className="field">
                                        <label htmlFor="dateClaimNotified">
                                            Date claim notified
                                        </label>
                                        <CustomDatePicker
                                            selectedDate={dateClaimNotified}
                                            setSelectedDate={setdateClaimNotified}
                                        />
                                    </div>
                                    <div className="field">
                                        <label htmlFor="claim">Claim</label>
                                        <input
                                            type="text"
                                            name="claim"
                                            id="Claim"
                                            placeholder="Enter claim"
                                            value={Claim}
                                            onChange={(e) => setClaim(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="check-box">
                                    <input
                                        onChange={handleEmployeeSeenDoctor}
                                        checked={employeeSeenDoctor}
                                        type="checkbox"
                                        name="employeeSeenDoctor"
                                        id="employeeSeenDoctor"
                                    />
                                    <label htmlFor="employeeSeenDoctor">
                                        Check it if Employee went to doctor/hospital?
                                    </label>
                                </div>

                                {employeeSeenDoctor ? (
                                    <div>
                                        <div className="half">
                                            <div className="field">
                                                <label htmlFor="doctorsFirstName">
                                                    Doctor's first name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="doctorsFirstName"
                                                    id="doctorsFirstName"
                                                    placeholder="Enter doctor's first name"
                                                    value={doctorsFirstName}
                                                    onChange={(e) => setdoctorsFirstName(e.target.value)}
                                                />
                                            </div>
                                            <div className="field">
                                                <label htmlFor="doctorsLastName">
                                                    Doctor's last name
                                                </label>
                                                <input
                                                    type="text"
                                                    name="doctorsLastName"
                                                    id="doctorsLastName"
                                                    placeholder="Enter doctor's last name"
                                                    value={doctorsLastName}
                                                    onChange={(e) => setdoctorsLastName(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="hospitalName">Hospital's name</label>
                                            <input
                                                type="text"
                                                name="hospitalName"
                                                id="hospitalName"
                                                placeholder="Enter hospital's name"
                                                value={hospitalName}
                                                onChange={(e) => sethospitalName(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}
                                <div className="field">
                                    <label htmlFor="preventions">
                                        Recommended preventive action to take in the future to
                                        prevent reoccurrence.
                                    </label>
                                    <RichTexField
                                        value={preventions}
                                        onEditorChange={setpreventions}
                                    />
                                </div>
                            </div>
                        ) : currentStep > 3 ? (
                            <FormCompleteMessage />
                        ) : (
                            ""
                        )}
                    </form>
                    <div className="btns">
                        {currentStep > 1 && currentStep < 4 ? (
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

                        {currentStep > 2 && currentStep < 4 ? (
                            <button
                                className="primary-button"
                                id="save-button"
                                onClick={handleSaveChange}
                            >
                                <span>{isLoading ? "Processing..." : "Save Incident"}</span>
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        ) : currentStep < 3 ? (
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
                </>
            )}
        </div>
    );
};

export default HealthIncidentInvestigationForm;
