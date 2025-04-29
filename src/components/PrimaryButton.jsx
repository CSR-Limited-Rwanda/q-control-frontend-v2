'use client'

import { LoaderCircle } from 'lucide-react'
import React from 'react'

const PrimaryButton = ({ text, span, onClick, isLoading, prefixIcon, suffixIcon, customClass }) => {
    return (
        <button type="button" className={`btn-primary ${isLoading ? 'loading' : ''} ${customClass}`} onClick={onClick} disabled={isLoading}>
            {
                !isLoading && prefixIcon && { ...prefixIcon }
            }
            {!span && text}
            {
                !text &&
                <span> {span}</span>
            }
            {
                !isLoading && suffixIcon && { ...suffixIcon }
            }
            {
                isLoading &&
                <div className="loader">
                    <LoaderCircle className="loading-icon" />
                </div>
            }
        </button>
    )
}

export default PrimaryButton