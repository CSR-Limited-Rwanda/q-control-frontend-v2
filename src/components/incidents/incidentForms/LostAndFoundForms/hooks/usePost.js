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

    console.log("Building data payload with formData:", formData)

    const data = {
      current_step: currentStep,
      facility_id: user.facility.id,
      department: departmentId,
      report_facility_id: currentFacility?.id,
      // Step 1 data
      reported_by: {
        first_name: formData.reported_by?.first_name || '',
        last_name: formData.reported_by?.last_name || '',
        profile_type: "Patient",
      },
      property_name: formData.property_name || '',
      item_description: formData.item_description || '',
      date_reported: formData.date_reported || '',
      time_reported: formData.time_reported || '',
      relation_to_patient: formData.relation_to_patient || '',
      taken_by: {
        first_name: formData.taken_by?.first_name || '',
        last_name: formData.taken_by?.last_name || '',
        profile_type: "Staff",
      },
      // Step 2 data
      action_taken: formData.action_taken || '',
      property_found: formData.property_found || false,
      property_returned: formData.property_returned || false,

      // Conditional Step 2 fields
      ...(formData.property_found && {
        location_found: formData.location_found || '',
        date_found: formData.date_found || '',
        time_found: formData.time_found || '',
        found_by: {
          first_name: formData.taken_by?.first_name || '',
          last_name: formData.taken_by?.last_name || '',
          profile_type: "Visitor",
        },
        is_found: "True",
      }),

      ...(formData.property_returned && {
        location_returned: formData.location_returned || '',
        returned_to: formData.returned_to || '',
        date_returned: formData.date_returned || '',
        time_returned: formData.time_returned || '',
      }),

      status: currentStep === 2 ? "Completed" : "Draft",
    };

    console.log("Final data payload being sent to API:", data)

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