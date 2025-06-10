import { useState } from "react";
import { ListFilter } from "lucide-react";

const SortControl = ({
    options = [
        { value: 'name', label: 'Name' },
        { value: 'created_at', label: 'Date added' },
        { value: 'updated_at', label: 'Last modified' },
        { value: 'size', label: 'Size' }
    ],
    defaultField = 'created_at',
    defaultDirection = 'desc',
    onChange = (config) => console.log('Sort config:', config)
}) => {
    const [sortConfig, setSortConfig] = useState({
        field: defaultField,
        direction: defaultDirection
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleFieldChange = (field) => {
        let newDirection = 'asc';
        if (field === sortConfig.field) {
            newDirection = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else if (field === 'created_at' || field === 'updated_at') {
            newDirection = 'desc';
        }
        const newConfig = { field, direction: newDirection };
        setSortConfig(newConfig);
        onChange(newConfig);
        setIsOpen(false);
    };

    const currentOption = options.find(opt => opt.value === sortConfig.field);

    return (
        <div>
            <div className="sort-controls">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="sort-btn"
                >
                    <ListFilter size={16} style={{ color: '#A5A3A9' }} />
                    <span>Sort By : {currentOption?.label}</span>
                </button>

                {isOpen && (
                    <div className="select-btn">
                        {options.map(option => (
                            <button
                                key={option.value}
                                onClick={() => handleFieldChange(option.value)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '8px 12px',
                                    border: 'none',
                                    backgroundColor: option.value === sortConfig.field ? '#f3f4f6' : 'transparent',
                                    textAlign: 'left',
                                    fontSize: '14px',
                                    color: '#374151',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    if (option.value !== sortConfig.field) {
                                        e.target.style.backgroundColor = '#f9fafb';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (option.value !== sortConfig.field) {
                                        e.target.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            {isOpen && (
                <div
                    className="select-popup"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default SortControl;