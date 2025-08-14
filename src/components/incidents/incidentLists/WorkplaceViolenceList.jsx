import React, { useEffect, useState } from "react";
import api, { API_URL, exportExcel } from "@/utils/api";
import {
  Eye,
  File,
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
import SliceText from "@/components/SliceText";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import {
  SortByNumberIcon,
  SortDateIcon,
  SortNameIcon,
} from "./StaffIncidentList";
import PermissionsGuard from "@/components/PermissionsGuard";

// Debugging check for imported components
if (
  !SortByNumberIcon ||
  !SortDateIcon ||
  !SortNameIcon ||
  !DateFormatter ||
  !SliceText
) {
  console.error("One or more imported components are undefined:", {
    SortByNumberIcon: !!SortByNumberIcon,
    SortDateIcon: !!SortDateIcon,
    SortNameIcon: !!SortNameIcon,
    DateFormatter: !!DateFormatter,
    SliceText: !!SliceText,
  });
}

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

function formatTime(timeString) {
  if (!timeString || !timeString.includes(":")) {
    return "Invalid Time";
  }
  const [hours, minutes, seconds] = timeString.split(":");
  return `${hours}:${minutes}:${seconds.split(".")[0] || "00"}`;
}

const WorkplaceViolenceList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });
  const [openFilters, setOpenFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIncidentData = incidentData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentSearchResults = searchResults.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (isSearching ? searchResults.length : incidentData.length) / itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const fetchFilteredData = async (appliedFilters) => {
    try {
      setIsFetching(true);
      setErrorFetching("");
      const queryParams = new URLSearchParams();
      if (appliedFilters.start_date)
        queryParams.append("start_date", appliedFilters.start_date);
      if (appliedFilters.end_date)
        queryParams.append("end_date", appliedFilters.end_date);
      if (appliedFilters.status)
        queryParams.append("status", appliedFilters.status);

      const response = await api.get(
        `${API_URL}/incidents/workplace-violence/?${queryParams.toString()}`
      );

      if (response && response.status === 200 && response.data) {
        const formattedData = response.data.map((item) => ({
          ...item,
          date_of_incident: formatDate(item.date_of_incident),
        }));
        setIncidentData(formattedData);
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
      console.error("Workplace Violence API error:", error);
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
    setIncidentData(data);
    setCurrentPage(1); // Reset to first page when filters are cleared
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
    const results = incidentData.filter(
      (item) =>
        (item.patient_visitor_name &&
          item.patient_visitor_name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.incident_type &&
          item.incident_type.toLowerCase().includes(string.toLowerCase())) ||
        (item.report_facility?.name &&
          item.report_facility.name
            .toLowerCase()
            .includes(string.toLowerCase()))
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

  const handleRowClick = (incidentId) => {
    router.push(`/incidents/workplace-violence/${incidentId}`);
    localStorage.setItem("workplaceViolenceId", incidentId);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incidents/workplace-violence/${incidentId}/update/`);
    localStorage.setItem("workplaceViolenceId", incidentId);
  };

  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
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

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    fetchFilteredData(filters);
  }, []);

  return (
    <PermissionsGuard model={"workplace_violence_reports"} codename={"view_list"}>
      {isFetching ? (
        <ModifyPageLoader />
      ) : (
        <div>
      {errorFetching ? (
        <div className="error-message">
          <p>{errorFetching}</p>
        </div>
      ) : (
        <div className="tab-container incidents-tab">
          <div className="tab-header">
            <div className="title-container-action">
              <div className="title-container">
                <h2 className="title">Workplace Violence Tracking List</h2>
                <p>{incidentData.length} incident(s) available</p>
              </div>
            </div>

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
                      <button onClick={clearFilters} className="outline-button">
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
                placeholder="Search by patient/visitor, incident type, or facility"
              />
              {selectedItems.length > 0 ? (
                <button
                  onClick={() => exportExcel(selectedItems, "wp_incident_list")}
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
          </div>

          <div className="incident-list">
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
                    <WorkplaceViolenceTable
                      incidentData={currentSearchResults}
                      handleSelectAll={handleSelectAll}
                      selectedItems={selectedItems}
                      handleSelectedItems={handleSelectedItems}
                      handleNonClickableColumnClick={
                        handleNonClickableColumnClick
                      }
                      navigateToModify={navigateToModify}
                      handleRowClick={handleRowClick}
                      setIncidentData={setSearchResults}
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
                    <p>No data found with your search</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <WorkplaceViolenceTable
                  incidentData={currentIncidentData}
                  handleSelectAll={handleSelectAll}
                  selectedItems={selectedItems}
                  handleSelectedItems={handleSelectedItems}
                  handleNonClickableColumnClick={handleNonClickableColumnClick}
                  navigateToModify={navigateToModify}
                  handleRowClick={handleRowClick}
                  setIncidentData={setIncidentData}
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
        </div>
      )}
    </div>
      )}
    </PermissionsGuard>
  );
};

const WorkplaceViolenceTable = ({
  incidentData,
  handleNonClickableColumnClick,
  handleRowClick,
  navigateToModify,
  selectedItems,
  handleSelectedItems,
  handleSelectAll,
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

  const handleSorting = (items, sortBy, direction, field) => {

    const sortByNumber = (field) => {
      return [...items].sort((a, b) => {
        const aValue = a.original_report ? a.original_report : a.id;
        const bValue = b.original_report ? b.original_report : b.id;
        const result = aValue - bValue;
        return direction === "asc" ? result : -result;
      });
    };

    const sortByFacilityName = (field) => {
      return [...items].sort((a, b) => {
        const nameA = a.patient_name?.user?.first_name || "";
        const nameB = b.patient_name?.user?.first_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByDateTime = (field) => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.date_of_incident);
        const dateB = new Date(b.date_of_incident);
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
              {SortByNumberIcon ? (
                <SortByNumberIcon
                  setSortDesc={setSortDesc}
                  handleSortById={handleSortById}
                  sortDesc={sortDesc}
                />
              ) : (
                <span>Sort</span>
              )}
            </div>
          </th>
          <th>Facility</th>
          <th>Type of incident</th>
          <th>Physical injury description</th>
          <th>
            <div className="sort-cell">
              Incident date & time
              {SortDateIcon ? (
                <SortDateIcon
                  setSortDesc={setDateRecent}
                  handleSortById={handleFilterByDate}
                  sortDesc={dateRecent}
                />
              ) : (
                <span>Sort</span>
              )}
            </div>
          </th>
          <th>Severity</th>
          <th>Status</th>
          <th className="action-col">Action</th>
        </tr>
      </thead>
      <tbody>
        {incidentData.length > 0 ? (
          incidentData.map((incident, index) => (
            <tr
              onDoubleClick={() =>
                handleRowClick(
                  incident.original_report
                    ? incident.original_report
                    : incident.id
                )
              }
              key={index}
              className={`table-card ${selectedItems.includes(incident) ? "selected" : ""
                }`}
            >
              <td data-label="Select">
                <div
                  onClick={() => handleSelectedItems(incident)}
                  className="icon"
                >
                  {selectedItems.includes(incident) ? (
                    <SquareCheck color="orange" />
                  ) : (
                    <Square />
                  )}
                </div>
              </td>
              <td data-label="No">{index + 1}</td>
              <td data-label="ID">{incident.original_report || incident.id}</td>
              <td data-label="Facility">{incident.report_facility?.name || "Not provided"}</td>
              <td data-label="Type of Incident">{incident.incident_type || "Not provided"}</td>
              <td data-label="Physical Injury Description">
                {SliceText ? (
                  <SliceText
                    text={
                      incident.physical_injury_description || "Not provided"
                    }
                    maxLength={20}
                  />
                ) : (
                  incident.physical_injury_description || "Not provided"
                )}
              </td>
              <td data-label="Date & Time Reported">
                {DateFormatter ? (
                  <DateFormatter dateString={incident.date_of_incident} />
                ) : (
                  incident.date_of_incident
                )}
                , {formatTime(incident.time_of_incident) || "Time not provided"}
              </td>
              <td data-label="Severity">{incident.severity_level || "Not provided"}</td>
              <td data-label="Status">
                <p
                  className={`follow-up ${incident.status === "Draft"
                    ? "in-progress"
                    : incident.status === "Closed"
                      ? "closed"
                      : "Open"
                    }`}
                >
                  {incident.status || "Not specified"}
                </p>
              </td>
              <td
                data-label="Action"
                onClick={(event) => handleNonClickableColumnClick(event)}
                className="action-col"
              >
                <div className="table-actions">
                  {!incident.is_resolved && (
                    <Pencil
                      size={20}
                      onClick={() =>
                        navigateToModify(
                          incident.original_report
                            ? incident.original_report
                            : incident.id
                        )
                      }
                    />
                  )}
                  <Eye
                    size={20}
                    onClick={() =>
                      handleRowClick(
                        incident.original_report
                          ? incident.original_report
                          : incident.id
                      )
                    }
                  />
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10">No data found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};


export default WorkplaceViolenceList;
