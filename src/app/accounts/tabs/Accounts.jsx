'use client'
import api from '@/utils/api';
import { Filter, LoaderCircle, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const Accounts = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const handleFetchUsers = async () => {
            setIsLoading(true);
            try {
                const response = await api.get(`/users/`);
                if (response.status === 200) {
                    console.log(response.data);
                    setUsers(response.data);
                    return
                } else {
                    setErrorMessage("Error fetching users. Contact support.");
                }
            } catch (error) {
                console.log(error)
                setErrorMessage("Error fetching users. Contact support.");
            } finally {
                setIsLoading(false);
            }
        }
        handleFetchUsers();
    }, [])
    return (
        <div>
            {
                isLoading
                    ? <LoaderCircle className='loading-icon' />
                    : errorMessage ? <div className="message error">
                        <span>{errorMessage}</span>
                    </div>
                        : <div className="users-table">
                            <div className="filters">
                                <div className="search-input">
                                    <input type="text" id='searchUsers' name='searchUser' placeholder='Search users' />
                                </div>

                                <div className="actions">
                                    <button className='secondary'><Filter /> Filters</button>
                                    <button className='primary'><Plus /> Add user</button>
                                </div>
                            </div>
                            {
                                users.length > 0 ?
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Names</th>
                                                <th>Email</th>
                                                <th>Phone</th>
                                                <th>Facility</th>
                                                <th>Permission level</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td>{user?.user?.first_name} {user?.user?.last_name}</td>
                                                        <td>{user?.user?.email}</td>
                                                        <td>{user.phone_number}</td>
                                                        <td>{user?.facility?.name}</td>
                                                        <td>{user.permission_level}</td>
                                                    </tr>
                                                ))
                                            }
                                            <tr>
                                            </tr>
                                        </tbody>
                                    </table>
                                    : <div className="no-content">
                                        <h3>No users found</h3>
                                        <p>There are no users in the system.</p>
                                    </div>
                            }
                        </div>
            }
        </div>
    )
}

export default Accounts