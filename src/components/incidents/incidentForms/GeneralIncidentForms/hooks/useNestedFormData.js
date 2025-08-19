import { useCallback } from 'react'

const useNestedFormData = () => {
    // Helper function to get nested value safely
    const getNestedValue = useCallback((obj, path) => {
        return path.split('.').reduce((current, key) => current?.[key], obj)
    }, [])

    // Helper function to set nested value
    const setNestedValue = useCallback((obj, path, value) => {
        const keys = path.split('.')
        const lastKey = keys.pop()
        const target = keys.reduce((current, key) => {
            if (!current[key]) current[key] = {}
            return current[key]
        }, obj)
        target[lastKey] = value
        return obj
    }, [])

    // Enhanced handleChange for nested objects
    const createNestedHandleChange = useCallback((setFormData) => {
        return (e) => {
            const { name, value } = e.target

            setFormData((prevData) => {
                const newData = { ...prevData }

                if (name.includes('.')) {
                    // Handle nested objects using dot notation
                    const [parentKey, childKey] = name.split('.')
                    newData[parentKey] = {
                        ...prevData[parentKey],
                        [childKey]: value
                    }
                } else {
                    // Handle regular fields
                    newData[name] = value
                }

                return newData
            })
        }
    }, [])

    // Initialize nested object structure
    const initializeNestedObject = useCallback((formData, path, defaultValue = '') => {
        const keys = path.split('.')
        const parentKey = keys[0]
        const childKey = keys[1]

        if (!formData[parentKey]) {
            formData[parentKey] = {}
        }
        if (!formData[parentKey][childKey]) {
            formData[parentKey][childKey] = defaultValue
        }

        return formData
    }, [])

    return {
        getNestedValue,
        setNestedValue,
        createNestedHandleChange,
        initializeNestedObject
    }
}

export default useNestedFormData
