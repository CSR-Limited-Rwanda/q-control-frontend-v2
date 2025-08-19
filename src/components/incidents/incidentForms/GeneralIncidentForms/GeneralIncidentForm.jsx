'use client'
import React, { useState, useEffect } from 'react'
import Step1IncidentInfo from './steps/Step1IncidentInfo'
import Step2LocationStatus from './steps/Step2LocationStatus'
import Step3IncidentType from './steps/Step3IncidentType'
import Step4Outcome from './steps/Step4Outcome'
import Step5Notification from './steps/Step5Notification'
import Step6Summary from './steps/Step6Summary'
import Step7Completion from './steps/Step7Completion'
import useValidate from './utils/useValidate'
import usePost from './hooks/usePost'
import useUpdate from './hooks/useUpdate'
import toast from 'react-hot-toast'
import '@/styles/components/_incidentForms.scss'
import { ArrowLeft } from 'lucide-react'

const GeneralIncidentForm = ({ initialData = {} }) => {
  // Initialize currentStep from localStorage or default to 1
  const getStoredStep = () => {
    const stored = localStorage.getItem('generalIncidentCurrentStep')
    return stored ? parseInt(stored, 10) : 1
  }

  const [currentStep, setCurrentStep] = useState(getStoredStep())
  const [formData, setFormData] = useState(initialData)
  const [isUploadingFiles, setIsUploadingFiles] = useState(false)

  // Check localStorage for existing incident ID
  const storedIncidentId = localStorage.getItem('generalIncidentId')
  const isEditing = Boolean(storedIncidentId)

  // Sync currentStep changes to localStorage
  useEffect(() => {
    localStorage.setItem('generalIncidentCurrentStep', currentStep.toString())
  }, [currentStep])

  // Safety check: If user is on step > 1 but no incident ID exists, reset to step 1
  useEffect(() => {
    if (currentStep > 1 && !storedIncidentId) {
      setCurrentStep(1)
      localStorage.removeItem('generalIncidentCurrentStep')
      toast.error('Session expired. Please start from step 1.')
    }
  }, [currentStep, storedIncidentId])

  const { invalidFieldNames, validateStep, clearValidationErrors, isFieldInvalid, getFieldError } = useValidate()
  const { postIncident, isLoading: isPosting, error: postError, success: postSuccess } = usePost()
  const { updateIncident, isLoading: isUpdating, error: updateError } = useUpdate()

  const isLoading = isPosting || isUpdating || isUploadingFiles

  // Handle upload state change from Step6Summary
  const handleUploadStateChange = (uploadState) => {
    setIsUploadingFiles(uploadState)
  }

  const handleNextStep = async () => {
    const isValid = validateStep(currentStep, formData)

    if (!isValid) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      if (isEditing) {
        await updateIncident(storedIncidentId, formData)
        toast.success('Step updated successfully')
      } else {
        await postIncident(formData)
        toast.success('Step saved successfully')
      }

      setCurrentStep((prevStep) => prevStep + 1)

    } catch (error) {
      console.error('Submission failed:', error)
      toast.error(error.message)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.')
      setFormData((prevData) => {
        const newData = {
          ...prevData,
          [parentKey]: {
            ...prevData[parentKey],
            [childKey]: value
          }
        }
        return newData
      })
    } else {

      setFormData((prevData) => {
        const newData = { ...prevData, [name]: value }
        return newData
      })
    }
  }
  return (
    <div className='incident-form'>
      <div className="form-header">
        <h2>{isEditing ? 'Edit Incident' : 'New Incident'}</h2>

        {/* Show current progress and reset option */}
        <div className="progress-info">
          <span>Step {currentStep} of 7</span>
          {(isEditing || currentStep > 1) && (
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
                  localStorage.removeItem('generalIncidentId')
                  localStorage.removeItem('generalIncidentCurrentStep')
                  window.location.reload()
                }
              }}
            >
              Start Over
            </button>
          )}
        </div>
      </div>

      {/* Display API errors */}
      {(postError || updateError) && (
        <div className="error-banner">
          <p>Error: {postError || updateError}</p>
        </div>
      )}

      <div className="fields">
        {/* from 1 to 7 */}
        {
          currentStep === 1 && <Step1IncidentInfo
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError} />
        }
        {
          currentStep === 2 && <Step2LocationStatus
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError} />
        }
        {
          currentStep === 3 && <Step3IncidentType
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError} />
        }
        {
          currentStep === 4 && <Step4Outcome
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError} />
        }
        {
          currentStep === 5 && <Step5Notification
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError} />
        }
        {
          currentStep === 6 && <Step6Summary
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
            onUploadStateChange={handleUploadStateChange} />
        }
        {
          currentStep === 7 && <Step7Completion
            formData={formData}
            onStartNew={() => {
              localStorage.removeItem('generalIncidentId')
              localStorage.removeItem('generalIncidentCurrentStep')
              window.location.reload()
            }}
            onViewDashboard={() => {
              localStorage.removeItem('generalIncidentId')
              localStorage.removeItem('generalIncidentCurrentStep')
              window.location.href = '/dashboard'
            }}
          />
        }
      </div>

      {/* Only show buttons if not on Step 7 - Step7Completion handles its own buttons */}
      {currentStep < 7 && (
        <div className="buttons">
          {/* buttons */}
          {
            currentStep > 1 && (
              <div className='back-button' onClick={() => setCurrentStep((prevStep) => prevStep - 1)} disabled={isLoading}>
                <ArrowLeft />
                {isUploadingFiles ? 'Uploading...' : isLoading ? 'Loading...' : 'Back'}
              </div>
            )
          }
          {
            currentStep < 7 && (
              <button onClick={handleNextStep} disabled={isLoading}>
                {isUploadingFiles ? 'Uploading files...' : isLoading ? 'Processing...' : currentStep === 6 ? 'Submit' : 'Next'}
              </button>
            )
          }
        </div>
      )}

    </div>
  )
}

export default GeneralIncidentForm