'use client'
import React, { useState } from 'react'
import CustomSelectInput from '@/components/CustomSelectInput'

const Step3IncidentType = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError }) => {
    // Incident type options
    const incidentTypeOptions = [
        "Fall related",
        "Treatment related",
        "Equipment malfunction",
        "Adverse Drug Reaction",
        "Other"
    ]

    // Fall type options
    const fallTypeOptions = [
        "Reported fall; not observed by staff",
        "Found on floor",
        "Lowered/Assisted to floor",
        "Fall from",
        "Fell off of",
        "While walking",
        "While standing",
        "While sitting",
        "Other"
    ]

    // Treatment types
    const treatmentTypes = [
        { name: "Medication administration" },
        { name: "IV therapy" },
        { name: "Surgery" },
        { name: "Laboratory" },
        { name: "Radiology" },
        { name: "Other" }
    ]

    // Other type options
    const otherTypeOptions = [
        { name: "Security" },
        { name: "Visitor" },
        { name: "Specimen" },
        { name: "Property loss" },
        { name: "Other" }
    ]

    // Handle incident type selection
    const handleIncidentTypeChange = (e) => {
        const selectedType = e.target.value
        handleChange({ target: { name: 'incident_type', value: selectedType } })

        // Clear related fields when incident type changes
        if (selectedType !== formData.incident_type) {
            // Clear all type-specific fields
            handleChange({ target: { name: 'fall_related_type', value: '' } })
            handleChange({ target: { name: 'treatment_type', value: '' } })
            handleChange({ target: { name: 'equipment_type', value: '' } })
            handleChange({ target: { name: 'suspected_medication', value: '' } })
            handleChange({ target: { name: 'other_type_specimen_other', value: '' } })
        }
    }

    return (
        <div className="form-container">
            {/* Form Header */}
            <div className="form-header">
                <h2>Step 3: Incident Type & Details</h2>
                <div className="progress-info">
                    <span className="step-indicator">Step 3 of 7</span>
                </div>
            </div>

            {/* Incident Type Selection */}
            <div className="field-group">
                <label htmlFor="incident_type">Incident Type <span className="required">*</span></label>
                <select
                    id="incident_type"
                    name="incident_type"
                    value={formData.incident_type || ''}
                    onChange={handleIncidentTypeChange}
                    className={isFieldInvalid('incident_type') ? 'invalid' : ''}
                >
                    <option value="">Select incident type</option>
                    {incidentTypeOptions.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
                {isFieldInvalid('incident_type') && (
                    <div className="error-message">
                        <span>{getFieldError('incident_type')}</span>
                    </div>
                )}
            </div>

            {/* Fall Related Section */}
            {formData.incident_type === "Fall related" && (
                <div className="field-group">
                    <label>Fall Related Details</label>
                    <div className="field-group">
                        <label htmlFor="fall_related_type">Fall Type <span className="required">*</span></label>
                        <select
                            id="fall_related_type"
                            name="fall_related_type"
                            value={formData.fall_related_type || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('fall_related_type') ? 'invalid' : ''}
                        >
                            <option value="">Select fall type</option>
                            {fallTypeOptions.map((type, index) => (
                                <option key={index} value={type}>{type}</option>
                            ))}
                        </select>
                        {isFieldInvalid('fall_related_type') && (
                            <div className="error-message">
                                <span>{getFieldError('fall_related_type')}</span>
                            </div>
                        )}
                    </div>

                    {/* Other Fall Type Input */}
                    {formData.fall_related_type === "Other" && (
                        <div className="field-group">
                            <label htmlFor="fall_type_other">Please specify other fall type <span className="required">*</span></label>
                            <input
                                type="text"
                                id="fall_type_other"
                                name="fall_type_other"
                                value={formData.fall_type_other || ''}
                                onChange={handleChange}
                                placeholder="Explain other fall type"
                                className={isFieldInvalid('fall_type_other') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('fall_type_other') && (
                                <div className="error-message">
                                    <span>{getFieldError('fall_type_other')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Treatment Related Section */}
            {formData.incident_type === "Treatment related" && (
                <div className="field-group">
                    <label>Treatment Related Details</label>
                    <div className="field-group">
                        <label htmlFor="treatment_type">Treatment Type <span className="required">*</span></label>
                        <select
                            id="treatment_type"
                            name="treatment_type"
                            value={formData.treatment_type || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('treatment_type') ? 'invalid' : ''}
                        >
                            <option value="">Select treatment type</option>
                            {treatmentTypes.map((type, index) => (
                                <option key={index} value={type.name}>{type.name}</option>
                            ))}
                        </select>
                        {isFieldInvalid('treatment_type') && (
                            <div className="error-message">
                                <span>{getFieldError('treatment_type')}</span>
                            </div>
                        )}
                    </div>

                    {/* Other Treatment Input */}
                    {formData.treatment_type === "Other" && (
                        <div className="field-group">
                            <label htmlFor="other_treatment">Please specify other treatment <span className="required">*</span></label>
                            <input
                                type="text"
                                id="other_treatment"
                                name="other_treatment"
                                value={formData.other_treatment || ''}
                                onChange={handleChange}
                                placeholder="Explain other treatment"
                                className={isFieldInvalid('other_treatment') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('other_treatment') && (
                                <div className="error-message">
                                    <span>{getFieldError('other_treatment')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Equipment Malfunction Section */}
            {formData.incident_type === "Equipment malfunction" && (
                <div className="field-group">
                    <label>Equipment Malfunction Details</label>
                    <div className="grouped-inputs">
                        <div className="field-group">
                            <label htmlFor="equipment_type">Equipment Type <span className="required">*</span></label>
                            <input
                                type="text"
                                id="equipment_type"
                                name="equipment_type"
                                value={formData.equipment_type || ''}
                                onChange={handleChange}
                                placeholder="Enter equipment type"
                                className={isFieldInvalid('equipment_type') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('equipment_type') && (
                                <div className="error-message">
                                    <span>{getFieldError('equipment_type')}</span>
                                </div>
                            )}
                        </div>
                        <div className="field-group">
                            <label htmlFor="equipment_manufacturer">Manufacturer</label>
                            <input
                                type="text"
                                id="equipment_manufacturer"
                                name="equipment_manufacturer"
                                value={formData.equipment_manufacturer || ''}
                                onChange={handleChange}
                                placeholder="Enter manufacturer"
                                className={isFieldInvalid('equipment_manufacturer') ? 'invalid' : ''}
                            />
                        </div>
                    </div>

                    <div className="grouped-inputs">
                        <div className="field-group">
                            <label htmlFor="equipment_model">Model</label>
                            <input
                                type="text"
                                id="equipment_model"
                                name="equipment_model"
                                value={formData.equipment_model || ''}
                                onChange={handleChange}
                                placeholder="Enter model"
                                className={isFieldInvalid('equipment_model') ? 'invalid' : ''}
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="equipment_serial_number">Serial Number</label>
                            <input
                                type="text"
                                id="equipment_serial_number"
                                name="equipment_serial_number"
                                value={formData.equipment_serial_number || ''}
                                onChange={handleChange}
                                placeholder="Enter serial number"
                                className={isFieldInvalid('equipment_serial_number') ? 'invalid' : ''}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Adverse Drug Reaction Section */}
            {formData.incident_type === "Adverse Drug Reaction" && (
                <div className="field-group">
                    <label>Adverse Drug Reaction Details</label>
                    <div className="field-group">
                        <label htmlFor="suspected_medication">Suspected Medication <span className="required">*</span></label>
                        <input
                            type="text"
                            id="suspected_medication"
                            name="suspected_medication"
                            value={formData.suspected_medication || ''}
                            onChange={handleChange}
                            placeholder="Enter suspected medication"
                            className={isFieldInvalid('suspected_medication') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('suspected_medication') && (
                            <div className="error-message">
                                <span>{getFieldError('suspected_medication')}</span>
                            </div>
                        )}
                    </div>

                    <div className="grouped-inputs">
                        <div className="field-group">
                            <label htmlFor="medication_dose">Dose</label>
                            <input
                                type="text"
                                id="medication_dose"
                                name="medication_dose"
                                value={formData.medication_dose || ''}
                                onChange={handleChange}
                                placeholder="Enter dose"
                                className={isFieldInvalid('medication_dose') ? 'invalid' : ''}
                            />
                        </div>
                        <div className="field-group">
                            <label htmlFor="medication_route">Route</label>
                            <input
                                type="text"
                                id="medication_route"
                                name="medication_route"
                                value={formData.medication_route || ''}
                                onChange={handleChange}
                                placeholder="Enter route"
                                className={isFieldInvalid('medication_route') ? 'invalid' : ''}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Other Section */}
            {formData.incident_type === "Other" && (
                <div className="field-group">
                    <label>Other Incident Type</label>
                    <div className="radio-group">
                        {otherTypeOptions.map((type, index) => (
                            <div
                                key={index}
                                className={`radio-item ${formData.other_type_specimen_other === type.name ? 'selected' : ''}`}
                                onClick={() => handleChange({ target: { name: 'other_type_specimen_other', value: type.name } })}
                            >
                                <div className="radio-icon">●</div>
                                <span className="radio-label">{type.name}</span>
                                <input
                                    type="radio"
                                    name="other_type_specimen_other"
                                    value={type.name}
                                    checked={formData.other_type_specimen_other === type.name}
                                    onChange={() => handleChange({ target: { name: 'other_type_specimen_other', value: type.name } })}
                                />
                            </div>
                        ))}
                    </div>
                    {isFieldInvalid('other_type_specimen_other') && (
                        <div className="error-message">
                            <span>{getFieldError('other_type_specimen_other')}</span>
                        </div>
                    )}

                    {/* Other Details Input */}
                    {formData.other_type_specimen_other === "Other" && (
                        <div className="field-group">
                            <label htmlFor="other_details">Please specify <span className="required">*</span></label>
                            <input
                                type="text"
                                id="other_details"
                                name="other_details"
                                value={formData.other_details || ''}
                                onChange={handleChange}
                                placeholder="Enter details"
                                className={isFieldInvalid('other_details') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('other_details') && (
                                <div className="error-message">
                                    <span>{getFieldError('other_details')}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default Step3IncidentType
