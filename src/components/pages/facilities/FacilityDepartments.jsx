'use client'
import React, { useEffect, useState } from "react";
import DashboardLayout from "@/app/dashboard/layout";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    MoveRight,
    X,
    Eye,
    SlidersHorizontal,
    Layers,
    AlignJustify,
    NotebookPen,
    SquarePen,
    Frown,
    Search,
    Users
} from 'lucide-react';
import api from "@/utils/api";
import { useNavigate } from "react-router-dom";
import DateFormatter from "@/components/DateFormatter";
// import { ComplainDetails } from "../../../components/profile/profileComplaints";
import NoteMessage from "@/components/NoteMessage";
import NewDepartmentForm from "@/components/forms/NewDepartmentForm";
import { usePermission, useDepartments } from "@/context/PermissionsContext";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import '../../../styles/facilities/_facilities.scss'

const FacilityDetailsPageContent = () => {
    const { facilityId } = useParams();
    const [facility, setFacility] = useState({});
    const [departments, setDepartments] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [staff, setStaff] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const [activeTab, setActiveTab] = useState("reports");

    const [generalIncidents, setGeneralIncidents] = useState([]);
    const [grievances, setGrievances] = useState([]);
    const [incidentList, setIncidentList] = useState([]);
    const [lostAndFoundIncidents, setLostAndFoundIncidents] = useState([]);
    const [employeeIncidents, setEmployeeIncidents] = useState([]);
    const [employeeHealthInvestigations, setEmployeeHealthInvestigations] =
        useState([]);
    const [workplaceViolenceIncidents, setWorkplaceViolenceIncidents] = useState(
        []
    );
    const [adverseDrugReaction, setAdverseDrugReaction] = useState([]);
    const [medicationError, setMedicationError] = useState([]);

    // fetching facility
    useEffect(() => {
        if (facilityId) return;
        const fetchFacility = async () => {
            try {
                const response = await api.get(`/facilities/${facilityId}/`);
                if (response.status === 200) {
                    setFacility(response.data);
                    console.log(response.data);
                    localStorage.setItem("facilityName", response.data.name);
                    localStorage.setItem("facilityId", response.data.id);
                    setIsLoading(false);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(
                        error.response.data.message ||
                        error.response.data.error ||
                        "Error fetching facility"
                    );
                } else {
                    setErrorMessage("Unknown error fetching facility");
                }
            }
        };
        fetchFacility();
    }, [facilityId]);

    // fetching facility departments
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(
                    `/facilities/${facilityId}/departments/`
                );
                if (response.status === 200) {
                    setDepartments(response.data.departments);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(
                        error.response.data.message ||
                        error.response.data.error ||
                        "Error fetching departments"
                    );
                } else {
                    setErrorMessage("Unknown error fetching departments");
                }
                setIsLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    useEffect(() => {
        // Fetch drafts data
        const fetchReports = async () => {
            // API call to fetch drafts data
            try {
                const response = await api.get(
                    `facilities/${facilityId}/incidents/overview/`,
                    {
                        params: {
                            department_id: activeTab,
                        },
                    }
                );
                if (response.status === 200) {
                    // se(response.data)
                    setIncidentList(response.data);
                    console.log('incidents', response.data)
                    setIsLoading(false);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(
                        error.response.data.message ||
                        error.response.error ||
                        "Error fetching drafts data, try again later"
                    );
                } else {
                    setErrorMessage("Unknown fetching incidents, try again later");
                }
                setIsLoading(false);
                console.log()
            }
        };

        fetchReports();
    }, []);

    // fetching complaints
    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/facilities/${facilityId}/complaints/`);
                if (response.status === 200) {
                    setComplaints(response.data.complaints || []); // Ensure we always have an array
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message ||
                    error.response?.data?.error ||
                    "Error fetching complaints data";
                setErrorMessage(errorMsg);
                setComplaints([]); // Reset complaints to empty array
                console.error("Complaints fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchComplaint();
    }, []);

    useEffect(() => {
        const fetchStaffs = async () => {
            try {
                const response = await api.get(`/facilities/${facilityId}/staff`);
                if (response.status === 200) {
                    setStaff(response.data.staff);
                    console.log(response.data.staff);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(
                        error.response.data.message ||
                        error.response.data.error ||
                        "Error fetching staff data"
                    );
                } else {
                    setErrorMessage("Unknown error fetching staff data");
                }
            }
        };
        fetchStaffs();
    }, []);

    return isLoading ? (
        <div className="dashboard-page-content">
            <p>Loading...</p>
        </div>
    ) : (
        <div className="dashboard-page-content">
            <h2>{facility.name}</h2>
            <div className="tabs-list">
                <div
                    onClick={() => setActiveTab("reports")}
                    className={`tab ${activeTab === "reports" ? "active" : ""}`}
                >
                    <AlignJustify size={20} />
                    Incidents reports
                </div>
                <div
                    onClick={() => setActiveTab("departments")}
                    className={`tab ${activeTab === "departments" ? "active" : ""}`}
                >
                    {" "}
                    <Layers size={20} /> Departments
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
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            {activeTab === "departments" && (
                <div className="departments-list-container">
                    <FacilityDepartments
                        departments={departments}
                        facilityId={facilityId}
                        staff={staff}
                        facility={facility}
                    />
                </div>
            )}
            {activeTab === "reports" && (
                <div className="report-list-with-notes">
                    <FacilitiesReports incidents={incidentList} />
                </div>
            )}
            {activeTab === "complaints" && (
                <div>
                    <FacilityComplaints complaints={complaints} />
                </div>
            )}
            {activeTab === "documents" && (
                <div>
                    <h3>Documents</h3>
                </div>
            )}
            {activeTab === "staff" && (
                <div>
                    <FacilitiesStaff staff={staff} />
                </div>
            )}
        </div>
    );
};


