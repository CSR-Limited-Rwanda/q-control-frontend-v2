'use client'
import '@/styles/accounts/_accounts.scss'
import api from '@/utils/api'
import { ChevronUp, SquareCheck, SquarePen, Trash2 } from 'lucide-react'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useGroupContext } from '@/context/providers/Group'

export const PermissionGroupCard = ({ users }) => {
    const [isLoading, setIsLoading] = useState(true)
    const { permissionGroupID } = useParams()
    const { selectedGroup, setSelectedGroup } = useGroupContext()
    const [itemsToShow, setItemsToShow] = useState({})

    const handleItemsToShow = (feature) => {
        if (feature === itemsToShow) {
            setItemsToShow("");
        } else {
            setItemsToShow(feature);
        }
    }

    const fetchPermission = async () => {
        try {
            const response = await api.get(`/permissions/${permissionGroupID}/`)
            console.log(response)
            if (response.status === 200) {
                setSelectedGroup(response.data)
                setIsLoading(false)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (permissionGroupID) {
            fetchPermission()
        }
    }, [])
    return (
        <div className="card permissions-card">
            <div className="group-header">
                <div className="content">
                    <h3>{selectedGroup?.name}</h3>
                    <small>Users with this permission: {users?.length}</small>
                </div>
                <div className="actions">
                    <div className="action danger">
                        <Trash2 size={18} />
                    </div>
                    <div className="action">
                        <SquarePen size={18} />
                    </div>

                </div>
            </div>

            <div className="permissions-groups-list">
                {
                    selectedGroup?.permissions?.map((perm, index) => (
                        <div onClick={() => handleItemsToShow(perm.feature)} key={index} className={`group ${itemsToShow === perm.feature && 'show'}`}>
                            <div className="header">
                                <p>{perm.feature}</p>
                                <ChevronUp className='icon' />
                            </div>
                            <div className="group-content">
                                <div className="perms">
                                    {
                                        perm.perms?.map((role, index) => (
                                            <div key={index} className="check-box">
                                                <SquareCheck color='#F87C47' />
                                                <p>{role.name}</p>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}