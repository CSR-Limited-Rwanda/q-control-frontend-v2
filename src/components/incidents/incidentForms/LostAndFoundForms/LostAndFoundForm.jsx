"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect } from "react";
import Step1InfoForm from "./steps/Step1InfoForm";
import Step2ActionsForm from "./steps/Step2ActionsForm";
import Step3CompletionForm from "./steps/Step3CompletionForm";
import { ArrowLeft} from "lucide-react";
import "../../../../styles/_forms.scss";
import useValidate from "./utils/useValidate";
import usePost from "./hooks/usePost";
import useUpdate from "./hooks/useUpdate";

const LostAndFoundForm = ({ initialData = {}, togglePopup }) => {
const getStoredStep = () => {
  const stored = localStorage.getItem('lostAndFoundCurrentStep')
  return stored ? parseInt(stored, 10) : 1
}


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

  return { ...defaultData, ...initialData }
}

const [currentStep, setCurrentStep] = useState(1 || getStoredStep())
const [formData, setFormData] = useState(getInitialFormData())
const storedLostFoundId = localStorage.getItem("lost_found_id");
const isEditing = Boolean(storedLostFoundId && currentStep > 1);

useEffect(() => {
 if (!initialData || Object.keys(initialData).length === 0) {
  
   localStorage.removeItem('lost_found_id')
 }
}, [initialData])

const initializeEditMode = async (incidentId) => {
  try {
    console.log("Initializing edit mode for incident:", incidentId)
    localStorage.setItem('lost_found_id', incidentId)

    const existingData = await fetchIncidentData(incidentId)
    console.log("Loading existing data for editing:", existingData)

   
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
    setFormData(formData)

    if (existingData.status === 'Completed') {
      setCurrentStep(3) 
    } else {
      setCurrentStep(existingData.current_step || 1)
    }

    toast.success("Form loaded for editing")

  } catch (error) {
    console.error("Error initializing edit mode:", error)
    toast.error("Failed to load data for editing")
  }
}

useEffect(() => {
  const loadExistingData = async () => {
    if (storedLostFoundId && isEditing) {
      await initializeEditMode(storedLostFoundId)
    }
  }

  loadExistingData()
}, [storedLostFoundId, isEditing])
 
  const { invalidFieldNames, validateStep, isFieldInvalid, getFieldError } = useValidate()
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

      if (currentStep === 2) {
        setCurrentStep(3) 
      } else {
        setCurrentStep((prevStep) => prevStep + 1)
      }
    } catch (error) {
      console.error('Submission failed:', error)
      toast.error(error.message)
    }
  }

  const handleChange = (e) => {
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
            [childKey]: value || '' 
          }
        }
        console.log('Updated nested field:', { parentKey, childKey, value: value || '', newData })
        return newData
      })
    } else {
      setFormData((prevData) => {
        const newData = { ...prevData, [name]: value || '' }
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
              )}
             <button
                onClick={togglePopup}
                id="continue-button"
                className="incident-back-btn"
              >
                <span>Cancel</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            {
              currentStep < 3 && (
                <button onClick={handleNextStep} disabled={isLoading}>
                  {currentStep === 2 ? 'Save' : 'Next'}
                </button>
              )}    
          </div>
        )}
    </div>
  );
};
export default LostAndFoundForm