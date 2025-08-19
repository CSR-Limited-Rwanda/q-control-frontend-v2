'use client'
import React, { useState } from 'react'
import RichTextField from '@/components/RichTextField'
import mediaAPI from '@/utils/mediaApi'
import toast from 'react-hot-toast'

const Step6Summary = ({ formData, setFormData, handleChange, isFieldInvalid, getFieldError, onUploadStateChange }) => {
    const [uploading, setUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedDocumentIds, setUploadedDocumentIds] = useState([])

    // Handle file upload - first upload files, then store document IDs
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files)

        if (files.length === 0) return

        setUploading(true)
        setUploadProgress(0)

        // Notify parent component about upload state
        if (onUploadStateChange) {
            onUploadStateChange(true)
        }

        // Show initial progress toast
        const toastId = toast.loading('Preparing to upload files...', {
            duration: Infinity,
        })

        try {
            const incidentId = localStorage.getItem('generalIncidentId')
            if (!incidentId) {
                toast.error('No incident ID found. Please save the incident first.')
                setUploading(false)
                if (onUploadStateChange) onUploadStateChange(false)
                return
            }

            const formData = new FormData()
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i])
            }
            formData.append("type", "general_incident")

            // Update toast to show upload progress
            toast.loading(`Uploading ${files.length} file(s)...`, {
                id: toastId,
            })

            const response = await mediaAPI.post(
                `incidents/general-visitor/${incidentId}/documents/`,
                formData,
                {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                        setUploadProgress(percentCompleted)

                        // Update toast with progress
                        toast.loading(`Uploading files... ${percentCompleted}%`, {
                            id: toastId,
                        })
                    }
                }
            )

            if (response.status === 200 || response.status === 201) {
                const documentIds = Array.isArray(response.data.documents)
                    ? response.data.documents.map(doc => doc.id)
                    : [response.data.document?.id].filter(Boolean)

                setUploadedDocumentIds(prev => [...prev, ...documentIds])

                // Store document IDs in form data for backend submission
                handleChange({
                    target: {
                        name: 'documents',
                        value: [...(formData.documents || []), ...documentIds]
                    }
                })

                // Store file info for display purposes
                handleChange({
                    target: {
                        name: 'uploaded_files',
                        value: [...(formData.uploaded_files || []), ...files]
                    }
                })

                // Success toast
                toast.success(`${files.length} file(s) uploaded successfully!`, {
                    id: toastId,
                    duration: 4000
                })
            }
        } catch (error) {
            console.error('File upload error:', error)
            toast.error('Error uploading files. Please try again.', {
                id: toastId,
                duration: 4000
            })
        } finally {
            setUploading(false)
            setUploadProgress(0)

            // Notify parent component that upload is complete
            if (onUploadStateChange) {
                onUploadStateChange(false)
            }
        }
    }

    // Handle rich text field changes
    const handleRichTextChange = (field, value) => {
        handleChange({
            target: {
                name: field,
                value: value
            }
        })
    }

    return (
        <div className="form-container">
            {/* Form Header */}
            <div className="form-header">
                <h2>Step 6: Summary & Documentation</h2>
                <div className="progress-info">
                    <span className="step-indicator">Step 6 of 7</span>
                </div>
            </div>

            {/* Description of Incident */}
            <div className="field-group">
                <label htmlFor="description">Description of Incident <span className="required">*</span></label>
                <RichTextField
                    name="description"
                    value={formData.description || ''}
                    onChange={handleChange}
                    placeholder="Provide a detailed description of the incident..."
                    isInvalid={isFieldInvalid('description')}
                />
                {isFieldInvalid('description') && (
                    <div className="error-message">
                        <span>{getFieldError('description')}</span>
                    </div>
                )}
            </div>

            {/* Upload Documents */}
            <div className="field-group">
                <label htmlFor="document_upload">Supporting Documents <span className="hint">(Optional)</span></label>
                <input
                    type="file"
                    id="document_upload"
                    multiple
                    onChange={handleFileChange}
                    disabled={uploading}
                    className="file-upload-input"
                />

                {/* Upload Progress */}
                {uploading && (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{uploadProgress}% uploaded</span>
                    </div>
                )}

                {/* Uploaded Files Display */}
                {formData.uploaded_files && formData.uploaded_files.length > 0 && (
                    <div className="uploaded-files">
                        <h5>Uploaded Files:</h5>
                        <ul className="file-list">
                            {Array.from(formData.uploaded_files).map((file, index) => (
                                <li key={index} className="file-item">
                                    <span className="file-name">{file.name}</span>
                                    <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Summary Information */}
            <div className="field-group">
                <label>Incident Summary Review</label>
                <div className="summary-info">
                    <div className="summary-grid">
                        <div className="summary-item">
                            <strong>Incident Type:</strong> <span>{formData.incident_type || 'Not specified'}</span>
                        </div>
                        <div className="summary-item">
                            <strong>Location:</strong> <span>{formData.location || 'Not specified'}</span>
                        </div>
                        <div className="summary-item">
                            <strong>Date:</strong> <span>{formData.incident_date || 'Not specified'}</span>
                        </div>
                        <div className="summary-item">
                            <strong>Outcome:</strong> <span>{formData.outcome || 'Not specified'}</span>
                        </div>
                        {formData.patient_visitor && (
                            <>
                                <div className="summary-item">
                                    <strong>Patient/Visitor:</strong>
                                    <span>{formData.patient_visitor.first_name} {formData.patient_visitor.last_name}</span>
                                </div>
                                <div className="summary-item">
                                    <strong>Profile Type:</strong>
                                    <span>{formData.patient_visitor.profile_type}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step6Summary