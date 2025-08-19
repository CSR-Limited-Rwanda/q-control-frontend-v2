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
        <div className="step-container">
            <h3>Step 4: Outcome</h3>
            <form>
                {/* Outcome Selection */}
                <div className="field-group">
                    <label>Select Outcome *</label>
                    <div className="outcome-choices">
                        {generalOutcomeOptions.map((outcome, index) => (
                            <div
                                key={index}
                                onClick={() => handleOutcomeSelection(outcome.value)}
                                className={`outcome-option ${formData.outcome === outcome.value ? 'selected' : ''
                                    }`}
                            >
                                <p>{outcome.label}</p>
                            </div>
                        ))}
                    </div>
                    {isFieldInvalid('outcome') && (
                        <span className="error-message">{getFieldError('outcome')}</span>
                    )}
                </div>

                {/* Other Outcome Input */}
                {formData.outcome === "Other" && (
                    <div className="field-group">
                        <label htmlFor="reason_for_escalation">Explain Other Outcome *</label>
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
                            <span className="error-message">{getFieldError('reason_for_escalation')}</span>
                        )}
                    </div>
                )}

                {/* Outcome Actions Taken */}
                <div className="field-group">
                    <label htmlFor="outcome_actions_taken">Actions Taken</label>
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
                        <span className="error-message">{getFieldError('outcome_actions_taken')}</span>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Step4Outcome