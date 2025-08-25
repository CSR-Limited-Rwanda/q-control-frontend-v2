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
        console.log("Updating drug reaction incident with data: ", formData)

        try {
            const cleanedFormData = cleanedData(formData)
            const response = await api.put(`/incidents/adverse-drug-reaction/${incidentId}/`, cleanedFormData)

            if (response.status >= 200 && response.status < 300) {
                setSuccess(true)
                return response.data
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

        } catch (err) {
            console.error('API Error:', err)

            let errorMessage = 'An error occurred while updating the drug reaction incident'

            if (err.response) {
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
                errorMessage = 'Network error - please check your connection'
            } else {
                errorMessage = err.message || errorMessage
            }

            setError(errorMessage)
            setSuccess(false)
            throw new Error(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    const patchIncident = async (incidentId, partialData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)
        console.log("Patching drug reaction incident with data: ", partialData)

        try {
            const response = await api.patch(`/adverse-drug-reaction/${incidentId}/`, partialData)

            if (response.status >= 200 && response.status < 300) {
                setSuccess(true)
                return response.data
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

        } catch (err) {
            console.error('API Error:', err)

            let errorMessage = 'An error occurred while updating the drug reaction incident'

            if (err.response) {
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
                errorMessage = 'Network error - please check your connection'
            } else {
                errorMessage = err.message || errorMessage
            }

            setError(errorMessage)
            setSuccess(false)
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
