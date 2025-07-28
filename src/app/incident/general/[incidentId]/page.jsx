'use client'
import DashboardLayout from '@/app/dashboard/layout'
import SendForReview from '@/components/incidents/incidentDetails/sendForReview/sendForReview'
import { useParams } from 'next/navigation'
import React from 'react'

const page = () => {
    const { incidentId } = useParams();
    return (
        <DashboardLayout>
            <SendForReview path={'general-visitor'} incidentID={incidentId} />
        </DashboardLayout>
    )
}

export default page