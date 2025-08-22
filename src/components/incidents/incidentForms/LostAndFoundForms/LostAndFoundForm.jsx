"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect, useRef } from "react";
import { validateStep } from "../../validators/GeneralIncidentFormValidator";
import api, { API_URL, cleanedData, calculateAge } from "@/utils/api";
import Step1InfoForm from "./steps/Step1InfoForm";
import Step2ActionsForm from "./steps/Step2ActionsForm";
import Step3CompletionForm from "./steps/Step3CompletionForm";
import postDocumentHistory from "../../documentHistory/postDocumentHistory";
import { ArrowLeft, CircleCheck, MoveRight } from "lucide-react";
import DraftPopup from "@/components/DraftPopup";
import "../../../../styles/_forms.scss";
import { useAuthentication } from "@/context/authContext";
import CloseIcon from "@/components/CloseIcon";
import useValidate from "./utils/useValidate";
import usePost from "./hooks/usePost";
import useUpdate from "./hooks/useUpdate";

const LostAndFoundForm = ({ initialData = {} }) => {

const getStoredStep = () => {
  const stored = localStorage.getItem('lostAndFoundCurrentStep')
  return stored ? parseInt(stored, 10) : 1
}

// Initialize form data with proper default values to prevent null issues
const getInitialFormData = () => {
  const defaultData = {
    // Step 1 fields
    reported_by: {
      first_name: '',
      last_name: '',
    },
    taken_by: {
      first_name: '',
      last_name: '',
    },
    property_name: '',
    item_description: '',
    date_reported: '',
    time_reported: '',
    relation_to_patient: '',

    // Step 2 fields
    action_taken: '',
    property_found: false,
    property_returned: false,
    location_found: '',
    date_found: '',
    time_found: '',
    location_returned: '',
    returned_to: '',
    date_returned: '',
    time_returned: '',
  }

  // Merge with initial data if provided
  return { ...defaultData, ...initialData }
}

const [currentStep, setCurrentStep] = useState(1 || getStoredStep())
const [formData, setFormData] = useState(getInitialFormData())

const storedLostFoundId = localStorage.getItem("lost_found_id");
// Only consider editing if we have an ID AND we're not on step 1
const isEditing = Boolean(storedLostFoundId && currentStep > 1);

// Temporarily disable session expiry check to fix Step 2 issues
// useEffect(() => {
//  // Only check for session expiry if we're not on completion step (step 3)
//  // and only if we actually expect to have a stored ID (i.e., after step 1 completion)
//  if (currentStep > 1 && currentStep < 3 && !storedLostFoundId) {
//    // Don't redirect immediately - give user a chance to complete step 1 first
//    const hasCompletedStep1 = localStorage.getItem('lostAndFoundCurrentStep') === '2'
//    if (hasCompletedStep1) {
//      setCurrentStep(1)
//      localStorage.removeItem('lostAndFoundCurrentStep')
//      toast.error('Session expired. Please start from step 1.')
//    }
//  }
// }, [currentStep, storedLostFoundId])

// Clear any existing lost_found_id when starting a new form
useEffect(() => {
 if (!initialData || Object.keys(initialData).length === 0) {
   // This is a new form, clear any existing IDs
   localStorage.removeItem('lost_found_id')
 }
}, [initialData])

// Function to initialize edit mode with existing data
const initializeEditMode = async (incidentId) => {
  try {
    console.log("Initializing edit mode for incident:", incidentId)
    localStorage.setItem('lost_found_id', incidentId)

    const existingData = await fetchIncidentData(incidentId)
    console.log("Loading existing data for editing:", existingData)

    // Transform API data to form structure - ensure no null values
    const formData = {
      // Step 1 fields
      reported_by: {
        first_name: existingData.reported_by?.first_name || '',
        last_name: existingData.reported_by?.last_name || '',
      },
      taken_by: {
        first_name: existingData.taken_by?.first_name || '',
        last_name: existingData.taken_by?.last_name || '',
      },
      property_name: existingData.property_name || '',
      item_description: existingData.item_description || '',
      date_reported: existingData.date_reported || '',
      time_reported: existingData.time_reported || '',
      relation_to_patient: existingData.relation_to_patient || '',

      // Step 2 fields
      action_taken: existingData.action_taken || '',
      property_found: existingData.property_found || false,
      property_returned: existingData.property_returned || false,
      location_found: existingData.location_found || '',
      date_found: existingData.date_found || '',
      time_found: existingData.time_found || '',
      location_returned: existingData.location_returned || '',
      returned_to: existingData.returned_to || '',
      date_returned: existingData.date_returned || '',
      time_returned: existingData.time_returned || '',
    }

    console.log("Transformed form data:", formData)

    setFormData(formData)

    // Set step based on completion status
    if (existingData.status === 'Completed') {
      setCurrentStep(3) // Go to completion
    } else {
      setCurrentStep(existingData.current_step || 1)
    }

    toast.success("Form loaded for editing")

  } catch (error) {
    console.error("Error initializing edit mode:", error)
    toast.error("Failed to load data for editing")
  }
}

// Auto-load existing data when editing (for direct URL access)
useEffect(() => {
  const loadExistingData = async () => {
    if (storedLostFoundId && isEditing) {
      await initializeEditMode(storedLostFoundId)
    }
  }

  loadExistingData()
}, [storedLostFoundId, isEditing])
 
  const { invalidFieldNames, validateStep, clearValidationErrors, isFieldInvalid, getFieldError } = useValidate()
  const { postLostAndFound, isLoading: isPosting, error: postError, success: postSuccess } = usePost()
  const { updateIncident, fetchIncidentData, isLoading: isUpdating, error: updateError } = useUpdate()

  const isLoading = isPosting || isUpdating

  const handleNextStep = async () => {
    const isValid = validateStep(currentStep, formData)

    if (!isValid) {
      toast.error('Please fill in all required fields')
      return
    }
    try{
      if (isEditing) {
        await updateIncident(storedLostFoundId, formData)
        if (currentStep === 2) {
          toast.success('Lost and Found report updated successfully!')
        } else {
          toast.success('Step updated successfully')
        }
      } else {
        await postLostAndFound(formData)
        if (currentStep === 2) {
          toast.success('Lost and Found report saved successfully!')
        } else {
          toast.success('Step saved successfully')
        }
      }

      // Move to next step or completion
      if (currentStep === 2) {
        setCurrentStep(3) // Go directly to completion
        // Don't clean up localStorage here - let the completion step handle it
        // or the user can manually start over using the "Start Over" button
      } else {
        setCurrentStep((prevStep) => prevStep + 1)
      }
    } catch (error) {
      console.error('Submission failed:', error)
      toast.error(error.message)
    }
  }

  const handleChange = (e) => {
    // Handle cases where e.target might be undefined
    if (!e || !e.target) {
      console.warn('handleChange called with invalid event object:', e)
      return
    }

    const { name, value } = e.target

    if (!name) {
      console.warn('handleChange called without name property:', e.target)
      return
    }

    console.log('handleChange called:', { name, value, currentStep, isEditing })

    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.')
      setFormData((prevData) => {
        const newData = {
          ...prevData,
          [parentKey]: {
            ...prevData[parentKey],
            [childKey]: value || '' // Ensure value is never null
          }
        }
        console.log('Updated nested field:', { parentKey, childKey, value: value || '', newData })
        return newData
      })
    } else {
      setFormData((prevData) => {
        const newData = { ...prevData, [name]: value || '' } // Ensure value is never null
        console.log('Updated direct field:', { name, value: value || '', newData })
        return newData
      })
    }
  }


  return (
    <div className="form-container">
      <div className="forms-header">
        <h2>{isEditing ? 'Edit Lost and Found' : 'New Lost and Found'}</h2>
          <div className="progress-info">
            <span>Step {currentStep} of 3 {currentStep === 2 ? '(Final Step - Save & Complete)' : ''}</span>
          {(isEditing || currentStep > 1) && (
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                if (window.confirm('Are you sure you want to start over? All progress will be lost.')) {
                  localStorage.removeItem('lost_found_id')
                  localStorage.removeItem('lostAndFoundCurrentStep')
                  window.location.reload()
                }
              }}
            >
              Start Over
            </button>
          )}
        </div>
      
      </div>

     {(postError || updateError) && (
          <div className="error-banner">
            <p>Error: {postError || updateError}</p>
            </div>
        )}
        {
          currentStep === 1 && <Step1InfoForm 
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          
          />
        }
        {
          currentStep === 2 && <Step2ActionsForm 
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            isFieldInvalid={isFieldInvalid}
            getFieldError={getFieldError}
          
          />
        }
        {
          currentStep === 3 && <Step3CompletionForm 
            formData={formData}
           onStartNew={() => {
            localStorage.removeItem('')
            localStorage.removeItem('')
            window.location.reload()
           }}
           onViewDashboard={() => {
            localStorage.removeItem('')
            localStorage.removeItem('')
            window.location.href = '/dashboard'
           }}
          
          />
        }
        {currentStep < 3 && (
          <div className="buttons">
            {
              currentStep > 1 && (
                <div className="back-button"  onClick={() => setCurrentStep((prevStep) => prevStep - 1)} disabled={isLoading}>
                  <ArrowLeft />
                  Back
                  </div>
              )
            }
            {
              currentStep < 3 && (
                <button onClick={handleNextStep} disabled={isLoading}>
                  {currentStep === 2 ? 'Save' : 'Next'}
                </button>

              )

            }
           
          </div>
        )}
    </div>
  );
};

export default LostAndFoundForm
