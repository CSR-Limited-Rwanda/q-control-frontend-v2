'use client'
import '@/styles/sendForReview.scss';
import api from '@/utils/api';
import React, { useState, useRef } from 'react'
import { ArrowLeft, ArrowRight, CheckSquare, CheckSquare2, Square, X } from 'lucide-react';
import Button from '@/components/forms/Button';
import { ReviewTemplates } from './ReviewTemplates';
import UsersList from './UsersList';

const SendForReview = ({ path, incidentID, handleClose }) => {
    // template related fields
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // user related fields
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [requireApprovalEachMember, setRequireApprovalEachMember] = useState(false);
    const [taskDays, setTaskDays] = useState(0);
    const [comment, setComment] = useState("");

    // common states
    const [error, setError] = useState(null);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const popupContentRef = useRef(null);

    const handlePopupClick = (e) => {
        if (popupContentRef.current && !popupContentRef.current.contains(e.target)) {
            handleClose();
        }
    };

    const sendForReviewUsingTemplate = async () => {
        const payload = {
            action: "send-for-review",
            review_template: selectedTemplate.id,
            description: comment,
        }
        await sendForReview(path, incidentID, payload);
    }

    const sendForReviewUsingUsers = async () => {
        const payload = {
            action: "send-for-review",
            assignees: selectedUsers.map(user => user.id),
            description: comment,
            require_approval_for_all_groups: requireApprovalEachMember,
            task_days: taskDays,
        }
        await sendForReview(path, incidentID, payload);
    }

    const handleBackButton = () => {
        if (currentStep > 1) {
            setCurrentStep(prevStep => prevStep - 1);
        }

        // Reset selections when going back to step 1
        if (currentStep === 2) {
            setSelectedChoice(null);
            setSelectedTemplate(null);
            setSelectedUsers([]);
        }

        // Clear error when going back
        setError(null);
    }

    const handleSendForReview = () => {
        if (!selectedChoice) {
            setError("Please select a choice to send for review.");
            return;
        }
        if (selectedChoice === 'template') {
            if (currentStep === 2 && !selectedTemplate) {
                setError("Please select a template first.");
                return;
            }
            if (currentStep === 2 && selectedTemplate) {
                setCurrentStep(3); // Go to confirmation step
                return;
            }
            if (currentStep === 3) {
                sendForReviewUsingTemplate();
                return;
            }
        }

        if (selectedChoice === 'users') {
            if (currentStep === 2 && selectedUsers.length === 0) {
                setError("Please select at least one user.");
                return;
            }
            if (currentStep === 2 && selectedUsers.length > 0) {
                setCurrentStep(3); // Go to fields step
                return;
            }
            if (currentStep === 3) {
                setCurrentStep(4); // Go to confirmation step
                return;
            }
            if (currentStep === 4) {
                sendForReviewUsingUsers();
                return;
            }
        }

        setCurrentStep(prevStep => prevStep + 1);
    }

    const sendForReview = async (path, incidentID, payload) => {
        if (!path) {
            setError("Path is required to send for review.");
            return;
        }

        try {
            setIsSending(true);
            setError(null);
            const response = await api.patch(`/incidents/${path}/${incidentID}/`, payload);
            if (response.status === 200) {
                setShowSuccessMessage(true);
                setError(null);
            } else {
                setError("Failed to send incident for review.");
            }
        } catch (error) {
            let errorMessage = "An error occurred while sending for review.";
            if (error.response && error.response.data) {
                errorMessage = error.response.data.error || errorMessage;
            }
            setError(errorMessage);
        } finally {
            setIsSending(false);
        }
    }

    return (
        <div className='popup' onClick={handlePopupClick}>
            {
                showSuccessMessage ?
                    <div className="popup-content" ref={popupContentRef}>
                        <h2>Success</h2>
                        <p>The incident has been successfully sent for review.</p>
                        <button onClick={() => setShowSuccessMessage(false)}>Back to incident details</button>
                    </div> :
                    <div className="popup-content" ref={popupContentRef}>
                        <h2>Send Incident for Review {currentStep}</h2>
                        <p>Are you sure you want to send this incident for review?</p>

                        {
                            selectedChoice === 'template' && currentStep === 2 ? (
                                <ReviewTemplates setCurrentStep={setCurrentStep} selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
                            ) : selectedChoice === 'template' && currentStep === 3 ? (
                                <div className="template-confirmation">
                                    <h3>Confirm Review Template</h3>
                                    <p>Selected Template: <strong>{selectedTemplate?.name}</strong></p>
                                    <p>This incident will be sent for review using the selected template.</p>
                                </div>
                            ) : selectedChoice === 'users' && currentStep === 2 ? (
                                <div className="user-selection">
                                    <h3>Select Users</h3>
                                    <UsersList
                                        users={users}
                                        selectedUsers={selectedUsers}
                                        setUsers={setUsers}
                                        setSelectedUsers={setSelectedUsers}
                                        requireApprovalEachMember={requireApprovalEachMember}
                                        setRequireApprovalEachMember={setRequireApprovalEachMember}
                                        taskDays={taskDays}
                                        setTaskDays={setTaskDays}
                                        comment={comment}
                                        setComment={setComment}
                                        handleSendForReview={handleSendForReview}
                                        error={error}
                                        setError={setError}
                                        currentStep={currentStep}
                                        setCurrentStep={setCurrentStep}
                                    />
                                </div>
                            ) : selectedChoice === 'users' && currentStep === 3 ? (
                                <div className="user-fields">
                                    <h3>Review Settings</h3>
                                    <div className="radio-buttons">
                                    </div>
                                    <div className="radio-buttons">
                                        <div className="radio" onClick={() => setRequireApprovalEachMember(true)}>
                                            {
                                                requireApprovalEachMember ? <CheckSquare2 /> : <Square />
                                            }
                                            <span>Require approval from each member</span>
                                        </div>
                                        <div className="radio" onClick={() => setRequireApprovalEachMember(false)}>
                                            {
                                                !requireApprovalEachMember ? <CheckSquare2 /> : <Square />
                                            }
                                            <span>Require approval from any member</span>
                                        </div>

                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="taskDays">Task Days:</label>
                                        <input
                                            type="number"
                                            id="taskDays"
                                            value={taskDays}
                                            onChange={(e) => setTaskDays(e.target.value)}
                                            min="0"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="comment">Comment:</label>
                                        <textarea
                                            id="comment"
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows="4"
                                            placeholder="Add any additional comments..."
                                        />
                                    </div>
                                </div>
                            ) : selectedChoice === 'users' && currentStep === 4 ? (
                                <div className="users-confirmation">
                                    <h3>Confirm Review Assignment</h3>
                                    <p><strong>Selected Users:</strong> {selectedUsers.map(user => `${user?.user?.first_name} ${user?.user?.last_name}`).join(', ')}</p>
                                    <p><strong>Task Days:</strong> {taskDays}</p>
                                    <p><strong>Require All Approvals:</strong> {requireApprovalEachMember ? 'Yes' : 'No'}</p>
                                    {comment && <p><strong>Comment:</strong> {comment}</p>}
                                </div>
                            ) :
                                <div className="send-choices">
                                    <div className="choice" onClick={() => { setSelectedChoice('template'); setCurrentStep(2); }}>
                                        <span>Use review template</span>
                                    </div>
                                    <div className="choice" onClick={() => { setSelectedChoice('users'); setCurrentStep(2); }}>
                                        <span>Send to specific users</span>
                                    </div>
                                </div>
                        }
                        {error && <p className="error message">{error}</p>}
                        <div className="buttons">
                            <button className='gray' onClick={currentStep < 2 ? handleClose : handleBackButton}>
                                {
                                    currentStep < 2 ? 'Cancel' : <><ArrowLeft /> Back</>
                                }
                            </button>
                            <Button
                                onClick={handleSendForReview}
                                text={
                                    (selectedChoice === 'template' && currentStep === 3) ||
                                        (selectedChoice === 'users' && currentStep === 4)
                                        ? 'Send for Review'
                                        : 'Continue'
                                }
                                isLoading={isSending}
                                hasIcon={true}
                                icon={<ArrowRight />}
                            />
                        </div>
                    </div>
            }
        </div>
    )
}

export default SendForReview
