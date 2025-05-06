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
    const [departments, setDepartments] = useState(true);
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

    useEffect(() => {
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
    }, []);

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
                console.error(error);
            }
        };

        fetchReports();
    }, []);
    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/facilities/${facilityId}/complaints/`);
                if (response.status === 200) {
                    setComplaints(response.data.complaints);
                    setIsLoading(false);
                }
            } catch (error) {
                if (error.response) {
                    setErrorMessage(
                        error.response.data.message ||
                        error.response.data.error ||
                        "Error fetching complaints data"
                    );
                } else {
                    setErrorMessage("Unknown error fetching complaints data");
                }
                setIsLoading(false);
                console.error(error);
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

const FacilitiesStaff = ({ staff }) => {
    const navigate = useNavigate();

    const handleRowClick = (id) => {
        navigate(`/users/profile/${id}/`);
    };

    return (
        <div className="staff-list">
            <div className="content-card">
                <div className="card-header">
                    <h3>Staff</h3>
                </div>

                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Access</th>
                                <th>Departments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff &&
                                staff.map((staff, index) => (
                                    <tr onClick={() => handleRowClick(staff.id)} key={index}>
                                        <td>{index + 1}</td>
                                        <td>{staff.id}</td>
                                        <td>
                                            {staff.first_name} {staff.last_name}
                                        </td>
                                        <td>{staff.email}</td>
                                        <td>{staff.access}</td>
                                        <td>
                                            {staff.department?.slice(0, 2).map((dep, index) => (
                                                <span key={index}>{dep.name}, </span>
                                            ))}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const FacilityComplaints = ({ complaints }) => {
    const [showComplaintDetails, setShowComplaintDetailsWithComplaints] =
        useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState();
    const handleShowComplainDetails = (complaint) => {
        setSelectedComplaint(complaint);
        setShowComplaintDetailsWithComplaints(!showComplaintDetails);
    };
    return (
        <div className="complaints-lists">
            {showComplaintDetails && (
                <p>complaints</p>
            )}
            <div className="content-card">
                <div className="card-header">
                    <h3>Complaints</h3>
                </div>
            </div>

            <div className="table">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Claim ID</th>
                            <th>Patient name</th>
                            <th>MRN</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {complaints && complaints.length > 0
                            ? complaints.map((complaint, index) => (
                                <tr
                                    onClick={() => handleShowComplainDetails(complaint)}
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
                            ))
                            : "No complaints found"}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FacilitiesReports = ({ incidents }) => {
    console.log(incidents);
    return (
        <div className="reports-list">
            {
                <div className="reports-categories">
                    {incidents && incidents.length > 0 ? (
                        <ContentCard incident={incidents} title={"All incident reports"} />
                    ) : (
                        <NoteMessage
                            message={"No incident has been reported in this facility"}
                        />
                    )}
                </div>
            }
        </div>
    );
};

const ContentCard = ({ incident, title }) => {
    const [openFilters, setOpenFilters] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);

    const permissions = usePermission();
    const department = useDepartments();
    const navigate = useNavigate();
    const permission = usePermission();
    let apiLink;
    const [filters, setFilters] = useState({
        category: "",
        status: "",
        end_date: "",
        start_date: "",
    });

    const search = (string) => {
        setIsSearching(true);
        const results = incident.filter(
            (item) =>
                item.id &&
                item.id.toString().toLowerCase().includes(string.toLowerCase())
        );
        if (results.length < 0) {
            setIsSearchingTheDatabase(true);
            setTimeout(() => {
                setIsSearchingTheDatabase(false);
            }, 3000);
        }
        setSearchResults(results);
        console.log(results);
    };

    const toggleOpenFilters = () => {
        setOpenFilters(!openFilters);
    };
    function formatApiDateToInputFormat(apiDate) {
        const date = new Date(apiDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    const applyFilters = () => {
        setIsSearching(true);
        const newFilteredData = incident.filter((item) => {
            const incidentDate = new Date(item.created_at);
            const startDate = filters.start_date ? filters.start_date : null;
            const endDate = filters.end_date ? filters.end_date : null;

            const withinDateRange =
                (!startDate || formatApiDateToInputFormat(incidentDate) >= startDate) &&
                (!endDate || formatApiDateToInputFormat(incidentDate) <= endDate);

            return (
                withinDateRange &&
                (!filters.status?.toLowerCase() ||
                    item.status?.toLowerCase() === filters.status?.toLowerCase()) &&
                (!filters?.category.toLowerCase() ||
                    item?.category.toLowerCase() === filters?.category.toLowerCase())
            );
        });
        if (newFilteredData.length < 1) {
            setIsSearchingTheDatabase(true);
            setTimeout(() => {
                setIsSearchingTheDatabase(false);
            }, 3000);
        }
        setSearchResults(newFilteredData);
        toggleOpenFilters();
    };
    const clearFilters = () => {
        setFilters({
            category: "",
            status: "",
            end_date: "",
            start_date: "",
        });
        setIsSearching(false);
        toggleOpenFilters(); // Reset filtered data to all data
    };

    const handleRowClick = (incidentId, category) => {
        console.log(category);
        category === "General Patient Visitor"
            ? (apiLink = "incident/general")
            : category === "Staff Incident Report"
                ? (apiLink = "incident/employee_incident")
                : category === "Lost and Found"
                    ? (apiLink = "incident/lost_and_found")
                    : category === "Grievance"
                        ? (apiLink = "incident/grievance")
                        : category === "Medication Error"
                            ? (apiLink = "incident/medication_error")
                            : category === "Workplace Violence"
                                ? (apiLink = "incident/workplace_violence")
                                : category === "Adverse Drug Reaction"
                                    ? (apiLink = "incident/drug-reaction")
                                    : (apiLink = "incident/general");

        navigate(`/${apiLink}/${incidentId}`);
        localStorage.setItem("changeBreadCrumbs", true);
    };
    const navigateToModify = (incidentId, category) => {
        console.log(category);
        category === "General Patient Visitor"
            ? (apiLink = "incident/general")
            : category === "Staff Incident Report"
                ? (apiLink = "incident/employee_incident")
                : category === "Lost and Found"
                    ? (apiLink = "incident/lost_and_found")
                    : category === "Grievance"
                        ? (apiLink = "incident/grievance")
                        : category === "Medication Error"
                            ? (apiLink = "incident/medication_error")
                            : category === "Workplace Violence"
                                ? (apiLink = "incident/workplace_violence")
                                : category === "Adverse Drug Reaction"
                                    ? (apiLink = "incident/drug-reaction")
                                    : (apiLink = "incident/general");
        navigate(`/${apiLink}/${incidentId}/modify/`);
        localStorage.setItem("changeBreadCrumbs", true);
    };
    const handleNonClickableColumnClick = (event) => {
        event.stopPropagation();
        localStorage.setItem("changeBreadCrumbs", true);
    };
    return (
        <div className="reports-card">
            <div className="card-header">
                <h3>{title}</h3>
                <div className="system-search-container">
                    <Search className="search-icon" size={20} variant={"stroke"} />
                    <input
                        onChange={(e) => {
                            search(e.target.value);
                        }}
                        // value={searchString}
                        type="search"
                        name="systemSearch"
                        id="systemSearch"
                        placeholder="Search by Report ID"
                    />
                </div>

                <div className="filters">
                    {openFilters ? (
                        <div className="filters_popup">
                            <div onClick={toggleOpenFilters} className="close-icon">
                                <X size={24} variant={"stroke"} />
                            </div>

                            <h3>Filter incident data</h3>
                            <div className="filter-buttons">
                                <CustomSelectInput
                                    options={[
                                        "General Patient Visitor",
                                        "Adverse Drug Reaction",
                                        "Grievance",
                                        "Staff Incident Report",
                                        "Lost and Found",
                                        "Medication Error",
                                        "Workplace Violence",
                                    ]}
                                    placeholder={"Filter by category"}
                                    selected={filters.category}
                                    setSelected={(value) =>
                                        setFilters({
                                            ...filters,
                                            category: value,
                                        })
                                    }
                                    name="incidentType"
                                    id="incidentType"
                                />
                                <CustomSelectInput
                                    options={["Draft", "Open", "Closed"]}
                                    placeholder={"Filter by status"}
                                    selected={filters.status}
                                    setSelected={(value) =>
                                        setFilters({ ...filters, status: value })
                                    }
                                    name="status"
                                    id="status"
                                />

                                <div className="filter-range">
                                    <span>Select Filter by start date</span>
                                    <CustomDatePicker
                                        selectedDate={filters.start_date}
                                        setSelectedDate={(value) =>
                                            setFilters({ ...filters, start_date: value })
                                        }
                                        placeholderText="Select a start date"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>

                                <div className="filter-range">
                                    <span>Select Filter by end date</span>
                                    <CustomDatePicker
                                        selectedDate={filters.end_date}
                                        setSelectedDate={(value) =>
                                            setFilters({ ...filters, end_date: value })
                                        }
                                        placeholderText="Select an end date"
                                        dateFormat="yyyy-MM-dd"
                                    />
                                </div>

                                <div className="pop-up-buttons">
                                    <button onClick={clearFilters} className="outline-button">
                                        <X size={20} variant={"stroke"} />
                                        Clear
                                    </button>
                                    <button onClick={applyFilters} className="secondary-button">
                                        <div className="icon">
                                            <SlidersHorizontal size={20} variant={"stroke"} />
                                        </div>
                                        <span>Filter</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ""
                    )}

                    {/* {selectedItems.length > 0 ? (
            permissions.includes("Super User") ||
            permissions.includes("Admin") ||
            permissions.includes("Quality - Risk Manager") ||
            (permissions.includes("Manager") &&
              department &&
              department.includes("Pharmacy")) ||
            (permissions.includes("Director") &&
              department &&
              department.includes("Pharmacy")) ? (
              <button
                onClick={() => exportExcel(selectedItems, "ard_list")}
                className="secondary-button"
              >
                {" "}
                <FileExportIcon /> <span>Export</span>
              </button>
            ) : (
              ""
            )
          )  */}

                    <button onClick={toggleOpenFilters} className="date-filter-button">
                        <div className="icon">
                            <SlidersHorizontal variant={"stroke"} />
                        </div>
                        <span>Filter</span>
                    </button>
                </div>
            </div>
            {isSearching ? (
                <div className="search-results">
                    {isSearchingTheDatabase ? (
                        <div className="searching_database">
                            <p>Searching database</p>
                        </div>
                    ) : searchResults && searchResults.length > 0 ? (
                        <div className="results-table">
                            <div className="results-count">
                                <span className="count">{searchResults.length}</span>
                                result(s) found
                            </div>
                            <>
                                <div className="table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Report ID</th>
                                                <th>Category</th>
                                                <th>Status</th>
                                                <th>Date</th>
                                                <th>Current step</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {searchResults &&
                                                searchResults.map((report, index) => {
                                                    return permission.includes("Super User") ||
                                                        permission.includes("Admin") ||
                                                        permission.includes("Manager") ? (
                                                        <tr
                                                            key={index}
                                                            onDoubleClick={() => {
                                                                navigateToModify(
                                                                    report.original_report
                                                                        ? report.original_report
                                                                        : report.id,
                                                                    report.category
                                                                );
                                                            }}
                                                        >
                                                            <td>{index + 1}</td>
                                                            <td>{report.id}</td>
                                                            <td>{report.category}</td>
                                                            <td className="status">
                                                                <span
                                                                    className={`follow-up update-follow-up ${report.status === "Draft"
                                                                        ? "in-progress"
                                                                        : report.status === "Closed"
                                                                            ? "closed"
                                                                            : "Open"
                                                                        }`}
                                                                >
                                                                    {report.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {
                                                                    <DateFormatter
                                                                        dateString={report.created_at}
                                                                    />
                                                                }
                                                            </td>
                                                            <td>{report.current_step}</td>
                                                            <td
                                                                onClick={(event) =>
                                                                    handleNonClickableColumnClick(event)
                                                                }
                                                                className="action-col"
                                                            >
                                                                <div className="table-actions">
                                                                    {(permission.includes("Super User") ||
                                                                        permission.includes("Admin") ||
                                                                        permission.includes("Manager")) &&
                                                                        !incident.is_resolved && (
                                                                            <SquarePen
                                                                                size={20}
                                                                                onClick={() =>
                                                                                    navigateToModify(
                                                                                        report.original_report
                                                                                            ? report.original_report
                                                                                            : report.id,
                                                                                        report.category
                                                                                    )
                                                                                }
                                                                            />
                                                                        )}

                                                                    {(permission.includes("Super User") ||
                                                                        permission.includes("Admin") ||
                                                                        permission.includes("Manager") ||
                                                                        permission.includes("Director")) && (
                                                                            <Eye
                                                                                size={20}
                                                                                onClick={() =>
                                                                                    handleRowClick(
                                                                                        report.original_report
                                                                                            ? report.original_report
                                                                                            : report.id,
                                                                                        report.category
                                                                                    )
                                                                                }
                                                                            />
                                                                        )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ) : (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>{report.id}</td>
                                                            <td>{report.category}</td>
                                                            <td className="status">
                                                                <span
                                                                    className={`follow-up update-follow-up ${report.status === "Draft"
                                                                        ? "in-progress"
                                                                        : report.status === "Closed"
                                                                            ? "closed"
                                                                            : "Open"
                                                                        }`}
                                                                >
                                                                    {report.status}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {
                                                                    <DateFormatter
                                                                        dateString={report.created_at}
                                                                    />
                                                                }
                                                            </td>
                                                            <td>{report.current_step}</td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        </div>
                    ) : (
                        <div className="no-data-found">
                            <p>No data found with your search found</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Report ID</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Current step</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {incident &&
                                incident.map((report, index) =>
                                    permission.includes("Super User") ||
                                        permission.includes("Admin") ||
                                        permission.includes("Manager") ? (
                                        <tr
                                            key={index}
                                            onDoubleClick={() => {
                                                navigateToModify(
                                                    report.original_report
                                                        ? report.original_report
                                                        : report.id,
                                                    report.category
                                                );
                                            }}
                                        >
                                            <td>{index + 1}</td>
                                            <td>{report.id}</td>
                                            <td>{report.category}</td>
                                            <td className="status">
                                                <span
                                                    className={`follow-up update-follow-up ${report.status === "Draft"
                                                        ? "in-progress"
                                                        : report.status === "Closed"
                                                            ? "closed"
                                                            : "Open"
                                                        }`}
                                                >
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td>
                                                {<DateFormatter dateString={report.created_at} />}
                                            </td>
                                            <td>{report.current_step}</td>
                                            <td
                                                onClick={(event) =>
                                                    handleNonClickableColumnClick(event)
                                                }
                                                className="action-col"
                                            >
                                                <div className="table-actions">
                                                    {(permission.includes("Super User") ||
                                                        permission.includes("Admin") ||
                                                        permission.includes("Manager")) &&
                                                        !incident.is_resolved && (
                                                            <SquarePen
                                                                size={20}
                                                                onClick={() =>
                                                                    navigateToModify(
                                                                        report.original_report
                                                                            ? report.original_report
                                                                            : report.id,
                                                                        report.category
                                                                    )
                                                                }
                                                            />
                                                        )}

                                                    {(permission.includes("Super User") ||
                                                        permission.includes("Admin") ||
                                                        permission.includes("Manager") ||
                                                        permission.includes("Director")) && (
                                                            <Eye
                                                                size={20}
                                                                onClick={() =>
                                                                    handleRowClick(
                                                                        report.original_report
                                                                            ? report.original_report
                                                                            : report.id,
                                                                        report.category
                                                                    )
                                                                }
                                                            />
                                                        )}
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{report.id}</td>
                                            <td>{report.category}</td>
                                            <td className="status">
                                                <span
                                                    className={`follow-up update-follow-up ${report.status === "Draft"
                                                        ? "in-progress"
                                                        : report.status === "Closed"
                                                            ? "closed"
                                                            : "Open"
                                                        }`}
                                                >
                                                    {report.status}
                                                </span>
                                            </td>
                                            <td>
                                                {<DateFormatter dateString={report.created_at} />}
                                            </td>
                                            <td>{report.current_step}</td>
                                        </tr>
                                    )
                                )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
export const BreadCrumbs = () => {
    const [facilityName, setFacilityName] = useState(
        localStorage.getItem("facilityName")
    );
    console.log(facilityName);
    const [facilityId, setFacilityId] = useState(null);
    useEffect(() => {
        setFacilityId(localStorage.getItem("facilityId"));
    }, []);
    return (
        <div className="breadcrumbs">
            <Link href={"/"}>Overview</Link>
            <MoveRight />
            <Link href={"/facilities/"}>Facilities</Link>
            <MoveRight />
            <Link href='/accounts' className="current-page">{facilityName}</Link>
        </div>
    );
};
const FacilityDetailsPage = () => {
    return (
        <>
            <BreadCrumbs />
            <FacilityDetailsPageContent />
        </>
    );
};

export const FacilityDepartments = ({
    departments,
    facilityId,
    staff,
    facility,
}) => {
    const [shownNewDepartmentForm, setShowNewDepartmentForm] = useState(false);
    const permissions = usePermission();
    const canAddDepartment =
        permissions.includes("Admin") ||
        permissions.includes("Quality - Risk Manager") ||
        permissions.includes("Facility Admin");
    return (
        <div className="department-lists-container">
            <h3>Departments</h3>
            {canAddDepartment && (
                <>
                    <NoteMessage
                        message={`Admins and Super Users can add a department`}
                    />
                    <button
                        onClick={() => setShowNewDepartmentForm(true)}
                        className="tertiary-button"
                    >
                        Add a department
                    </button>
                </>
            )}
            {shownNewDepartmentForm && (
                <div className="pop-up">
                    <div className="popup-content">
                        <NewDepartmentForm
                            setShowNewDepartmentForm={setShowNewDepartmentForm}
                            staff={staff}
                            facility={facility}
                        />
                    </div>
                </div>
            )}
            <div className="departments-list">
                {departments && departments.length > 0 ? (
                    departments.map((department, index) => (
                        <Link
                            to={`/facilities/${facilityId}/departments/${department.id}/`}
                            key={index}
                        >
                            <div className="department-item">
                                <div className="icon">
                                    <NotebookPen />
                                </div>
                                <div className="title-content">
                                    <h3>{department.name}</h3>
                                    <small>Members: {department.members}</small>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="no-content-found">
                        <p>No department</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default FacilityDetailsPage;
