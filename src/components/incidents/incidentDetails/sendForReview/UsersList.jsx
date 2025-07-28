'use client'
import { fetchUsers } from '@/hooks/fetchUsers';
import { CheckSquare2, Square } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);


    const loadUsers = async (queryParams) => {
        setIsLoading(true);
        setError(null);
        const response = await fetchUsers(queryParams);
        console.log(response);
        if (response.success) {
            setUsers(response.data);
        } else {
            setError(response.message);
        }
        setIsLoading(false);
    }


    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        if (value.length >= 3) {
            loadUsers(`q=${value}`);
        } else if (value.length === 0) {
            loadUsers({});
        }
    }

    useEffect(() => {
        loadUsers(`page=1&size=100`);
    }, []);

    return (
        <div className='users-list-container'>
            <input type="search" name="search" id="search" value={searchQuery} onChange={handleInputChange} />
            {
                isLoading ? (
                    <p>Loading users...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="user-list">
                        {users.map(user => (
                            <div className='user' key={user.id} onClick={() => {
                                if (selectedUsers.includes(user)) {
                                    setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
                                } else {
                                    setSelectedUsers([...selectedUsers, user]);
                                }
                            }}>
                                {selectedUsers.includes(user) ? <CheckSquare2 /> : <Square />} {user?.user?.first_name} {user?.user?.last_name}
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}

export default UsersList