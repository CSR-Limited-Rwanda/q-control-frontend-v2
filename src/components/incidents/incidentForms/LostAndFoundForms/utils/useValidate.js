import { useState } from 'react'

const useValidate = () => {
  const [invalidFieldNames, setInvalidFieldNames] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})

  const validateStep = (step, formData) => {
    setInvalidFieldNames([])
    setFieldErrors({})

    let isValid = true
    const errors = {}
    const invalidFields = []

    // Step 1 validation
    if (step === 1) {
      if (!formData.taken_by?.first_name?.trim()) {
        errors.reporterFirstName = 'Reporter first name is required'
        invalidFields.push('reporterFirstName')
        isValid = false
      }

      if (!formData.taken_by?.last_name?.trim()) {
        errors.reporterLastName = 'Reporter last name is required'
        invalidFields.push('reporterLastName')
        isValid = false
      }

      if (!formData.reported_by?.first_name?.trim()) {
        errors.patientFirstName = 'Patient first name is required'
        invalidFields.push('patientFirstName')
        isValid = false
      }

      if (!formData.reported_by?.last_name?.trim()) {
        errors.patientLastName = 'Patient last name is required'
        invalidFields.push('patientLastName')
        isValid = false
      }

      if (!formData.date_reported?.trim()) {
        errors.date_reported = 'Date Reporting is required'
        invalidFields.push('date_reported')
        isValid = false
      }

      if (!formData.time_reported?.trim()) {
        errors.time_reported = 'Time Reporting is required'
        invalidFields.push('time_reported')
        isValid = false
      }

      if (!formData.property_name?.trim()) {
        errors.property_name = 'Property Name is required'
        invalidFields.push('property_name')
        isValid = false
      }

      if (!formData.item_description?.trim()) {
        errors.item_description = 'Description Of Property is required'
        invalidFields.push('item_description')
        isValid = false
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!formData.action_taken?.trim()) {
        errors.action_taken = 'Actions taken are required'
        invalidFields.push('action_taken')
        isValid = false
      }

      // Conditional validation for found properties
      if (formData.property_found) {
        if (!formData.location_found?.trim()) {
          errors.location_found = 'Location found is required'
          invalidFields.push('location_found')
          isValid = false
        }

        if (!formData.date_found?.trim()) {
          errors.date_found = 'Date found is required'
          invalidFields.push('date_found')
          isValid = false
        }

        if (!formData.time_found?.trim()) {
          errors.time_found = 'Time found is required'
          invalidFields.push('time_found')
          isValid = false
        }

        if (!formData.taken_by?.first_name?.trim()) {
          errors.foundByFirstName = 'First name of person who found property is required'
          invalidFields.push('foundByFirstName')
          isValid = false
        }

        if (!formData.taken_by?.last_name?.trim()) {
          errors.foundByLastName = 'Last name of person who found property is required'
          invalidFields.push('foundByLastName')
          isValid = false
        }
      }

      // Conditional validation for returned properties
      if (formData.property_returned) {
        if (!formData.location_returned?.trim()) {
          errors.location_returned = 'Location returned is required'
          invalidFields.push('location_returned')
          isValid = false
        }

        if (!formData.returned_to?.trim()) {
          errors.returned_to = 'Property returned to is required'
          invalidFields.push('returned_to')
          isValid = false
        }

        if (!formData.date_returned?.trim()) {
          errors.date_returned = 'Date returned is required'
          invalidFields.push('date_returned')
          isValid = false
        }

        if (!formData.time_returned?.trim()) {
          errors.time_returned = 'Time returned is required'
          invalidFields.push('time_returned')
          isValid = false
        }
      }
    }

    setInvalidFieldNames(invalidFields)
    setFieldErrors(errors)

    return isValid
  }

  const clearValidationErrors = () => {
    setInvalidFieldNames([])
    setFieldErrors({})
  }

  const isFieldInvalid = (fieldName) => {
    return invalidFieldNames.includes(fieldName)
  }

  const getFieldError = (fieldName) => {
    return fieldErrors[fieldName] || ''
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
