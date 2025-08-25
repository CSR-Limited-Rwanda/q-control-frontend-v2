import React from 'react'

const useHandlers = () => {

    
      const handleSaveChange = async () => {
        if (currentStep === 2) {
          const isValid = validateStep({
            action_taken: actionTaken,
            ...(checkboxReturnedChecked && {
              returned_to: propertyReturnedTo,
              date_returned: dateReturned,
              time_returned: timeReturned,
              location_returned: locationReturned,
            }),
            ...(checkboxChecked && {
              location_found: location,
              date_found: dateFound,
              time_found: timeFound,
            }),
          });
    
          const data = {
            current_step: currentStep,
            action_taken: actionTaken,
            ...(checkboxReturnedChecked && {
              returned_to: propertyReturnedTo,
              date_returned: dateReturned,
              time_returned: timeReturned,
              location_returned: locationReturned,
            }),
            ...(checkboxChecked && {
              location_found: location,
              date_found: dateFound,
              time_found: formatTime(timeFound),
              is_found: checkboxChecked ? "True" : "False",
              found_by: {
                first_name: personWhoFoundPropertyFirstName,
                last_name: personWhoFoundPropertyLastName,
                profile_type: "Visitor",
              },
            }),
          };
          if (isValid) {
            setIsLoading(true);
            patchData(data);
          } else {
            toast.error("Please fill in all required fields.");
          }
        }
      };
    const handleDateOfBirth = (date) => {
          const calculatedAge = calculateAge(date);
          setDateBirth(date);
          setAge(calculatedAge);
        };
    
   
    
      const handlePreviousStep = () => {
        currentStep > 1 ? setCurrentStep(currentStep - 1) : setCurrentStep(1);
      };
    
      const handleCheckboxChange = () => {
        setCheckboxChecked(!checkboxChecked);
      };
    
      const handleCheckboxReturn = () => {
        setCheckboxReturnedChecked(!checkboxReturnedChecked);
      };
    
      const handleCurrentFacility = (facilityId) => {
        const selectedFacility = user?.accounts?.find(
          (facility) => facility.id === parseInt(facilityId)
        );
        setCurrentFacility(selectedFacility);
      };
  return {
    handleSaveChange,
    handleDateOfBirth,
    handlePreviousStep,
    handleCheckboxChange,
    handleCheckboxReturn,
    handleCurrentFacility


  }
}

export default useHandlers