'use client'
import { useState } from 'react'
import { X, TriangleAlert } from 'lucide-react'
import '../../styles/_messages.scss'

const ErrorMessage = ({ message, hideMessage, handleHideMessage }) => {
    const [showMessage, setShowMessage] = useState(true)

    const toggleMessage = () => {
        setShowMessage(false)
        handleHideMessage()
    }
    return (
        <>
            {message && showMessage && <div className="error-message">
                <div className="message">
                    <TriangleAlert className='message-icon' />
                    <p>{message}</p>
                </div>
                {
                    hideMessage && <X onClick={toggleMessage} className='message-icon' />
                }
            </div>}
        </>
    )
}

export default ErrorMessage