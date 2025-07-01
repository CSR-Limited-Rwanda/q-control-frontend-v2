'use client'
import { useState } from "react";
import SubmitComplaintForm from "./SubmitComplaintForm";
import { GripVertical } from 'lucide-react';

const FormChoicesPopup = ({ togglePopup, setSelectedForm }) => {
    const [showComplaintForm, setShowComplaintForm] = useState();
    const handleClick = (value) => {
        togglePopup();
        setSelectedForm(value);
    };

    const handleShowComplaintForm = () => {
        setShowComplaintForm(!showComplaintForm);
    };
    return (
        <>
            {showComplaintForm ? <SubmitComplaintForm /> : ""}
            <div id="FormChoicesPopup">
                <div className="content choices">
                    <div onClick={() => handleClick("general")} className="choice">
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">
                            <p>General Patient/Visitor Incident</p>
                        </div>
                    </div>

                    <div onClick={() => handleClick("employee")} className="choice">
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">Staff Incident</div>
                    </div>

                    <div onClick={() => handleClick("lostAndFound")} className="choice">
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">Lost and Found Property Report</div>
                    </div>

                    <div
                        onClick={() => handleClick("medicationError")}
                        className="choice"
                    >
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">Medication Error/Near Miss Report</div>
                    </div>

                    <div onClick={() => handleClick("grievance")} className="choice">
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">Patient/Visitor Grievance</div>
                    </div>

                    <div onClick={() => handleClick("reactionReport")} className="choice">
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">Anaphylaxis/Adverse Drug Reaction Report</div>
                    </div>

                    <div
                        onClick={() => handleClick("workPlaceViolence")}
                        className="choice"
                    >
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">Workplace Violence Incident</div>
                    </div>
                    <div onClick={() => handleClick("complaintForm")} className="choice">
                        <div className="icon">
                            <GripVertical />
                        </div>
                        <div className="text">Submit a complaint</div>
                    </div>
                    {/* <div onClick={() => handleClick("verbalComplaint")} className="choice">
          <div className="icon">
            <i className="fa-solid fa-ellipsis-vertical"></i>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </div>
          <div className="text">Patient/Visitor Verbal Complaint</div>
        </div> */}
                    {/* <div
          onClick={() => handleClick("grievanceInvestigation")}
          className="choice"
        >
          <div className="icon">
            <i className="fa-solid fa-ellipsis-vertical"></i>
            <i className="fa-solid fa-ellipsis-vertical"></i>
          </div>
          <div className="text">Grievance Investigation </div>
        </div> */}
                </div>
            </div>
        </>
    );
};

export default FormChoicesPopup;