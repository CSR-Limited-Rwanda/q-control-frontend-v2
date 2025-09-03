"use client";

import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import api from "@/utils/api";
import { X, CircleCheck, LoaderCircle, Square } from "lucide-react";
import CustomDatePicker from "../CustomDatePicker";
import { howComplaintIsReceived } from "@/constants/constants";
import RichTexField from "./RichTextField";
import CloseIcon from "../CloseIcon";

const SubmitComplaintForm = ({ handleSubmitComplaint, hasHeight }) => {
  const [error, setError] = useState("");
  const [userError, setUserError] = useState("");
  const [fetchingStaff, setFetchingStaff] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [dateOfComplaint, setDateOfComplaint] = useState("");
  const [patientName, setPatientName] = useState("");
  const [medicalRecordNumber, setMedicalRecordNumber] = useState("");
  const [natureOfComplaint, setNatureOfComplaint] = useState("");
  const [department, setDepartment] = useState("");
  const [complaintType, setComplaintType] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resolvedByStaff, setResolvedByStaff] = useState(false);
  const [howComplaintWasReceived, setHowComplaintWasReceived] = useState("");
  const [assignedToStaff, setAssignedToStaff] = useState("");
  const [assignedStaffList, setAssignedStaffList] = useState([]);
  const [complaintDetails, setComplaintDetails] = useState("");
  const [staffList, setStaffList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [facilityId, setFacilityId] = useState(
    localStorage.getItem("facilityId")
  );

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
    // Resolved by staff
    //For concerns expressed by a patient or patient representative that were not resolved by staff present, the concern should be considered a Grievance. Please notify the House Supervisor, Charge Nurse or the Administrator on Call (AOC)
    //Who resolved the complaint?
    setIsLoading(true);
    const complaintData = {
      facility: parseInt(facilityId),
      date_of_complaint: dateOfComplaint,
      patient_name: patientName,
      medical_record_number: medicalRecordNumber,
      complaint_nature: natureOfComplaint,
      phone_number: phoneNumber,
      complaint_type: complaintType,
      resolved_by_staff: resolvedByStaff,
      how_complaint_was_taken: howComplaintWasReceived,
      assigned_to: assignedStaffList,
      details: complaintDetails,
    };
    try {
      const response = await api.post("complaints/", complaintData);
      if (response.status === 201) {
        toast.success("Complaint submitted successfully");
        setIsLoading(false);
        setTimeout(() => {
          handleSubmitComplaint();
        }, 3000);
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
    <div className="form" id="complaint-form">
      <div className="complaint-form-header">
        <h3>Submit a new complaint</h3>

        <CloseIcon onClick={handleSubmitComplaint} />
      </div>
      <form action="" className="newIncidentForm">
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
            {resolvedByStaff ? <CircleCheck /> : <Square />}
            <p>Resolved by staff</p>
          </div>
          {!resolvedByStaff && (
            <div className="warning-message">
              <small>
                For concerns expressed by a patient or patient representative
                that were not resolved by staff present, the concern should be
                considered a Grievance. Please notify the House Supervisor,
                Charge Nurse or the Administrator on Call (AOC)
              </small>
            </div>
          )}
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
                  <CircleCheck />
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
                                                <X onClick={() => handleAssignedStaffList(staff)} size={18} />
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

      {resolvedByStaff && (
        <button onClick={handleSubmit} className="primary-button" type="button">
          {isLoading ? (
            <LoaderCircle size={18} className="loading-icon" />
          ) : (
            "Submit complaint"
          )}
        </button>
      )}
    </div>
  );
};

export default SubmitComplaintForm;
