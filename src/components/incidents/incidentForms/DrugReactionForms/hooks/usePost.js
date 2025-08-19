import api, { cleanedData } from '@/utils/api'
import { useState } from 'react'

const usePost = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const postIncident = async (formData) => {
        setIsLoading(true)
        setError(null)
        setSuccess(false)
        console.log("Form data: ", formData)

        try {
            const cleanedFormData = cleanedData(formData)
            const response = await api.post('/incidents/adverse-drug-reaction/', cleanedFormData)

            if (response.status >= 200 && response.status < 300) {
                setSuccess(true)

                localStorage.setItem('drugReactionId', response.data.id)
                return response.data
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

        } catch (err) {
            console.error('API Error:', err)

            let errorMessage = 'An error occurred while submitting the drug reaction incident'

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
        postIncident,
        isLoading,
        error,
        success,
        resetState
    }
}

export default usePost