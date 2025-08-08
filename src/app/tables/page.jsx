'use client'
import '@/styles/components/tables.css'
import React from 'react'

const page = () => {
    // table data
    const data = [
        { name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'Active' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'Inactive' },
        { name: 'Alice Johnson', email: 'alice@example.com', role: 'User', status: 'Active' },
        { name: 'Bob Brown', email: 'bob@example.com', role: 'User', status: 'Inactive' },
        { name: 'Charlie White', email: 'charlie@example.com', role: 'User', status: 'Active' },
        { name: 'David Black', email: 'david@example.com', role: 'User', status: 'Inactive' }
    ];

    // table header
    const headers = ['Name', 'Email', 'Role', 'Status', 'Actions'];


    // handle delete action
    const handleDelete = (row) => {
        console.log('Delete', row.name);
    }
    // handle edit action
    const handleEdit = (row) => {
        console.log('Edit', row.name);
    }

    // handle view action
    const handleView = (row) => {
        console.log('View', row.name);
    }

    // handle row click
    const handleRowClick = (row) => {
        console.log('Row clicked:', row);
    }

    const actions = [
        { label: 'View', onClick: (row) => handleView(row), customClass: 'normal' },
        { label: 'Edit', onClick: (row) => handleEdit(row), customClass: 'action' },
        { label: 'Delete', onClick: (row) => handleDelete(row), customClass: 'danger' }
    ];
    return (
        <Table headers={headers} data={data} actions={actions} onRowClick={handleRowClick} />
    )
}

export default page




export const Table = ({ headers, data, onRowClick, actions }) => {

    const handleRowClick = (row) => {
        if (onRowClick) {
            onRowClick(row);
        }
    }

    const handleActionClick = (event, action, row) => {
        event.stopPropagation();
        if (action.onClick) {
            action.onClick(row);
        }
    }
    return (
        <div className="custom-table">
            <div className="custom-table-header">
                {actions && actions.length > 0 ? headers.map((item, index) => (
                    <div className="custom-table-header-cell" key={index}>
                        {item}
                    </div>
                )) : headers.slice(0, -1).map((item, index) => (
                    <div className="custom-table-header-cell" key={index}>
                        {item}
                    </div>
                ))}
            </div>

            {data?.map((row, rowIndex) => (
                <div className="custom-table-row" key={rowIndex} onClick={() => handleRowClick(row)}>
                    {Object.entries(row).map(([key, value], cellIndex) => (
                        <div data-label={headers[cellIndex]} className="custom-table-cell" key={cellIndex}>
                            <span className='hide-desktop'>{headers[cellIndex]}: </span>
                            {value}
                        </div>
                    ))}
                    {
                        actions && <div className="custom-table-cell custom-table-actions">
                            {actions.map((action, actionIndex) => (
                                <div className={`custom-table-action-button ${action.customClass || ''}`}
                                    key={actionIndex}
                                    onClick={e => handleActionClick(e, action, row)}
                                >
                                    {action.label}
                                </div>
                            ))}
                        </div>
                    }
                </div>
            ))}
        </div>
    )
}