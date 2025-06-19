import { ChevronLeft, Check } from 'lucide-react';

const FormCompleteMessage = ({ title, message }) => {
    const handlePageRefresh = () => {
        window.location.reload();
    };
    return (
        <div className="form-complete-message">
            <div className="message-container">
                <div className="icon">
                    <Check size={42} />
                </div>
                <h3 className="title">{title || "Form submission complete"}</h3>
                <p className="message">
                    {message ||
                        "All data has been saved, and people in charge have been notified"}
                </p>
            </div>
            <button onClick={handlePageRefresh} className="primary-button">
                <ChevronLeft />
                <span>Close</span>
            </button>
        </div>
    );
};

export default FormCompleteMessage;