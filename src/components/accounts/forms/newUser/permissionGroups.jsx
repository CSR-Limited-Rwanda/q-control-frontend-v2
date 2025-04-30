'use client'
import React, { useEffect, useCallback } from 'react'
import { useState } from 'react'
import { LoaderCircle, Search, Square, SquareCheck, X } from 'lucide-react'
import api from '@/utils/api';
import { SearchInput } from '@/components/forms/Search';


const PermissionGroups = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    }

    const [groups, setGroups] = useState([])
    const [addToPermissionGroups, setAddToPermissionGroups] = useState(true)
    const [hasReviewPermissions, setHasReviewPermissions] = useState(false)
    const [permissionLevel, setPermissionLevel] = useState('')
    const [permissions, setPermissions] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const isFocused = document.activeElement;

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)


    const fetchGroups = async () => {
        setIsLoading(true)
        try {
            const response = await api.get(`/permissions/?search=${searchQuery}`)
            setGroups(response.data)
        } catch (error) {
            setErrorMessage("Failed to fetch groups")
            console.log(error)
        } finally {
            setIsLoading(false)
            setIsSearching(false)
        }
    }
    const fetchPermissions = async () => {
        setIsLoading(true)
        try {
            const response = await api.get("/permissions/")
            setPermissions(response.data)
        } catch (error) {
            console.log(error)
            setErrorMessage("Failed to fetch permissions")
        } finally {
            setIsLoading(false)
        }
    }

    const handleSearch = useCallback(() => {
        if (searchQuery.length >= 3) {
            setIsSearching(true);
            fetchGroups();
        }
        else if (searchQuery.length === 0 && isFocused) {
            setIsSearching(true);
            fetchGroups();
        } else {
            setIsSearching(false);
        }
    }, [searchQuery]);

    const handleCheckPermissionGroup = (group) => {
        setFormData((prevData) => {
            const isGroupSelected = prevData.permissionGroups.some((item) => item.id === group.id);
            const updatedGroups = isGroupSelected
                ? prevData.permissionGroups.filter((item) => item.id !== group.id)
                : [...prevData.permissionGroups, group];

            return {
                ...prevData,
                permissionGroups: updatedGroups,
            };
        });
    };

    const handleHasReviewPermissions = () => {
        setFormData((prevData) => ({
            ...prevData,
            hasReviewPermissions: !prevData.hasReviewPermissions,
        }));
    }

    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            handleSearch();
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [searchQuery, handleSearch]);

    useEffect(() => {
        fetchGroups()
    }, [])

    useEffect(() => {
        console.log("Updated permissionGroups:", formData.permissionGroups);
    }, [formData.permissionGroups]);

    return (
        <div className='form'>
            <div className="card">
                <div className="form-group">
                    <label htmlFor="permissionLevel">Permission level</label>
                    <select
                        id="permissionLevel"
                        value={formData.permissionLevel}
                        onChange={handleChange}
                    >
                        <option value="">Select permission level</option>
                        <option value="Individual">User</option>
                        <option value="Department">Department</option>
                        <option value="Facility">Facility</option>
                        <option value="Corporate">Corporate</option>
                    </select>
                </div>
                <div className="check-box" onClick={handleHasReviewPermissions}>
                    {
                        formData.hasReviewPermissions ? <SquareCheck /> : <Square />
                    }
                    <label htmlFor="hasReviewPermissions">Has review permissions</label>
                </div>
                <div className="check-box" onClick={() => setAddToPermissionGroups(!addToPermissionGroups)}>
                    {
                        addToPermissionGroups ? <SquareCheck /> : <Square />
                    }
                    <label htmlFor="addToPermissionGroups">Add to permission groups</label>
                </div>
            </div>
            {
                addToPermissionGroups ?
                    <>
                        <div className="card permission-groups">
                            <SearchInput
                                value={searchQuery}
                                setValue={setSearchQuery}
                                isSearching={isSearching}
                            />
                            <h3>Permission Roles</h3>
                            {
                                isLoading && groups.length < 1 ? (
                                    <p>Loading...</p>
                                ) : errorMessage ? (
                                    <p>{errorMessage}</p>
                                ) : (
                                    <div>
                                        {groups.map((group) => (
                                            <div onClick={() => handleCheckPermissionGroup(group)} className='group check-box' key={group.id}>
                                                {formData.permissionGroups.some((item) => item.id === group.id) ? <SquareCheck /> : <Square />}
                                                <p>{group.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                    </>
                    : <div className="permissions-list">
                        <h3>Permissions</h3>
                    </div>
            }
        </div>
    )
}

export default PermissionGroups