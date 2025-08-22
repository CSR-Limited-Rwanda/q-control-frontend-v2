import React, { useState } from 'react'
import api, { cleanedData, API_URL } from '@/utils/api'
import toast from "react-hot-toast";
import postDocumentHistory from "@/components/incidents/documentHistory/postDocumentHistory";

const useUpdate = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Function to fetch existing data for editing
  async function fetchIncidentData(incidentId) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await api.get(`${API_URL}/incidents/lost-found/${incidentId}/`)

      if (response.status === 200) {
        console.log("Fetched incident data for editing:", response.data)
        return response.data
      }
    } catch (error) {
      console.error("Error fetching incident data:", error)
      const errorMessage = error.response?.data?.message || "Failed to fetch data"
      toast.error(errorMessage)
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  async function updateIncident(incidentId, formData) {
    setIsLoading(true)
    setError(null)

    console.log("useUpdate called with incidentId:", incidentId)
    console.log("useUpdate formData:", formData)

    const data = {
      current_step: 2,
      // Include all Step 1 data for complete update
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

      status: "Completed",
    }

    console.log("useUpdate final data payload:", data)
    const payload = cleanedData(data);
    console.log("useUpdate cleaned payload:", payload)

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
    fetchIncidentData,
    isLoading,
    error
  }
}

export default useUpdate