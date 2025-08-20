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
      if (!formData.reporterFirstName?.trim()) {
        errors.reporterFirstName = 'Reporter first name is required'
        invalidFields.push('reporterFirstName')
        isValid = false
      }

      if (!formData.reporterLastName?.trim()) {
        errors.reporterLastName = 'Reporter last name is required'
        invalidFields.push('reporterLastName')
        isValid = false
      }

      if (!formData.patientFirstName?.trim()) {
        errors.patientFirstName = 'Patient first name is required'
        invalidFields.push('patientFirstName')
        isValid = false
      }

      if (!formData.patientLastName?.trim()) {
        errors.patientLastName = 'Patient last name is required'
        invalidFields.push('patientLastName')
        isValid = false
      }

      if (!formData.dateReporting?.trim()) {
        errors.dateReporting = 'Date Reporting is required'
        invalidFields.push('dateReporting')
        isValid = false
      }

      if (!formData.timeReporting?.trim()) {
        errors.timeReporting = 'Time Reporting is required'
        invalidFields.push('timeReporting')
        isValid = false
      }

      if (!formData.propertyName?.trim()) {
        errors.propertyName = 'Property Name is required'
        invalidFields.push('propertyName')
        isValid = false
      }

      if (!formData.descriptionOfProperty?.trim()) {
        errors.descriptionOfProperty = 'Description Of Property is required'
        invalidFields.push('descriptionOfProperty')
        isValid = false
      }
    }

    // Step 2 validation
    if (step === 2) {
      if (!formData.actionTaken?.trim()) {
        errors.actionTaken = 'Actions taken are required'
        invalidFields.push('actionTaken')
        isValid = false
      }

      // Conditional validation for returned properties
      if (formData.checkboxReturnedChecked) {
        if (!formData.propertyReturnedTo?.trim()) {
          errors.propertyReturnedTo = 'Property returned to is required'
          invalidFields.push('propertyReturnedTo')
          isValid = false
        }

        if (!formData.dateReturned?.trim()) {
          errors.dateReturned = 'Date returned is required'
          invalidFields.push('dateReturned')
          isValid = false
        }

        if (!formData.timeReturned?.trim()) {
          errors.timeReturned = 'Time returned is required'
          invalidFields.push('timeReturned')
          isValid = false
        }

        if (!formData.locationReturned?.trim()) {
          errors.locationReturned = 'Location returned is required'
          invalidFields.push('locationReturned')
          isValid = false
        }
      }

      // Conditional validation for found properties
      if (formData.checkboxChecked) {
        if (!formData.location?.trim()) {
          errors.location = 'Location found is required'
          invalidFields.push('location')
          isValid = false
        }

        if (!formData.dateFound?.trim()) {
          errors.dateFound = 'Date found is required'
          invalidFields.push('dateFound')
          isValid = false
        }

        if (!formData.timeFound?.trim()) {
          errors.timeFound = 'Time found is required'
          invalidFields.push('timeFound')
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
