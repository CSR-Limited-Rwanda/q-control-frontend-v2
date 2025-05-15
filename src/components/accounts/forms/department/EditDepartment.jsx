'use client'
import { useState, useEffect } from "react"
import { X } from "lucide-react"
import api from "@/utils/api"
import ErrorMessage from "@/components/messages/ErrorMessage"
import '../../../../styles/facilities/_facilities.scss'


const EditDepartment = ({
    department,
    onClose,
    onDepartmentUpdated
}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        // header_of_department: department?.header_of_department || '',
        members: []
    })
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (department) {
            setFormData({
                name: department.name || '',
                description: department.description || '',
                members: department.members?.map(member => member.id) || []
            })
        }
    }, [])

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(`/users/`)
                if (res.status === 200) {
                    setUsers(res.data)
                }
            } catch (error) {
                console.log(`an error occurred: ${error}`)
                setError('Failed to fetch users')
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleMembers = (e) => {
        const options = Array.from(e.target.selectedOptions).map(option => option.value)
        setFormData(prev => ({
            ...prev,
            members: options
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            if (!department?.id) {
                throw new Error('Department ID is missing')
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                members: formData.members.map(Number)
            }

            if (Object.keys(payload).length === 0) {
                onClose()
                return
            }


            const res = await api.put(`/departments/${department.id}/`, payload)
            if (res.status === 200) {
                const updatedDepartment = {
                    ...department,
                    ...res.data.data,
                    members: res.data.data.members || []
                }
                onDepartmentUpdated(updatedDepartment)
                onClose()
            }
        } catch (error) {
            console.log('an error occurred', error)
            setError(error.response?.data?.message || 'Failed to update the department')
        } finally {
            setIsLoading(false)
        }
    }

    if (!department) return null

    return (
        <div className="popup">
            <div className="popup-content">
                <button type="button" className="close" onClick={onClose}>
                    <X />
                </button>
                <h2>Edit Department</h2>
                {error && <ErrorMessage message={error} />}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Department Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    {/* <div className="form-group">
                        <label>Head of Department:</label>
                        <select
                            name="header_of_department"
                            value={formData.header_of_department}
                            onChange={handleChange}
                        >
                            <option value="">Select Head of Department</option>
                            {users.map(user => (
                                <option key={user.id} value={user.user.email}>
                                    {user.user.first_name} {user.user.last_name} ({user.user.email})
                                </option>
                            ))}
                        </select>
                    </div> */}

                    <div className="form-group">
                        <label>Members:</label>
                        <select
                            multiple
                            name="members"
                            value={formData.members}
                            onChange={handleMembers}
                            className="multi-select"
                        >
                            {users.map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.first_name} {user.last_name}
                                </option>

                            ))}
                        </select>
                        <small>Hold Ctrl/Cmd to select multiple members</small>
                    </div>

                    <div className="actions">
                        <button type="button" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </button>
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Update Department'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditDepartment

