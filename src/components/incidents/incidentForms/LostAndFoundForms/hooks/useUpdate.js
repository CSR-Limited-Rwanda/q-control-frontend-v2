import React, { useState } from 'react'
import api, { cleanedData, API_URL } from '@/utils/api'
import toast from "react-hot-toast";
import postDocumentHistory from "@/components/incidents/documentHistory/postDocumentHistory";

const useUpdate = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  async function updateIncident(incidentId, formData) {
    setIsLoading(true)
    setError(null)

    const data = {
      current_step: 2,
      action_taken: formData.actionTaken || '',
      ...(formData.checkboxReturnedChecked && {
        returned_to: formData.propertyReturnedTo || '',
        date_returned: formData.dateReturned || '',
        time_returned: formData.timeReturned || '',
        location_returned: formData.locationReturned || '',
      }),
      ...(formData.checkboxChecked && {
        location_found: formData.location || '',
        date_found: formData.dateFound || '',
        time_found: formData.timeFound || '',
        is_found: formData.checkboxChecked ? "True" : "False",
        found_by: {
          first_name: formData.personWhoFoundPropertyFirstName || '',
          last_name: formData.personWhoFoundPropertyLastName || '',
          profile_type: "Visitor",
        },
      }),
    }

    const payload = cleanedData(data);

    try {
      const response = await api.put(
        `${API_URL}/incidents/lost-found/${incidentId}/`,
        payload
      );

      toast.success("Data updated successfully");

      if (data.current_step === 2) {
        postDocumentHistory(incidentId, "added a new incident", "create");
        localStorage.setItem("updateNewIncident", "false");
      }

      return response
    } catch (error) {
      console.error("UPDATE ERROR:", error);
      if (error.response?.data) {
        console.error(
          "SERVER ERROR:",
          JSON.stringify(error.response.data, null, 2)
        );
      }
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to update data";
      toast.error(errorMessage);
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false);
    }
  }

  return {
    updateIncident,
    isLoading,
    error
  }
}

export default useUpdate