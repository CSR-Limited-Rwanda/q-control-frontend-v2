import React, { useEffect, useState } from "react";

import api, { API_URL, exportExcel } from "@/utils/api";

// import TableActionsPopup from "../general/popups/tableActionPopup";
// import {
//   useDepartments,
//   usePermission,
// } from "../../contexts/permissionsContext";
// import NoAccessPage from "../../pages/errorPages/401";

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
import { ComplainDetails } from "@/components/accounts/profile/profileComplaints";

const handleSearch = (items, searchString) => {
  if (searchString.length > 2) {
    const results = items.filter((item) => {
      return (
        item.patient_name.toLowerCase().includes(searchString.toLowerCase()) ||
        item.form_initiated_by.toLowerCase()
      );
    });
    return results;
  }

  return [];
};

const PatientVisitorGrievanceList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [grievanceData, setGrievanceData] = useState([]);

  const [searchResults, setSearchResults] = useState([]);
  const [resultsFound, setResultsFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterByDate, setFilterByDate] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);

  const [openAction, setOpenAction] = useState(false);
  const [openActionIndex, setOpenActionIndex] = useState("");
  const router = useRouter();

  const [data, setData] = useState([]); // To hold the table data // To hold filtered data
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });
  const [openFilters, setOpenFilters] = useState(false);

  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(0);
    return `${year}-${month}-${day}`;
  }

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
    if (selectedItems !== items) {
      setSelectedItems(items);
    } else {
      setSelectedItems([]);
    }
  };
  // Handle filter application
  const applyFilters = () => {
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.date);
      const startDate = filters.start_date
        ? new Date(filters.start_date)
        : null;
      const endDate = filters.end_date ? new Date(filters.end_date) : null;

      const withinDateRange =
        (!startDate || incidentDate >= startDate) &&
        (!endDate || incidentDate <= endDate);

      return (
        withinDateRange &&
        (!filters.status.toLowerCase() ||
          item.status.toLowerCase() === filters.status.toLowerCase())
      );
    });
    console.log("filters", filters);
    console.log("new filtered data", newFilteredData);
    setSearchResults(newFilteredData);
    setGrievanceData(newFilteredData); // Update filtered data state
    toggleOpenFilters();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
    });
    setIsSearching(false);
    setGrievanceData(data); // Reset filtered data to all data
    toggleOpenFilters();
  };
  const handleRowClick = (incidentId) => {
    router.push(`/incident/grievance/${incidentId}`);
  };
  const navigateToModify = (incidentId) => {
    router.push(`/incident/grievance/${incidentId}/modify/`);
  };

  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
  };

  const toggleAction = (index) => {
    setOpenActionIndex(index);
    setOpenAction(!openAction);
  };
  const toggleFilterByDate = () => {
    setFilterByDate(!filterByDate);
  };

  const search = (string) => {
    setIsSearching(true);
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
  };

  useEffect(() => {
    const fetchGrievanceData = async () => {
      try {
        const response = await api.get(`${API_URL}/incidents/grievance/`);
        if (response.status === 200) {
          const formattedData = response.data.map((item) => ({
            ...item,
            date: formatDate(item.date),
          }));
          setGrievanceData(formattedData);
          setIsFetching(false);
          setData(formattedData);
          console.log(response.data);
        }
      } catch (error) {
        if (error.response.data.error) {
          setErrorFetching(error.response.data.error);
          setIsFetching(false);
        } else {
          setErrorFetching("An error occurred while fetching incident data.");
          setIsFetching(false);
        }
      }
    };
    fetchGrievanceData();
    setIsFetching(false);
  }, []);

  return isFetching ? (
    <ModifyPageLoader />
  ) : (
    <>
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
                    <h2 className="title">Grievance List</h2>
                    <p>{grievanceData.length} incidents available</p>
                  </div>
                </div>
              </div>
              <div className="tabs">
                <div
                  onClick={() => setActiveTab("all")}
                  className={`reports-tab tracking-tab ${
                    activeTab === "all" ? "active" : ""
                  }`}
                >
                  <File />
                  <span>Grievance reports</span>
                </div>

                <div
                  onClick={() => setActiveTab("drafts")}
                  className={`drafts tracking-tab  ${
                    activeTab === "drafts" ? "active" : ""
                  }`}
                >
                  <FileEdit />
                  <span>Complaints</span>
                </div>
              </div>
            </div>

            <div className="incident-content">
              {activeTab === "all" && (
                <>
                  <div className="filters">
                    {openFilters ? (
                      <div className="filters_popup">
                        <div onClick={toggleOpenFilters} className="close-icon">
                          <X size={24} variant={"stroke"} />
                        </div>

                        <h3>Filter incident data</h3>
                        <div className="filter-buttons">
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
                          <div className="pop-up-buttons">
                            <button
                              onClick={clearFilters}
                              className="outline-button"
                            >
                              <X size={20} variant={"stroke"} />
                              Clear
                            </button>
                            <button
                              onClick={applyFilters}
                              className="secondary-button"
                            >
                              <div className="icon">
                                <SlidersHorizontal
                                  size={20}
                                  variant={"stroke"}
                                />
                              </div>
                              <span>Filter</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                    <input
                      onChange={(e) => {
                        search(e.target.value);
                      }}
                      // value={searchString}
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
                        {" "}
                        <FileExportIcon /> <span>Export</span>
                      </button>
                    ) : (
                      <button
                        onClick={toggleOpenFilters}
                        className="date-filter-button"
                      >
                        <div className="icon">
                          <SlidersHorizontal variant={"stroke"} />
                        </div>
                        <span>Filter</span>
                      </button>
                    )}
                  </div>
                  <div className="incident-list">
                    {isSearching ? (
                      <div className="search-results">
                        {isSearchingTheDatabase ? (
                          <div className="searching_database">
                            <p>Searching database</p>
                          </div>
                        ) : searchResults && searchResults.length > 0 ? (
                          <div className="results-table">
                            <div className="results-count">
                              <span className="count">
                                {searchResults.length}
                              </span>{" "}
                              result(s) found
                            </div>

                            <>
                              <GrievanceTable
                                incidentData={searchResults}
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

                              <div className="mobile-table">
                                <button
                                  onClick={() => handleSelectAll(grievanceData)}
                                  type="button"
                                  className="tertiary-button"
                                >
                                  {" "}
                                  {selectedItems === searchResults ? (
                                    <SquareCheck />
                                  ) : (
                                    <Square />
                                  )}{" "}
                                  Select all
                                </button>

                                {searchResults.map((grievance, index) => (
                                  <IncidentTableCard
                                    key={index}
                                    incident={grievance}
                                    navigateToModify={navigateToModify}
                                    handleRowClick={handleRowClick}
                                    selectedItems={selectedItems}
                                    handleSelectedItems={handleSelectedItems}
                                  />
                                ))}
                              </div>
                            </>
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
                          incidentData={grievanceData}
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

                        <div className="mobile-table">
                          <button
                            onClick={() => handleSelectAll(grievanceData)}
                            type="button"
                            className="tertiary-button"
                          >
                            {" "}
                            {selectedItems === grievanceData ? (
                              <SquareCheck />
                            ) : (
                              <Square />
                            )}{" "}
                            Select all
                          </button>

                          {grievanceData.map((grievance, index) => (
                            <IncidentTableCard
                              key={index}
                              incident={grievance}
                              navigateToModify={navigateToModify}
                              handleRowClick={handleRowClick}
                              selectedItems={selectedItems}
                              handleSelectedItems={handleSelectedItems}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
              {activeTab === "drafts" && <ComplaintsTab />}
            </div>
          </div>
        )}
      </div>
    </>
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
    console.log(items);
    console.log("sorting items:", sortBy, direction, field);
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
        return items; // Return unsorted if the sortBy criteria doesn't match
    }
  };
  return (
    <table>
      <thead>
        <tr>
          <th>
            <div onClick={() => handleSelectAll(incidentData)}>
              {" "}
              {selectedItems === incidentData ? <SquareCheck /> : <Square />}
            </div>
          </th>

          <th>No</th>
          <th className="sort-cell">
            ID
            <SortByNumberIcon
              setSortDesc={setSortDesc}
              handleSortById={handleSortById}
              sortDesc={sortDesc}
            />{" "}
          </th>
          <th>Facility</th>
          <th className="sort-cell">
            Name{" "}
            <SortNameIcon
              handleSortById={handleSortByName}
              sortDesc={nameAZ}
              setSortDesc={setNameAZ}
            />{" "}
          </th>
          <th>MRN</th>

          <th className="sort-cell">
            Date
            <SortDateIcon
              setSortDesc={setDateRecent}
              handleSortById={handleFilterByDate}
              sortDesc={dateRecent}
            />
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
              className={`table-card ${
                selectedItems.includes(grievance) ? "selected" : ""
              }`}
            >
              <td>
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

              <td>{index + 1}</td>
              <td>{grievance.original_report || grievance.id} </td>
              <td>{grievance.report_facility?.name || "No provided"}</td>
              <td>
                {grievance.patient_name?.last_name ||
                grievance.patient_name?.first_name
                  ? `${grievance.patient_name?.last_name} ${grievance.patient_name?.first_name}`
                  : "Not provided"}
              </td>
              <td>
                {grievance.patient_name?.medical_record_number ||
                  "Not specified"}
              </td>

              {/* <td>{grievance.form_initiated_by || "-"}</td> */}

              <td>{<DateFormatter dateString={grievance.date} /> || "-"}</td>
              <td>
                {" "}
                <p
                  className={`follow-up ${
                    grievance.status === "Draft"
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
            <td>No data found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const IncidentTableCard = ({
  incident,
  items,
  selectedItems,
  handleSelectedItems,
  navigateToModify,
  handleRowClick,
}) => {
  return (
    <div
      className={`table-card ${
        selectedItems.includes(incident) ? "selected" : ""
      }`}
    >
      <div className="card-header">
        <div className="id-number">
          <div onClick={() => handleSelectedItems(incident)} className="icon">
            {selectedItems.includes(incident) ? (
              <SquareCheck color="orange" />
            ) : (
              <Square />
            )}
          </div>

          <span>ID</span>
          <span>{incident.original_report || incident.id} </span>
        </div>

        <div
          onClick={() =>
            handleRowClick(
              incident.original_report ? incident.original_report : incident.id
            )
          }
          className="card-actions"
        >
          <ViewIcon />
          <span>View more</span>
        </div>
      </div>
      <div className="card-content-items">
        <div className="item">
          <label htmlFor="">Facility: </label>
          <span>{incident?.report_facility?.name || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Type of incident: </label>
          <span>{incident.incident_type || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Date & Time: </label>
          <span>{incident.incident_date || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Status: </label>
          <span
            className={`follow-up ${
              incident.status === "Draft"
                ? "in-progress"
                : incident.status === "Closed"
                ? "closed"
                : "Open"
            }`}
          >
            {incident?.status || "Not specified"}
          </span>
        </div>
      </div>
    </div>
  );
};

const ComplaintsTab = () => {
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [grievanceComplaints, setGrievanceComplaints] = useState([]);
  const [sortDesc, setSortDesc] = useState(false);
  const [nameAZ, setNameAZ] = useState(false);
  const [dateRecent, setDateRecent] = useState(false);
  const [showComplaintDetails, setShowComplainDetails] = useState(false);
  const [selectedComplain, setSelectedComplain] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [data, setData] = useState([]); // To hold the table data // To hold filtered data
  const [searchResults, setSearchResults] = useState([]);
  const [filters, setFilters] = useState({
    end_date: "",
    start_date: "",
    resolved_by_staff: null,
  });
  const [openFilters, setOpenFilters] = useState(false);

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
    console.log(items);
    console.log("sorting items:", sortBy, direction, field);
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
        return items; // Return unsorted if the sortBy criteria doesn't match
    }
  };

  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  function formatDate(dateString) {
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear()).slice(0);
    return `${year}-${month}-${day}`;
  }

  // Handle filter application
  const applyFilters = () => {
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.date_of_complaint);
      const startDate = filters.start_date
        ? new Date(filters.start_date)
        : null;
      const endDate = filters.end_date ? new Date(filters.end_date) : null;

      const withinDateRange =
        (!startDate || incidentDate >= startDate) &&
        (!endDate || incidentDate <= endDate);

      return (
        withinDateRange &&
        (filters.resolved_by_staff === null ||
          item.resolved_by_staff === filters.resolved_by_staff)
      );
    });
    console.log("filters", filters);
    console.log("new filtered data", newFilteredData);
    setGrievanceComplaints(newFilteredData); // Update filtered data state
    toggleOpenFilters();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      resolved_by_staff: null,
    });
    setGrievanceComplaints(data); // Reset filtered data to all data
  };

  const search = (string) => {
    setIsSearching(true);
    if (Object.keys(string).length < 2) {
      setIsSearching(false);
    }
    if (Object.keys(string).length > 2) {
      const results = handleSearch(grievanceComplaints, string);
      setSearchResults(results);
    }
  };
  const handleShowComplainDetails = () => {
    setShowComplainDetails(!showComplaintDetails);
  };

  const handleSelectedComplaint = (complaint) => {
    setSelectedComplain(complaint);
    handleShowComplainDetails();
  };

  useEffect(() => {
    const fetchGrievanceComplaints = async () => {
      try {
        const response = await api.get(`${API_URL}/complaints/`);
        if (response.status === 200) {
          const formattedData = response.data.results.map((item) => ({
            ...item,
            date_of_complaint: formatDate(item.date_of_complaint),
          }));
          console.log(formattedData);
          setGrievanceComplaints(formattedData);
          setData(formattedData);
          setLoadingComplaints(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchGrievanceComplaints();
  }, []);
  return (
    <div className="incident-list">
      <div className="filters">
        {openFilters ? (
          <div className="filters_popup">
            <div onClick={toggleOpenFilters} className="close-icon">
              <X size={24} variant={"stroke"} />
            </div>

            <h3>Filter incident data</h3>
            <div className="filter-buttons">
              <CustomSelectInput
                options={["Yes", "No"]}
                placeholder={"Filter by resolved by staff"}
                selected={
                  filters.resolved_by_staff === null
                    ? ""
                    : filters.resolved_by_staff
                    ? "Yes"
                    : "No"
                } // Handle empty state
                setSelected={(value) => {
                  // Handle "Yes" and "No" as true/false, or set to null if empty
                  const resolvedByStaff =
                    value === "Yes" ? true : value === "No" ? false : null;
                  console.log("heyyy", resolvedByStaff);
                  setFilters({
                    ...filters,
                    resolved_by_staff: resolvedByStaff,
                  });
                }}
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
        <div className="search-input incident-search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            onChange={(e) => {
              search(e.target.value);
            }}
            // value={searchString}
            type="search"
            name="systemSearch"
            id="systemSearch"
            placeholder="Search the system"
          />
        </div>
        <button onClick={toggleOpenFilters} className="date-filter-button">
          <div className="icon">
            <SlidersHorizontal size={24} variant={"stroke"} />
          </div>
          <span>Filter</span>
        </button>
      </div>
      <br />
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
                />{" "}
              </div>
            </th>
            <th>
              <div className="sort-cell">
                Patient Name
                <SortNameIcon
                  handleSortById={handleSortByName}
                  sortDesc={nameAZ}
                  setSortDesc={setNameAZ}
                />{" "}
              </div>{" "}
            </th>

            <th>MRN</th>

            {/* <th>Title</th> */}
            {/* <th>Patient Name</th> */}

            {/* <th>Date of Complaint-Grievance</th> */}

            {/* <th>Nature of complaint-Grievance</th> */}
            <th>
              <div className="sort-cell">
                Date of Complaint
                <SortDateIcon
                  setSortDesc={setDateRecent}
                  handleSortById={handleFilterByDate}
                  sortDesc={dateRecent}
                />
              </div>{" "}
            </th>

            {/* <th>Follow up</th> */}
            {/* <th>Complaint resolved by staff present</th> */}
            <th>Resolved by staff</th>
            <th>How complaint was taken</th>
          </tr>
        </thead>
        {/* {isSearching ? (
      <tbody>
        {searchResults.length > 0 ? (
          searchResults.map((grievance, index) => (
            <tr>
              <td>{index + 1}</td>
              <td>{grievance.patient_name}</td>
              <td>
                {grievance.phone_number ||
                  "Not specified"}
              </td>
              <td>{grievance.medical_record_number || "-"}</td>
              <td>{grievance.complaint_nature || "-"}</td>
              <td>{grievance.complaint_type || "Not specified"}</td>
              <td>{grievance.date_of_complaint || "-"} </td>
              <td>
                {grievance.resolved_by_staff || "Not specified"}
              </td>
              <td>{grievance.how_complaint_was_taken || "-"}</td>
              
            </tr>
          ))
        ) : (
          <p>Nothing found</p>
        )}
      </tbody>
    ) : ( */}
        <tbody>
          {showComplaintDetails && (
            <ComplainDetails
              handleShowComplainDetails={handleShowComplainDetails}
              complaint={selectedComplain}
            />
          )}
          {grievanceComplaints.length > 0 ? (
            grievanceComplaints.map((complaint, index) => (
              <tr
                key={index}
                onClick={() => handleSelectedComplaint(complaint)}
              >
                <td>{index + 1}</td>
                <td>{complaint.id}</td>
                <td>{complaint.patient_name}</td>

                <td>{complaint.medical_record_number || "-"}</td>

                <td>
                  {<DateFormatter dateString={complaint.date_of_complaint} /> ||
                    "-"}
                </td>

                <td>
                  {" "}
                  <p
                    className={`follow-up ${
                      complaint.resolved_by_staff === false
                        ? "in-progress"
                        : "Open"
                    }`}
                  >
                    {(complaint.resolved_by_staff ? "Yes" : "No") ||
                      "Not specified"}
                  </p>
                </td>

                <td>{complaint.how_complaint_was_taken || "-"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td>No data found</td>
            </tr>
          )}
        </tbody>
        {/* )} */}
      </table>
    </div>
  );
};

{
  /* <div className="tabs">
              <div onClick={() => setActiveTab('all')} className={`reports-tab tracking-tab ${activeTab === 'all' ? 'active' : ''}`}>
                <Note01Icon />
                <span>All reports</span>
              </div>

              <div onClick={() => setActiveTab('drafts')} className={`drafts tracking-tab  ${activeTab === 'drafts' ? 'active' : ''}`}>
                <NoteEditIcon />
                <span>Drafts</span>
              </div>
            </div> */
}

export default PatientVisitorGrievanceList;
