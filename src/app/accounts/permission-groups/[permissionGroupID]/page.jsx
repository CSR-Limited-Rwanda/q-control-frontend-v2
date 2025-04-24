'use client'
import DashboardLayout from '@/app/dashboard/layout'
import { useGroupContext } from '@/context/providers/Group'
import React, { useState } from 'react'

const page = () => {
    const { selectedGroup, setSelectedGroup } = useGroupContext()

    return (
        <DashboardLayout>
            {selectedGroup?.name}
        </DashboardLayout>
    )
}

export default page