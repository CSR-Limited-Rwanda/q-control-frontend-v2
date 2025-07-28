'use client'
import DashboardLayout from '@/app/dashboard/layout'
import IncidentDetailsHeader from '@/components/incidents/incidentDetails/IncidentDetailsHeader'
import SendForReview from '@/components/incidents/incidentDetails/sendForReview/sendForReview'
import api from '@/utils/api'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {
    const { incidentId } = useParams();
    const [sendForReview, setSendForReview] = useState(false);
    const [incidentDetails, setIncidentDetails] = useState({});

    useEffect(() => {
        // Fetch incident details using incidentId
        const fetchIncidentDetails = async () => {
            try {
                const response = await api.get(`/incidents/general-visitor/${incidentId}/`);
                setIncidentDetails(response.data);
            } catch (error) {
                console.error("Error fetching incident details:", error);
            }
        };

        fetchIncidentDetails();
    }, [incidentId]);

    return (
        <DashboardLayout>
            {
                sendForReview ?
                    <SendForReview path={'general-visitor'} incidentID={incidentId} handleClose={() => setSendForReview(false)} /> :
                    <button onClick={() => setSendForReview(true)}>Send for Review</button>
            }
        </DashboardLayout>
    )
}

export default page