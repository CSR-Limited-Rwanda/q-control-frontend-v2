import React, { useState } from 'react'
import api, { cleanedData, API_URL } from '@/utils/api'
import { useAuthentication } from "@/context/authContext";
import toast from "react-hot-toast";

const usePost = () => {
  const {user} = useAuthentication();
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)
    const [currentStep, setCurrentStep] = useState(1);
    const [currentFacility, setCurrentFacility] = useState(user.facility);
    const [departmentId, setDepartmentId] = useState(localStorage.getItem("departmentId"));

    const postLostAndFound = async (formData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)
        console.log("Form data: ", formData)

    const data = {
      current_step: currentStep,
      facility_id: user.facility.id,
      department: departmentId,
      report_facility_id: currentFacility?.id,
      reported_by: {
        first_name: formData.reporterFirstName || '',
        last_name: formData.reporterLastName || '',
        profile_type: "Staff",
      },
      property_name: formData.propertyName || '',
      item_description: formData.descriptionOfProperty || '',
      date_reported: formData.dateReporting || '',
      time_reported: formData.timeReporting || '',
      relation_to_patient: formData.relationship || '',
      taken_by: {
        first_name: formData.patientFirstName || '',
        last_name: formData.patientLastName || '',
        profile_type: "Patient",
      },
      date_found: formData.dateFound || '',
      location_found: formData.location || '',
      status: "Draft",
    };

    try {
      const response = await api.post(
        `${API_URL}/incidents/lost-found/`,
        cleanedData(data)
      );

      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("lost_found_id", response.data.id);
        toast.success("Data posted successfully");
        localStorage.setItem("updateNewIncident", "true");
        if (currentStep <= 3) {
          setCurrentStep(currentStep + 1);
        }

        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Detailed error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config,
      });

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to post data";
      toast.error(errorMessage);
    }
  }
  return {
    postLostAndFound,
    isLoading,
    error,
    success
  }
}

export default usePost