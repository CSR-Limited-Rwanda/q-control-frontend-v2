import React from 'react';
import PrimaryButton from '@/components/PrimaryButton';
import { CheckCheckIcon, CheckCircle2Icon } from 'lucide-react';

const Step7Completion = ({
    formData,
    isSubmitting = false
}) => {
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="completion-container">
            <div className="success-icon">
                <CheckCircle2Icon />
            </div>
            <h2>Incident Report Submitted Successfully!</h2>
            <p>Your incident report has been submitted and will be reviewed by the appropriate personnel.</p>

            <div className="action-buttons">
                <button
                    type="button"
                    onClick={handleRefresh}
                    disabled={isSubmitting}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default Step7Completion;
