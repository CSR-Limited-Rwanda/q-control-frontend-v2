'use client'
import DashboardLayout from '@/app/dashboard/layout'
import GeneralIncidentForm from '@/components/incidents/incidentForms/GeneralIncidentForms/GeneralIncidentForm'
import React from 'react'

const NewIncident = () => {
    return (
        <DashboardLayout>
            <GeneralIncidentForm />
        </DashboardLayout>
    )
}

export default NewIncident