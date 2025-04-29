import api from '@/utils/api'
import React, { useEffect, useState } from 'react'

const ProfileDocuments = () => {
    const [errorMessage, setErrorMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [documents, setDocuments] = useState([])

    useEffect(() => {
        // fetch documents
        const fetchDocuments = async () => {
            try {
                const response = await api.get(`/accounts/profile/documents/`)
                if (response.status === 200) {
                    setDocuments(response.data.documents)
                    setIsLoading(false)
                    console.log(response.data.documents)
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(error.response.data.message || error.response.data.error || 'Error getting your documents')
                } else {
                    setErrorMessage('Unknown error getting your documents')
                }
                setIsLoading(false)
            }
        }
        fetchDocuments()
    }, [])
    return (
        <div className='profile-documents'>
            {
                errorMessage && <div className="error-message">{errorMessage}</div>
            }
            {
                isLoading ? 'Loading...' : <FilesList documents={documents} showDownload={true} />
            }
        </div>
    )
}

export default ProfileDocuments
