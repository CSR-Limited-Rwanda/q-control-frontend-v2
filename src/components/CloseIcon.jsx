import { X } from 'lucide-react'
import React from 'react'

const CloseIcon = ({ onClick }) => {
    return (
        <div className='close-popup' onClick={onClick}><X /></div>
    )
}

export default CloseIcon