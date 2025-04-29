import { SearchInput } from '@/components/forms/Search'
import PrimaryButton from '@/components/PrimaryButton'
import UserCard from '@/components/UserCard'
import api from '@/utils/api'
import { Minus, Plus, Square, SquareCheck, X } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import AddUserPermissionsFrom from '../forms/AddUserPermissionsFrom'

const UsersCard = ({ setUsersNumber }) => {
    const router = useRouter()
    const { permissionGroupID } = useParams()
    const [users, setUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])

    const [isLoading, setIsLoading] = useState(true)
    const [showAddUserForm, setShowAddUserForm] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
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
        console.log("User: ", user)
        router.push(`/accounts/profiles/${user?.id}`)
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


    const handleRemoveUsers = async () => {
        const confirmed = window.confirm(
            `Are you sure you want to remove ${selectedUsers.length} users from this group? This action is not reversible`
        );

        if (!confirmed) return;

        const removedUserIds = [];
        const errors = [];

        for (const user of selectedUsers) {
            const payload =
            {
                id: parseInt(permissionGroupID),
            }

            try {
                const response = await api.delete(`/users/${user.id}/permissions/`, {
                    data: payload
                });

                if (response.status === 200) {
                    console.log("Response: ", response)
                    removedUserIds.push(user.id);
                }
            } catch (error) {
                console.log(`Failed to remove permissions for user ${user}:`, error);
                alert(`Failed to remove permissions for user ${user.first_name}:`);
                console.log("Payload: ", payload);
            } finally {
                setSelectedUsers([])
            }
        }

        if (removedUserIds.length > 0) {
            setUsers(prevUsers =>
                prevUsers.filter(user => !removedUserIds.includes(user.id))
            );
        }

        if (errors.length > 0) {
            setErrorMessage(`Failed to remove permissions for ${errors.length} users`);
        }
    };

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
                {
                    selectedUsers && selectedUsers.length > 0
                        ?
                        <button className="button" onClick={handleRemoveUsers} style={{
                            backgroundColor: 'tomato',
                            color: 'white',
                        }}>
                            <Minus />
                            Remove {selectedUsers.length}
                        </button>
                        :
                        <PrimaryButton
                            span={'Add users'}
                            prefixIcon={<Plus />}
                            onClick={() => setShowAddUserForm(true)}
                        />
                }

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
                                <tr key={index} onClick={() => handleNavigate(user)}>
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
                showAddUserForm &&
                <div className="popup">
                    <div className="popup-content">
                        <div className="close">
                            <X size={32} onClick={() => setShowAddUserForm(false)} />
                        </div>
                        <AddUserPermissionsFrom existingUsers={users} setExistingUsers={setUsers} groupId={permissionGroupID} />
                    </div>
                </div>
            }
        </div>


    )
}

export default UsersCard