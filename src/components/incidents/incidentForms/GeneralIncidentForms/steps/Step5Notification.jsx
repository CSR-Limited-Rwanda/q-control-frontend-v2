'use client'
import React from 'react'
import USDatePicker from '@/components/forms/USDatePicker'
import CustomTimeInput from '@/components/CustomTimeInput'

const Step5Notification = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError }) => {
    // Handle nested object changes for physician_notified
    const handlePhysicianChange = (field, value) => {
        const currentPhysician = formData.physician_notified || {}
        const updatedPhysician = {
            ...currentPhysician,
            [field]: value,
            profile_type: "Physician"
        }
        handleChange({
            target: {
                name: 'physician_notified',
                value: updatedPhysician
            }
        })
    }

    // Handle nested object changes for family_notified
    const handleFamilyChange = (field, value) => {
        const currentFamily = formData.family_notified || {}
        const updatedFamily = {
            ...currentFamily,
            [field]: value,
            profile_type: "Family"
        }
        handleChange({
            target: {
                name: 'family_notified',
                value: updatedFamily
            }
        })
    }

    // Handle nested object changes for notified_by
    const handleNotifiedByChange = (field, value) => {
        const currentNotifiedBy = formData.notified_by || {}
        const updatedNotifiedBy = {
            ...currentNotifiedBy,
            [field]: value,
            profile_type: "Nurse"
        }
        handleChange({
            target: {
                name: 'notified_by',
                value: updatedNotifiedBy
            }
        })
    }

    return (
        <div className="step-container">
            <h3>Step 5: Notification</h3>
            <form>
                {/* Physician Notified Section */}
                <div className="notification-section">
                    <h4>Physician Notified</h4>
                    <div className="notification-row">
                        <div className="field-group">
                            <label htmlFor="physician_first_name">First Name *</label>
                            <input
                                type="text"
                                id="physician_first_name"
                                value={formData.physician_notified?.first_name || ''}
                                onChange={(e) => handlePhysicianChange('first_name', e.target.value)}
                                placeholder="Enter first name"
                                className={isFieldInvalid('physician_notified.first_name') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('physician_notified.first_name') && (
                                <span className="error-message">{getFieldError('physician_notified.first_name')}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <label htmlFor="physician_last_name">Last Name *</label>
                            <input
                                type="text"
                                id="physician_last_name"
                                value={formData.physician_notified?.last_name || ''}
                                onChange={(e) => handlePhysicianChange('last_name', e.target.value)}
                                placeholder="Enter last name"
                                className={isFieldInvalid('physician_notified.last_name') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('physician_notified.last_name') && (
                                <span className="error-message">{getFieldError('physician_notified.last_name')}</span>
                            )}
                        </div>
                    </div>

                    <div className="notification-row">
                        <div className="field-group">
                            <label htmlFor="date_physician_notified">Date *</label>
                            <USDatePicker
                                name="date_physician_notified"
                                value={formData.date_physician_notified}
                                onChange={handleChange}
                            />
                            {isFieldInvalid('date_physician_notified') && (
                                <span className="error-message">{getFieldError('date_physician_notified')}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <label htmlFor="time_physician_notified">Time *</label>
                            <CustomTimeInput
                                setTime={(time) => handleChange({ target: { name: 'time_physician_notified', value: time } })}
                                defaultTime={formData.time_physician_notified}
                            />
                            {isFieldInvalid('time_physician_notified') && (
                                <span className="error-message">{getFieldError('time_physician_notified')}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Family Notified Section */}
                <div className="notification-section">
                    <h4>Family Notified</h4>
                    <div className="notification-row">
                        <div className="field-group">
                            <label htmlFor="family_first_name">First Name</label>
                            <input
                                type="text"
                                id="family_first_name"
                                value={formData.family_notified?.first_name || ''}
                                onChange={(e) => handleFamilyChange('first_name', e.target.value)}
                                placeholder="Enter first name"
                                className={isFieldInvalid('family_notified.first_name') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('family_notified.first_name') && (
                                <span className="error-message">{getFieldError('family_notified.first_name')}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <label htmlFor="family_last_name">Last Name</label>
                            <input
                                type="text"
                                id="family_last_name"
                                value={formData.family_notified?.last_name || ''}
                                onChange={(e) => handleFamilyChange('last_name', e.target.value)}
                                placeholder="Enter last name"
                                className={isFieldInvalid('family_notified.last_name') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('family_notified.last_name') && (
                                <span className="error-message">{getFieldError('family_notified.last_name')}</span>
                            )}
                        </div>
                    </div>

                    <div className="notification-row">
                        <div className="field-group">
                            <label htmlFor="date_family_notified">Date</label>
                            <USDatePicker
                                name="date_family_notified"
                                value={formData.date_family_notified}
                                onChange={handleChange}
                            />
                            {isFieldInvalid('date_family_notified') && (
                                <span className="error-message">{getFieldError('date_family_notified')}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <label htmlFor="time_family_notified">Time</label>
                            <CustomTimeInput
                                setTime={(time) => handleChange({ target: { name: 'time_family_notified', value: time } })}
                                defaultTime={formData.time_family_notified}
                            />
                            {isFieldInvalid('time_family_notified') && (
                                <span className="error-message">{getFieldError('time_family_notified')}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notified By Section */}
                <div className="notification-section">
                    <h4>Notified By</h4>
                    <div className="notification-row">
                        <div className="field-group">
                            <label htmlFor="notified_by_first_name">First Name *</label>
                            <input
                                type="text"
                                id="notified_by_first_name"
                                value={formData.notified_by?.first_name || ''}
                                onChange={(e) => handleNotifiedByChange('first_name', e.target.value)}
                                placeholder="Enter first name"
                                className={isFieldInvalid('notified_by.first_name') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('notified_by.first_name') && (
                                <span className="error-message">{getFieldError('notified_by.first_name')}</span>
                            )}
                        </div>

                        <div className="field-group">
                            <label htmlFor="notified_by_last_name">Last Name *</label>
                            <input
                                type="text"
                                id="notified_by_last_name"
                                value={formData.notified_by?.last_name || ''}
                                onChange={(e) => handleNotifiedByChange('last_name', e.target.value)}
                                placeholder="Enter last name"
                                className={isFieldInvalid('notified_by.last_name') ? 'invalid' : ''}
                            />
                            {isFieldInvalid('notified_by.last_name') && (
                                <span className="error-message">{getFieldError('notified_by.last_name')}</span>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Step5Notification