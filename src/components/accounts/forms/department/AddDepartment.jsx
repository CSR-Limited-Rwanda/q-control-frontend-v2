'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/utils/api"
import { X } from "lucide-react"
import ErrorMessage from "@/components/messages/ErrorMessage"
import '../../../../styles/facilities/_facilities.scss'
const AddDepartment = ({ facilityId, onClose, onDepartmentAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        facility_id: facilityId,
        header_of_department: '',
        description: '',
        members: []
    })
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setIsLoading(true)
                const res = await api.get(`/users/`)
                if (res.status === 200) {
                    console.log('Users:', res.data);
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
        setError('')

        try {
            const res = await api.post('/departments/', formData)
            if (res.status === 201) {
                onDepartmentAdded(res.data)
                onClose()
            }
        } catch (error) {
            console.error(error)
            setError(error.res?.data?.message || 'Failed to create department')
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <div className="popup">
            <div className="popup-content">
                <button type="button" className="close" onClick={onClose}>
                    <X />
                </button>
                <h2>Add Department</h2>
                {error && <ErrorMessage message={error} />}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Department Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Head of Department:</label>
                        <select
                            name="header_of_department"
                            value={formData.header_of_department}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Head of Department</option>
                            {users.map(user => (
                                <option key={user.id} value={user.user.email}>
                                    {user.user.first_name} {user.user.last_name} ({user.user.email})
                                </option>
                            ))}
                        </select>
                    </div>

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
                                    {user.user.first_name} {user.user.last_name}
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
                            {isLoading ? 'Creating...' : 'Create Department'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddDepartment
