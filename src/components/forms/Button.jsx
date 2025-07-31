import { LoaderCircle } from 'lucide-react'
import React from 'react'

const Button = ({ text, isLoading, onClick, isPrimary = true, hasIcon = false, icon = null, className }) => {
    return (
        <button onClick={onClick} type='button' className={`${isPrimary ? 'primary' : 'secondary'} ${className}`}>
            {text || 'Add text'}
            {
                isLoading ? (
                    <LoaderCircle className='loading-icon' />
                ) : hasIcon && icon ? (
                    icon
                ) : null
            }
        </button>
    )
}

export default Button