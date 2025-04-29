'use client'
import '@/styles/accounts/_profile.scss'
import DashboardLayout from '@/app/dashboard/layout'
import { DraftsTab } from '@/components/accounts/profile/DraftsTab'
import UserComplaints from '@/components/accounts/profile/profileComplaints'
import ProfileDocuments from '@/components/accounts/profile/profileDocuments'
import ProfileReports from '@/components/accounts/profile/profileReports'
import api from '@/utils/api'
import { ChevronDown, ChevronRight, File, Frown, Key, Layers, ListCheck, LoaderCircle, ShieldCheck, SquarePen, Trash2, UserCheck, UserX } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import OutlineButton from '@/components/OutlineButton'
import PrimaryButton from '@/components/PrimaryButton'
import ProfilePlaceHolder from '@/components/ProfilePlaceHolder'
import UserCard from '@/components/UserCard'
import NewUserForm from '@/components/accounts/forms/newUser/newUserForm'
import ChangePasswordForm from '@/components/accounts/forms/ChangePassword'
import ActivateUserForm from '@/components/accounts/forms/ActivateUser'
import DeleteUserForm from '@/components/accounts/forms/DeleteUser'
import UserPermissions from '@/components/accounts/profile/userPermissions'

const ProfileDetailsPage = () => {
    const { profileId } = useParams()
    const [profile, setProfile] = useState(null)
    const [showChangePasswordForm, setShowChangePasswordForm] = useState(false);
    const [showUpdateUserForm, setShowUpdateUserForm] = useState(false);
    const [showPreferencesForm, setShowPreferencesForm] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [showActivateUserForm, setShowActivateUserForm] = useState(false);
    const [showDeactivateUserForm, setShowDeactivateUserForm] = useState(false);
    const [showDeleteUserForm, setShowDeleteUserForm] = useState(false);
    const [showUserPermissionsForm, setShowUserPermissionsForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const handleShowUpdateForm = () => {
        setShowActions(false)
        setShowUpdateUserForm(!showUpdateUserForm)
    }

    const handleShowActions = () => {
        setShowActions(!showActions)
    }
    const handleShowPreferencesForm = () => {
        setShowPreferencesForm(!showPreferencesForm)
    }
    const handleShowChangePasswordForm = () => {
        setShowChangePasswordForm(!showChangePasswordForm)
    }
    const handleShowActivateUserForm = () => {
        setShowActivateUserForm(!showActivateUserForm)
    }
    const handleShowDeactivateUserForm = () => {
        setShowDeactivateUserForm(!showDeactivateUserForm)
    }
    const handleShowDeleteUserForm = () => {
        setShowDeleteUserForm(!showDeleteUserForm)
    }
    const handleShowUserPermissionsForm = () => {
        setShowUserPermissionsForm(!showUserPermissionsForm)
    }

    useEffect(() => {
        const fetchProfile = async () => {

            try {
                const response = await api.get(`/users/${profileId}/`)
                console.log(response.data)
                if (response.status === 200) {
                    const data = response.data
                    const transformedProfile = {

                        ...data,
                        facility: data?.facility
                            ? { label: data.facility.name, value: data.facility.id }
                            : null,
                        department: data?.department
                            ? { label: data.department.name, value: data.department.id }
                            : null,
                    };

                    setProfile(transformedProfile);
                    console.log(transformedProfile)
                }
            } catch (error) {
                let message = "Something went wrong"
                if (error?.response?.data) {
                    message = error.response.data.message || error.response.data.error || 'Something went wrong. Try again later.'
                }
                setError(message)
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()

    }, [])
    return (
        <DashboardLayout>
            <div className="profile-page">
                <div className="page-header card">
                    <div className="id">
                        <h1>ID</h1>
                        <h1>{profile?.id}</h1>
                    </div>
                    <div className="actions">
                        <OutlineButton
                            prefixIcon={<Key />}
                            span={'Permissions'}
                            onClick={handleShowUserPermissionsForm}
                        />
                        <div onClick={handleShowActions} className={`actions-dropdown ${showActions && 'show'}`}>
                            <div className="header">
                                <span>Actions</span>
                                <ChevronRight className='icon' />
                            </div>

                            {/* actions : Edit, Deactivate, Activate, Delete, Change Password */}
                            <div className="actions-list">
                                <div className="action" onClick={() => setShowUpdateUserForm(true)}>
                                    <SquarePen />
                                    <span>Edit user</span>
                                </div>
                                <hr />
                                <div className="action">
                                    <UserCheck />
                                    <span>Activate user</span>
                                </div>
                                <hr />
                                <div className="action">
                                    <UserX />
                                    <span>Deactivate user</span>
                                </div>
                                <hr />
                                <div className="action" onClick={handleShowDeleteUserForm}>
                                    <Trash2 />
                                    <span>Delete user</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-details">
                    <div className="profile-info">
                        <div className="profile card">
                            <UserCard
                                firstName={profile?.user?.first_name}
                                lastName={profile?.user?.last_name}
                                label={profile?.user?.email}
                            />
                        </div>
                        <div className="card">
                            <h3>Facility information</h3>
                            <div className="details">
                                <div className="detail">
                                    <small>Facility</small>
                                    <p>{profile?.facility?.label}</p>
                                </div>
                                <div className="detail">
                                    <small>Department</small>
                                    <p>{profile?.department?.label}</p>
                                </div>
                                <div className="detail">
                                    <small>Title</small>
                                    <p>{profile?.title}</p>
                                </div>
                                <div className="detail">
                                    <small>Role</small>
                                    <p>{profile?.role}</p>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <h3>Personal information</h3>

                            <div className="details">
                                <div className="detail">
                                    <small>First name</small>
                                    <p>{profile?.user.first_name}</p>
                                </div>
                                <div className="detail">
                                    <small>Last name</small>
                                    <p>{profile?.user.last_name}</p>
                                </div>
                                <div className="detail">
                                    <small>Email</small>
                                    <p>{profile?.user.email}</p>
                                </div>
                                <div className="detail">
                                    <small>Phone</small>
                                    <p>{profile?.phone_number}</p>
                                </div>
                                <div className="detail">
                                    <small>Gender</small>
                                    <p>{profile?.gender}</p>
                                </div>
                                <div className="detail">
                                    <small>Date of birth</small>
                                    <p>{profile?.date_of_birth}</p>
                                </div>
                                <div className="detail">
                                    <small>Birth country</small>
                                    <p>{profile?.birth_country}</p>
                                </div>
                                <div className="detail">
                                    <small>State</small>
                                    <p>{profile?.state}</p>
                                </div>
                                <div className="detail">
                                    <small>City</small>
                                    <p>{profile?.city}</p>
                                </div>
                                <div className="detail">
                                    <small>Address</small>
                                    <p>{profile?.address}</p>
                                </div>
                                <div className="detail">
                                    <small>Zip code</small>
                                    <p>{profile?.zip_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card profile-tabs">
                        <ProfileTabs userId={profile?.id} />
                    </div>
                </div>
            </div>
            {showUpdateUserForm && <NewUserForm handleClose={handleShowUpdateForm} isEditMode={true} existingUserData={profile} />}
            {showChangePasswordForm && <ChangePasswordForm />}
            {showActivateUserForm && <ActivateUserForm />}
            {showDeactivateUserForm && <showDeactivateUserForm />}
            {showDeleteUserForm && <DeleteUserForm userId={profileId} handleClose={handleShowDeleteUserForm} />}
            {showUserPermissionsForm && <UserPermissions userId={profileId} togglePermissions={handleShowUserPermissionsForm} />}

        </DashboardLayout>
    )
}

export default ProfileDetailsPage


const ProfileTabs = ({ userId }) => {
    const [activeTab, setActiveTab] = useState("reports");

    if (activeTab === "drafts") {
        localStorage.removeItem("changeBreadCrumbs");
    }
    useEffect(() => {
        if (localStorage.getItem("setDraftActive") === "drafts") {
            setActiveTab("drafts");
            localStorage.removeItem("setDraftActive");
        }
    }, []);

    return (
        <div className="profile-data">
            <div className="tabs">
                <div
                    onClick={() => setActiveTab("reports")}
                    className={`tab ${activeTab === "reports" ? "active" : ""}`}
                >
                    <ListCheck size={20} />
                    <p> Submitted reports</p>
                </div>
                <div
                    onClick={() => {
                        setActiveTab("drafts");
                        localStorage.removeItem("changeBreadCrumbs");
                    }}
                    className={`tab ${activeTab === "drafts" ? "active" : ""}`}
                >
                    <Layers size={20} />
                    <p> Drafts reports</p>
                </div>
                <div
                    onClick={() => setActiveTab("complaints")}
                    className={`tab ${activeTab === "complaints" ? "active" : ""}`}
                >
                    {" "}
                    <Frown size={20} /> <p>Complaints</p>
                </div>
                <div
                    onClick={() => setActiveTab("documents")}
                    className={`tab ${activeTab === "documents" ? "active" : ""}`}
                >
                    <File />
                    <p>Documents</p>
                </div>
            </div>

            {activeTab === "reports" && (
                <div className="tabs-content">
                    <h3>Your reports</h3>
                    <ProfileReports userId={userId} />
                </div>
            )}
            {activeTab === "drafts" && (
                <div className="tabs-content">
                    <h3>Your drafts</h3>
                    <DraftsTab />
                </div>
            )}
            {activeTab === "complaints" && (
                <div className="tabs-content">
                    <h3>Your complaints</h3>
                    <UserComplaints />
                </div>
            )}
            {activeTab === "documents" && (
                <div className="tabs-content">
                    <h3>Your documents</h3>
                    <ProfileDocuments />
                </div>
            )}
        </div>
    );
};

const BreadCrumbs = () => {
    return (
        <div className="breadcrumbs">
            <Link to={"/"}>Overview</Link> <ArrowRight01Icon />{" "}
            <Link className="current-page">Profile</Link>
        </div>
    );
};
const ProfilePage = () => {
    return (
        <DashBoardContainer
            content={<ProfilePageContent />}
            breadCrumbs={<BreadCrumbs />}
        />
    );
};