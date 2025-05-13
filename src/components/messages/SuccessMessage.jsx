'use client'
import { useState } from 'react'
import { X, SquareCheckBig } from 'lucide-react'
import '../../styles/_messages.scss'

const SuccessMessage = ({ message, hideMessage, handleHideMessage }) => {
    const [showMessage, setShowMessage] = useState(true)

    const toggleMessage = () => {
        setShowMessage(false)
        handleHideMessage()
    }

    return (
        <>
            {message && showMessage && <div className="success-message">
                <div className="message">
                    <SquareCheckBig className='message-icon' />
                    <p>{message}</p>
                </div>
                {
                    hideMessage && <X onClick={toggleMessage} className='message-icon' />
                }
            </div>}
        </>
    )
}

export default SuccessMessage