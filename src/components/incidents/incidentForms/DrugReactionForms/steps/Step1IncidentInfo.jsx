'use client'
import { useAuthentication } from '@/context/authContext'
import USDatePicker from '@/components/forms/USDatePicker'
import CustomTimeInput from '@/components/CustomTimeInput'
import React from 'react'

const Step1IncidentInfo = ({ formData, onChange, isFieldInvalid, getFieldError }) => {
    const { user } = useAuthentication()

    return (
        <form>
            {/* Facility Selection */}
            <div className="field-group">
                <label htmlFor="report_facility">Facility <span className="required">*</span></label>
                <select
                    id="report_facility"
                    name="report_facility"
                    value={formData.report_facility || formData.facility_id || user.accounts[0]?.id || ''}
                    onChange={onChange}
                    className={isFieldInvalid('report_facility') ? 'invalid' : ''}
                >
                    <option value="">Select Facility</option>
                    {user?.accounts.map((facility) => (
                        <option key={facility.id} value={facility.id}>
                            {facility.name}
                        </option>
                    ))}
                </select>
                {isFieldInvalid('report_facility') && (
                    <div className="error-message">
                        <span>{getFieldError('report_facility')}</span>
                    </div>
                )}
            </div>

            {/* Patient Type */}
            <div className="field-group">
                <label>Patient Type <span className="required">*</span></label>
                <div className="radio-group">
                    <div
                        className={`radio-item ${formData.patient_type === "Inpatient" ? 'selected' : ''}`}
                        onClick={() => onChange({ target: { name: 'patient_type', value: 'Inpatient' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Inpatient</span>
                        <input
                            type="radio"
                            name="patient_type"
                            value="Inpatient"
                            checked={formData.patient_type === "Inpatient"}
                            onChange={onChange}
                        />
                    </div>
                    <div
                        className={`radio-item ${formData.patient_type === "Outpatient" ? 'selected' : ''}`}
                        onClick={() => onChange({ target: { name: 'patient_type', value: 'Outpatient' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Outpatient</span>
                        <input
                            type="radio"
                            name="patient_type"
                            value="Outpatient"
                            checked={formData.patient_type === "Outpatient"}
                            onChange={onChange}
                        />
                    </div>
                    <div
                        className={`radio-item ${formData.patient_type === "ER" ? 'selected' : ''}`}
                        onClick={() => onChange({ target: { name: 'patient_type', value: 'ER' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Emergency Room (ER)</span>
                        <input
                            type="radio"
                            name="patient_type"
                            value="ER"
                            checked={formData.patient_type === "ER"}
                            onChange={onChange}
                        />
                    </div>
                    <div
                        className={`radio-item ${formData.patient_type === "Visitor" ? 'selected' : ''}`}
                        onClick={() => onChange({ target: { name: 'patient_type', value: 'Visitor' } })}
                    >
                        <div className="radio-icon">●</div>
                        <span className="radio-label">Visitor</span>
                        <input
                            type="radio"
                            name="patient_type"
                            value="Visitor"
                            checked={formData.patient_type === "Visitor"}
                            onChange={onChange}
                        />
                    </div>
                </div>
                {isFieldInvalid('patient_type') && (
                    <div className="error-message">
                        <span>{getFieldError('patient_type')}</span>
                    </div>
                )}
            </div>

            {/* Patient Name */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_name_first_name">First Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_name_first_name"
                        name="patient_name.first_name"
                        value={formData.patient_name?.first_name || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.first_name') ? 'invalid' : ''}
                        placeholder="Enter first name"
                    />
                    {isFieldInvalid('patient_name.first_name') && (
                        <div className="error-message">
                            <span>{getFieldError('patient_name.first_name')}</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_name_last_name">Last Name <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_name_last_name"
                        name="patient_name.last_name"
                        value={formData.patient_name?.last_name || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.last_name') ? 'invalid' : ''}
                        placeholder="Enter last name"
                    />
                    {isFieldInvalid('patient_name.last_name') && (
                        <div className="error-message">
                            <span>Last name is required</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Gender and Incident Date */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_name_gender">Gender <span className="required">*</span></label>
                    <select
                        id="patient_name_gender"
                        name="patient_name.gender"
                        value={formData.patient_name?.gender || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.gender') ? 'invalid' : ''}
                    >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    {isFieldInvalid('patient_name.gender') && (
                        <div className="error-message">
                            <span>Gender is required</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <USDatePicker
                        name="incident_date"
                        label="Incident Date"
                        value={formData.incident_date || ''}
                        onChange={onChange}
                        isInvalid={isFieldInvalid('incident_date')}
                        errorMessage={getFieldError('incident_date')}
                        required={true}
                        maxDate={new Date()} // Prevent future dates
                    />
                </div>
            </div>

            {/* Incident Time and Medical Record Number */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="incident_time">Incident Time <span className="required">*</span></label>
                    <CustomTimeInput
                        setTime={(timeValue) => onChange({ target: { name: 'incident_time', value: timeValue } })}
                        defaultTime={formData.incident_time || ''}
                    />
                    {isFieldInvalid('incident_time') && (
                        <div className="error-message">
                            <span>{getFieldError('incident_time')}</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_name_medical_record_number">Medical Record Number <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_name_medical_record_number"
                        name="patient_name.medical_record_number"
                        value={formData.patient_name?.medical_record_number || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.medical_record_number') ? 'invalid' : ''}
                        placeholder="Enter medical record number"
                    />
                    {isFieldInvalid('patient_name.medical_record_number') && (
                        <div className="error-message">
                            <span>Medical record number is required</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Address and City */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_name_address">Address <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_name_address"
                        name="patient_name.address"
                        value={formData.patient_name?.address || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.address') ? 'invalid' : ''}
                        placeholder="Enter address"
                    />
                    {isFieldInvalid('patient_name.address') && (
                        <div className="error-message">
                            <span>Address is required</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_name_city">City <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_name_city"
                        name="patient_name.city"
                        value={formData.patient_name?.city || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.city') ? 'invalid' : ''}
                        placeholder="Enter city"
                    />
                    {isFieldInvalid('patient_name.city') && (
                        <div className="error-message">
                            <span>City is required</span>
                        </div>
                    )}
                </div>
            </div>

            {/* State and Zip Code */}
            <div className="grouped-inputs">
                <div className="field-group">
                    <label htmlFor="patient_name_state">State <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_name_state"
                        name="patient_name.state"
                        value={formData.patient_name?.state || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.state') ? 'invalid' : ''}
                        placeholder="Enter state"
                    />
                    {isFieldInvalid('patient_name.state') && (
                        <div className="error-message">
                            <span>State is required</span>
                        </div>
                    )}
                </div>
                <div className="field-group">
                    <label htmlFor="patient_name_zip_code">Zip Code <span className="required">*</span></label>
                    <input
                        type="text"
                        id="patient_name_zip_code"
                        name="patient_name.zip_code"
                        value={formData.patient_name?.zip_code || ''}
                        onChange={onChange}
                        className={isFieldInvalid('patient_name.zip_code') ? 'invalid' : ''}
                        placeholder="Enter zip code"
                    />
                    {isFieldInvalid('patient_name.zip_code') && (
                        <div className="error-message">
                            <span>{getFieldError('patient_name.zip_code')}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Phone Number */}
            <div className="field-group">
                <label htmlFor="patient_name_phone_number">Phone Number <span className="required">*</span></label>
                <input
                    type="tel"
                    id="patient_name_phone_number"
                    name="patient_name.phone_number"
                    value={formData.patient_name?.phone_number || ''}
                    onChange={onChange}
                    className={isFieldInvalid('patient_name.phone_number') ? 'invalid' : ''}
                    placeholder="Enter phone number"
                />
                {isFieldInvalid('patient_name.phone_number') && (
                    <div className="error-message">
                        <span>{getFieldError('patient_name.phone_number')}</span>
                    </div>
                )}
            </div>
        </form>
    )
}

export default Step1IncidentInfo
