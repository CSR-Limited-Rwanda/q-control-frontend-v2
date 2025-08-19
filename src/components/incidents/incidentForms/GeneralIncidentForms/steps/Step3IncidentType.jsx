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

    // Agreement options for falls
    const agreementOptions = [
        { name: "Were the side rails up" },
        { name: "Patient using assistive device" },
        { name: "Patient oriented x3" },
        { name: "Call light within reach" },
        { name: "Restraints in use" },
        { name: "Chemical" },
        { name: "Four side rails" },
        { name: "Wrist restraints" }
    ]

    // Fell off options
    const fellOffOptions = [
        { name: "Bed" },
        { name: "Chair" },
        { name: "Wheelchair" },
        { name: "Toilet" },
        { name: "Stretcher" }
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
            // Clear fall related fields
            handleChange({ target: { name: 'fall_related_type', value: '' } })
            handleChange({ target: { name: 'fall_type_other', value: '' } })
            handleChange({ target: { name: 'fall_type_other_text', value: '' } })
            handleChange({ target: { name: 'morse_fall_score', value: '' } })
            handleChange({ target: { name: 'fell_from', value: '' } })
            handleChange({ target: { name: 'fall_type_agreement', value: '' } })

            // Clear treatment fields
            handleChange({ target: { name: 'treatment_type', value: '' } })
            handleChange({ target: { name: 'other_treatment', value: '' } })

            // Clear equipment fields
            handleChange({ target: { name: 'equipment_type', value: '' } })
            handleChange({ target: { name: 'equipment_manufacturer', value: '' } })
            handleChange({ target: { name: 'equipment_model', value: '' } })
            handleChange({ target: { name: 'equipment_serial_number', value: '' } })
            handleChange({ target: { name: 'equipment_lot_number', value: '' } })
            handleChange({ target: { name: 'equipment_malfunction', value: '' } })
            handleChange({ target: { name: 'removed_from_service', value: "No" } })
            handleChange({ target: { name: 'engineering_staff_notified', value: '' } })

            // Clear adverse drug reaction fields
            handleChange({ target: { name: 'suspected_medication', value: '' } })
            handleChange({ target: { name: 'medication_dose', value: '' } })
            handleChange({ target: { name: 'medication_route', value: '' } })
            handleChange({ target: { name: 'medication_frequency', value: '' } })
            handleChange({ target: { name: 'medication_rate_iv', value: '' } })
            handleChange({ target: { name: 'date_medication_order', value: '' } })
            handleChange({ target: { name: 'reaction_information_location', value: '' } })
            handleChange({ target: { name: 'reaction_found_in_nurse_notes', value: false } })
            handleChange({ target: { name: 'reaction_found_in_progress_notes', value: false } })
            handleChange({ target: { name: 'reaction_found_in_other_notes', value: false } })
            handleChange({ target: { name: 'reaction_treated', value: false } })
            handleChange({ target: { name: 'treatment_description', value: '' } })

            // Clear other type fields
            handleChange({ target: { name: 'other_type_specimen_other', value: '' } })
            handleChange({ target: { name: 'other_details', value: '' } })
        }
    }

    // Handle agreement checkbox selection (multiple)
    const handleAgreementChange = (agreementName) => {
        const currentAgreements = formData.fall_type_agreement ? formData.fall_type_agreement.split(', ') : []
        let updatedAgreements

        if (currentAgreements.includes(agreementName)) {
            updatedAgreements = currentAgreements.filter(agreement => agreement !== agreementName)
        } else {
            updatedAgreements = [...currentAgreements, agreementName]
        }

        handleChange({
            target: {
                name: 'fall_type_agreement',
                value: updatedAgreements.join(', ')
            }
        })
    }

    // Handle fell off selection (multiple) - but store as single string since backend doesn't seem to support this
    const handleFellOffChange = (option) => {
        // Based on backend object, this might not be needed, but keeping for UI consistency
        const currentOptions = formData.fell_off_of ? formData.fell_off_of.split(', ') : []
        let updatedOptions

        if (currentOptions.includes(option)) {
            updatedOptions = currentOptions.filter(opt => opt !== option)
        } else {
            updatedOptions = [...currentOptions, option]
        }

        handleChange({
            target: {
                name: 'fell_off_of',
                value: updatedOptions.join(', ')
            }
        })
    }

    // Get selected arrays for rendering
    const selectedAgreements = formData.fall_type_agreement ? formData.fall_type_agreement.split(', ') : []
    const showRestraintOptions = selectedAgreements.includes('Restraints in use')

    return (
        <div className="step-container">
            <h3>Step 3: Incident Type</h3>
            <form>
                {/* Main Incident Type Selection */}
                <div className="field-group">
                    <label htmlFor="incident_type">Incident Type *</label>
                    <select
                        id="incident_type"
                        name="incident_type"
                        value={formData.incident_type || ''}
                        onChange={handleIncidentTypeChange}
                        className={isFieldInvalid('incident_type') ? 'invalid' : ''}
                    >
                        <option value="">Select incident type</option>
                        {incidentTypeOptions.map((type, index) => (
                            <option key={index} value={type}>{type}</option>
                        ))}
                    </select>
                    {isFieldInvalid('incident_type') && (
                        <span className="error-message">{getFieldError('incident_type')}</span>
                    )}
                </div>

                {/* Fall Related Section */}
                {formData.incident_type === "Fall related" && (
                    <div className="incident-type-details">
                        <h4>Fall Related Incident</h4>

                        {/* Fall Type */}
                        <div className="field-group">
                            <label htmlFor="fall_related_type">Fall Type *</label>
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
                                <span className="error-message">{getFieldError('fall_related_type')}</span>
                            )}
                        </div>

                        {/* Other Fall Type Input */}
                        {formData.fall_related_type === "Other" && (
                            <div>
                                <div className="field-group">
                                    <label htmlFor="fall_type_other">Explain Other Fall Type *</label>
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
                                        <span className="error-message">{getFieldError('fall_type_other')}</span>
                                    )}
                                </div>

                                <div className="field-group">
                                    <label htmlFor="fall_type_other_text">Additional Details</label>
                                    <textarea
                                        id="fall_type_other_text"
                                        name="fall_type_other_text"
                                        value={formData.fall_type_other_text || ''}
                                        onChange={handleChange}
                                        placeholder="Provide additional details about the fall type"
                                        rows="3"
                                        className={isFieldInvalid('fall_type_other_text') ? 'invalid' : ''}
                                    />
                                    {isFieldInvalid('fall_type_other_text') && (
                                        <span className="error-message">{getFieldError('fall_type_other_text')}</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Fall From Input */}
                        {formData.fall_related_type === "Fall from" && (
                            <div className="field-group">
                                <label htmlFor="fell_from">Fell from (equipment) *</label>
                                <input
                                    type="text"
                                    id="fell_from"
                                    name="fell_from"
                                    value={formData.fell_from || ''}
                                    onChange={handleChange}
                                    placeholder="Enter equipment"
                                    className={isFieldInvalid('fell_from') ? 'invalid' : ''}
                                />
                                {isFieldInvalid('fell_from') && (
                                    <span className="error-message">{getFieldError('fell_from')}</span>
                                )}
                            </div>
                        )}

                        {/* Fell Off Of - Simple text input since backend doesn't support multiple selection */}
                        {formData.fall_related_type === "Fell off of" && (
                            <div className="field-group">
                                <label htmlFor="fell_from">What did patient fall off of? *</label>
                                <input
                                    type="text"
                                    id="fell_from"
                                    name="fell_from"
                                    value={formData.fell_from || ''}
                                    onChange={handleChange}
                                    placeholder="e.g. Bed, Chair, Wheelchair, etc."
                                    className={isFieldInvalid('fell_from') ? 'invalid' : ''}
                                />
                                {isFieldInvalid('fell_from') && (
                                    <span className="error-message">{getFieldError('fell_from')}</span>
                                )}
                            </div>
                        )}

                        {/* Morse Fall Score */}
                        <div className="field-group">
                            <label htmlFor="morse_fall_score">Morse Fall Score *</label>
                            <input
                                type="number"
                                id="morse_fall_score"
                                name="morse_fall_score"
                                value={formData.morse_fall_score || ''}
                                onChange={handleChange}
                                placeholder="Enter score"
                                className={isFieldInvalid('morse_fall_score') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('morse_fall_score') && (
                                <span className="error-message">{getFieldError('morse_fall_score')}</span>
                            )}
                        </div>

                        {/* Agreement Options */}
                        <div className="field-group">
                            <label>Please select all applicable *</label>
                            <div className="checkbox-options">
                                {agreementOptions.map((option, index) => {
                                    // Hide restraint options unless "Restraints in use" is selected
                                    if ((option.name === "Chemical" || option.name === "Four side rails" || option.name === "Wrist restraints") && !showRestraintOptions) {
                                        return null
                                    }

                                    return (
                                        <div
                                            key={index}
                                            className={`checkbox-option ${selectedAgreements.includes(option.name) ? 'selected' : ''}`}
                                            onClick={() => handleAgreementChange(option.name)}
                                        >
                                            <span>{option.name}</span>
                                        </div>
                                    )
                                })}
                            </div>
                            {isFieldInvalid('fall_type_agreement') && (
                                <span className="error-message">{getFieldError('fall_type_agreement')}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Treatment Related Section */}
                {formData.incident_type === "Treatment related" && (
                    <div className="incident-type-details">
                        <h4>Treatment Related</h4>

                        <div className="field-group">
                            <label>Select Treatment *</label>
                            <div className="treatment-options">
                                {treatmentTypes.map((treatment, index) => (
                                    <div
                                        key={index}
                                        className={`treatment-option ${formData.treatment_type === treatment.name ? 'selected' : ''}`}
                                        onClick={() => handleChange({ target: { name: 'treatment_type', value: treatment.name } })}
                                    >
                                        <span>{treatment.name}</span>
                                    </div>
                                ))}
                            </div>
                            {isFieldInvalid('treatment_type') && (
                                <span className="error-message">{getFieldError('treatment_type')}</span>
                            )}

                            {/* Other Treatment Input */}
                            {formData.treatment_type === "Other" && (
                                <div className="other-treatment-input">
                                    <input
                                        type="text"
                                        name="other_treatment"
                                        value={formData.other_treatment || ''}
                                        onChange={handleChange}
                                        placeholder="Enter other treatment"
                                        className={isFieldInvalid('other_treatment') ? 'invalid' : ''}
                                    />
                                    {isFieldInvalid('other_treatment') && (
                                        <span className="error-message">{getFieldError('other_treatment')}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Equipment Malfunction Section */}
                {formData.incident_type === "Equipment malfunction" && (
                    <div className="incident-type-details">
                        <h4>Equipment Malfunction</h4>

                        <div className="equipment-checkboxes">
                            <div className="checkbox-row">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="removed_from_service"
                                        checked={formData.removed_from_service === "Yes"}
                                        onChange={(e) => handleChange({
                                            target: {
                                                name: 'removed_from_service',
                                                value: e.target.checked ? "Yes" : "No"
                                            }
                                        })}
                                    />
                                    Removed from service
                                </label>
                            </div>
                        </div>

                        {/* Equipment Malfunction Description */}
                        <div className="field-group">
                            <label htmlFor="equipment_malfunction">Equipment Malfunction Description *</label>
                            <textarea
                                id="equipment_malfunction"
                                name="equipment_malfunction"
                                value={formData.equipment_malfunction || ''}
                                onChange={handleChange}
                                placeholder="Describe the equipment malfunction"
                                rows="3"
                                className={isFieldInvalid('equipment_malfunction') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('equipment_malfunction') && (
                                <span className="error-message">{getFieldError('equipment_malfunction')}</span>
                            )}
                        </div>

                        {/* Engineering Staff Notified */}
                        <div className="field-group">
                            <label htmlFor="engineering_staff_notified">Engineering Staff Notified *</label>
                            <textarea
                                id="engineering_staff_notified"
                                name="engineering_staff_notified"
                                value={formData.engineering_staff_notified || ''}
                                onChange={handleChange}
                                placeholder="Describe when and how engineering staff was notified"
                                rows="2"
                                className={isFieldInvalid('engineering_staff_notified') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('engineering_staff_notified') && (
                                <span className="error-message">{getFieldError('engineering_staff_notified')}</span>
                            )}
                        </div>

                        <div className="equipment-fields">
                            <div className="field-group">
                                <label htmlFor="equipment_type">Equipment Type *</label>
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
                                    <span className="error-message">{getFieldError('equipment_type')}</span>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="equipment_manufacturer">Manufacturer *</label>
                                <input
                                    type="text"
                                    id="equipment_manufacturer"
                                    name="equipment_manufacturer"
                                    value={formData.equipment_manufacturer || ''}
                                    onChange={handleChange}
                                    placeholder="Enter manufacturer"
                                    className={isFieldInvalid('equipment_manufacturer') ? 'invalid' : ''}
                                />
                                {isFieldInvalid('equipment_manufacturer') && (
                                    <span className="error-message">{getFieldError('equipment_manufacturer')}</span>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="equipment_model">Model *</label>
                                <input
                                    type="text"
                                    id="equipment_model"
                                    name="equipment_model"
                                    value={formData.equipment_model || ''}
                                    onChange={handleChange}
                                    placeholder="Enter model"
                                    className={isFieldInvalid('equipment_model') ? 'invalid' : ''}
                                />
                                {isFieldInvalid('equipment_model') && (
                                    <span className="error-message">{getFieldError('equipment_model')}</span>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="equipment_serial_number">Serial Number *</label>
                                <input
                                    type="text"
                                    id="equipment_serial_number"
                                    name="equipment_serial_number"
                                    value={formData.equipment_serial_number || ''}
                                    onChange={handleChange}
                                    placeholder="Enter serial number"
                                    className={isFieldInvalid('equipment_serial_number') ? 'invalid' : ''}
                                />
                                {isFieldInvalid('equipment_serial_number') && (
                                    <span className="error-message">{getFieldError('equipment_serial_number')}</span>
                                )}
                            </div>

                            <div className="field-group">
                                <label htmlFor="equipment_lot_number">Lot/Control Number *</label>
                                <input
                                    type="text"
                                    id="equipment_lot_number"
                                    name="equipment_lot_number"
                                    value={formData.equipment_lot_number || ''}
                                    onChange={handleChange}
                                    placeholder="Enter lot number"
                                    className={isFieldInvalid('equipment_lot_number') ? 'invalid' : ''}
                                />
                                {isFieldInvalid('equipment_lot_number') && (
                                    <span className="error-message">{getFieldError('equipment_lot_number')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Other Section */}
                {formData.incident_type === "Other" && (
                    <div className="incident-type-details">
                        <h4>Other Types</h4>

                        <div className="field-group">
                            <label>Select Type *</label>
                            <div className="other-type-options">
                                {otherTypeOptions.map((type, index) => (
                                    <div
                                        key={index}
                                        className={`other-type-option ${formData.other_type_specimen_other === type.name ? 'selected' : ''}`}
                                        onClick={() => handleChange({ target: { name: 'other_type_specimen_other', value: type.name } })}
                                    >
                                        <span>{type.name}</span>
                                    </div>
                                ))}
                            </div>
                            {isFieldInvalid('other_type_specimen_other') && (
                                <span className="error-message">{getFieldError('other_type_specimen_other')}</span>
                            )}

                            {/* Other Details Input */}
                            {formData.other_type_specimen_other === "Other" && (
                                <div className="other-details-input">
                                    <input
                                        type="text"
                                        name="other_details"
                                        value={formData.other_details || ''}
                                        onChange={handleChange}
                                        placeholder="Enter details"
                                        className={isFieldInvalid('other_details') ? 'invalid' : ''}
                                    />
                                    {isFieldInvalid('other_details') && (
                                        <span className="error-message">{getFieldError('other_details')}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>
    )
}

export default Step3IncidentType