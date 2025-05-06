'use client'
import React, { useState } from 'react'
import { X, Link2, Info } from 'lucide-react'
import '../styles/_messages.scss'


const NoteMessage = ({ message, hideMessage, handleHideMessage, actionLink }) => {
    const [showMessage, setShowMessage] = useState(true)

    const toggleMessage = () => {
        setShowMessage(false)
        handleHideMessage()
    }
    return (
        <>
            {message && showMessage && <div className="note-message">
                <div className="message">
                    <Info className='message-icon' />
                    <p>{message}</p>
                    {
                        actionLink && <a className='link message-icon' href=""><span>Learn more</span> <Link2 size={18} /></a>

                    }
                </div>
                {
                    hideMessage && <X onClick={toggleMessage} className='message-icon' />
                }
            </div>}
        </>
    )
}

export default NoteMessage