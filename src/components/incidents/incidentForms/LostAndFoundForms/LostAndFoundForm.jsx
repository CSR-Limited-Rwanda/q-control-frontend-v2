'use client'
import '@/styles/components/_incidentForms.scss'
import React, { useState } from 'react'
import Step1Info from './steps/Step1Info'
import Step2Actions from './steps/Step2Actions'

const LostAndFoundForm = () => {
  const getStoredStep = () => {
    const stored = localStorage.getItem('lostAndFoundIncidentCurrentStep')
    return stored ? parseInt(stored, 10) : 1
  }

  useEffect(() => {
    localStorage.setItem('lostAndFoundIncidentCurrentStep', currentStep.toString())
  }, [currentStep])
  const [currentStep, setCurrentStep] = useState(getStoredStep())
  return (
    <div className='form-container'>
      {
        currentStep === 1 && <Step1Info />
      }
      {
        currentStep === 2 && <Step2Actions />
      }
    </div>
  )
}

export default LostAndFoundForm