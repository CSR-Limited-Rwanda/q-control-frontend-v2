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
        <div className="step-container">
            <h3>Step 6: Summary</h3>
            <form>
                {/* Brief Summary of Incident */}
                <div className="field-group">
                    <label htmlFor="brief_summary_of_incident">Brief Summary of Incident *</label>
                    <RichTextField
                        value={formData.brief_summary_of_incident || ''}
                        onEditorChange={(value) => handleRichTextChange('brief_summary_of_incident', value)}
                        placeholder="Provide a brief summary of what happened..."
                    />
                    {isFieldInvalid('brief_summary_of_incident') && (
                        <span className="error-message">{getFieldError('brief_summary_of_incident')}</span>
                    )}
                </div>

                {/* Immediate Actions Taken */}
                <div className="field-group">
                    <label htmlFor="immediate_action_taken">Immediate Actions Taken *</label>
                    <RichTextField
                        value={formData.immediate_action_taken || ''}
                        onEditorChange={(value) => handleRichTextChange('immediate_action_taken', value)}
                        placeholder="Describe the immediate actions that were taken..."
                    />
                    {isFieldInvalid('immediate_action_taken') && (
                        <span className="error-message">{getFieldError('immediate_action_taken')}</span>
                    )}
                </div>

                {/* Response */}
                <div className="field-group">
                    <label htmlFor="response">Response</label>
                    <RichTextField
                        value={formData.response || ''}
                        onEditorChange={(value) => handleRichTextChange('response', value)}
                        placeholder="Describe the overall response to the incident..."
                    />
                    {isFieldInvalid('response') && (
                        <span className="error-message">{getFieldError('response')}</span>
                    )}
                </div>

                {/* File Upload */}
                <div className="field-group">
                    <label htmlFor="documents">Supporting Documents</label>
                    <input
                        type="file"
                        id="documents"
                        name="documents"
                        onChange={handleFileChange}
                        multiple
                        className="file-input"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.txt"
                        disabled={uploading}
                    />
                    <div className="file-help">
                        You can upload multiple files (PDF, DOC, DOCX, JPG, PNG, TXT)
                        {uploading && ` - Uploading... ${uploadProgress}%`}
                    </div>

                    {/* Upload Progress Bar */}
                    {uploading && (
                        <div className="upload-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <span className="progress-text">{uploadProgress}%</span>
                        </div>
                    )}

                    {formData.uploaded_files && formData.uploaded_files.length > 0 && (
                        <div className="uploaded-files">
                            <p>Uploaded files:</p>
                            <ul>
                                {Array.from(formData.uploaded_files).map((file, index) => (
                                    <li key={index}>
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Summary Information */}
                <div className="summary-info">
                    <h4>Incident Summary</h4>
                    <div className="summary-grid">
                        <div className="summary-item">
                            <strong>Incident Type:</strong> {formData.incident_type || 'Not specified'}
                        </div>
                        <div className="summary-item">
                            <strong>Location:</strong> {formData.location || 'Not specified'}
                        </div>
                        <div className="summary-item">
                            <strong>Date:</strong> {formData.incident_date || 'Not specified'}
                        </div>
                        <div className="summary-item">
                            <strong>Outcome:</strong> {formData.outcome || 'Not specified'}
                        </div>
                        {formData.patient_visitor && (
                            <>
                                <div className="summary-item">
                                    <strong>Patient/Visitor:</strong> {formData.patient_visitor.first_name} {formData.patient_visitor.last_name}
                                </div>
                                <div className="summary-item">
                                    <strong>Profile Type:</strong> {formData.patient_visitor.profile_type}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Step6Summary