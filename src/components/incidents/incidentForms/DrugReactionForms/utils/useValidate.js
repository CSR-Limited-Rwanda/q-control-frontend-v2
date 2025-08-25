import { useState } from 'react'

const useValidate = () => {
    const [invalidFieldNames, setInvalidFieldNames] = useState([])

    const validateStep = (stepNumber, formData) => {
        const errors = []

        switch (stepNumber) {
            case 1:
                // Step 1: Incident Information

                // Validate report_facility
                if (!formData.report_facility && !formData.facility_id) {
                    errors.push({
                        name: 'report_facility',
                        error: 'Facility selection is required'
                    })
                }

                // Patient Type
                if (!formData.patient_type || formData.patient_type.trim() === '') {
                    errors.push({
                        name: 'patient_type',
                        error: 'Patient type is required'
                    })
                }

                // Patient Name Information
                if (!formData.patient_name?.first_name || formData.patient_name.first_name.trim() === '') {
                    errors.push({
                        name: 'patient_name.first_name',
                        error: 'First name is required'
                    })
                }
                if (!formData.patient_name?.last_name || formData.patient_name.last_name.trim() === '') {
                    errors.push({
                        name: 'patient_name.last_name',
                        error: 'Last name is required'
                    })
                }
                if (!formData.patient_name?.gender || formData.patient_name.gender.trim() === '') {
                    errors.push({
                        name: 'patient_name.gender',
                        error: 'Gender is required'
                    })
                }

                // Medical Record Number (if included in patient_name)
                if (formData.patient_name?.medical_record_number !== undefined &&
                    (!formData.patient_name?.medical_record_number || formData.patient_name.medical_record_number.trim() === '')) {
                    errors.push({
                        name: 'patient_name.medical_record_number',
                        error: 'Medical record number is required'
                    })
                }

                // Address Information (if included in patient_name)
                if (formData.patient_name?.address !== undefined &&
                    (!formData.patient_name?.address || formData.patient_name.address.trim() === '')) {
                    errors.push({
                        name: 'patient_name.address',
                        error: 'Address is required'
                    })
                }
                if (formData.patient_name?.city !== undefined &&
                    (!formData.patient_name?.city || formData.patient_name.city.trim() === '')) {
                    errors.push({
                        name: 'patient_name.city',
                        error: 'City is required'
                    })
                }
                if (formData.patient_name?.state !== undefined &&
                    (!formData.patient_name?.state || formData.patient_name.state.trim() === '')) {
                    errors.push({
                        name: 'patient_name.state',
                        error: 'State is required'
                    })
                }
                if (formData.patient_name?.zip_code !== undefined) {
                    if (!formData.patient_name?.zip_code || formData.patient_name.zip_code.trim() === '') {
                        errors.push({
                            name: 'patient_name.zip_code',
                            error: 'Zip code is required'
                        })
                    } else if (!/^\d{5}(-\d{4})?$/.test(formData.patient_name.zip_code.trim())) {
                        errors.push({
                            name: 'patient_name.zip_code',
                            error: 'Zip code should be 5 digits (e.g., 12345) or 5+4 format (e.g., 12345-6789)'
                        })
                    }
                }
                if (formData.patient_name?.phone_number !== undefined) {
                    if (!formData.patient_name?.phone_number || formData.patient_name.phone_number.trim() === '') {
                        errors.push({
                            name: 'patient_name.phone_number',
                            error: 'Phone number is required'
                        })
                    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.patient_name.phone_number.trim())) {
                        errors.push({
                            name: 'patient_name.phone_number',
                            error: 'Phone number should be in format: (123) 456-7890 or 123-456-7890'
                        })
                    }
                }

                // Incident Date and Time
                if (!formData.incident_date || formData.incident_date.trim() === '') {
                    errors.push({
                        name: 'incident_date',
                        error: 'Incident date is required'
                    })
                } else {
                    // Validate YYYY-MM-DD format for API
                    const dateRegex = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
                    if (!dateRegex.test(formData.incident_date.trim())) {
                        errors.push({
                            name: 'incident_date',
                            error: 'Invalid date format. Expected YYYY-MM-DD'
                        });
                    }
                }
                if (!formData.incident_time || formData.incident_time.trim() === '') {
                    errors.push({
                        name: 'incident_time',
                        error: 'Incident time is required'
                    })
                }
                break

            case 2:
                // Step 2: Event Details
                if (!formData.provider || formData.provider.trim() === '') {
                    errors.push({
                        name: 'provider',
                        error: 'Provider is required'
                    })
                }
                if (!formData.observers_name?.first_name || formData.observers_name.first_name.trim() === '') {
                    errors.push({
                        name: 'observers_name.first_name',
                        error: 'Observer first name is required'
                    })
                }
                if (!formData.observers_name?.last_name || formData.observers_name.last_name.trim() === '') {
                    errors.push({
                        name: 'observers_name.last_name',
                        error: 'Observer last name is required'
                    })
                }
                if (!formData.time_of_report || formData.time_of_report.trim() === '') {
                    errors.push({
                        name: 'time_of_report',
                        error: 'Time of report is required'
                    })
                }
                if (!formData.date_of_report || formData.date_of_report.trim() === '') {
                    errors.push({
                        name: 'date_of_report',
                        error: 'Date of report is required'
                    })
                }
                if (!formData.event_detail || formData.event_detail.trim() === '') {
                    errors.push({
                        name: 'event_detail',
                        error: 'Event details are required'
                    })
                }
                break

            case 3:
                // Step 3: Medication and Dose
                if (!formData.suspected_medication || formData.suspected_medication.trim() === '') {
                    errors.push({
                        name: 'suspected_medication',
                        error: 'Suspected medication is required'
                    })
                }
                if (!formData.dose || formData.dose.trim() === '') {
                    errors.push({
                        name: 'dose',
                        error: 'Dose is required'
                    })
                }
                if (!formData.frequency || formData.frequency.trim() === '') {
                    errors.push({
                        name: 'frequency',
                        error: 'Frequency is required'
                    })
                }
                if (!formData.route || formData.route.trim() === '') {
                    errors.push({
                        name: 'route',
                        error: 'Route is required'
                    })
                }
                if (!formData.date_of_medication_order || formData.date_of_medication_order.trim() === '') {
                    errors.push({
                        name: 'date_of_medication_order',
                        error: 'Date of medication order is required'
                    })
                }
                // Rate of administration required for IV routes
                if ((formData.route === "IV Push" || formData.route === "IV Drip") && (!formData.rate_of_administration || formData.rate_of_administration.trim() === '')) {
                    errors.push({
                        name: 'rate_of_administration',
                        error: 'Rate of administration is required for IV routes'
                    })
                }
                break

            case 4:
                // Step 4: Reaction Details
                if (!formData.date_of_information || formData.date_of_information.trim() === '') {
                    errors.push({
                        name: 'date_of_information',
                        error: 'Date information is required'
                    })
                }
                if (!formData.information_reaction || formData.information_reaction.trim() === '') {
                    errors.push({
                        name: 'information_reaction',
                        error: 'Reaction description is required'
                    })
                }
                if (!formData.date_of_adverse_reaction || formData.date_of_adverse_reaction.trim() === '') {
                    errors.push({
                        name: 'date_of_adverse_reaction',
                        error: 'Adverse reaction date is required'
                    })
                }
                if (!formData.reaction_on_settime || formData.reaction_on_settime.trim() === '') {
                    errors.push({
                        name: 'reaction_on_settime',
                        error: 'Reaction onset time is required'
                    })
                }
                // Note validation - at least one type of note required
                if (!formData.nurse_note && !formData.progress_note && !formData.other_information_can_be_found_in) {
                    errors.push({
                        name: 'note_selection',
                        error: 'Please select at least one note type'
                    })
                }
                // Treatment description required if reaction was treated
                if (formData.reaction_was_treated && (!formData.treatment_description || formData.treatment_description.trim() === '')) {
                    errors.push({
                        name: 'treatment_description',
                        error: 'Treatment description is required when reaction was treated'
                    })
                }
                break

            case 5:
                // Step 5: Incident Classification
                if (!formData.incident_type_classification || formData.incident_type_classification.trim() === '') {
                    errors.push({
                        name: 'incident_type_classification',
                        error: 'Incident type classification is required'
                    })
                }
                break

            case 6:
                // Step 6: Actions and Treatment
                if (!formData.immediate_actions_taken || formData.immediate_actions_taken.trim() === '') {
                    errors.push({
                        name: 'immediate_actions_taken',
                        error: 'Immediate actions taken are required'
                    })
                }
                break

            case 7:
                // Step 7: Outcome
                if (!formData.outcome_type || formData.outcome_type.trim() === '') {
                    errors.push({
                        name: 'outcome_type',
                        error: 'Outcome type is required'
                    })
                }
                if (!formData.outcome_description || formData.outcome_description.trim() === '') {
                    errors.push({
                        name: 'outcome_description',
                        error: 'Outcome description is required'
                    })
                }
                break

            case 8:
                // Step 8: Summary
                if (!formData.brief_summary || formData.brief_summary.trim() === '') {
                    errors.push({
                        name: 'brief_summary',
                        error: 'Brief summary is required'
                    })
                }
                if (!formData.description || formData.description.trim() === '') {
                    errors.push({
                        name: 'description',
                        error: 'Description is required'
                    })
                }
                break

            default:
                break
        }

        if (errors.length > 0) {
            setInvalidFieldNames(errors)
            return false
        } else {
            setInvalidFieldNames([])
            return true
        }
    }

    const clearValidationErrors = () => {
        setInvalidFieldNames([])
    }

    const isFieldInvalid = (fieldName) => {
        return invalidFieldNames.some(error => error.name === fieldName)
    }

    const getFieldError = (fieldName) => {
        const error = invalidFieldNames.find(error => error.name === fieldName)
        return error ? error.error : null
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
