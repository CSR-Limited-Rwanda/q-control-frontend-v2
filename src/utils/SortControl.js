'use client'
import { useState } from "react";
import { ListFilter } from "lucide-react";

const SortControl = ({
    options,
    defaultField,
    defaultDirection = 'asc',
    onChange
}) => {
    const [sortConfig, setSortConfig] = useState({
        field: defaultField,
        direction: defaultDirection
    });

    const handleFieldChange = (field) => {
        let newDirection = 'asc'
        if(field === sortConfig.field) {
            newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc'
        } else if (field === 'created_at') {
            newDirection = 'desc'
        }
        const newConfig = {field, direction: newDirection}
        setSortConfig(newConfig)
        onChange(newConfig)
    };

    const toggleDirection = () => {
        const newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        const newConfig = {
            field: sortConfig.field,
            direction: newDirection
        };
        setSortConfig(newConfig);
        onChange(newConfig);
    };

    return (
        <div className="sort-controls">
            <select
                value={sortConfig.field}
                onChange={(e) => handleFieldChange(e.target.value)}
                className="sort-select"
            >
                {options.map(option => (
                    <option
                        key={option.value}
                        value={option.value}
                    >
                        {option.label}
                    </option>
                ))}
            </select>
            <ListFilter
                size={24}
                onClick={toggleDirection}
                className={`sort-btn ${sortConfig.direction === 'asc' ? 'ascending' : 'descending'}`}
                aria-label={`Sort ${sortConfig.direction === 'asc' ? 'descending' : 'ascending'}`}
            />
        </div>
    );
};

export default SortControl;