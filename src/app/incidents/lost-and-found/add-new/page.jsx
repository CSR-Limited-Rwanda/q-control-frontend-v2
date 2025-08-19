import DashboardLayout from '@/app/dashboard/layout'
import LostAndFoundForm from '@/components/incidents/incidentForms/LostAndFoundForms/LostAndFoundForm'
import React from 'react'

const AddNewLostAndFound = () => {
    return (
        <DashboardLayout>
            <LostAndFoundForm />
        </DashboardLayout>
    )
}

export default AddNewLostAndFound