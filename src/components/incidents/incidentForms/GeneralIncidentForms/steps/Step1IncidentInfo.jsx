'use client'
import { useAuthentication } from '@/context/authContext'
import USDatePicker from '@/components/forms/USDatePicker'
import React from 'react'
const Step1IncidentInfo = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError }) => {
    const { user } = useAuthentication()
    return (
        <div className="form">
            <h3>Step 1: Incident Information</h3>
            <form>
                {/* select facility */}
                <div className="field-group">
                    <select
                        id="facility_id"
                        name="facility_id"
                        value={formData.facility_id || user.accounts[0]?.id || ''}
                        onChange={handleChange}
                    >
                        {user?.accounts.map((facility) => (
                            <option key={facility.id} value={facility.id}>
                                Submitting for {facility.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-half">
                    {/* inpatient */}
                    <div className="radio">
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            id="category1"
                            value="Inpatient"
                            checked={formData.patient_visitor?.profile_type === "Inpatient"}
                            onChange={handleChange}
                        />
                        <label htmlFor="category1">Inpatient</label>
                    </div>
                    {/* outpatient */}
                    <div className="radio">
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            id="category2"
                            value="Outpatient"
                            checked={formData.patient_visitor?.profile_type === "Outpatient"}
                            onChange={handleChange}
                        />
                        <label htmlFor="category2">Outpatient</label>
                    </div>

                    {/* ER */}
                    <div className="radio">
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            id="category3"
                            value="ER"
                            checked={formData.patient_visitor?.profile_type === "ER"}
                            onChange={handleChange}
                        />
                        <label htmlFor="category3">ER</label>
                    </div>

                    {/* Visitor */}
                    <div className="radio">
                        <input
                            type="radio"
                            name="patient_visitor.profile_type"
                            id="category4"
                            value="Visitor"
                            checked={formData.patient_visitor?.profile_type === "Visitor"}
                            onChange={handleChange}
                        />
                        <label htmlFor="category4">Visitor</label>
                    </div>
                </div>

                <div className="form-half">
                    {/* patient_visitor first and last name */}
                    <div className="field-group">
                        <label htmlFor="patient_visitor_first_name">Patient/Visitor First Name</label>
                        <input
                            type="text"
                            id="patient_visitor_first_name"
                            name="patient_visitor.first_name"
                            value={formData.patient_visitor?.first_name || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('patient_visitor.first_name') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('patient_visitor.first_name') && (
                            <span className="error">{getFieldError('patient_visitor.first_name')}</span>
                        )}
                    </div>
                    <div className="field-group">
                        <label htmlFor="patient_visitor_last_name">Patient/Visitor Last Name</label>
                        <input
                            type="text"
                            id="patient_visitor_last_name"
                            name="patient_visitor.last_name"
                            value={formData.patient_visitor?.last_name || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('patient_visitor.last_name') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('patient_visitor.last_name') && (
                            <span className="error">Last name is required</span>
                        )}
                    </div>
                </div>
                <div className="form-half">
                    {/* sex */}
                    <div className="field-group">
                        <label htmlFor="patient_visitor_sex">Patient/Visitor Sex</label>
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
                            <span className="error">Sex is required</span>
                        )}
                    </div>

                    {/* incident_date */}
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

                <div className="form-half">

                    {/* medical_record_number */}
                    <div className="field-group">
                        <label htmlFor="medical_record_number">Medical Record Number</label>
                        <input
                            type="text"
                            id="medical_record_number"
                            name="medical_record_number"
                            value={formData.medical_record_number || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('medical_record_number') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('medical_record_number') && (
                            <span className="error">Medical record number is required</span>
                        )}
                    </div>

                    {/* address */}
                    <div className="field-group">
                        <label htmlFor="patient_visitor_address">Address</label>
                        <input
                            type="text"
                            id="patient_visitor_address"
                            name="patient_visitor.address"
                            value={formData.patient_visitor?.address || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('patient_visitor.address') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('patient_visitor.address') && (
                            <span className="error">Address is required</span>
                        )}
                    </div>
                </div>
                <div className="form-half">
                    {/*  state */}
                    <div className="field-group">
                        <label htmlFor="patient_visitor_state">State</label>
                        <input
                            type="text"
                            id="patient_visitor_state"
                            name="patient_visitor.state"
                            value={formData.patient_visitor?.state || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('patient_visitor.state') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('patient_visitor.state') && (
                            <span className="error">State is required</span>
                        )}
                    </div>
                    {/* city */}
                    <div className="field-group">
                        <label htmlFor="patient_visitor_city">City</label>
                        <input
                            type="text"
                            id="patient_visitor_city"
                            name="patient_visitor.city"
                            value={formData.patient_visitor?.city || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('patient_visitor.city') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('patient_visitor.city') && (
                            <span className="error">City is required</span>
                        )}
                    </div>
                </div>

                <div className="form-half">
                    {/* zip code */}
                    <div className="field-group">
                        <label htmlFor="patient_visitor_zip_code">Zip Code</label>
                        <input
                            type="text"
                            id="patient_visitor_zip_code"
                            name="patient_visitor.zip_code"
                            value={formData.patient_visitor?.zip_code || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('patient_visitor.zip_code') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('patient_visitor.zip_code') && (
                            <span className="error">{getFieldError('patient_visitor.zip_code')}</span>
                        )}
                    </div>

                    {/* phone_number */}
                    <div className="field-group">
                        <label htmlFor="patient_visitor_phone_number">Phone Number</label>
                        <input
                            type="text"
                            id="patient_visitor_phone_number"
                            name="patient_visitor.phone_number"
                            value={formData.patient_visitor?.phone_number || ''}
                            onChange={handleChange}
                            className={isFieldInvalid('patient_visitor.phone_number') ? 'invalid' : ''}
                        />
                        {isFieldInvalid('patient_visitor.phone_number') && (
                            <span className="error">{getFieldError('patient_visitor.phone_number')}</span>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Step1IncidentInfo