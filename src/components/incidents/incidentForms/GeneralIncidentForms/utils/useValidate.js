import { useState } from 'react'

const useValidate = () => {
    const [invalidFieldNames, setInvalidFieldNames] = useState([])

    const validateStep = (stepNumber, formData) => {
        const errors = []

        switch (stepNumber) {
            case 1:
                // Step 1: Incident Information

                // Validate facility_id
                if (!formData.facility_id || formData.facility_id.trim() === '') {
                    errors.push({
                        name: 'facility_id',
                        error: 'Facility selection is required'
                    })
                }

                // Validate patient_visitor nested object
                if (!formData.patient_visitor?.profile_type || formData.patient_visitor.profile_type.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.profile_type',
                        error: 'Patient/Visitor type is required'
                    })
                }
                if (!formData.patient_visitor?.first_name || formData.patient_visitor.first_name.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.first_name',
                        error: 'First name is required'
                    })
                }
                if (!formData.patient_visitor?.last_name || formData.patient_visitor.last_name.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.last_name',
                        error: 'Last name is required'
                    })
                }
                if (!formData.patient_visitor?.sex || formData.patient_visitor.sex.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.sex',
                        error: 'Sex is required'
                    })
                }
                if (!formData.patient_visitor?.address || formData.patient_visitor.address.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.address',
                        error: 'Address is required'
                    })
                }
                if (!formData.patient_visitor?.city || formData.patient_visitor.city.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.city',
                        error: 'City is required'
                    })
                }
                if (!formData.patient_visitor?.state || formData.patient_visitor.state.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.state',
                        error: 'State is required'
                    })
                }
                if (!formData.patient_visitor?.zip_code || formData.patient_visitor.zip_code.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.zip_code',
                        error: 'Zip code is required'
                    })
                } else if (!/^\d{5}(-\d{4})?$/.test(formData.patient_visitor.zip_code.trim())) {
                    errors.push({
                        name: 'patient_visitor.zip_code',
                        error: 'Zip code should be 5 digits (e.g., 12345) or 5+4 format (e.g., 12345-6789)'
                    })
                }
                if (!formData.patient_visitor?.phone_number || formData.patient_visitor.phone_number.trim() === '') {
                    errors.push({
                        name: 'patient_visitor.phone_number',
                        error: 'Phone number is required'
                    })
                } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.patient_visitor.phone_number.trim())) {
                    errors.push({
                        name: 'patient_visitor.phone_number',
                        error: 'Phone number should be in format: (123) 456-7890 or 123-456-7890'
                    })
                }

                // Validate other top-level fields
                if (!formData.incident_date || formData.incident_date.trim() === '') {
                    errors.push({
                        name: 'incident_date',
                        error: 'Incident date is required'
                    })
                } else {
                    // Validate MM-DD-YYYY format
                    const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])-(19|20)\d{2}$/;
                    if (!dateRegex.test(formData.incident_date.trim())) {
                        errors.push({
                            name: 'incident_date',
                            error: 'Invalid date format'
                        });
                    } else {
                        // Additional validation: Check if it's a valid date
                        const dateParts = formData.incident_date.trim().split('-');
                        const month = parseInt(dateParts[0], 10);
                        const day = parseInt(dateParts[1], 10);
                        const year = parseInt(dateParts[2], 10);
                        const date = new Date(year, month - 1, day);

                        if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                            errors.push({
                                name: 'incident_date',
                                error: 'Please enter a valid date'
                            });
                        } else if (date > new Date()) {
                            errors.push({
                                name: 'incident_date',
                                error: 'Incident date cannot be in the future'
                            });
                        }
                    }
                }
                if (!formData.medical_record_number || formData.medical_record_number.trim() === '') {
                    errors.push({
                        name: 'medical_record_number',
                        error: 'Medical record number is required'
                    })
                }
                break

            case 2:
                // Step 2: Location & Status

                // Validate incident location
                if (!formData.location || formData.location.trim() === '') {
                    errors.push({
                        name: 'location',
                        error: 'Incident location is required'
                    })
                }

                // Validate patient/visitor status prior to incident
                if (!formData.patient_status_prior || formData.patient_status_prior.trim() === '') {
                    errors.push({
                        name: 'patient_status_prior',
                        error: 'Patient/visitor status prior to incident is required'
                    })
                }

                // Validate other status input if "Others" is selected
                const selectedStatuses = formData.patient_status_prior ? formData.patient_status_prior.split(', ') : []
                if (selectedStatuses.includes('Others')) {
                    if (!formData.other_status_input || formData.other_status_input.trim() === '') {
                        errors.push({
                            name: 'other_status_input',
                            error: 'Please specify other status when "Others" is selected'
                        })
                    }
                }
                break

            case 3:
                // Step 3: Incident Type

                // Validate main incident type
                if (!formData.incident_type || formData.incident_type.trim() === '') {
                    errors.push({
                        name: 'incident_type',
                        error: 'Incident type is required'
                    })
                } else {
                    // Validate based on selected incident type
                    if (formData.incident_type === 'Fall related') {
                        // Fall related validations
                        if (!formData.fall_related_type || formData.fall_related_type.trim() === '') {
                            errors.push({
                                name: 'fall_related_type',
                                error: 'Fall type is required'
                            })
                        }

                        if (formData.fall_related_type === 'Other' && (!formData.fall_type_other || formData.fall_type_other.trim() === '')) {
                            errors.push({
                                name: 'fall_type_other',
                                error: 'Please specify other fall type'
                            })
                        }

                        if ((formData.fall_related_type === 'Fall from' || formData.fall_related_type === 'Fell off of') && (!formData.fell_from || formData.fell_from.trim() === '')) {
                            errors.push({
                                name: 'fell_from',
                                error: formData.fall_related_type === 'Fall from'
                                    ? 'Please specify what equipment patient fell from'
                                    : 'Please specify what patient fell off of'
                            })
                        }

                        if (!formData.morse_fall_score || formData.morse_fall_score.trim() === '') {
                            errors.push({
                                name: 'morse_fall_score',
                                error: 'Morse fall score is required'
                            })
                        }

                        if (!formData.fall_type_agreement || formData.fall_type_agreement.trim() === '') {
                            errors.push({
                                name: 'fall_type_agreement',
                                error: 'Please select at least one applicable option'
                            })
                        }

                    } else if (formData.incident_type === 'Treatment related') {
                        // Treatment related validations
                        if (!formData.treatment_type || formData.treatment_type.trim() === '') {
                            errors.push({
                                name: 'treatment_type',
                                error: 'Treatment type is required'
                            })
                        }

                        if (formData.treatment_type === 'Other' && (!formData.other_treatment || formData.other_treatment.trim() === '')) {
                            errors.push({
                                name: 'other_treatment',
                                error: 'Please specify other treatment type'
                            })
                        }

                    } else if (formData.incident_type === 'Equipment malfunction') {
                        // Equipment malfunction validations
                        if (!formData.equipment_type || formData.equipment_type.trim() === '') {
                            errors.push({
                                name: 'equipment_type',
                                error: 'Equipment type is required'
                            })
                        }

                        if (!formData.equipment_manufacturer || formData.equipment_manufacturer.trim() === '') {
                            errors.push({
                                name: 'equipment_manufacturer',
                                error: 'Manufacturer is required'
                            })
                        }

                        if (!formData.equipment_model || formData.equipment_model.trim() === '') {
                            errors.push({
                                name: 'equipment_model',
                                error: 'Model is required'
                            })
                        }

                        if (!formData.equipment_serial_number || formData.equipment_serial_number.trim() === '') {
                            errors.push({
                                name: 'equipment_serial_number',
                                error: 'Serial number is required'
                            })
                        }

                        if (!formData.equipment_lot_number || formData.equipment_lot_number.trim() === '') {
                            errors.push({
                                name: 'equipment_lot_number',
                                error: 'Lot/control number is required'
                            })
                        }

                        if (!formData.equipment_malfunction || formData.equipment_malfunction.trim() === '') {
                            errors.push({
                                name: 'equipment_malfunction',
                                error: 'Equipment malfunction description is required'
                            })
                        }

                        if (!formData.engineering_staff_notified || formData.engineering_staff_notified.trim() === '') {
                            errors.push({
                                name: 'engineering_staff_notified',
                                error: 'Engineering staff notification details are required'
                            })
                        }

                    } else if (formData.incident_type === 'Other') {
                        // Other type validations
                        if (!formData.other_type_specimen_other || formData.other_type_specimen_other.trim() === '') {
                            errors.push({
                                name: 'other_type_specimen_other',
                                error: 'Other type is required'
                            })
                        }

                        if (formData.other_type_specimen_other === 'Other' && (!formData.other_details || formData.other_details.trim() === '')) {
                            errors.push({
                                name: 'other_details',
                                error: 'Please provide details for other type'
                            })
                        }
                    }
                }
                break

            case 4:
                // Step 4: Outcome

                // Validate outcome selection
                if (!formData.outcome || formData.outcome.trim() === '') {
                    errors.push({
                        name: 'outcome',
                        error: 'Outcome selection is required'
                    })
                }

                // Validate other outcome explanation when "Other" is selected
                if (formData.outcome === 'Other' && (!formData.reason_for_escalation || formData.reason_for_escalation.trim() === '')) {
                    errors.push({
                        name: 'reason_for_escalation',
                        error: 'Please explain the outcome when "Other" is selected'
                    })
                }
                break

            case 5:
                // Step 5: Notification

                // Validate physician notified
                if (!formData.physician_notified?.first_name || formData.physician_notified.first_name.trim() === '') {
                    errors.push({
                        name: 'physician_notified.first_name',
                        error: 'Physician first name is required'
                    })
                }

                if (!formData.physician_notified?.last_name || formData.physician_notified.last_name.trim() === '') {
                    errors.push({
                        name: 'physician_notified.last_name',
                        error: 'Physician last name is required'
                    })
                }

                if (!formData.date_physician_notified || formData.date_physician_notified.trim() === '') {
                    errors.push({
                        name: 'date_physician_notified',
                        error: 'Physician notification date is required'
                    })
                }

                if (!formData.time_physician_notified || formData.time_physician_notified.trim() === '') {
                    errors.push({
                        name: 'time_physician_notified',
                        error: 'Physician notification time is required'
                    })
                }

                // Validate notified by
                if (!formData.notified_by?.first_name || formData.notified_by.first_name.trim() === '') {
                    errors.push({
                        name: 'notified_by.first_name',
                        error: 'Notified by first name is required'
                    })
                }

                if (!formData.notified_by?.last_name || formData.notified_by.last_name.trim() === '') {
                    errors.push({
                        name: 'notified_by.last_name',
                        error: 'Notified by last name is required'
                    })
                }
                break

            case 6:
                // Step 6: Summary

                // Validate brief summary
                if (!formData.brief_summary_of_incident || formData.brief_summary_of_incident.trim() === '') {
                    errors.push({
                        name: 'brief_summary_of_incident',
                        error: 'Brief summary of incident is required'
                    })
                }

                // Validate immediate actions taken
                if (!formData.immediate_action_taken || formData.immediate_action_taken.trim() === '') {
                    errors.push({
                        name: 'immediate_action_taken',
                        error: 'Immediate actions taken is required'
                    })
                }
                break

            case 7:
                // Step 7: Success
                // No validation needed for success page
                break

            default:
                break
        }

        setInvalidFieldNames(errors)
        return errors.length === 0 // Return true if valid, false if invalid
    }

    const clearValidationErrors = () => {
        setInvalidFieldNames([])
    }

    const isFieldInvalid = (fieldName) => {
        return invalidFieldNames.some(error => error.name === fieldName)
    }

    const getFieldError = (fieldName) => {
        const errorObj = invalidFieldNames.find(error => error.name === fieldName)
        return errorObj ? errorObj.error : null
    }

    return {
        invalidFieldNames,
        validateStep,
        clearValidationErrors,
        isFieldInvalid,
        getFieldError
    }
}

export default useValidate
