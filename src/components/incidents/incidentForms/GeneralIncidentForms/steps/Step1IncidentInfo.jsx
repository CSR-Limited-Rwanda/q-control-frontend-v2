'use client'
import { useAuthentication } from '@/context/authContext'
import USDatePicker from '@/components/forms/USDatePicker'
import React from 'react'

const Step1IncidentInfo = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError }) => {
    const { user } = useAuthentication()

    return (
        <form >
            {/* Facility Selection */}
            <div className="field-group">
                <label htmlFor="facility_id">Facility <span className="required">*</span></label>
                <select
                    id="facility_id"
                    name="facility_id"
                    value={formData.facility_id || user.accounts[0]?.id || ''}
                    onChange={handleChange}
                    className={isFieldInvalid('facility_id') ? 'invalid' : ''}
                >
                    <option value="">Select Facility</option>
                    {user?.accounts.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                            {facility.name}
                        </option>
                    ))}
                </select>
                {isFieldInvalid('facility_id') && (
                    <div className="error-message">
                        <span>{getFieldError('facility_id')}</span>
                    </div>
                )}
            </div>

            {/* Patient/Visitor Profile Type */}
            <div className="field-group">
                <label>Patient/Visitor Category <span className="required">*</span></label>
                <div className="radio-group">
                    <div
                        className={`radio-item ${formData.patient_visitor?.profile_type === "Inpatient" ? 'selected' : ''}`}
                        onClick={() => handleChange({ target: { name: 'patient_visitor.profile_type', value: 'Inpatient' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Inpatient</span>
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            value="Inpatient"
                            checked={formData.patient_visitor?.profile_type === "Inpatient"}
                            onChange={handleChange}
                        />
                    </div>
                    <div
                        className={`radio-item ${formData.patient_visitor?.profile_type === "Outpatient" ? 'selected' : ''}`}
                        onClick={() => handleChange({ target: { name: 'patient_visitor.profile_type', value: 'Outpatient' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Outpatient</span>
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            value="Outpatient"
                            checked={formData.patient_visitor?.profile_type === "Outpatient"}
                            onChange={handleChange}
                        />
                    </div>
                    <div
                        className={`radio-item ${formData.patient_visitor?.profile_type === "ER" ? 'selected' : ''}`}
                        onClick={() => handleChange({ target: { name: 'patient_visitor.profile_type', value: 'ER' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Emergency Room (ER)</span>
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            value="ER"
                            checked={formData.patient_visitor?.profile_type === "ER"}
                            onChange={handleChange}
                        />
                    </div>
                    <div
                        className={`radio-item ${formData.patient_visitor?.profile_type === "Visitor" ? 'selected' : ''}`}
                        onClick={() => handleChange({ target: { name: 'patient_visitor.profile_type', value: 'Visitor' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Visitor</span>
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            value="Visitor"
                            checked={formData.patient_visitor?.profile_type === "Visitor"}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {isFieldInvalid('patient_visitor.profile_type') && (
                    <div className="error-message">
                        <span>{getFieldError('patient_visitor.profile_type')}</span>
                    </div>
                )}
            </div>

            {/* Patient/Visitor Name */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_visitor_first_name">First Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_visitor_first_name"
                        name="patient_visitor.first_name"
                        value={formData.patient_visitor?.first_name || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.first_name') ? 'invalid' : ''}
                        placeholder="Enter first name"
                    />
                    {isFieldInvalid('patient_visitor.first_name') && (
                        <div className="error-message">
                            <span>{getFieldError('patient_visitor.first_name')}</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_visitor_last_name">Last Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_visitor_last_name"
                        name="patient_visitor.last_name"
                        value={formData.patient_visitor?.last_name || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.last_name') ? 'invalid' : ''}
                        placeholder="Enter last name"
                    />
                    {isFieldInvalid('patient_visitor.last_name') && (
                        <div className="error-message">
                            <span>Last name is required</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Sex and Incident Date */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_visitor_sex">Sex <span className="required">*</span></label>
                    <select
                        id="patient_visitor_sex"
                        name="patient_visitor.sex"
                        value={formData.patient_visitor?.sex || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.sex') ? 'invalid' : ''}
                    >
                        <option value="">Select Sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {isFieldInvalid('patient_visitor.sex') && (
                        <div className="error-message">
                            <span>Sex is required</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <USDatePicker
                        name="incident_date"
                        label="Incident Date"
                        value={formData.incident_date || ''}
                        onChange={handleChange}
                        isInvalid={isFieldInvalid('incident_date')}
                        errorMessage={getFieldError('incident_date')}
                        required={true}
                        maxDate={new Date()} // Prevent future dates
                    />
                </div>
            </div>

            {/* Medical Record Number and Address */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="medical_record_number">Medical Record Number <span className="required">*</span></label>
                    <input
                        type="text"
                        id="medical_record_number"
                        name="medical_record_number"
                        value={formData.medical_record_number || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('medical_record_number') ? 'invalid' : ''}
                        placeholder="Enter medical record number"
                    />
                    {isFieldInvalid('medical_record_number') && (
                        <div className="error-message">
                            <span>Medical record number is required</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_visitor_address">Address <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_visitor_address"
                        name="patient_visitor.address"
                        value={formData.patient_visitor?.address || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.address') ? 'invalid' : ''}
                        placeholder="Enter address"
                    />
                    {isFieldInvalid('patient_visitor.address') && (
                        <div className="error-message">
                            <span>Address is required</span>
                        </div>
                    )}
                </div>
            </div>

            {/* State and City */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_visitor_state">State <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_visitor_state"
                        name="patient_visitor.state"
                        value={formData.patient_visitor?.state || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.state') ? 'invalid' : ''}
                        placeholder="Enter state"
                    />
                    {isFieldInvalid('patient_visitor.state') && (
                        <div className="error-message">
                            <span>State is required</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_visitor_city">City <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_visitor_city"
                        name="patient_visitor.city"
                        value={formData.patient_visitor?.city || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.city') ? 'invalid' : ''}
                        placeholder="Enter city"
                    />
                    {isFieldInvalid('patient_visitor.city') && (
                        <div className="error-message">
                            <span>City is required</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Zip Code and Phone Number */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_visitor_zip_code">Zip Code <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_visitor_zip_code"
                        name="patient_visitor.zip_code"
                        value={formData.patient_visitor?.zip_code || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.zip_code') ? 'invalid' : ''}
                        placeholder="Enter zip code"
                    />
                    {isFieldInvalid('patient_visitor.zip_code') && (
                        <div className="error-message">
                            <span>{getFieldError('patient_visitor.zip_code')}</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_visitor_phone_number">Phone Number <span className="required">*</span></label>
                    <input
                        type="tel"
                        id="patient_visitor_phone_number"
                        name="patient_visitor.phone_number"
                        value={formData.patient_visitor?.phone_number || ''}
                        onChange={handleChange}
                        className={isFieldInvalid('patient_visitor.phone_number') ? 'invalid' : ''}
                        placeholder="Enter phone number"
                    />
                    {isFieldInvalid('patient_visitor.phone_number') && (
                        <div className="error-message">
                            <span>{getFieldError('patient_visitor.phone_number')}</span>
                        </div>
                    )}
                </div>
            </div>
        </form>
    )
}

export default Step1IncidentInfo