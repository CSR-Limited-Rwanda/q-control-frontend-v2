import React from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';

const Step7Completion = ({
    formData,
    onStartNew,
    onViewDashboard,
    isSubmitting = false
}) => {
    const getIncidentId = () => {
        return formData.id || 'N/A';
    };

    const getIncidentType = () => {
        if (!formData.incident_type) return 'N/A';

        const typeMap = {
            fall: 'Fall',
            treatment: 'Treatment',
            equipment: 'Equipment',
            other: 'Other'
        };

        return typeMap[formData.incident_type] || formData.incident_type;
    };

    const getPatientInfo = () => {
        if (formData.patient_visitor?.type === 'patient') {
            return `Patient: ${formData.patient_visitor?.name || 'N/A'}`;
        } else if (formData.patient_visitor?.type === 'visitor') {
            return `Visitor: ${formData.patient_visitor?.name || 'N/A'}`;
        }
        return 'N/A';
    };

    const getIncidentDate = () => {
        if (formData.incident_date && formData.incident_time) {
            return `${formData.incident_date} at ${formData.incident_time}`;
        }
        return 'N/A';
    };

    return (
        <div className="completion-container">
            <div className="success-message">
                <div className="success-icon">
                    <svg width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>

                <h2>Incident Report Submitted Successfully!</h2>
                <p>Your incident report has been submitted and will be reviewed by the appropriate personnel.</p>
            </div>

            <div className="incident-summary">
                <h3>Incident Summary</h3>
                <div className="summary-details">
                    <div className="detail-row">
                        <strong>Incident ID:</strong>
                        <span>{getIncidentId()}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Type:</strong>
                        <span>{getIncidentType()}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Patient/Visitor:</strong>
                        <span>{getPatientInfo()}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Date & Time:</strong>
                        <span>{getIncidentDate()}</span>
                    </div>
                    <div className="detail-row">
                        <strong>Location:</strong>
                        <span>{formData.location || 'N/A'}</span>
                    </div>
                </div>
            </div>

            <div className="next-steps">
                <h4>What happens next?</h4>
                <ul>
                    <li>Your incident report has been logged in the system</li>
                    <li>The appropriate department will be notified</li>
                    <li>You will receive updates on the incident status</li>
                    <li>A follow-up may be required based on the incident severity</li>
                </ul>
            </div>

            <div className="action-buttons">
                <SecondaryButton
                    type="button"
                    onClick={onStartNew}
                    disabled={isSubmitting}
                >
                    Submit Another Report
                </SecondaryButton>

                <PrimaryButton
                    type="button"
                    onClick={onViewDashboard}
                    disabled={isSubmitting}
                >
                    Return to Dashboard
                </PrimaryButton>
            </div>
        </div>
    );
};

export default Step7Completion;
