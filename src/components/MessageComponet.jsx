import React from 'react'

const MessageComponent = ({ errorMessage, successMessage }) => {
    return (
        <div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
        </div>
    )
}

export default MessageComponent