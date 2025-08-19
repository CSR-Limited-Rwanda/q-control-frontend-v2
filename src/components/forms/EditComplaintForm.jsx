import { useEffect, useState } from "react";
import api, { cleanedData } from "@/utils/api";

import CustomDatePicker from "../CustomDatePicker";
import { howComplaintIsReceived } from "@/constants/constants";
import RichTexField from "./RichTextField";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  LoaderCircle,
  Save,
  Square,
  SquareCheck,
  X,
} from "lucide-react";
import CloseIcon from "../CloseIcon";

const EditComplaintForm = ({ complaint, handleSubmitComplaint }) => {
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [fetchingStaff, setFetchingStaff] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dateOfComplaint, setDateOfComplaint] = useState(
    complaint.date_of_complaint || ""
  );
  const [patientName, setPatientName] = useState(complaint.patient_name || "");
  const [medicalRecordNumber, setMedicalRecordNumber] = useState(
    complaint.medical_record_number || ""
  );
  const [natureOfComplaint, setNatureOfComplaint] = useState(
    complaint.complaint_nature || ""
  );
  const [department, setDepartment] = useState("");
  const [complaintType, setComplaintType] = useState(
    complaint.complaint_type || ""
  );
  const [phoneNumber, setPhoneNumber] = useState(complaint.phone_number || "");
  const [resolvedByStaff, setResolvedByStaff] = useState(
    complaint.resolved_by_staff || false
  );
  const [howComplaintWasReceived, setHowComplaintWasReceived] = useState(
    complaint.how_complaint_was_taken || ""
  );
  const [assignedToStaff, setAssignedToStaff] = useState("");
  const [assignedStaffList, setAssignedStaffList] = useState([]);
  const [complaintDetails, setComplaintDetails] = useState(complaint.details);
  const [staffList, setStaffList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleResolvedStaff = () => {
    setResolvedByStaff(!resolvedByStaff);
  };

  const handleSuggestions = (value) => {
    setAssignedToStaff(value);
    setSuggestions(
      staffList.filter((staff) =>
        staff.first_name?.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleAssignedStaffList = (staff) => {
    if (!assignedStaffList.includes(staff)) {
      setAssignedStaffList((prevList) => [...prevList, staff]);
    } else {
      setAssignedStaffList((prevList) =>
        prevList.filter((prevStaff) => prevStaff !== staff)
      );
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError("");
    toast.success("");
    const complaintData = {
      date_of_complaint: dateOfComplaint,
      patient_name: patientName,
      medical_record_number: medicalRecordNumber,
      complaint_nature: natureOfComplaint,
      department: department,
      phone_number: phoneNumber,
      complaint_type: complaintType,
      resolved_by_staff: resolvedByStaff,
      how_complaint_was_taken: howComplaintWasReceived,
      assigned_to: assignedStaffList,
      details: complaintDetails,
    };
    try {
      const response = await api.put(
        `complaints/${complaint.id}/`,
        cleanedData(complaintData)
      );
      if (response.status === 200) {
        toast.success("Complaint submitted successfully");
        setIsLoading(false);
        setTimeout(() => {
          handleSubmitComplaint();
        }, 3000);
        window.location.reload();
      }
    } catch (error) {
      if (error.response) {
        setError(
          error.response.data.message ||
          error.response.data.error ||
          "Error while submitting the complaint"
        );
      } else {
        setError("Unknown error while submitting the complaint");
      }
      console.error(error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    // get a list of users
    const fetchStaff = async () => {
      try {
        const response = await api.get("users/?page_size=5");
        setStaffList(response.data);

        setFetchingStaff(false);
      } catch (error) {
        if (error.response) {
          setUserError(
            error.response.data.message ||
            error.response.data.error ||
            "We could no get a list of users"
          );
        }
        console.error(error);
        setFetchingStaff(false);
      }
    };
    fetchStaff();
  }, []);
  return (
    <div className="user-complain-form">
      <div className="form">
        <h3>Edit your complaint</h3>
        <CloseIcon onClick={handleSubmitComplaint} />

        <form action="">
          <div className="field">
            <label htmlFor="">Patient's name</label>
            <input
              type="text"
              id="patientName"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              required
              placeholder="Enter patient's"
            />
          </div>
          <div className="half">
            <div className="field">
              <label htmlFor="">Date of complaint</label>
              <CustomDatePicker
                selectedDate={dateOfComplaint}
                setSelectedDate={setDateOfComplaint}
              />
            </div>
            <div className="field">
              <label htmlFor="">Medical record number (if any)</label>
              <input
                type="text"
                id="medicalRecordNumber"
                value={medicalRecordNumber}
                onChange={(e) => setMedicalRecordNumber(e.target.value)}
                required
                placeholder="Enter medical record number"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="">Nature of complaint</label>
            <input
              type="text"
              id="natureOfComplaint"
              value={natureOfComplaint}
              onChange={(e) => setNatureOfComplaint(e.target.value)}
              required
            />
          </div>
          {/* <div className="field">
                        <label htmlFor="">Department</label>
                        <input type="text" id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                    </div> */}
          <div className="field">
            <label htmlFor="">Complaint type</label>
            <input
              type="text"
              id="complaintType"
              value={complaintType}
              onChange={(e) => setComplaintType(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="">Phone number</label>
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <div onClick={handleResolvedStaff} className="check-box">
              {resolvedByStaff ? <SquareCheck /> : <Square />}
              <p>Resolved by staff</p>
            </div>
          </div>
          <div className="field">
            <label htmlFor="">How complaint was received</label>
            <div className="check-boxes">
              {howComplaintIsReceived.map((howComplaintIsReceived, index) => (
                <div
                  key={index}
                  onClick={(e) =>
                    setHowComplaintWasReceived(howComplaintIsReceived)
                  }
                  className="check-box"
                >
                  {howComplaintWasReceived === howComplaintIsReceived ? (
                    <SquareCheck />
                  ) : (
                    <Square />
                  )}
                  <p>{howComplaintIsReceived}</p>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="field">
                        <label htmlFor="">Assigned to staff</label>
                        {
                            assignedStaffList && assignedStaffList.length > 0
                                ? <div className="assigned-staff-list">
                                    {
                                        assignedStaffList.map((staff, index) => (
                                            <div className="staff">
                                                <p>{staff.first_name}</p>
                                                <Cancel01Icon onClick={() => handleAssignedStaffList(staff)} size={18} />
                                            </div>

                                        ))
                                    }
                                </div>

                                : 'No staff assigned'
                        }
                        <input type="text" id="assignedToStaff" value={assignedToStaff} onChange={(e) => handleSuggestions(e.target.value)} required />
                        {
                            fetchingStaff ? 'Loading staf...'
                                : staffList?.length > 0 ? <div className="suggestions">
                                    {
                                        suggestions && suggestions.map((staff, index) => (
                                            <div onClick={() => handleAssignedStaffList(staff)} className="staff">

                                                <span>{staff.first_name}</span>

                                            </div>
                                        ))
                                    }
                                </div> : ''
                        }
                        <button onClick={handleAssignedStaffList}>Assign</button>
                    </div> */}
          <div className="field">
            <label htmlFor="">Complaint details</label>
            <RichTexField
              staffList={staffList}
              value={complaintDetails}
              onEditorChange={setComplaintDetails}
            />
          </div>
        </form>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <div className="buttons">
          <button onClick={handleSubmitComplaint} className="tertiary-button">
            <ArrowLeft size={16} />
            Back
          </button>
          <button
            onClick={handleSubmit}
            className="primary-button"
            type="button"
          >
            {isLoading ? (
              <LoaderCircle size={18} className="loading-icon" />
            ) : (
              <>
                <Save size={18} />
                Update complaint
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditComplaintForm;
