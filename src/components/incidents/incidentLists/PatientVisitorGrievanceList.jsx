import React, { useEffect, useState } from "react";
import api, { API_URL, exportExcel } from "@/utils/api";
import {
  Eye,
  File,
  FileEdit,
  Pencil,
  SlidersHorizontal,
  Square,
  SquareCheck,
  ViewIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import DateFormatter from "@/components/DateFormatter";
import ModifyPageLoader from "@/components/loader";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import {
  SortByNumberIcon,
  SortDateIcon,
  SortNameIcon,
} from "./StaffIncidentList";

function formatDate(dateString) {
  if (!dateString || isNaN(new Date(dateString).getTime())) {
    return "Invalid Date";
  }
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${year}-${month}-${day}`;
}

const PatientVisitorGrievanceList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [grievanceData, setGrievanceData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const router = useRouter();

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGrievanceData = grievanceData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentSearchResults = searchResults.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (isSearching ? searchResults.length : grievanceData.length) / itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const fetchFilteredData = async (appliedFilters) => {
    try {
      setIsFetching(true);
      const queryParams = new URLSearchParams();
      if (appliedFilters.start_date)
        queryParams.append("start_date", appliedFilters.start_date);
      if (appliedFilters.end_date)
        queryParams.append("end_date", appliedFilters.end_date);
      if (appliedFilters.status)
        queryParams.append("status", appliedFilters.status);

      const response = await api.get(
        `${API_URL}/incidents/grievance/?${queryParams.toString()}`
      );

      if (response && response.status === 200 && response.data) {
        const formattedData = response.data.map((item) => ({
          ...item,
          date: formatDate(item.date),
        }));
        setGrievanceData(formattedData);
        setSearchResults([]);
        setIsSearching(false);
        setIsSearchingTheDatabase(false);
        setCurrentPage(1);
        setIsFetching(false);
      } else {
        setErrorFetching("Unexpected response format.");
        setIsFetching(false);
      }
    } catch (error) {
      console.error("Grievance API error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorFetching(error.response.data.error);
      } else {
        setErrorFetching("An error occurred while fetching incident data.");
      }
      setIsFetching(false);
    }
  };

  const applyFilters = () => {
    fetchFilteredData(filters);
    toggleOpenFilters();
  };

  const clearFilters = () => {
    const clearedFilters = {
      start_date: "",
      end_date: "",
      status: "",
    };
    setFilters(clearedFilters);
    setSearchResults([]);
    setIsSearching(false);
    setIsSearchingTheDatabase(false);
    setCurrentPage(1);
    setOpenFilters(false);
    fetchFilteredData(clearedFilters);
  };

  const handleRowClick = (incidentId) => {
    router.push(`/incidents/grievance/${incidentId}`);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incidents/grievance/${incidentId}/update/`);
    localStorage.setItem("grievanceId", incidentId);
  };

  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
  };

  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  const search = (string) => {
    setIsSearching(true);
    if (string.length < 2) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    const results = grievanceData.filter(
      (item) =>
        (item.patient_name?.first_name &&
          item.patient_name?.first_name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.report_facility?.name &&
          item.report_facility.name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.id &&
          item.id.toString().toLowerCase().includes(string.toLowerCase()))
    );

    if (results.length < 1) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSelectedItems = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    }
  };

  const handleSelectAll = (items) => {
    const allSelected = items.every((item) =>
      selectedItems.some((selected) => selected.id === item.id)
    );
    if (!allSelected) {
      setSelectedItems([...new Set([...selectedItems, ...items])]);
    } else {
      setSelectedItems(
        selectedItems.filter(
          (selected) => !items.some((item) => item.id === selected.id)
        )
      );
    }
  };

  useEffect(() => {
    fetchFilteredData(filters);
  }, []);

  return isFetching ? (
    <ModifyPageLoader />
  ) : (
    <div>
      {errorFetching ? (
        <div className="error-message">
          <p>{errorFetching}</p>
        </div>
      ) : (
        <div className="tab-container incidents-tab tracking-headers grievance-tracking-headers">
          <div className="grievance-tab-headers">
            <div className="tab-header">
              <div className="title-container-action">
                <div className="title-container">
                  <h2 className="title">Grievance Tracking List</h2>
                  <p>{grievanceData.length} incident(s) available</p>
                </div>
              </div>
            </div>
            <div className="tabs">
              <div
                onClick={() => setActiveTab("all")}
                className={`reports-tab tracking-tab ${activeTab === "all" ? "active" : ""
                  }`}
              >
                <File />
                <span>Grievance reports</span>
              </div>
              <div
                onClick={() => setActiveTab("drafts")}
                className={`drafts tracking-tab ${activeTab === "drafts" ? "active" : ""
                  }`}
              >
                <FileEdit />
                <span>Complaints</span>
              </div>
            </div>
          </div>

          <div className="incident-content">
            {activeTab === "all" && (
              <div className="incident-list">
                <div className="filters">
                  {openFilters ? (
                    <div className="filters_popup">
                      <div onClick={toggleOpenFilters} className="close-icon">
                        <X size={24} variant="stroke" />
                      </div>
                      <h3>Filter incident data</h3>
                      <div className="filter-buttons">
                        <CustomSelectInput
                          options={["Draft", "Open", "Closed"]}
                          placeholder="Filter by status"
                          selected={filters.status}
                          setSelected={(value) =>
                            setFilters({ ...filters, status: value })
                          }
                          name="status"
                          id="status"
                        />
                        <div className="filter-range">
                          <span>Start date</span>
                          <CustomDatePicker
                            selectedDate={filters.start_date}
                            setSelectedDate={(value) =>
                              setFilters({ ...filters, start_date: value })
                            }
                            placeholderText="Select a date"
                            dateFormat="yyyy-MM-dd"
                          />
                        </div>
                        <div className="filter-range">
                          <span>End date</span>
                          <CustomDatePicker
                            selectedDate={filters.end_date}
                            setSelectedDate={(value) =>
                              setFilters({ ...filters, end_date: value })
                            }
                            placeholderText="Select a date"
                            dateFormat="yyyy-MM-dd"
                          />
                        </div>
                        <div className="popup-buttons">
                          <button
                            onClick={clearFilters}
                            className="outline-button"
                          >
                            <X size={20} variant="stroke" />
                            Clear
                          </button>
                          <button
                            onClick={applyFilters}
                            className="secondary-button"
                          >
                            <div className="icon">
                              <SlidersHorizontal size={20} variant="stroke" />
                            </div>
                            <span>Filter</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  <input
                    onChange={(e) => search(e.target.value)}
                    type="search"
                    name="systemSearch"
                    id="systemSearch"
                    placeholder="Search by ID, Name and facility"
                  />
                  {selectedItems.length > 0 ? (
                    <button
                      onClick={() =>
                        exportExcel(selectedItems, "general_incident_list")
                      }
                      className="secondary-button"
                    >
                      <File />
                      <span>Export</span>
                    </button>
                  ) : (
                    <button
                      onClick={toggleOpenFilters}
                      className="date-filter-button"
                    >
                      <div className="icon">
                        <SlidersHorizontal variant="stroke" />
                      </div>
                      <span>Filter</span>
                    </button>
                  )}
                </div>
                {isSearching ? (
                  <div className="search-results">
                    {isSearchingTheDatabase ? (
                      <div className="searching_database">
                        <p>Searching database</p>
                      </div>
                    ) : currentSearchResults.length > 0 ? (
                      <div className="results-table">
                        <div className="results-count">
                          <span className="count">{searchResults.length}</span>{" "}
                          result(s) found
                        </div>
                        <GrievanceTable
                          incidentData={currentSearchResults}
                          handleNonClickableColumnClick={
                            handleNonClickableColumnClick
                          }
                          setIncidentData={setSearchResults}
                          navigateToModify={navigateToModify}
                          handleRowClick={handleRowClick}
                          selectedItems={selectedItems}
                          handleSelectAll={handleSelectAll}
                          handleSelectedItems={handleSelectedItems}
                        />

                        <div className="pagination-controls">
                          <button
                            className="pagination-button"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                          >
                            Prev
                          </button>
                          {pageNumbers.map((number) => (
                            <button
                              key={number}
                              className={`pagination-button ${currentPage === number ? "active" : ""
                                }`}
                              onClick={() => handlePageChange(number)}
                            >
                              {number}
                            </button>
                          ))}
                          <button
                            className="pagination-button"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="no-data-found">
                        <p>No data found</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <GrievanceTable
                      incidentData={currentGrievanceData}
                      handleNonClickableColumnClick={
                        handleNonClickableColumnClick
                      }
                      setIncidentData={setGrievanceData}
                      navigateToModify={navigateToModify}
                      handleRowClick={handleRowClick}
                      selectedItems={selectedItems}
                      handleSelectAll={handleSelectAll}
                      handleSelectedItems={handleSelectedItems}
                    />

                    <div className="pagination-controls">
                      <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        Prev
                      </button>
                      {pageNumbers.map((number) => (
                        <button
                          key={number}
                          className={`pagination-button ${currentPage === number ? "active" : ""
                            }`}
                          onClick={() => handlePageChange(number)}
                        >
                          {number}
                        </button>
                      ))}
                      <button
                        className="pagination-button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
            {activeTab === "drafts" && <ComplaintsTab />}
          </div>
        </div>
      )}
    </div>
  );
};

const GrievanceTable = ({
  incidentData,
  handleNonClickableColumnClick,
  navigateToModify,
  handleRowClick,
  handleSelectAll,
  selectedItems,
  handleSelectedItems,
  setIncidentData,
}) => {
  const [sortDesc, setSortDesc] = useState(false);
  const [nameAZ, setNameAZ] = useState(false);
  const [dateRecent, setDateRecent] = useState(false);

  const handleSortById = () => {
    const results = handleSorting(
      incidentData,
      "number",
      sortDesc ? "desc" : "asc",
      "id"
    );
    setIncidentData(results);
    setSortDesc(!sortDesc);
  };

  const handleSortByName = () => {
    const results = handleSorting(
      incidentData,
      "name",
      nameAZ ? "desc" : "asc",
      "name"
    );
    setIncidentData(results);
    setNameAZ(!nameAZ);
  };

  const handleFilterByDate = () => {
    const results = handleSorting(
      incidentData,
      "datetime",
      dateRecent ? "desc" : "asc",
      "date"
    );
    setIncidentData(results);
    setDateRecent(!dateRecent);
  };

  const handleSorting = (items, sortBy, direction = "asc", field) => {

    const sortByNumber = (field) => {
      return [...items].sort((a, b) => {
        const result = a.id - b.id;
        return direction === "asc" ? result : -result;
      });
    };

    const sortByFacilityName = (field) => {
      return [...items].sort((a, b) => {
        const nameA = a.patient_name?.first_name || "";
        const nameB = b.patient_name?.first_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByDateTime = (field) => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const result = dateA - dateB;
        return direction === "asc" ? result : -result;
      });
    };

    switch (sortBy) {
      case "number":
        return sortByNumber(field);
      case "name":
        return sortByFacilityName(field);
      case "datetime":
        return sortByDateTime(field);
      default:
        return items;
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>
            <div onClick={() => handleSelectAll(incidentData)}>
              {incidentData.every((item) =>
                selectedItems.some((selected) => selected.id === item.id)
              ) ? (
                <SquareCheck />
              ) : (
                <Square />
              )}
            </div>
          </th>
          <th>No</th>
          <th>
            <div className="sort-cell">
              ID
              <SortByNumberIcon
                setSortDesc={setSortDesc}
                handleSortById={handleSortById}
                sortDesc={sortDesc}
              />
            </div>
          </th>
          <th>Facility</th>
          <th>
            <div className="sort-cell">
              Name
              <SortNameIcon
                handleSortById={handleSortByName}
                sortDesc={nameAZ}
                setSortDesc={setNameAZ}
              />
            </div>
          </th>
          <th>MRN</th>
          <th>
            <sort className="sort-cell">
              Date
              <SortDateIcon
                setSortDesc={setDateRecent}
                handleSortById={handleFilterByDate}
                sortDesc={dateRecent}
              />
            </sort>
          </th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {incidentData.length > 0 ? (
          incidentData.map((grievance, index) => (
            <tr
              onDoubleClick={() =>
                handleRowClick(
                  grievance.original_report
                    ? grievance.original_report
                    : grievance.id
                )
              }
              key={index}
              className={`table-card ${selectedItems.includes(grievance) ? "selected" : ""
                }`}
            >
              <td data-label="Select">
                <div
                  onClick={() => handleSelectedItems(grievance)}
                  className="icon"
                >
                  {selectedItems.includes(grievance) ? (
                    <SquareCheck color="orange" />
                  ) : (
                    <Square />
                  )}
                </div>
              </td>
              <td data-label="No">{index + 1}</td>
              <td data-label="ID">{grievance.original_report || grievance.id}</td>
              <td data-label="Facility">{grievance.report_facility?.name || "Not provided"}</td>
              <td data-label="Name">
                {grievance.patient_name?.last_name &&
                  grievance.patient_name?.first_name
                  ? `${grievance.patient_name?.last_name} ${grievance.patient_name?.first_name}`
                  : "Not provided"}
              </td>
              <td data-label="MRN">
                {grievance.patient_name?.medical_record_number ||
                  "Not specified"}
              </td>
              <td data-label="Date">
                <DateFormatter dateString={grievance.date} />
              </td>
              <td data-label="Status">
                <p
                  className={`follow-up ${grievance.status === "Draft"
                    ? "in-progress"
                    : grievance.status === "Closed"
                      ? "closed"
                      : "Open"
                    }`}
                >
                  {grievance.status || "Not specified"}
                </p>
              </td>
              <td
                data-label="Action"
                onClick={(event) => handleNonClickableColumnClick(event)}
                className="action-col"
              >
                <div className="table-actions">
                  {!grievance.is_resolved && (
                    <Pencil
                      size={20}
                      onClick={() =>
                        navigateToModify(
                          grievance.original_report
                            ? grievance.original_report
                            : grievance.id
                        )
                      }
                    />
                  )}
                  <Eye
                    size={20}
                    onClick={() =>
                      handleRowClick(
                        grievance.original_report
                          ? grievance.original_report
                          : grievance.id
                      )
                    }
                  />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="9">No data found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};


const ComplaintsTab = () => {
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [errorFetchingComplaints, setErrorFetchingComplaints] = useState("");
  const [grievanceComplaints, setGrievanceComplaints] = useState([]);
  const [sortDesc, setSortDesc] = useState(false);
  const [nameAZ, setNameAZ] = useState(false);
  const [dateRecent, setDateRecent] = useState(false);
  const [showComplaintDetails, setShowComplaintDetails] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    resolved_by_staff: null,
  });
  const [openFilters, setOpenFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGrievanceComplaints = isSearching
    ? searchResults.slice(indexOfFirstItem, indexOfLastItem)
    : grievanceComplaints.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(
    (isSearching ? searchResults.length : grievanceComplaints.length) /
    itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const fetchFilteredComplaints = async (appliedFilters) => {
    try {
      setLoadingComplaints(true);
      setErrorFetchingComplaints("");
      const queryParams = new URLSearchParams();
      if (appliedFilters.start_date)
        queryParams.append("start_date", appliedFilters.start_date);
      if (appliedFilters.end_date)
        queryParams.append("end_date", appliedFilters.end_date);
      if (appliedFilters.resolved_by_staff !== null)
        queryParams.append(
          "resolved_by_staff",
          appliedFilters.resolved_by_staff ? "True" : "False"
        );

      const response = await api.get(
        `${API_URL}/complaints/?${queryParams.toString()}`
      );

      if (response && response.status === 200 && response.data) {
        const data = Array.isArray(response.data.results)
          ? response.data.results
          : Array.isArray(response.data)
            ? response.data
            : [];
        const formattedData = data.map((item) => ({
          ...item,
          date_of_complaint: formatDate(item.date_of_complaint),
        }));
        setGrievanceComplaints(formattedData);
        setSearchResults([]);
        setIsSearching(false);
        setCurrentPage(1);
        setLoadingComplaints(false);
      } else {
        setErrorFetchingComplaints("Unexpected response format.");
        setLoadingComplaints(false);
      }
    } catch (error) {
      console.error("Complaints API error:", error);
      setErrorFetchingComplaints(
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "An error occurred while fetching complaints."
      );
      setLoadingComplaints(false);
    }
  };

  const applyFilters = () => {
    fetchFilteredComplaints(filters);
    toggleOpenFilters();
  };

  const clearFilters = () => {
    const clearedFilters = {
      start_date: "",
      end_date: "",
      resolved_by_staff: null,
    };
    setFilters(clearedFilters);
    setSearchResults([]);
    setIsSearching(false);
    setCurrentPage(1);
    setOpenFilters(false);
    fetchFilteredComplaints(clearedFilters);
  };

  const handleSortById = () => {
    const results = handleSorting(
      grievanceComplaints,
      "number",
      sortDesc ? "desc" : "asc",
      "id"
    );
    setGrievanceComplaints(results);
    setSortDesc(!sortDesc);
  };

  const handleSortByName = () => {
    const results = handleSorting(
      grievanceComplaints,
      "name",
      nameAZ ? "desc" : "asc",
      "name"
    );
    setGrievanceComplaints(results);
    setNameAZ(!nameAZ);
  };

  const handleFilterByDate = () => {
    const results = handleSorting(
      grievanceComplaints,
      "datetime",
      dateRecent ? "desc" : "asc",
      "date"
    );
    setGrievanceComplaints(results);
    setDateRecent(!dateRecent);
  };

  const handleSorting = (items, sortBy, direction = "asc", field) => {

    const sortByNumber = (field) => {
      return [...items].sort((a, b) => {
        const result = a.id - b.id;
        return direction === "asc" ? result : -result;
      });
    };

    const sortByFacilityName = (field) => {
      return [...items].sort((a, b) => {
        const nameA = a.patient_name || "";
        const nameB = b.patient_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByDateTime = (field) => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.date_of_complaint);
        const dateB = new Date(b.date_of_complaint);
        const result = dateA - dateB;
        return direction === "asc" ? result : -result;
      });
    };

    switch (sortBy) {
      case "number":
        return sortByNumber(field);
      case "name":
        return sortByFacilityName(field);
      case "datetime":
        return sortByDateTime(field);
      default:
        return items;
    }
  };

  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  function formatDate(dateString) {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "Invalid Date";
    }
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear());
    return `${year}-${month}-${day}`;
  }

  const search = (string) => {
    setIsSearching(true);
    if (string.length < 2) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    const results = grievanceComplaints.filter(
      (item) =>
        (item.patient_name &&
          item.patient_name.toLowerCase().includes(string.toLowerCase())) ||
        (item.id &&
          item.id.toString().toLowerCase().includes(string.toLowerCase())) ||
        (item.medical_record_number &&
          item.medical_record_number
            .toLowerCase()
            .includes(string.toLowerCase()))
    );
    setSearchResults(results);
    setCurrentPage(1);
  };

  const handleShowComplaintDetails = () => {
    setShowComplaintDetails(!showComplaintDetails);
  };

  const handleSelectedComplaint = (complaint) => {
    setSelectedComplaint(complaint);
    handleShowComplaintDetails();
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    fetchFilteredComplaints(filters);
  }, []);

  return (
    <div className="incident-list">
      {errorFetchingComplaints ? (
        <div className="error-message">
          <p>{errorFetchingComplaints}</p>
        </div>
      ) : (
        <>
          <div className="filters">
            {openFilters ? (
              <div className="filters_popup">
                <div onClick={toggleOpenFilters} className="close-icon">
                  <X size={24} variant="stroke" />
                </div>
                <h3>Filter complaint data</h3>
                <div className="filter-buttons">
                  <CustomSelectInput
                    options={["Any", "Yes", "No"]}
                    placeholder="Filter by resolved by staff"
                    selected={
                      filters.resolved_by_staff === null
                        ? "Any"
                        : filters.resolved_by_staff
                          ? "Yes"
                          : "No"
                    }
                    setSelected={(value) => {
                      const resolvedByStaff =
                        value === "Yes" ? true : value === "No" ? false : null;
                      setFilters({
                        ...filters,
                        resolved_by_staff: resolvedByStaff,
                      });
                    }}
                    name="resolved_by_staff"
                    id="resolved_by_staff"
                  />
                  <div className="filter-range">
                    <span>Start date</span>
                    <CustomDatePicker
                      selectedDate={filters.start_date}
                      setSelectedDate={(value) =>
                        setFilters({ ...filters, start_date: value })
                      }
                      placeholderText="Select a date"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div className="filter-range">
                    <span>End date</span>
                    <CustomDatePicker
                      selectedDate={filters.end_date}
                      setSelectedDate={(value) =>
                        setFilters({ ...filters, end_date: value })
                      }
                      placeholderText="Select a date"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>
                  <div className="popup-buttons">
                    <button onClick={clearFilters} className="outline-button">
                      <X size={20} variant="stroke" />
                      Clear
                    </button>
                    <button onClick={applyFilters} className="secondary-button">
                      <div className="icon">
                        <SlidersHorizontal size={20} variant="stroke" />
                      </div>
                      <span>Filter</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
            <div className="search-input incident-search">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                onChange={(e) => search(e.target.value)}
                type="search"
                name="systemSearch"
                id="systemSearch"
                placeholder="Search by ID, Name, or MRN"
              />
            </div>
            <button onClick={toggleOpenFilters} className="date-filter-button">
              <div className="icon">
                <SlidersHorizontal size={24} variant="stroke" />
              </div>
              <span>Filter</span>
            </button>
          </div>
          <br />
          {loadingComplaints ? (
            <ModifyPageLoader />
          ) : (
            <>
              {isSearching ? (
                <div className="search-results">
                  {searchResults.length > 0 ? (
                    <>
                      <table>
                        <thead>
                          <tr>
                            <th>No</th>
                            <th>
                              <div className="sort-cell">
                                ID
                                <SortByNumberIcon
                                  setSortDesc={setSortDesc}
                                  handleSortById={handleSortById}
                                  sortDesc={sortDesc}
                                />
                              </div>
                            </th>
                            <th>
                              <div className="sort-cell">
                                Patient Name
                                <SortNameIcon
                                  handleSortById={handleSortByName}
                                  sortDesc={nameAZ}
                                  setSortDesc={setNameAZ}
                                />
                              </div>
                            </th>
                            <th>MRN</th>
                            <th>
                              <div className="sort-cell">
                                Date of Complaint
                                <SortDateIcon
                                  setSortDesc={setDateRecent}
                                  handleSortById={handleFilterByDate}
                                  sortDesc={dateRecent}
                                />
                              </div>
                            </th>
                            <th>Resolved by staff</th>
                            <th>How complaint was taken</th>
                          </tr>
                        </thead>
                        <tbody>
                          {showComplaintDetails && (
                            <ComplaintDetails
                              handleShowComplainDetails={
                                handleShowComplaintDetails
                              }
                              complaint={selectedComplaint}
                            />
                          )}
                          {currentGrievanceComplaints.map(
                            (complaint, index) => (
                              <tr
                                key={index}
                                onClick={() =>
                                  handleSelectedComplaint(complaint)
                                }
                              >
                                <td data-label="No"> {index + 1}</td>
                                <td data-label="ID">{complaint.id}</td>
                                <td data-label="Patient Name">
                                  {complaint.patient_name || "Not provided"}
                                </td>
                                <td data-label="MRN">
                                  {complaint.medical_record_number || "-"}
                                </td>
                                <td data-label="Date of Complaint">
                                  <DateFormatter
                                    dateString={complaint.date_of_complaint}
                                  />
                                </td>
                                <td data-label="Resolved by staff">
                                  <p
                                    className={`follow-up ${complaint.resolved_by_staff === false
                                      ? "in-progress"
                                      : "Open"
                                      }`}
                                  >
                                    {(complaint.resolved_by_staff
                                      ? "Yes"
                                      : "No") || "Not specified"}
                                  </p>
                                </td>
                                <td data-label="How complaint was taken">
                                  {complaint.how_complaint_was_taken || "-"}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                      <div className="pagination-controls">
                        <button
                          className="pagination-button"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        {pageNumbers.map((number) => (
                          <button
                            key={number}
                            className={`pagination-button ${currentPage === number ? "active" : ""
                              }`}
                            onClick={() => handlePageChange(number)}
                          >
                            {number}
                          </button>
                        ))}
                        <button
                          className="pagination-button"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    </>
                  ) : (
                    <p>No complaints found</p>
                  )}
                </div>
              ) : (
                <>
                  <table>
                    <thead>
                      <tr>
                        <th>No</th>
                        <th>
                          <div className="sort-cell">
                            ID
                            <SortByNumberIcon
                              setSortDesc={setSortDesc}
                              handleSortById={handleSortById}
                              sortDesc={sortDesc}
                            />
                          </div>
                        </th>
                        <th>
                          <div className="sort-cell">
                            Patient Name
                            <SortNameIcon
                              handleSortById={handleSortByName}
                              sortDesc={nameAZ}
                              setSortDesc={setNameAZ}
                            />
                          </div>
                        </th>
                        <th>MRN</th>
                        <th>
                          <div className="sort-cell">
                            Date of Complaint
                            <SortDateIcon
                              setSortDesc={setDateRecent}
                              handleSortById={handleFilterByDate}
                              sortDesc={dateRecent}
                            />
                          </div>
                        </th>
                        <th>Resolved by staff</th>
                        <th>How complaint was taken</th>
                      </tr>
                    </thead>
                    <tbody>
                      {showComplaintDetails && (
                        <ComplaintDetails
                          handleShowComplainDetails={handleShowComplaintDetails}
                          complaint={selectedComplaint}
                        />
                      )}
                      {currentGrievanceComplaints.length > 0 ? (
                        currentGrievanceComplaints.map((complaint, index) => (
                          <tr
                            key={index}
                            onClick={() => handleSelectedComplaint(complaint)}
                          >
                            <td data-label="No">{index + 1}</td>
                            <td data-label="ID">{complaint.id}</td>
                            <td data-label="Patient Name">{complaint.patient_name || "Not provided"}</td>
                            <td data-label="MRN">{complaint.medical_record_number || "-"}</td>
                            <td data-label="Date of Complaint">
                              <DateFormatter
                                dateString={complaint.date_of_complaint}
                              />
                            </td>
                            <td data-label="Resolved by staff">
                              <p
                                className={`follow-up ${complaint.resolved_by_staff === false
                                  ? "in-progress"
                                  : "Open"
                                  }`}
                              >
                                {(complaint.resolved_by_staff ? "Yes" : "No") ||
                                  "Not specified"}
                              </p>
                            </td>
                            <td data-label="How complaint was taken">{complaint.how_complaint_was_taken || "-"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7">No complaints found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div className="pagination-controls">
                    <button
                      className="pagination-button"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    {pageNumbers.map((number) => (
                      <button
                        key={number}
                        className={`pagination-button ${currentPage === number ? "active" : ""
                          }`}
                        onClick={() => handlePageChange(number)}
                      >
                        {number}
                      </button>
                    ))}
                    <button
                      className="pagination-button"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PatientVisitorGrievanceList;
