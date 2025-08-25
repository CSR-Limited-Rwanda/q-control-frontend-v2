import { useState } from 'react'
import { calculateAge } from '@/utils/api'

export const useDrugReactionHandlers = () => {
    // Age calculation handler
    const handleDateOfBirth = (date, setDateOfBirth, setAge) => {
        const calculatedAge = calculateAge(date)
        setDateOfBirth(date)
        setAge(calculatedAge)
    }

    // Handle checkbox arrays (multi-select)
    const handleCheckboxArrayChange = (option, currentArray, setArray) => {
        let updatedOptions
        if (currentArray.includes(option)) {
            updatedOptions = currentArray.filter((item) => item !== option)
        } else {
            updatedOptions = [...currentArray, option]
        }
        setArray(updatedOptions)
    }

    // Handle single checkbox toggle
    const handleCheckboxToggle = (currentValue, setValue) => {
        setValue(!currentValue)
    }

    // Handle radio button selection with "other" option
    const handleRadioWithOther = (value, setValue, setOtherValue, setShowOther) => {
        setValue(value)
        if (value !== 'Other' && value !== 'other' && value !== 'Other note') {
            setShowOther && setShowOther(false)
            setOtherValue && setOtherValue('')
        } else {
            setShowOther && setShowOther(true)
        }
    }

    // Handle array selection (like agreements, outcomes)
    const handleArraySelection = (item, currentArray, setArray) => {
        if (currentArray.includes(item)) {
            // Remove if already selected
            setArray(currentArray.filter((selectedItem) => selectedItem !== item))
        } else {
            // Add if not already selected
            setArray([...currentArray, item])
        }
    }

    // Handle outcome changes for checkboxes
    const handleOutcomeChange = (value, currentArray, setArray) => {
        if (currentArray.includes(value)) {
            setArray(currentArray.filter((item) => item !== value))
        } else {
            setArray([...currentArray, value])
        }
    }

    // Handle route selection based on type
    const handleRouteSelection = (route, setRoute, setShowDescription, setDescription) => {
        setRoute(route)

        if (route === 'IV Push' || route === 'IV Drip') {
            setShowDescription && setShowDescription(true)
        } else {
            setShowDescription && setShowDescription(false)
            setDescription && setDescription('')
        }
    }

    // Handle facility selection
    const handleFacilitySelection = (facilityId, user, setCurrentFacility) => {
        const selectedFacility = user?.accounts?.find(
            (facility) => facility.id === parseInt(facilityId)
        )
        setCurrentFacility(selectedFacility)
    }

    // Handle file uploads
    const handleFileChange = (event, setFiles) => {
        setFiles(event.target.files)
    }

    // Handle note type selection with toggle for "other"
    const handleNoteTypeChange = (noteType, setNurseNote, setProgressNote, setOtherNote, setOtherNoteDescription) => {
        // Reset all note types
        setNurseNote(false)
        setProgressNote(false)
        setOtherNote(false)

        // Set the selected note type
        switch (noteType) {
            case 'Nurse note':
                setNurseNote(true)
                break
            case 'Progress note':
                setProgressNote(true)
                break
            case 'Other note':
                setOtherNote(true)
                break
            default:
                break
        }

        // Clear other note description if not selecting "other"
        if (noteType !== 'Other note') {
            setOtherNoteDescription && setOtherNoteDescription('')
        }
    }

    return {
        handleDateOfBirth,
        handleCheckboxArrayChange,
        handleCheckboxToggle,
        handleRadioWithOther,
        handleArraySelection,
        handleOutcomeChange,
        handleRouteSelection,
        handleFacilitySelection,
        handleFileChange,
        handleNoteTypeChange
    }
}

export default useDrugReactionHandlers
