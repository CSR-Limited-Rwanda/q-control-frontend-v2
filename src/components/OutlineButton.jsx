'use client'

import { LoaderCircle } from 'lucide-react'
import React from 'react'

const OutlineButton = ({ text, span, onClick, isLoading, prefixIcon, suffixIcon }) => {
    return (
        <button type="button" className={`btn-outline ${isLoading ? 'loading' : ''}`} onClick={onClick} disabled={isLoading}>
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

export default OutlineButton