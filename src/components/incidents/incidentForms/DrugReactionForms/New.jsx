'use client'
import React, { useState, useEffect } from 'react'
import Step1IncidentInfo from './steps/Step1IncidentInfo'
import Step2EventDetails from './steps/Step2EventDetails'
import Step3MedicationDose from './steps/Step3MedicationDose'
import Step4ReactionDetails from './steps/Step4ReactionDetails'
import Step5Notifications from './steps/Step5Notifications'
import Step6ActionsTreatment from './steps/Step6ActionsTreatment'
import Step7Outcome from './steps/Step7Outcome'
import Step8Summary from './steps/Step8Summary'
import useValidate from './utils/useValidate'
import usePost from './hooks/usePost'
import useUpdate from './hooks/useUpdate'
import toast from 'react-hot-toast'
import '@/styles/components/_incidentForms.scss'
import { ArrowLeft } from 'lucide-react'

const DrugReactionForm = ({ initialData = {} }) => {
    // Initialize currentStep from localStorage or default to 1
    const getStoredStep = () => {
        const stored = localStorage.getItem('drugReactionIncidentCurrentStep')
        return stored ? parseInt(stored, 10) : 1
    }

    const [currentStep, setCurrentStep] = useState(1 || getStoredStep())
    const [formData, setFormData] = useState(initialData)
    const [isUploadingFiles, setIsUploadingFiles] = useState(false)

    // Check localStorage for existing incident ID
    const storedIncidentId = localStorage.getItem('drugReactionIncidentId')
    const isEditing = Boolean(storedIncidentId)

    // Sync currentStep changes to localStorage
    useEffect(() => {
        localStorage.setItem('drugReactionIncidentCurrentStep', currentStep.toString())
    }, [currentStep])

    // Safety check: If user is on step > 1 but no incident ID exists, reset to step 1
    useEffect(() => {
        if (currentStep > 1 && !storedIncidentId) {
            setCurrentStep(1)
            localStorage.removeItem('drugReactionIncidentCurrentStep')
            toast.error('Session expired. Please start from step 1.')
        }
    }, [currentStep, storedIncidentId])

    const { invalidFieldNames, validateStep, clearValidationErrors, isFieldInvalid, getFieldError } = useValidate()
    const { postIncident, isLoading: isPosting, error: postError, success: postSuccess } = usePost()
    const { updateIncident, isLoading: isUpdating, error: updateError } = useUpdate()

    const isLoading = isPosting || isUpdating || isUploadingFiles

    // Handle upload state change from Step8Summary
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
            // Prepare form data with required API structure
            const submitData = {
                ...formData,
                // Always set these default values for drug reaction incidents
                status: "Draft",
                current_step: currentStep,
                is_resolved: false,
                // Ensure nested objects have profile_type
                patient_name: {
                    ...formData.patient_name,
                    profile_type: "Patient"
                },
                observers_name: formData.observers_name ? {
                    ...formData.observers_name,
                    profile_type: "Staff"
                } : undefined,
                name_of_physician_notified: formData.name_of_physician_notified ? {
                    ...formData.name_of_physician_notified,
                    profile_type: "Physician"
                } : undefined,
                name_of_family_notified: formData.name_of_family_notified ? {
                    ...formData.name_of_family_notified,
                    profile_type: "Family"
                } : undefined,
                notified_by: formData.notified_by ? {
                    ...formData.notified_by,
                    profile_type: "Staff"
                } : undefined
            }

            if (isEditing) {
                await updateIncident(storedIncidentId, submitData)
                toast.success('Step updated successfully')
            } else {
                await postIncident(submitData)
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

        // Clear validation errors for the changed field
        clearValidationErrors()
    }

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prevStep) => prevStep - 1)
        }
    }

    const renderStepContent = () => {
        const stepProps = {
            formData,
            onChange: handleChange,
            isFieldInvalid,
            getFieldError
        }

        switch (currentStep) {
            case 1:
                return <Step1IncidentInfo {...stepProps} />
            case 2:
                return <Step2EventDetails {...stepProps} />
            case 3:
                return <Step3MedicationDose {...stepProps} />
            case 4:
                return <Step4ReactionDetails {...stepProps} />
            case 5:
                return <Step5Notifications {...stepProps} />
            case 6:
                return <Step6ActionsTreatment {...stepProps} />
            case 7:
                return <Step7Outcome {...stepProps} />
            case 8:
                return <Step8Summary {...stepProps} onUploadStateChange={handleUploadStateChange} />
            default:
                return <div>Invalid step</div>
        }
    }

    const getStepTitle = () => {
        const titles = {
            1: 'Incident Information',
            2: 'Event Details',
            3: 'Medication and Dose',
            4: 'Reaction Details',
            5: 'Notifications',
            6: 'Actions and Treatment',
            7: 'Outcome',
            8: 'Summary'
        }
        return titles[currentStep] || 'Unknown Step'
    }

    return (
        <div className="incident-form-container">
            <div className="form-header">
                <h2>Anaphylaxis/Adverse Drug Reaction Report</h2>
                <div className="step-indicator">
                    Step {currentStep} of 8: {getStepTitle()}
                </div>
            </div>

            <div className="form-content">
                {renderStepContent()}
            </div>

            <div className="form-navigation">
                {currentStep > 1 && (
                    <button
                        type="button"
                        onClick={handlePreviousStep}
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        <ArrowLeft size={16} />
                        Previous
                    </button>
                )}

                {currentStep < 8 && (
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Next'}
                    </button>
                )}

                {currentStep === 8 && (
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="btn btn-success"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Report'}
                    </button>
                )}
            </div>
        </div>
    )
}

export default DrugReactionForm