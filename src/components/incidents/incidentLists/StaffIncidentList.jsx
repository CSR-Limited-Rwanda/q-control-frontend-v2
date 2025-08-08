import React, { useEffect, useState } from "react";
import api, { API_URL, exportExcel } from "@/utils/api";
import { useRouter } from "next/navigation";
import DateFormatter from "@/components/DateFormatter";
import ModifyPageLoader from "@/components/loader";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import {
  Eye,
  File,
  Pencil,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  Square,
  SquareCheck,
  ViewIcon,
  X,
} from "lucide-react";

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear());
  return `${year}-${month}-${day}`;
}

const StaffIncidentList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });

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

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

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
        `${API_URL}/incidents/staff-incident/?${queryParams.toString()}`
      );
      if (response && response.status === 200 && response.data) {
        const formattedData = response.data.map((item) => ({
          ...item,
          date_of_injury_or_near_miss: formatDate(
            item.date_of_injury_or_near_miss
          ),
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
    router.push(`/incidents/staff/${incidentId}`);
    localStorage.setItem("staffIncidentId", incidentId)
    localStorage.setItem("employee_investigation_id", incidentId)
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incidents/staff/${incidentId}/update/`);
    localStorage.setItem("staffIncidentId", incidentId);
  };

  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
  };

  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  const search = (string) => {
    setIsSearching(true);
    const results = incidentData.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(string.toLowerCase())) ||
        (item.id &&
          item.id.toString().toLowerCase().includes(string.toLowerCase())) ||
        (item.patient_info?.first_name &&
          item.patient_info?.first_name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.patient_info?.last_name &&
          item.patient_info?.last_name
            .toLowerCase()
            .includes(string.toLowerCase()))
    );
    if (results.length === 0) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }
    setSearchResults(results);
    setCurrentPage(1);
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
        <div className="tab-container incidents-tab">
          <div className="tab-header">
            <div className="title-container-action">
              <div className="title-container">
                <h2 className="title">Staff Incident Tracking List</h2>
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
                placeholder="Search by facility, staff name"
              />
              {selectedItems.length > 0 ? (
                <button
                  onClick={() =>
                    exportExcel(selectedItems, "staff_incident_list")
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
                    <StaffTable
                      incidentData={currentSearchResults}
                      handleRowClick={handleRowClick}
                      selectedItems={selectedItems}
                      handleSelectedItems={handleSelectedItems}
                      handleSelectAll={handleSelectAll}
                      handleNonClickableColumnClick={
                        handleNonClickableColumnClick
                      }
                      setIncidentData={setSearchResults}
                      navigateToModify={navigateToModify}
                    />
                    <div className="mobile-table">
                      <button
                        onClick={() => handleSelectAll(searchResults)}
                        type="button"
                        className="tertiary-button"
                      >
                        {searchResults.every((item) =>
                          selectedItems.some(
                            (selected) => selected.id === item.id
                          )
                        ) ? (
                          <SquareCheck />
                        ) : (
                          <Square />
                        )}{" "}
                        Select all
                      </button>
                      {currentSearchResults.map((incident, index) => (
                        <IncidentTableCard
                          key={index}
                          incident={incident}
                          handleRowClick={handleRowClick}
                          handleSelectedItems={handleSelectedItems}
                          selectedItems={selectedItems}
                        />
                      ))}
                    </div>
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
                <StaffTable
                  incidentData={currentIncidentData}
                  handleNonClickableColumnClick={handleNonClickableColumnClick}
                  setIncidentData={setIncidentData}
                  navigateToModify={navigateToModify}
                  handleRowClick={handleRowClick}
                  selectedItems={selectedItems}
                  handleSelectAll={handleSelectAll}
                  handleSelectedItems={handleSelectedItems}
                />
                <div className="mobile-table">
                  <button
                    onClick={() => handleSelectAll(incidentData)}
                    type="button"
                    className="tertiary-button"
                  >
                    {incidentData.every((item) =>
                      selectedItems.some((selected) => selected.id === item.id)
                    ) ? (
                      <SquareCheck />
                    ) : (
                      <Square />
                    )}{" "}
                    Select all
                  </button>
                  {currentIncidentData.map((incident, index) => (
                    <IncidentTableCard
                      key={index}
                      incident={incident}
                      handleRowClick={handleRowClick}
                      handleSelectedItems={handleSelectedItems}
                      selectedItems={selectedItems}
                    />
                  ))}
                </div>
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
  );
};

const StaffTable = ({
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
        const nameA = a.patient_info?.first_name || "";
        const nameB = b.patient_info?.first_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByDateTime = (field) => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.date_of_injury_or_near_miss);
        const dateB = new Date(b.date_of_injury_or_near_miss);
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
          <th className="sort-cell">
            ID
            <SortByNumberIcon
              setSortDesc={setSortDesc}
              handleSortById={handleSortById}
              sortDesc={sortDesc}
            />
          </th>
          <th>Facility</th>
          <th className="sort-cell">
            Staff name
            <SortNameIcon
              handleSortById={handleSortByName}
              sortDesc={nameAZ}
              setSortDesc={setNameAZ}
            />
          </th>
          <th>Claims Notified</th>
          <th className="sort-cell">
            Injury Date & Time
            <SortDateIcon
              setSortDesc={setDateRecent}
              handleSortById={handleFilterByDate}
              sortDesc={dateRecent}
            />
          </th>
          <th>Claim contact & PH</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {incidentData.length > 0 ? (
          incidentData.map((employee, index) => (
            <tr
              onDoubleClick={() =>
                handleRowClick(
                  employee.original_report
                    ? employee.original_report
                    : employee.id
                )
              }
              key={index}
              className={`table-card ${selectedItems.includes(employee) ? "selected" : ""
                }`}
            >
              <td>
                <div
                  onClick={() => handleSelectedItems(employee)}
                  className="icon"
                >
                  {selectedItems.includes(employee) ? (
                    <SquareCheck color="orange" />
                  ) : (
                    <Square />
                  )}
                </div>
              </td>
              <td>{index + 1}</td>
              <td>{employee.original_report || employee.id}</td>
              <td>{employee.report_facility?.name || "Not provided"}</td>
              <td>
                {employee.patient_info?.last_name &&
                  employee.patient_info?.first_name
                  ? `${employee.patient_info?.last_name} ${employee.patient_info?.first_name}`
                  : "Not provided"}
              </td>
              <td>{employee.claim || "Not Specified"}</td>
              <td>
                <div>
                  <DateFormatter
                    dateString={employee.date_of_injury_or_near_miss}
                  />
                  , {employee.time_of_injury_or_near_miss || "-"}
                </div>
              </td>
              <td>{employee.claim || "Not Specified"}</td>
              <td>
                <p
                  className={`follow-up ${employee.status === "Draft"
                    ? "in-progress"
                    : employee.status === "Closed"
                      ? "closed"
                      : "Open"
                    }`}
                >
                  {employee.status || "Not specified"}
                </p>
              </td>
              <td
                onClick={(event) => handleNonClickableColumnClick(event)}
                className="action-col"
              >
                <div className="table-actions">
                  <Pencil
                    size={20}
                    onClick={() =>
                      navigateToModify(
                        employee.original_report
                          ? employee.original_report
                          : employee.id
                      )
                    }
                  />
                  <Eye
                    size={20}
                    onClick={() =>
                      handleRowClick(
                        employee.original_report
                          ? employee.original_report
                          : employee.id
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

const IncidentTableCard = ({
  incident,
  handleRowClick,
  handleSelectedItems,
  selectedItems,
}) => {
  return (
    <div
      className={`table-card ${selectedItems.includes(incident) ? "selected" : ""
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
          <span>{incident.original_report || incident.id}</span>
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
          <label htmlFor="">Staff Name: </label>
          <span>
            {incident.patient_info?.last_name &&
              incident.patient_info?.first_name
              ? `${incident.patient_info?.last_name} ${incident.patient_info?.first_name}`
              : "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Injury Date & Time: </label>
          <span>
            <DateFormatter dateString={incident?.date_of_injury_or_near_miss} />
            , {incident?.time_of_injury_or_near_miss || "-"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Claims Notified: </label>
          <span>{incident?.claim || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Claims contact & PH: </label>
          <span>{incident?.claim || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Status: </label>
          <span
            className={`follow-up ${incident?.status === "Draft"
              ? "in-progress"
              : incident?.status === "Closed"
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

export const SortByNumberIcon = ({ handleSortById, sortDesc, setSortDesc }) => {
  return (
    <div className="sort-icon" onClick={handleSortById}>
      <SortIcon sort={sortDesc} />
    </div>
  );
};

export const SortNameIcon = ({ handleSortById, sortDesc, setSortDesc }) => {
  return (
    <div className="sort-icon" onClick={handleSortById}>
      <SortIcon sort={sortDesc} />
    </div>
  );
};

export const SortDateIcon = ({ handleSortById, sortDesc, setSortDesc }) => {
  return (
    <div className="sort-icon" onClick={handleSortById}>
      <SortIcon sort={sortDesc} />
    </div>
  );
};

export const SortIcon = ({ sort }) => {
  return (
    <div className="sort-icon">
      {sort ? <SortAsc size={18} /> : <SortDesc size={18} />}
    </div>
  );
};

export default StaffIncidentList;
