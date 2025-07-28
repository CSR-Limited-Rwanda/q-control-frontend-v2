'use client'
import { fetchUsers } from '@/hooks/fetchUsers';
import { Button } from '@mui/material';
import { CheckSquare2, Square } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const UsersList = ({ currentStep, setCurrentStep, error, setError, users, setUsers, selectedUsers, setSelectedUsers, requireApprovalEachMember, setRequireApprovalEachMember, taskDays, setTaskDays, comment, setComment, handleSendForReview }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [showOtherFields, setShowOtherFields] = useState(false);
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

    const handleConfirmUsers = () => {
        if (selectedUsers.length === 0) {
            setError("Please select at least one user.");
            return;
        }
        setShowOtherFields(true);
        setError(null);
    }

    const handleSelectedUserChange = (user) => {
        if (selectedUsers.some(u => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
        setError(null); // Clear any existing errors
    }

    useEffect(() => {
        loadUsers(`page=1&size=100`);
    }, []);

    return (
        <div className='users-list-container'>
            <div className="users-search">
                <input
                    type="search"
                    name="search"
                    id="search"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search users..."
                />
                {
                    isLoading ? (
                        <p>Loading users...</p>
                    ) : error ? (
                        <p className="error">{error}</p>
                    ) : (
                        <div className="user-list">
                            {users.map(user => (
                                <div className='user' key={user.id} onClick={() => handleSelectedUserChange(user)}>
                                    {selectedUsers.some(u => u.id === user.id) ? <CheckSquare2 /> : <Square />}
                                    {user?.user?.first_name} {user?.user?.last_name}
                                </div>
                            ))}
                        </div>
                    )
                }
                {selectedUsers.length > 0 && (
                    <div className="selected-users-summary">
                        <p><strong>Selected:</strong> {selectedUsers.length} user(s)</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UsersList