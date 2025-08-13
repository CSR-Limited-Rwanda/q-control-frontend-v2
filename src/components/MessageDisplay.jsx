import React from 'react';

const MessageDisplay = ({ errorMessage, successMessage, onClearError, onClearSuccess }) => {
    const handleClearError = () => {
        if (onClearError) {
            onClearError();
        }
    };

    const handleClearSuccess = () => {
        if (onClearSuccess) {
            onClearSuccess();
        }
    };

    if (!errorMessage && !successMessage) {
        return null;
    }

    return (
        <div className="message-container">
            {errorMessage && (
                <div className="error-message" onClick={handleClearError}>
                    {errorMessage}
                </div>
            )}
            {successMessage && (
                <div className="success-message" onClick={handleClearSuccess}>
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default MessageDisplay;
