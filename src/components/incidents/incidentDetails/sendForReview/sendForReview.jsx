'use client'
import '@/styles/sendForReview.scss';
import { fetchReviewTemplates, fetchReviewTemplateTasks } from '@/hooks/fetchReviewTemplates';
import api from '@/utils/api';
import React, { useEffect, useState } from 'react'
import { ArrowRight, CheckSquare, CheckSquare2, Square } from 'lucide-react';
import Button from '@/components/forms/Button';
import { ReviewTemplates } from './ReviewTemplates';
import UsersList from './usersList';

const SendForReview = ({ path, incidentID }) => {
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


    const handleSendForReview = () => {
        if (!selectedChoice) {
            setError("Please select a choice to send for review.");
            return;
        }
        if (selectedChoice === 'template' && selectedTemplate) {
            sendForReviewUsingTemplate();
        } else if (selectedChoice === 'users' && selectedUsers.length > 0) {
            sendForReviewUsingUsers();
        }
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
        <div className='popup'>
            {
                showSuccessMessage ?
                    <div className="popup-content">
                        <h2>Success</h2>
                        <p>The incident has been successfully sent for review.</p>
                        <button onClick={() => setShowSuccessMessage(false)}>Back to incident details</button>
                    </div> :
                    <div className="popup-content">
                        <h2>Send Incident for Review</h2>
                        <p>Are you sure you want to send this incident for review?</p>

                        {
                            selectedChoice === 'template' ? (
                                <ReviewTemplates selectedTemplate={selectedTemplate} setSelectedTemplate={setSelectedTemplate} />
                            ) : selectedChoice === 'users' ? (
                                <div className="user-selection">
                                    <h3>Select Users</h3>
                                    <UsersList />
                                </div>
                            ) :
                                <div className="send-choices">
                                    <div className="choice" onClick={() => setSelectedChoice('template')}>
                                        <span>Use review template</span>
                                    </div>
                                    <div className="choice" onClick={() => setSelectedChoice('users')}>
                                        <span>Send to specific users</span>
                                    </div>
                                </div>
                        }
                        {error && <p className="error message">{error}</p>}
                        <div className="buttons">
                            <button onClick={() => setSelectedChoice(null)}>Back</button>
                            <Button onClick={handleSendForReview} text={'Send for Review'} isLoading={isSending} />
                        </div>
                    </div>
            }
        </div>
    )
}

export default SendForReview
