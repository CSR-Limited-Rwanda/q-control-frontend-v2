'use client'
import { X } from 'lucide-react'
import React, { useState } from 'react'
import TitlesForm from '../forms/TitlesForm';
import PrimaryButton from '@/components/PrimaryButton';
import OutlineButton from '@/components/OutlineButton';
import api from '@/utils/api';

const TitleDetails = ({ title, handleClose }) => {
    const [showEditForm, setShowEditForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleEditClick = () => {
        setShowEditForm(!showEditForm);
    }

    const handleDeleteClick = async (id) => {
        try {
            setIsLoading(true);
            const response = await api.delete(`/titles/${id}/`);
            if (response.status === 204) {
                setSuccessMessage("Title deleted successfully")
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        }
        catch (error) {
            console.error('Error deleting title:', error)
            let message
            if (error?.response?.data) {
                message = error?.response?.data?.error || error?.response?.data?.message || 'An error occurred';
            } else {
                message = error?.message || 'Unknown error occurred';
            }
            setErrorMessage(message);
            return
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className='popup'>
                <div className="popup-content">
                    <div className="close" onClick={handleClose}>
                        <X />
                    </div>
                    <h3>{title.name}</h3>
                    <p>{title.description}</p>
                    {
                        errorMessage && <p className='error message'>{errorMessage}</p>
                    }
                    {
                        successMessage && <p className='success message'>{successMessage}</p>
                    }
                    <div className="actions">
                        <OutlineButton
                            text={'Delete title'}
                            isLoading={isLoading}
                            onClick={() => handleDeleteClick(title.id)}
                        />
                        <PrimaryButton
                            text={'Edit title'}
                            onClick={handleEditClick}
                        />
                    </div>
                </div>
            </div>

            {
                showEditForm && <TitlesForm existingTitleData={title} isEditMode={true} handleClose={handleEditClick} />
            }
        </>
    )
}

export default TitleDetails