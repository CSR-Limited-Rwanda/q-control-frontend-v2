import { useState, useEffect } from "react";
import api from "@/utils/api";
import { ArrowLeft, LoaderCircle, Send, X } from "lucide-react";
import CloseIcon from "../CloseIcon";

const SendComplaintToDepartment = ({ complaint, onClose }) => {
  const [step, setStep] = useState(1);
  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [comment, setComment] = useState("");
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch facilities on component mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        const response = await api.get("/facilities/");
        setFacilities(response.data);
      } catch (error) {
        setError("Failed to fetch facilities");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFacilities();
  }, []);

  // Fetch departments when facility is selected
  useEffect(() => {
    if (selectedFacility) {
      const fetchDepartments = async () => {
        try {
          setIsLoading(true);
          const response = await api.get(
            `/departments/?facility_id=${selectedFacility}`
          );
          setDepartments(response.data.results);
        } catch (error) {
          setError("Failed to fetch departments");
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchDepartments();
    }
  }, [selectedFacility]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async () => {
    if (!selectedDepartment || !comment) {
      setError("Please select a department and add a comment");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Upload files if any exist
      let fileUrls = [];
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });
        const uploadResponse = await api.post("/documents/", formData);
        // Assuming the API returns an array of URLs or a single URL

        console.log("Upload response data: ", uploadResponse);
        fileUrls = Array.isArray(uploadResponse.data.files)
          ? uploadResponse.data.files.map((item) => item.url)
          : [uploadResponse.data.files.url];
      }

      // Send the complaint to the department
      const complaintData = {
        action: "send_to_department",
        details: comment,
        files: fileUrls,
        department_id: selectedDepartment,
      };

      console.log(complaintData);

      const response = await api.patch(
        `complaints/${complaint.id}/`,
        complaintData
      );

      if (response.status === 200) {
        setSuccessMessage("Complaint sent successfully");

        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send complaint");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="complaint-modal popup">
      <div className="modal-content popup-content">
        <CloseIcon onClick={onClose} />
        <h2 className="modal-title">
          {step === 1 ? "Select Facility and Department" : "Add Details"}
        </h2>

        {step === 1 && (
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Select Facility</label>
              <select
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
                className="form-select"
              >
                <option value="">Select a facility</option>
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedFacility && (
              <div className="form-group">
                <label className="form-label">Select Department</label>
                <div className="department-list">
                  {departments.map((dept) => (
                    <div
                      key={dept.id}
                      onClick={() => setSelectedDepartment(dept.id)}
                      className={`department-item ${
                        selectedDepartment === dept.id ? "selected" : ""
                      }`}
                    >
                      {dept.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Enter your comment here"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Attach Files</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="form-input"
                multiple
              />
            </div>
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        <div className="button-group">
          {step === 1 ? (
            <button onClick={onClose} className="cancel-button">
              <ArrowLeft size={16} className="button-icon" />
              Cancel
            </button>
          ) : (
            <button onClick={() => setStep(1)} className="cancel-button">
              <ArrowLeft size={16} className="button-icon" />
              Back
            </button>
          )}
          <button
            onClick={step === 1 ? () => setStep(2) : handleSubmit}
            disabled={step === 1 ? !selectedDepartment : isLoading}
            className={`submit-button ${
              isLoading || (step === 1 && !selectedDepartment) ? "disabled" : ""
            }`}
          >
            {isLoading ? (
              <LoaderCircle size={18} className="loading-icon" />
            ) : step === 1 ? (
              "Next"
            ) : (
              <>
                <Send size={18} className="button-icon" />
                Send Complaint
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendComplaintToDepartment;
