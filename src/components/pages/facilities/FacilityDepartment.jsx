'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/app/dashboard/layout'
import { useParams } from 'next/navigation'
import { useRouter } from 'next/navigation'
import api from '@/utils/api'
import { Notebook } from 'lucide-react'
import DateFormatter from '@/components/DateFormatter'
import '../../../styles/facilities/_facilities.scss'
import NoteMessage from '@/components/NoteMessage'
import {
    NotepadText,
    Frown,
    Users,
    ChevronRight,
    File,
    Key,
    Layers,
    ListCheck,
    SquarePen,
    UserCheck,
    UserX,
    Trash2
} from 'lucide-react'
import NewUserForm from '@/components/accounts/forms/newUser/newUserForm'
import DeleteDepartmentPopup from '@/components/accounts/forms/department/DeleteDepartmentPopup'
import ErrorMessage from '@/components/messages/ErrorMessage'
import EditDepartment from '@/components/accounts/forms/department/EditDepartment'


const FacilityDepartmentContent = () => {
    const params = useParams()
    const facility_id = params.facility_id
    const department_id = params.department_id
    const [facility, setFacility] = useState(null)
    const [complaints, setComplaints] = useState([])
    const [staffCount, setStaffCount] = useState(0)
    const [members, setMembers] = useState([])
    const [activeTab, setActiveTab] = useState("staff")
    const [department, setDepartment] = useState(null)
    const [showNewUserForm, setShowNewUserForm] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [departmentMembers, setDepartmentMembers] = useState(0)
    const [showActions, setShowActions] = useState(false)
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [showEditForm, setShowEditForm] = useState(false)
    const router = useRouter()


    useEffect(() => {
        const getDepartment = async () => {
            try {
                setIsLoading(true);
                const res = await api.get(`/departments/${department_id}/?expand=members,facility`);
                if (res.status === 200) {
                    const responseData = res.data.data || {}
                    const departmentData = {
                        ...responseData,
                        members: responseData.members || [],
                        facility: responseData.facility || { name: 'unknown facility' }
                    }
                    console.log('department', departmentData)
                    setDepartment(departmentData);
                }
            } catch (error) {
                console.error('Error fetching department:', error);
                setError('Failed to load department data');
            } finally {
                setIsLoading(false);
            }
        }

        if (department_id) {
            getDepartment();
        }
    }, [department_id]);


    useEffect(() => {
        if (!facility_id) return;

        const fetchFacility = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/facilities/${facility_id}/?expand=departments`);
                if (response.status === 200) {
                    const facilityData = {
                        ...response.data,
                        staff_members: response.data.staff_members || [],
                        departments: response.data.departments || []
                    };
                    setFacility(facilityData);
                    setStaffCount(facilityData.staff_members.length);
                }
            } catch (error) {
                console.error('Error fetching facility:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFacility();
    }, [facility_id]);

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
                    console.log('facility department members', response.data.members.length)
                    setMembers(response.data.members)
                    setDepartmentMembers(response.data.members.length)
                }
            } catch (error) {
                console.log(`an error has occurred: ${error}`)
            }
        }
        fetchStaffMembers()
    }, [])

    // fetching the incidents of the departments
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

    const handleShowNewUserForm = () => {
        setShowNewUserForm(prev => !prev);
    };
    useEffect(() => {
        setDepartment(localStorage.getItem("department"));
    }, []);

    const handleShowActions = () => {
        setShowActions(!showActions)
    }

    const handleDeleteDepartment = async () => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const res = await api.delete(`/departments/${department_id}/`);

            if (res.status === 200 || res.status === 204) {
                router.push(`/accounts`);
                console.log('clicked')
            } else {
                setDeleteError('Failed to delete department');
            }
        } catch (error) {
            console.error('Delete error:', error);
            setDeleteError(error.response?.data?.message || 'Error deleting department');
        } finally {
            setIsDeleting(false);
            setShowDeletePopup(false);
        }
    };


    if (!facility) {
        return <div>Loading facility data...</div>;
    }

    return (
        <>
            {showNewUserForm && (
                <div className='popup'>
                    <div className='popup-content'>
                        <NewUserForm handleClose={handleShowNewUserForm} />
                    </div>
                </div>
            )}

            {showEditForm && (
                <EditDepartment
                    department={department}
                    onClose={() => setShowEditForm(false)}
                    onDepartmentUpdated={(updatedDepartment) => {
                        setDepartment(updatedDepartment)
                    }}
                />
            )}

            {showDeletePopup && (
                <DeleteDepartmentPopup
                    onClose={() => setShowDeletePopup(false)}
                    onConfirm={handleDeleteDepartment}
                    isLoading={isDeleting}
                />
            )}
            {deleteError && (
                <ErrorMessage message={deleteError} />
            )}

            <section className='facility-department-details-header'>
                <div className='facility-department-details-row'>
                    <div className='col-1'>
                        <div className='icon-container'>
                            <Notebook size={30} color='#f87c47' className='icon' />
                        </div>
                        <div className='facility-title'>
                            {department ? (
                                <>
                                    <h2 className='facility-name'>{department.name}</h2>
                                    <p className='date-created'>Created on <DateFormatter dateString={department.created_at} /></p>
                                </>
                            ) : (
                                <p>Loading department data...</p>
                            )}
                        </div>

                    </div>
                    <div className='col-2'>
                        <div className='staff-card'>
                            <p className='staff-card-title'>Staff</p>
                            <p className='staff-card-desc'>{departmentMembers}</p>
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
                            </div>
                        </div>
                    </div>
                    <div className='col-3'>
                        <div onClick={handleShowActions} className={`actions-dropdown ${showActions && 'show'}`}>
                            <div className="header">
                                <span>Actions</span>
                                <ChevronRight className='icon' />
                            </div>

                            {/* actions : Edit, Deactivate, Activate, Delete, Change Password */}
                            <div className="actions-list">
                                <div
                                    className="action"
                                    onClick={() => {
                                        setShowEditForm(true)
                                        setShowActions(false)
                                    }}
                                >
                                    <SquarePen />
                                    <span>Edit department</span>
                                </div>
                                <hr />
                                <div
                                    className="action"
                                    onClick={() => {
                                        setShowDeletePopup(true)
                                        setShowActions(false)
                                    }}
                                >
                                    <Trash2 />
                                    <span>Delete department</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="tabs-list">
                <div
                    onClick={() => setActiveTab("reports")}
                    className={`tab ${activeTab === "reports" ? "active" : ""}`}
                >
                    <NotepadText size={20} />
                    Incidents reports
                </div>
                <div
                    onClick={() => setActiveTab("complaints")}
                    className={`tab ${activeTab === "complaints" ? "active" : ""}`}
                >
                    <Frown size={20} /> Complaints
                </div>
                {/* <div onClick={() => setActiveTab('documents')} className={`tab ${activeTab === 'documents' ? 'active' : ''}`}>Documents</div> */}
                <div
                    onClick={() => setActiveTab("staff")}
                    className={`tab ${activeTab === "staff" ? "active" : ""}`}
                >
                    <Users size={20} /> Staff
                </div>
            </div>

            {/* incident reports */}
            {activeTab === "reports" && (
                <div className="report-list-with-notes">
                    <p>Incident reports of the department</p>
                </div>
            )}
            {/* complaints */}
            {activeTab === "complaints" && (
                <div>
                    <div className="table-container">
                        <table className='review-groups-table'>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Claim ID</th>
                                    <th>Patient name</th>
                                    <th>MRN</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            {complaints && complaints.length > 0 ? (
                                complaints.map((complaint) => (
                                    <tbody>
                                        <tr
                                            // onClick={() => handleShowComplainDetails(complaint)}
                                            key={index}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{complaint.id}</td>
                                            <td>{complaint.patient_name}</td>
                                            <td>{complaint.medical_record_number}</td>
                                            <td>
                                                {<DateFormatter dateString={complaint.created_at} />}
                                            </td>
                                        </tr>
                                    </tbody>
                                ))
                            ) : (
                                <tbody>
                                    <tr>
                                        <td colSpan='5'>
                                            <p>No complaints available</p>
                                        </td>
                                    </tr>
                                </tbody>
                            )}
                        </table>
                    </div>
                </div>
            )}
            {/* staff */}
            {activeTab === "staff" && (

                <div className='staff-list'>
                    <NoteMessage message={"Admin can add staff from here"} />
                    <div className='staff-list-header'>
                        <p>
                            When you add a staff, they are going to be added under {department && department.name}
                        </p>
                        <button
                            onClick={handleShowNewUserForm}
                            type="button"
                            className="tertiary-button"
                        >
                            Add staff
                        </button>
                    </div>
                    <div className='table-container'>
                        <table className='review-groups-table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Department</th>
                                </tr>
                            </thead>
                            {department && (
                                <tbody>
                                    {department.members.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.id}</td>
                                            <td>{member.first_name} {member.last_name}</td>
                                            <td>{member.email}</td>
                                            <td>{department.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            ) || (
                                    <tbody>
                                        <tr>
                                            <td colSpan='5'>No member in this department</td>
                                        </tr>
                                    </tbody>
                                )}
                        </table>
                    </div>
                </div>
            )}
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
