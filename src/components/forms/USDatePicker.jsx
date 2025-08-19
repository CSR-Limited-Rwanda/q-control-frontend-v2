'use client'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

const USDatePicker = ({
    name,
    value,
    onChange,
    placeholder = "MM-DD-YYYY",
    className = "",
    isInvalid = false,
    errorMessage = "",
    label,
    required = false,
    maxDate = new Date(), // Default to today to prevent future dates
    ...props
}) => {
    // Convert MM-DD-YYYY string to Date object
    const parseUSDate = (dateString) => {
        if (!dateString) return null
        const parts = dateString.split('-')
        if (parts.length === 3 && parts[0].length === 2) {
            const month = parseInt(parts[0], 10) - 1 // Month is 0-indexed
            const day = parseInt(parts[1], 10)
            const year = parseInt(parts[2], 10)
            return new Date(year, month, day)
        }
        return null
    }

    // Convert Date object to MM-DD-YYYY string
    const formatUSDate = (date) => {
        if (!date) return ''
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const year = date.getFullYear()
        return `${month}-${day}-${year}`
    }

    const selectedDate = parseUSDate(value)

    const handleDateChange = (date) => {
        const formattedDate = formatUSDate(date)

        // Create synthetic event to match regular input onChange
        const syntheticEvent = {
            target: {
                name: name,
                value: formattedDate
            }
        }

        onChange(syntheticEvent)
    }

    return (
        <div className="us-date-picker-container">
            {label && (
                <label htmlFor={name} className="date-picker-label">
                    {label} {required && <span className="required">*</span>}
                </label>
            )}

            <DatePicker
                id={name}
                name={name}
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM-dd-yyyy"
                placeholderText={placeholder}
                className={`us-date-picker ${className} ${isInvalid ? 'invalid' : ''}`}
                maxDate={maxDate}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
                yearDropdownItemNumber={50}
                scrollableYearDropdown
                autoComplete="off"
                {...props}
            />

            <div className="date-format-hint">
                Format: MM-DD-YYYY (e.g., 08-19-2025)
            </div>

            {isInvalid && errorMessage && (
                <span className="error-message">{errorMessage}</span>
            )}
        </div>
    )
}

export default USDatePicker

// usage example

// Example usage of USDatePicker component

// import USDatePicker from '@/components/forms/USDatePicker'

// const ExampleForm = () => {
//     const [formData, setFormData] = useState({
//         eventDate: '',
//         birthDate: '',
//         appointmentDate: ''
//     })

//     const handleChange = (e) => {
//         const { name, value } = e.target
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }))
//     }

//     return (
//         <div className="example-form">
//             {/* Basic usage */}
//             <USDatePicker
//                 name="eventDate"
//                 label="Event Date"
//                 value={formData.eventDate}
//                 onChange={handleChange}
//                 required={true}
//             />

//             {/* With custom max date (allow future dates) */}
//             <USDatePicker
//                 name="appointmentDate"
//                 label="Appointment Date"
//                 value={formData.appointmentDate}
//                 onChange={handleChange}
//                 maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))} // 1 year from now
//                 placeholder="Select appointment date"
//             />

//             {/* With validation */}
//             <USDatePicker
//                 name="birthDate"
//                 label="Birth Date"
//                 value={formData.birthDate}
//                 onChange={handleChange}
//                 isInvalid={!formData.birthDate}
//                 errorMessage="Birth date is required"
//                 maxDate={new Date()} // Prevent future dates
//             />
//         </div>
//     )
// }

// export default ExampleForm