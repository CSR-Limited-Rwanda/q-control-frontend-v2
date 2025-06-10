'use client'
import { useState } from "react"

const useSorting = (defaultField = 'created_at', defaultOrder = 'desc') => {
    const [sortField, setSortField] = useState(defaultField)
    const [sortOrder, setSortOrder] = useState(defaultOrder)
    
    const handleSort = (field) => {
        if(field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
        } else {
            setSortField(field)
            setSortOrder('asc')
        }
    }

    return {
        sortField,
        sortOrder,
        handleSort,
        getSortParams: () => ({
            sort_by: sortField,
            sort_order: sortOrder
        })
    }
}

export default useSorting
