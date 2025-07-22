"use client"
import React, { useEffect, useState, useRef } from "react";
import api, {API_URL, cleanedData} from "@/utils/api";
import mediaAPI from "@/utils/mediaApi";
import CustomDatePicker from "@/components/CustomDatePicker";
import RichTexField from "@/components/forms/RichTextField";
import { X } from "lucide-react";
import FormCompleteMessage from "@/components/forms/FormCompleteMessage";

const PartiesInvolved = ({ data, handleRemovePartyInvolved }) => {
  return data && data.length > 0 ? (
    <div className="parties-involved-list">
      {data.map((party, index) => (
        <div key={index} className="party">
          <span>{party.name}</span>
          <div
            onClick={() => handleRemovePartyInvolved(index)}
            className="icon"
          >
            <X size={18} fontVariant={"stroke"} />
          </div>
        </div>
      ))}
    </div>
  ) : (
    ""
  );
};

const GrievanceInvestigationForm = ({ incidentId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const currentStepRef = useRef(currentStep);
  const [isLoading, setIsLoading] = useState(false);
  const [conductedBy, setConductedBy] = useState({
    first_name: "",
    last_name: "",
  });
  const [formData, setFormData] = useState({
    investigativeFindings: "",
    startDate: "",
    endDate: "",
    review: "",
    actionsTaken: "",
    feedbackDate: "",
    personAtMeeting: "",
    relationship: "",
    meeting: false,
    telephone: false,
    extensionLetterDate: "",
    responseLetterDate: "",
    dateClosed: "",
  });
  const [content, setContent] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [findingsInterviews, setFindingsInterviews] = useState("");
  const [medicalRecordFindings, setMedicalRecordFindings] = useState("");

  const [conclusions, setConclusions] = useState("");
  const [actionsTaken, setActionsTaken] = useState("");
  const [feedbackDate, setFeedbackDate] = useState("");
  const [feedback, setFeedBack] = useState("");

  const [partiesInvolved, setPartiesInvolved] = useState([]);
  const [newPartyName, setNewPartyName] = useState("");
  const [newPartyRelationship, setNewPartyNameRelationship] = useState("");
  const [partyInvolved, setPartyInvolved] = useState({});

  const [extensionLaterFile, setExtensionLaterFile] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState("");
  const [responseLaterFile, setResponseLaterFile] = useState("");
  const [extensionLetterDate, setExtensionLetterDate] = useState("");
  const [responseLetterDate, seRResponseLetterDate] = useState("");
  const [dateClosed, setDateClosed] = useState();
  const responseLetterFileInputRef = useRef("");
  const extensionLetterFileInputRef = useRef("");
  const [error, setError] = useState("");

  const handleExtensionLetter = async (event) => {
    const incidentId = localStorage.getItem("grievanceInvestigationId");
    const formData = new FormData();
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const response = await mediaAPI.post(
        `incidents/grievance-investigation/${incidentId}/documents/extension-letter/new/`,
        formData
      );

      if (response.status === 200) {
        setResponseLaterFile(response.data.document);
        console.log(response.data.document);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(
          error.response.message ||
            error.response.error ||
            "Error uploading files"
        );
      } else {
        setError("Unknown error uploading files");
      }
    }
  };

  const handleResponseLetter = async (event) => {
    const incidentId = localStorage.getItem("grievanceInvestigationId");
    const formData = new FormData();
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }

    try {
      const response = await mediaAPI.post(
        `incidents/grievance-investigation/${incidentId}/documents/response-letter/new/`,
        formData
      );

      if (response.status === 200) {
        setResponseLaterFile(response.data.document);
        console.log(response.data.document);
      }
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(
          error.response.message ||
            error.response.error ||
            "Error uploading files"
        );
      } else {
        setError("Unknown error uploading files");
      }
    }
  };

  const handlePartyInvolved = (name, relationship_to_patient) => {
    if (name === "" || relationship_to_patient === "") {
      window.customToast.error(
        "Please enter a valid party name and relationship"
      );
      return;
    }
    const newPartyInvolved = {
      name,
      relationship_to_patient,
    };

    setPartiesInvolved([...partiesInvolved, newPartyInvolved]);
    setNewPartyName("");
    setNewPartyNameRelationship("");
    setPartyInvolved([]);
  };

  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Check if Ctrl or Alt key is pressed
      if (event.key === "Enter") {
        event.preventDefault();
        if (currentStepRef.current < 4) {
          document.getElementById("continue-button").click();
        } else if (currentStepRef.current === 4) {
          document.getElementById("save-button").click();
        } else {
          return;
        }
      }

      if (event.ctrlKey || event.altKey) {
        switch (event.key) {
          case "s": // Ctrl + S
            event.preventDefault(); // Prevent default browser action
            if (currentStepRef.current < 4) {
              document.getElementById("continue-button").click();
            } else if (currentStepRef.current === 4) {
              document.getElementById("save-button").click();
            } else {
              return;
            }
            break;
          case "b":
            event.preventDefault();
            if (currentStepRef.current > 1 && currentStepRef.current <= 4) {
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
  const handleRemovePartyInvolved = (index) => {
    setPartiesInvolved(partiesInvolved.filter((_, i) => i !== index));
  };
  const handleConclusions = (content, editor) => {
    setConclusions(content);
  };

  const handleActionsTaken = (content, editor) => {
    setActionsTaken(content);
  };

  const handleEditorChange = (content, editor) => {
    setContent(content);
  };

  const handleNewIncident = async (data) => {
    setIsLoading(true);
    console.log("Form data: ", data);
    try {
      const response = await api.post(
        `${API_URL}/incidents/grievance/${incidentId}/investigation/new/`,
        data
      );
      if (response.status === 201) {
        console.log(response.data.incident);
        window.customToast.success(
          "Grievance investigation saved successfully"
        );
        localStorage.setItem(
          "grievanceInvestigationId",
          response.data.incident.id
        );
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      if (error.response.data) {
        window.customToast.error(
          error.response.data.message ||
            "Error saving the grievance investigation"
        );
      } else {
        window.customToast.error(
          "There was a error. report the error to admin"
        );
      }
    }
  };
  const handleUpdateIncident = async (data, hasMedia) => {
    const request = hasMedia ? mediaAPI : api;
    setIsLoading(true);
    const incidentId = localStorage.getItem("grievanceInvestigationId");
    try {
      const response = await request.patch(
        `${API_URL}/incidents/grievance-investigation/${incidentId}/update/`,
        data
      );
      if (response.status === 200) {
        window.customToast.success(
          "Grievance investigation updated successfully"
        );
        setCurrentStep(currentStep + 1);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      if (error.response.data) {
        window.customToast.error(
          error.response.data.message ||
            "Error updating the grievance investigation"
        );
      } else {
        window.customToast.error(
          "There was a error. report the error to admin"
        );
      }
    }
  };
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const data = {
        findings: content,
        conducted_by: {
          user_data: conductedBy,
        },
        start_date: startDate,
        end_date: endDate,
        interviews_findings: findingsInterviews,
        medical_record_findings: medicalRecordFindings,
        status: "Draft",
      };
      console.log("incident data: ", data);
      const incidentData = cleanedData(data);
      handleNewIncident(incidentData);
    } else if (currentStep === 2) {
      const data = {
        feedback: feedback,
        review: formData.review,
        action_taken: actionsTaken,
        date_of_feedback: feedback !== "" ? feedbackDate : null,
        conclusion: conclusions,
        parties_involved: partiesInvolved.length > 0 ? partiesInvolved : null,
      };

      handleUpdateIncident(cleanedData(data));
    } else if (currentStep === 3) {
      const incidentId = localStorage.getItem("grievanceInvestigationId");
      const data = {};

      if (extensionLetterDate) {
        data.date_extension_letter_sent = extensionLetterDate;
      }

      if (extensionLetterDate) {
        data.extension_letter_sent = true;
      }

      if (responseLetterDate) {
        data.date_response_letter_sent = responseLetterDate;
      }

      if (dateClosed) {
        data.date_matter_closed = dateClosed;
      }

      handleUpdateIncident(data);
    }
  };

  const handleFeedback = (value) => {
    if (feedback === value) {
      setFeedBack("");
    } else {
      setFeedBack(value);
    }
  };
  const handlePreviousStep = () => {
    currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
  };

  return (
    <div className="forms-container">
      <h2>Grievance Investigation Form</h2>
      {currentStep < 4 ? (
        <div className="form-steps">
          <div className={currentStep === 1 ? "step current-step" : "step"}>
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="name">
              <p className="step-name">Step 1/4</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className={currentStep === 2 ? "step current-step" : "step"}>
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="name">
              <p className="step-name">Step 2/4</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className={currentStep === 3 ? "step current-step" : "step"}>
            <div className="icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="name">
              <p className="step-name">Step 3/4</p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <form className="newIncidentForm">
        {currentStep === 1 ? (
          <div className="step">
            <div className="field">
              <label htmlFor="investigativeFindings">Interviews</label>
              <RichTexField
                value={findingsInterviews}
                onEditorChange={setFindingsInterviews}
              />
            </div>

            <div className="field">
              <label htmlFor="investigativeFindings">
                Medical Record Findings
              </label>
              <RichTexField
                value={medicalRecordFindings}
                onEditorChange={setMedicalRecordFindings}
              />
            </div>
            <div className="field">
              <label htmlFor="investigativeFindings">
                Other Observation/Findings
              </label>
              <RichTexField
                value={content}
                onEditorChange={handleEditorChange}
              />
            </div>
            <label htmlFor="conductedBy">Investigation conducted by :</label>
            <div className="half">
              <div className="field">
                <label htmlFor="conductedByFirstName">First name</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setConductedBy((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  value={conductedBy.first_name}
                  placeholder="First name"
                  id="conductedByFirstName"
                />
              </div>
              <div className="field">
                <label htmlFor="conductedByLastName">Last name</label>
                <input
                  type="text"
                  onChange={(e) =>
                    setConductedBy((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  value={conductedBy.last_name}
                  placeholder="Last name"
                  id="conductedByLastName"
                />
              </div>
            </div>

            <div className="half">
              <div className="field">
                <label htmlFor="">Start date</label>
                <CustomDatePicker
                  selectedDate={startDate}
                  setSelectedDate={setStartDate}
                />
              </div>
              <div className="field">
                <label htmlFor="">End date</label>
                <CustomDatePicker
                  selectedDate={endDate}
                  setSelectedDate={setEndDate}
                />
              </div>
            </div>
          </div>
        ) : currentStep === 2 ? (
          <div className="step">
            <div className="field">
              <label htmlFor="review">Conclusions of Reviews</label>
              <RichTexField
                value={conclusions}
                onEditorChange={handleConclusions}
              />
            </div>
            <div className="field">
              <label htmlFor="actions">Actions Taken</label>
              <RichTexField
                value={actionsTaken}
                onEditorChange={handleActionsTaken}
              />
            </div>
            <div className="half">
              <div className="field">
                <h3>Feedback to Patient and Family</h3>
                <div className="check-boxes">
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="meeting"
                      id="meeting"
                      onChange={() => handleFeedback("Meeting")}
                      checked={feedback === "Meeting"}
                    />
                    <label htmlFor="meeting">Meeting</label>
                  </div>
                  <div className="check-box">
                    <input
                      type="checkbox"
                      name="telephone"
                      id="telephone"
                      onChange={() => handleFeedback("Telephone")}
                      checked={feedback === "Telephone"}
                    />
                    <label htmlFor="telephone">Telephone conversation</label>
                  </div>
                </div>
              </div>
            </div>
            {feedback !== "" && (
              <>
                <div className="field">
                  <label htmlFor="feedbackDate">Date of feedback</label>
                  <CustomDatePicker
                    selectedDate={feedbackDate}
                    setSelectedDate={setFeedbackDate}
                  />
                </div>
                <h3>Parties Involved</h3>
                <PartiesInvolved
                  data={partiesInvolved}
                  handleRemovePartyInvolved={handleRemovePartyInvolved}
                />
                <div className="half">
                  <div className="field">
                    <label htmlFor="personAtMeeting">
                      Person at Meeting/Call
                    </label>
                    <input
                      onChange={(e) => setNewPartyName(e.target.value)}
                      value={newPartyName}
                      type="text"
                      name="personAtMeeting"
                      id="personAtMeeting"
                      placeholder="Enter witness name"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="relationship">
                      Relationship To Patient
                    </label>
                    <input
                      onChange={(e) =>
                        setNewPartyNameRelationship(e.target.value)
                      }
                      value={newPartyRelationship}
                      type="text"
                      name="relationship"
                      id="relationship"
                      placeholder="Enter Relationship"
                    />
                  </div>
                </div>

                <button
                  onClick={() =>
                    handlePartyInvolved(newPartyName, newPartyRelationship)
                  }
                  type="button"
                >
                  Add new party
                </button>
              </>
            )}
          </div>
        ) : currentStep === 3 ? (
          <div className="step">
            <div className="field">
              <label htmlFor="extensionLetterDate">
                Date extension letter sent to patient and/or family
              </label>
              <CustomDatePicker
                selectedDate={extensionLetterDate}
                setSelectedDate={setExtensionLetterDate}
              />
            </div>

            <div className="field">
              <label htmlFor="extensionLetterCopy">
                Attach copy of letter and certified receipt received
              </label>
              <input
                id="extensionLetterFileInput"
                type="file"
                onChange={handleResponseLetter}
              />
            </div>

            <div className="field">
              <label htmlFor="responseLetterDate">
                Date written response letter sent to patient and/or family
              </label>
              <CustomDatePicker
                selectedDate={responseLetterDate}
                setSelectedDate={seRResponseLetterDate}
              />
            </div>

            <div className="field">
              <label htmlFor="responseLetterCopy">
                Attach copy and certified receipt received
              </label>

              <input
                id="responseLetterFileInput"
                type="file"
                onChange={handleExtensionLetter}
              />
            </div>

            <div className="field">
              <label htmlFor="dateClosed">Date when matter closed:</label>
              <CustomDatePicker
                selectedDate={dateClosed}
                setSelectedDate={setDateClosed}
              />
            </div>
          </div>
        ) : currentStep === 4 ? (
          <FormCompleteMessage />
        ) : (
          ""
        )}
      </form>

      <div className="form-buttons buttons">
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

        {currentStep < 3 ? (
          <button
            onClick={handleNextStep}
            id="continue-button"
            className="primary-button"
          >
            <span>{isLoading ? "Processing..." : "Save & Continue"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : currentStep === 3 ? (
          <button
            onClick={handleNextStep}
            id="save-button"
            className="primary-button"
          >
            <span>{isLoading ? "Processing..." : "Save"}</span>
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default GrievanceInvestigationForm;