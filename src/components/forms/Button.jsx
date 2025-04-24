import { LoaderCircle } from 'lucide-react'
import React from 'react'

const Button = ({ text, isLoading, onClick, isPrimary = true }) => {
    return (
        <button onClick={onClick} type='button' className={`${isPrimary ? 'primary' : 'secondary'}`}>
            {text || 'Add text'}
            {
                isLoading &&
                <LoaderCircle className='loading-icon' />
            }
        </button>
    )
}

export default Button