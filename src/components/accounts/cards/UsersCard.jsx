import { SearchInput } from '@/components/forms/Search'
import PrimaryButton from '@/components/PrimaryButton'
import UserCard from '@/components/UserCard'
import api from '@/utils/api'
import { Plus, Square, SquareCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import AddUserPermissionsFrom from '../forms/addUserPermissionsFrom'

const UsersCard = ({ setUsersNumber }) => {
    const router = useRouter()
    const { permissionGroupID } = useParams()
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [showAddUserForm, setShowAddUserForm] = useState(false)

    // handle select user
    const handleSelectUser = (user) => {
        // if user is not in selected users list add them, else remove them
        if (!selectedUsers.includes(user)) {
            setSelectedUsers([...selectedUsers, user])
        } else {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id))
        }
    }

    // handle select all users
    const handleSelectAllUsers = () => {
        if (selectedUsers.length !== users.length) {
            setSelectedUsers(users)
        } else {
            setSelectedUsers([])
        }
    }

    const handleNavigate = (user) => {

        router.push(`/dashboard/accounts/${user?.id}`)
    }

    const fetchUsers = async () => {
        try {
            const response = await api.get(`/permissions/${permissionGroupID}/users/`)
            if (response.status === 200) {
                setUsers(response.data)
                setUsersNumber(response.data.length)
                setIsLoading(false)
            }
        } catch (error) {
            let message = "Something went wrong"
            if (error?.response?.data) {
                message = error.response.data.message || error.response.data.error || 'Something went wrong. Try again later.'
            }
        }
    }



    useEffect(() => {
        if (permissionGroupID) {
            fetchUsers()
        }
    }, [])
    return (
        <div className='card users-card'>
            <div className="filters">
                <h3 className='title'>Users assigned ({users.length})</h3>
                <SearchInput label={'Search users in this group'} />
                <PrimaryButton
                    span={'Add users'}
                    prefixIcon={<Plus />}
                    onClick={() => setShowAddUserForm(true)}
                />

            </div>
            <div className="users-table">
                <table>
                    <thead>
                        <tr>
                            <th onClick={handleSelectAllUsers}>
                                {
                                    selectedUsers.length === users.length ? <SquareCheck /> : <Square />
                                }
                            </th>
                            <th>Username</th>
                            <th>Phone number</th>
                            <th>Facility</th>
                            <th>Department</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user, index) => (
                                <tr key={index}>
                                    <td onClick={(e) => { e.stopPropagation(); handleSelectUser(user) }}>{selectedUsers.includes(user) ? <SquareCheck /> : <Square />}</td>
                                    <td>
                                        <UserCard
                                            firstName={user?.user?.first_name}
                                            lastName={user?.user?.last_name}
                                            label={user?.user?.email}
                                        />
                                    </td>
                                    <td>{user?.phone_number}</td>
                                    <td>{user?.facility?.name}</td>
                                    <td>{user?.department?.name}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {
                showAddUserForm && <AddUserPermissionsFrom existingUsers={users} setExistingUsers={setUsers} groupId={permissionGroupID} />
            }
        </div>


    )
}

export default UsersCard