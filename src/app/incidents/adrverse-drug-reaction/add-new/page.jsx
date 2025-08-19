'use client'
import DashboardLayout from '@/app/dashboard/layout'
import NewDepartmentForm from '@/components/forms/NewDepartmentForm'
import DrugReactionForm from '@/components/incidents/incidentForms/DrugReactionForms/DrugReactionForm'
import React from 'react'

const NewAdverseDrugReaction = () => {
    return (
        <DashboardLayout>
            <DrugReactionForm />
        </DashboardLayout>
    )
}

export default NewAdverseDrugReaction