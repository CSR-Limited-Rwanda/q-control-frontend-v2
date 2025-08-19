import React from 'react'

const Step7Success = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError }) => {
    return (
        <div className="step-container">
            <h3>Step 7: Success</h3>
            <p>✅ Incident report submitted successfully!</p>
            <p>Thank you for reporting this incident.</p>
        </div>
    )
}

export default Step7Success