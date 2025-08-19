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
        <div className="step-container">
            <h3>Step 2: Location and Status</h3>
            <form>
                {/* Incident Location */}
                <div className="field-group">
                    <label htmlFor="location">Incident Location *</label>
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
                        <span className="error-message">{getFieldError('location')}</span>
                    )}
                </div>

                {/* Patient/Visitor Status Prior to Incident */}
                <div className="field-group">
                    <label>Select patient/visitor status prior to incident *</label>
                    <div className="status-checkboxes">
                        {statusesPriorToIncident.map((status, index) => (
                            <div
                                key={index}
                                className={`status-checkbox ${selectedStatuses.includes(status.description) ? 'selected' : ''}`}
                                onClick={() => handleStatusCheckboxChange(status.description)}
                            >
                                {selectedStatuses.includes(status.description) ? (
                                    <CheckSquare className="checkbox-icon" />
                                ) : (
                                    <Square className="checkbox-icon" />
                                )}
                                <span>{status.description}</span>
                            </div>
                        ))}
                    </div>
                    {isFieldInvalid('patient_status_prior') && (
                        <span className="error-message">{getFieldError('patient_status_prior')}</span>
                    )}

                    {/* Other status input - shown when "Others" is selected */}
                    {isOthersSelected && (
                        <div className="other-status-input">
                            <input
                                type="text"
                                name="other_status_input"
                                value={formData.other_status_input || ''}
                                onChange={handleOtherStatusChange}
                                placeholder="Enter other prior status"
                                className={isFieldInvalid('other_status_input') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('other_status_input') && (
                                <span className="error-message">{getFieldError('other_status_input')}</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Contributing Diagnosis */}
                <div className="field-group">
                    <label htmlFor="consulting_diagnosis">Contributing Diagnosis</label>
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
                        <span className="error-message">{getFieldError('consulting_diagnosis')}</span>
                    )}
                </div>
            </form>
        </div>
    )
}

export default Step2LocationStatus