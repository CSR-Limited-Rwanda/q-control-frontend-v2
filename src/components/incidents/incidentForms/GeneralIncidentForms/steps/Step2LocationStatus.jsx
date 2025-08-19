'use client'
import React, { useState, useEffect } from 'react'
import { Square, CheckSquare } from 'lucide-react'

const Step2LocationStatus = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError }) => {
    // Status options - you can move this to constants if needed
    const statusesPriorToIncident = [
        { description: "Ambulatory" },
        { description: "Wheelchair" },
        { description: "Bed rest" },
        { description: "Assisted ambulation" },
        { description: "Others" }
    ]

    // Handle checkbox changes for multiple selections
    const handleStatusCheckboxChange = (statusDescription) => {
        const currentStatuses = formData.patient_status_prior ? formData.patient_status_prior.split(', ') : []
        let updatedStatuses

        if (currentStatuses.includes(statusDescription)) {
            // Remove if already selected
            updatedStatuses = currentStatuses.filter(status => status !== statusDescription)
        } else {
            // Add if not selected
            updatedStatuses = [...currentStatuses, statusDescription]
        }

        // Update form data
        const syntheticEvent = {
            target: {
                name: 'patient_status_prior',
                value: updatedStatuses.join(', ')
            }
        }
        handleChange(syntheticEvent)
    }

    // Handle "Other" input change
    const handleOtherStatusChange = (e) => {
        const syntheticEvent = {
            target: {
                name: 'other_status_input',
                value: e.target.value
            }
        }
        handleChange(syntheticEvent)
    }

    // Check if "Others" is selected
    const selectedStatuses = formData.patient_status_prior ? formData.patient_status_prior.split(', ') : []
    const isOthersSelected = selectedStatuses.includes("Others")

    return (
        <div className="form-container">
            {/* Form Header */}
            <div className="form-header">
                <h2>Step 2: Location and Status</h2>
                <div className="progress-info">
                    <span className="step-indicator">Step 2 of 7</span>
                </div>
            </div>

            {/* Incident Location */}
            <div className="field-group">
                <label htmlFor="location">Incident Location <span className="required">*</span></label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleChange}
                    placeholder="Enter incident location"
                    className={isFieldInvalid('location') ? 'invalid' : ''}
                />
                {isFieldInvalid('location') && (
                    <div className="error-message">
                        <span>{getFieldError('location')}</span>
                    </div>
                )}
            </div>

            {/* Patient/Visitor Status Prior to Incident */}
            <div className="field-group">
                <label>Patient/Visitor Status Prior to Incident <span className="required">*</span></label>
                <div className="checkbox-group">
                    {statusesPriorToIncident.map((status, index) => (
                        <div
                            key={index}
                            className={`checkbox-item ${selectedStatuses.includes(status.description) ? 'selected' : ''}`}
                            onClick={() => handleStatusCheckboxChange(status.description)}
                        >
                            {selectedStatuses.includes(status.description) ? (
                                <CheckSquare className="checkbox-icon" />
                            ) : (
                                <Square className="checkbox-icon" />
                            )}
                            <span className="checkbox-label">{status.description}</span>
                            <input
                                type="checkbox"
                                name="patient_status_prior"
                                value={status.description}
                                checked={selectedStatuses.includes(status.description)}
                                onChange={() => handleStatusCheckboxChange(status.description)}
                            />
                        </div>
                    ))}
                </div>
                {isFieldInvalid('patient_status_prior') && (
                    <div className="error-message">
                        <span>{getFieldError('patient_status_prior')}</span>
                    </div>
                )}

                {/* Other status input - shown when "Others" is selected */}
                {isOthersSelected && (
                    <div className="field-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
                        <label htmlFor="other_status_input">Please specify other status <span className="required">*</span></label>
                        <input
                            type="text"
                            id="other_status_input"
                            name="other_status_input"
                            value={formData.other_status_input || ''}
                            onChange={handleOtherStatusChange}
                            placeholder="Enter other prior status"
                            className={isFieldInvalid('other_status_input') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('other_status_input') && (
                            <div className="error-message">
                                <span>{getFieldError('other_status_input')}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Contributing Diagnosis */}
            <div className="field-group">
                <label htmlFor="consulting_diagnosis">Contributing Diagnosis <span className="hint">(Optional)</span></label>
                <input
                    type="text"
                    id="consulting_diagnosis"
                    name="consulting_diagnosis"
                    value={formData.consulting_diagnosis || ''}
                    onChange={handleChange}
                    placeholder="Enter contributing diagnosis"
                    className={isFieldInvalid('consulting_diagnosis') ? 'invalid' : ''}
                />
                {isFieldInvalid('consulting_diagnosis') && (
                    <div className="error-message">
                        <span>{getFieldError('consulting_diagnosis')}</span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Step2LocationStatus