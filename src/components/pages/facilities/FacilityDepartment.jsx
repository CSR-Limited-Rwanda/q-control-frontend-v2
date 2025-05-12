'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/app/dashboard/layout'
import { useParams } from 'next/navigation'
import api from '@/utils/api'
import { Notebook } from 'lucide-react'
import DateFormatter from '@/components/DateFormatter'
import '../../../styles/facilities/_facilities.scss'
import NoteMessage from '@/components/NoteMessage'
import { ChevronDown } from 'lucide-react';


const FacilityDepartmentContent = () => {
    const params = useParams()
    const facility_id = params.facility_id
    const department_id = params.department_id
    const [facility, setFacility] = useState("")
    const [complaints, setComplaints] = useState([])
    const [staffCount, setStaffCount] = useState(0)
    const [members, setMembers] = useState([])

    // getting the department
    useEffect(() => {
        if (!facility_id) return

        const fetchDepartments = async () => {
            try {
                // console.log('Fetching departments for facility:', facility_id)
                const response = await api.get(`/facilities/${department_id}/`)
                if (response.status === 200) {
                    // console.log('facility department', response.data)
                    setFacility(response.data)
                    setStaffCount(response.data.staff_members?.length || 0)
                }
            } catch (error) {
                console.log(`an error has occurred: ${error}`)
            }
        }
        fetchDepartments()
    }, [facility_id, params])

    // getting the complaints of a department
    useEffect(() => {
        const getComplaints = async () => {
            try {
                const response = await api.get(`/departments/${department_id}/complaints`)
                if (response.status === 200) {
                    // console.log('department complaints', response.data)
                    setComplaints(response.data)
                }
            } catch (error) {
                console.log(`an error has occurred fetching complaints: ${error}`)
            }
        }
        getComplaints()
    }, [department_id])

    // getting the staff members of a departments
    useEffect(() => {
        const fetchStaffMembers = async () => {
            try {
                const response = await api.get(`/facilities/departments/${department_id}/members/`)
                if (response.status === 200) {
                    // console.log('facility department members', response.data)
                    setMembers(response.data.members)
                }
            } catch (error) {
                console.log(`an error has occurred: ${error}`)
            }
        }
        fetchStaffMembers()
    }, [])

    // fetching the incidents
    useEffect(() => {
        const getIncidents = async () => {
            try {
                const response = await api.get(`/facilities/departments/${department_id}/incidents`)
                if (response.status === 200) {
                    console.log('incidents', response)
                }
            } catch (error) {
                console.log(`Failed to fetch the incidents of the departments: ${error}`)
            }
        }
        getIncidents()
    }, [])

    if (!facility) {
        return <div>Loading facility data...</div>;
    }

    return (
        <>
            <section className='facility-department-details-header'>
                <div className='facility-department-details-row'>
                    <div className='col-1'>
                        <div className='icon-container'>
                            <Notebook size={30} color='#f87c47' className='icon' />
                        </div>
                        <div className='facility-title'>
                            <h2 className='facility-name'>{facility.name}</h2>
                            <p className='date-created'>Created on <DateFormatter dateString={facility.created_at} /></p>
                        </div>
                    </div>
                    <div className='col-2'>
                        <div className='staff-card'>
                            <p className='staff-card-title'>Staff</p>
                            <p className='staff-card-desc'>{staffCount}</p>
                        </div>
                        <div className='complaints-card'>
                            <p className='complaints-card-title'>Complaints</p>
                            {complaints && complaints.length > 0 ? (
                                <p className='complaints-card-desc'>{complaints.length}</p>
                            ) : (
                                <p className='complaints-card-desc'>0</p>
                            )}
                        </div>
                        <div className='staff-members-container'>
                            <p>Members</p>
                            <div className='staff-members-names'>
                                {Array.isArray(members) && members.length > 0 ? (
                                    members.slice(-4).map((member) => (
                                        <div key={member.id} className='staff-member-name-card'>
                                            <p className='member-name'>
                                                {member.first_name?.charAt(0).toUpperCase() || 'None'} {member.last_name?.charAt(0).toUpperCase() || 'None'}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <NoteMessage message="no members" />
                                )}
                                {/* {Array.isArray(members) && members.map((member) => (
                                    <div key={member.id} className='staff-member-name-card'>
                                        <p className='member-name'>
                                            {member.first_name?.charAt(0).toUpperCase() || 'None'} {member.last_name?.charAt(0).toUpperCase() || 'None'}
                                        </p>
                                    </div>
                                ))} */}
                            </div>
                        </div>
                    </div>
                    <div className='col'>
                        <button>
                            <span>
                                Actions
                            </span>
                            <ChevronDown />
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}

const FacilityDepartment = () => {
    return (
        <DashboardLayout>
            <FacilityDepartmentContent />
        </DashboardLayout>
    )
}

export default FacilityDepartment
