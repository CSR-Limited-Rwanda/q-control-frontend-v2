import api, { cleanedData } from '@/utils/api'
import { useState } from 'react'

const useUpdate = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const updateIncident = async (incidentId, formData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)
        console.log("Updating incident with data: ", formData)

        try {
            const cleanedFormData = cleanedData(formData)
            console.log("Cleaned update data: ", cleanedFormData)
            const response = await api.put(`/incidents/general-visitor/${incidentId}/`, cleanedFormData)

            // Check if the response is successful (200-299 status codes)
            if (response.status >= 200 && response.status < 300) {
                setSuccess(true)
                console.log("Incident updated successfully:", response.data)
                return response.data
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

        } catch (err) {
            console.error('API Error:', err)

            // Handle different types of backend errors
            let errorMessage = 'An error occurred while updating the incident'

            if (err.response) {
                // Backend responded with an error status
                const responseData = err.response.data

                if (responseData?.error) {
                    errorMessage = responseData.error
                } else if (responseData?.message) {
                    errorMessage = responseData.message
                } else if (responseData?.detail) {
                    errorMessage = responseData.detail
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData
                } else {
                    errorMessage = `HTTP error! status: ${err.response.status}`
                }

                console.error('Backend Error:', responseData)
            } else if (err.request) {
                // Network error
                errorMessage = 'Network error - please check your connection'
            } else {
                // Other error
                errorMessage = err.message || errorMessage
            }

            setError(errorMessage)
            setSuccess(false)
            // Re-throw the error so the calling function knows it failed
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const patchIncident = async (incidentId, partialData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)
        console.log("Patching incident with data: ", partialData)

        try {
            const response = await api.patch(`/incidents/general-visitor/${incidentId}/`, partialData)

            // Check if the response is successful (200-299 status codes)
            if (response.status >= 200 && response.status < 300) {
                setSuccess(true)
                console.log("Incident patched successfully:", response.data)
                return response.data
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

        } catch (err) {
            console.error('API Error:', err)

            // Handle different types of backend errors
            let errorMessage = 'An error occurred while updating the incident'

            if (err.response) {
                // Backend responded with an error status
                const responseData = err.response.data

                if (responseData?.error) {
                    errorMessage = responseData.error
                } else if (responseData?.message) {
                    errorMessage = responseData.message
                } else if (responseData?.detail) {
                    errorMessage = responseData.detail
                } else if (typeof responseData === 'string') {
                    errorMessage = responseData
                } else {
                    errorMessage = `HTTP error! status: ${err.response.status}`
                }

                console.error('Backend Error:', responseData)
            } else if (err.request) {
                // Network error
                errorMessage = 'Network error - please check your connection'
            } else {
                // Other error
                errorMessage = err.message || errorMessage
            }

            setError(errorMessage)
            setSuccess(false)
            // Re-throw the error so the calling function knows it failed
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const resetState = () => {
        setError(null)
        setSuccess(false)
        setIsLoading(false)
    }

    return {
        updateIncident,
        patchIncident,
        isLoading,
        error,
        success,
        resetState
    }
}

export default useUpdate
