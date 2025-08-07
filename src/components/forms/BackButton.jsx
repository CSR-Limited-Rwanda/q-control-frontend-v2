import { ArrowLeft } from 'lucide-react'
import React from 'react'

const BackButton = ({ onClick, text }) => {
    return (
        <div className="back-button" onClick={onClick}>
            <ArrowLeft />
            <span>{text || 'Back'}</span>
        </div>
    )
}

export default BackButton