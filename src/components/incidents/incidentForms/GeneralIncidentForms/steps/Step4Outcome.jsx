'use client'
import React from 'react'

const Step4Outcome = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError }) => {
    // General outcome options
    const generalOutcomeOptions = [
        { label: "No injury", value: "No injury" },
        { label: "Minor injury", value: "Minor injury" },
        { label: "Moderate injury", value: "Moderate injury" },
        { label: "Serious injury", value: "Serious injury" },
        { label: "Death", value: "Death" },
        { label: "Near miss", value: "Near miss" },
        { label: "Property damage", value: "Property damage" },
        { label: "Other", value: "Other" }
    ]

    // Handle outcome selection
    const handleOutcomeSelection = (selectedValue) => {
        handleChange({ target: { name: 'outcome', value: selectedValue } })

        // Clear other outcome when different option is selected
        if (selectedValue !== 'Other') {
            handleChange({ target: { name: 'reason_for_escalation', value: '' } })
        }
    }

    return (
        <div className="form-container">
            {/* Form Header */}
            <div className="form-header">
                <h2>Step 4: Outcome</h2>
                <div className="progress-info">
                    <span className="step-indicator">Step 4 of 7</span>
                </div>
            </div>

            {/* Outcome Selection */}
            <div className="field-group">
                <label>Incident Outcome <span className="required">*</span></label>
                <div className="radio-group">
                    {generalOutcomeOptions.map((outcome, index) => (
                        <div
                            key={index}
                            className={`radio-item ${formData.outcome === outcome.value ? 'selected' : ''}`}
                            onClick={() => handleOutcomeSelection(outcome.value)}
                        >
                            <div className="radio-icon">●</div>
                            <span className="radio-label">{outcome.label}</span>
                            <input
                                type="radio"
                                name="outcome"
                                value={outcome.value}
                                checked={formData.outcome === outcome.value}
                                onChange={() => handleOutcomeSelection(outcome.value)}
                            />
                        </div>
                    ))}
                </div>
                {isFieldInvalid('outcome') && (
                    <div className="error-message">
                        <span>{getFieldError('outcome')}</span>
                    </div>
                )}
            </div>

            {/* Other Outcome Input */}
            {formData.outcome === "Other" && (
                <div className="field-group">
                    <label htmlFor="reason_for_escalation">Please specify other outcome <span className="required">*</span></label>
                    <input
                        type="text"
                        id="reason_for_escalation"
                        name="reason_for_escalation"
                        value={formData.reason_for_escalation || ''}
                        onChange={handleChange}
                        placeholder="Explain the outcome"
                        className={isFieldInvalid('reason_for_escalation') ? 'invalid' : ''}
                    />
                    {isFieldInvalid('reason_for_escalation') && (
                        <div className="error-message">
                            <span>{getFieldError('reason_for_escalation')}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Outcome Actions Taken */}
            <div className="field-group">
                <label htmlFor="outcome_actions_taken">Actions Taken <span className="hint">(Optional)</span></label>
                <textarea
                    id="outcome_actions_taken"
                    name="outcome_actions_taken"
                    value={formData.outcome_actions_taken || ''}
                    onChange={handleChange}
                    placeholder="Describe actions taken in response to the outcome"
                    rows="4"
                    className={isFieldInvalid('outcome_actions_taken') ? 'invalid' : ''}
                />
                {isFieldInvalid('outcome_actions_taken') && (
                    <div className="error-message">
                        <span>{getFieldError('outcome_actions_taken')}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Step4Outcome