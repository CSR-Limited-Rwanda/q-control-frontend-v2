'use client'
import '@/styles/components/tables.css'
import { Square, SquareCheck } from 'lucide-react';
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
        { label: 'Edit', onClick: (row) => handleEdit(row), customClass: 'edit' },
        { label: 'Delete', onClick: (row) => handleDelete(row), customClass: 'danger' }
    ];
    return (
        <Table headers={headers} data={data} actions={actions} onRowClick={handleRowClick} />
    )
}

export default page




export const Table = ({ headers, data, onRowClick, actions, handleSelect, handleSelectAll, selectedItems, customClassName = null, isSelectable = false }) => {

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
    return (<CustomTable />)
    return (
        <div className={`custom-table table ${customClassName || ''} ${isSelectable ? 'selectable' : ''}`}>
            <div className="custom-table-header header">
                {
                    isSelectable && <div className="checkbox select-all-cell" onClick={handleSelectAll}>
                        {
                            selectedItems?.length === data.length ? <SquareCheck /> : <Square />
                        }
                    </div>
                }

                {actions && actions.length > 0 ? headers.map((item, index) => (
                    <div className="custom-table-header-cell cell" key={index}>
                        {item}
                    </div>
                )) : headers.slice(0, -1).map((item, index) => (
                    <div className="custom-table-header-cell cell" key={index}>
                        {item}
                    </div>
                ))}
            </div>

            {data?.map((row, rowIndex) => (
                <div className={`custom-table-row row ${selectedItems.includes(row.id) ? 'selected' : ''}`} key={rowIndex} onClick={() => handleRowClick(row)}>
                    {
                        isSelectable &&
                        <div onClick={(e) => {
                            e.stopPropagation();
                            handleSelect(row.id);
                        }} className='select-cell'>
                            {selectedItems.includes(row.id) ? <SquareCheck /> : <Square />}
                        </div>
                    }
                    {Object.entries(row).map(([key, value], cellIndex) => (
                        <div data-label={headers[cellIndex]} className="custom-table-cell cell" key={cellIndex}>

                            <p><span className='hide-desktop'>{headers[cellIndex]}: </span> {value}</p>
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

const CustomTable = () => {
    return (

        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Occupation</th>
                    <th>City</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td data-label="Name">John Doe</td>
                    <td data-label="Age">30</td>
                    <td data-label="Occupation">Engineer</td>
                    <td data-label="City">New York</td>
                </tr>
                <tr>
                    <td data-label="Name">Jane Smith</td>
                    <td data-label="Age">25</td>
                    <td data-label="Occupation">Designer</td>
                    <td data-label="City">Los Angeles</td>
                </tr>
                <tr>
                    <td data-label="Name">Sam Wilson</td>
                    <td data-label="Age">40</td>
                    <td data-label="Occupation">Teacher</td>
                    <td data-label="City">Chicago</td>
                </tr>
            </tbody>
        </table>

    )
}