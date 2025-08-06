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
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import {
  SortByNumberIcon,
  SortDateIcon,
  SortNameIcon,
  SortNameIcon2,
} from "./StaffIncidentList";

// Debugging check for imported components
// if (
//   !SortByNumberIcon ||
//   !SortDateIcon ||
//   !SortNameIcon ||
//   !SortNameIcon2 ||
//   !DateFormatter
// ) {
//   console.error("One or more imported components are undefined:", {
//     SortByNumberIcon: !!SortByNumberIcon,
//     SortDateIcon: !!SortDateIcon,
//     SortNameIcon: !!SortNameIcon,
//     SortNameIcon2: !!SortNameIcon2,
//     DateFormatter: !!DateFormatter,
//   });
// }

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

const LostAndFoundList = () => {
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
        `${API_URL}/incidents/lost-found/?${queryParams.toString()}`
      );
      console.log("Lost and Found API response:", response);
      if (response && response.status === 200 && response.data) {
        const formattedData = response.data.map((item) => ({
          ...item,
          date_reported: formatDate(item.date_reported),
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
      console.error("Lost and Found API error:", error);
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
        (item.person_taking_report &&
          item.person_taking_report
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.report_facility?.name &&
          item.report_facility.name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.name_of_person_reporting_loss &&
          item.name_of_person_reporting_loss
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
    router.push(`/incidents/lost-and-found/${incidentId}`);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incidents/lost-and-found/${incidentId}/update/`);
    localStorage.setItem("lostAndFoundId", incidentId);
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
                <h2 className="title">Lost & Found Property Tracking List</h2>
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
                    <div className="pop-up-buttons">
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
                placeholder="Search by person taking report, facility, or person reporting"
              />
              {selectedItems.length > 0 ? (
                <button
                  onClick={() =>
                    exportExcel(selectedItems, "lost_and_found_incident_list")
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
                      <LostFoundTable
                        incidentData={currentSearchResults}
                        handleNonClickableColumnClick={
                          handleNonClickableColumnClick
                        }
                        setIncidentData={setSearchResults}
                        navigateToModify={navigateToModify}
                        handleRowClick={handleRowClick}
                        handleSelectedItems={handleSelectedItems}
                        selectedItems={selectedItems}
                        handleSelectAll={handleSelectAll}
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
                            selectedItems={selectedItems}
                            handleSelectedItems={handleSelectedItems}
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
                      <p>No data found</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <LostFoundTable
                    incidentData={currentIncidentData}
                    handleNonClickableColumnClick={
                      handleNonClickableColumnClick
                    }
                    setIncidentData={setIncidentData}
                    navigateToModify={navigateToModify}
                    handleRowClick={handleRowClick}
                    handleSelectedItems={handleSelectedItems}
                    selectedItems={selectedItems}
                    handleSelectAll={handleSelectAll}
                  />
                  <div className="mobile-table">
                    <button
                      onClick={() => handleSelectAll(incidentData)}
                      type="button"
                      className="tertiary-button"
                    >
                      {incidentData.every((item) =>
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
                    {currentIncidentData.map((incident, index) => (
                      <IncidentTableCard
                        key={index}
                        incident={incident}
                        handleRowClick={handleRowClick}
                        selectedItems={selectedItems}
                        handleSelectedItems={handleSelectedItems}
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
        </div>
      )}
    </div>
  );
};

const LostFoundTable = ({
  incidentData,
  handleNonClickableColumnClick,
  navigateToModify,
  handleRowClick,
  handleSelectedItems,
  selectedItems,
  handleSelectAll,
  setIncidentData,
}) => {
  const [sortDesc, setSortDesc] = useState(false);
  const [nameAZ, setNameAZ] = useState(false);
  const [nameAZ2, setNameAZ2] = useState(false);
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

  const handleSortByName2 = () => {
    const results = handleSorting(
      incidentData,
      "name2",
      nameAZ2 ? "desc" : "asc",
      "name2"
    );
    setIncidentData(results);
    setNameAZ2(!nameAZ2);
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
    console.log("sorting items:", sortBy, direction, field);
    const sortByNumber = (field) => {
      return [...items].sort((a, b) => {
        const result = a.id - b.id;
        return direction === "asc" ? result : -result;
      });
    };

    const sortByFacilityName = (field) => {
      return [...items].sort((a, b) => {
        const nameA = a.taken_by?.first_name || "";
        const nameB = b.taken_by?.first_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByFacilityName2 = (field) => {
      return [...items].sort((a, b) => {
        const nameA = a.reported_by?.first_name || "";
        const nameB = b.reported_by?.first_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByDateTime = (field) => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.date_reported);
        const dateB = new Date(b.date_reported);
        const result = dateA - dateB;
        return direction === "asc" ? result : -result;
      });
    };

    switch (sortBy) {
      case "number":
        return sortByNumber(field);
      case "name":
        return sortByFacilityName(field);
      case "name2":
        return sortByFacilityName2(field);
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
          <th>
            <div className="sort-cell">
              Date & Time Reported
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
          <th>
            <div className="sort-cell">
              Person taking report
              {SortNameIcon ? (
                <SortNameIcon
                  handleSortById={handleSortByName}
                  sortDesc={nameAZ}
                  setSortDesc={setNameAZ}
                />
              ) : (
                <span>Sort</span>
              )}
            </div>
          </th>
          <th>
            <div className="sort-cell">
              Person reporting
              {SortNameIcon2 ? (
                <SortNameIcon2
                  handleSortById={handleSortByName2}
                  sortDesc={nameAZ2}
                  setSortDesc={setNameAZ2}
                />
              ) : (
                <span>Sort</span>
              )}
            </div>
          </th>

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
              <td>
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
              <td>{index + 1}</td>
              <td>{incident.original_report || incident.id}</td>
              <td>{incident.report_facility?.name || "Not provided"}</td>
              <td>
                {DateFormatter ? (
                  <DateFormatter dateString={incident.date_reported} />
                ) : (
                  incident.date_reported
                )}
                , {formatTime(incident.time_reported)}
              </td>
              <td>
                {incident.taken_by?.last_name && incident.taken_by?.first_name
                  ? `${incident.taken_by.last_name} ${incident.taken_by.first_name}`
                  : "Not provided"}
              </td>
              <td>
                {incident.reported_by?.last_name &&
                  incident.reported_by?.first_name
                  ? `${incident.reported_by.last_name} ${incident.reported_by.first_name}`
                  : "Not provided"}
              </td>
              <td>
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
            <td colSpan="9">No data found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

const IncidentTableCard = ({
  incident,
  handleRowClick,
  selectedItems,
  handleSelectedItems,
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
          <span>{incident.report_facility?.name || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Date & Time: </label>
          <span>
            {DateFormatter ? (
              <DateFormatter dateString={incident.date_reported} />
            ) : (
              incident.date_reported
            )}
            , {formatTime(incident.time_reported)}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Person taking report: </label>
          <span>
            {incident.taken_by?.last_name && incident.taken_by?.first_name
              ? `${incident.taken_by.last_name} ${incident.taken_by.first_name}`
              : "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Person reporting: </label>
          <span>
            {incident.reported_by?.last_name && incident.reported_by?.first_name
              ? `${incident.reported_by.last_name} ${incident.reported_by.first_name}`
              : "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Location found: </label>
          <span>{incident.location_found || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Location disposed: </label>
          <span>{incident.location_returned || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Status: </label>
          <span
            className={`follow-up ${incident.status === "Draft"
                ? "in-progress"
                : incident.status === "Closed"
                  ? "closed"
                  : "Open"
              }`}
          >
            {incident.status || "Not specified"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LostAndFoundList;