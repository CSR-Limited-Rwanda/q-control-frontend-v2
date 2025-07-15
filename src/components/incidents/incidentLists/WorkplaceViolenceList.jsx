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
import SliceText from "@/components/SliceText";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import {
  SortByNumberIcon,
  SortDateIcon,
  SortNameIcon,
} from "./StaffIncidentList";

const handleSearch = (items, searchString) => {
  if (searchString.length > 2) {
    const results = items.filter((item) => {
      return (
        (item.patient_visitor_name &&
          item.patient_visitor_name
            .toLowerCase()
            .includes(searchString.toLowerCase())) ||
        (item.incident_type &&
          item.incident_type
            .toLowerCase()
            .includes(searchString.toLowerCase())) ||
        (item.follow_up &&
          item.follow_up.toLowerCase().includes(searchString.toLowerCase()))
      );
    });
    return results;
  }

  return [];
};

const WorkplaceViolenceList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [searchResults, setSearchResults] = useState("");
  const [resultsFound, setResultsFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterByDate, setFilterByDate] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [openActionIndex, setOpenActionIndex] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();

  const [data, setData] = useState([]); // To hold the table data
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
  const currentSearchResults = searchResults
    ? searchResults.slice(indexOfFirstItem, indexOfLastItem)
    : [];
  const totalPages = Math.ceil(
    (isSearching ? searchResults.length : incidentData.length) / itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Handle filter application
  const applyFilters = () => {
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.date_of_incident);
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
    setIncidentData(newFilteredData);
    setCurrentPage(1); // Reset to first page when filters are applied
    toggleOpenFilters();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
    });
    setIncidentData(data);
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  const toggleAction = (index) => {
    setOpenActionIndex(index);
    setOpenAction(!openAction);
  };

  const handleRowClick = (incidentId) => {
    router.push(`/incident/workplace_violence/${incidentId}`);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incident/workplace_violence/${incidentId}/modify/`);
  };

  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
  };

  const search = (string) => {
    setIsSearching(true);
    const results = incidentData.filter(
      (item) =>
        (item.report_facility &&
          item.report_facility?.name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.incident_type &&
          item.incident_type.toLowerCase().includes(string.toLowerCase()))
    );

    if (results.length < 1) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }

    setSearchResults(results);
    setCurrentPage(1); // Reset to first page when searching
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
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/workplace-violence/`
        );
        if (response.status === 200) {
          const formattedData = response.data.map((item) => ({
            ...item,
            date_of_incident: formatDate(item.date_of_incident),
          }));
          setIncidentData(formattedData);
          setData(formattedData);
          setIsFetching(false);
        }
      } catch (error) {
        if (error.response) {
          setErrorFetching(error.response.data.error);
          setIsFetching(false);
        } else {
          setErrorFetching("An error occurred while fetching incident data.");
          setIsFetching(false);
        }
      }
    };
    fetchIncidentData();
    setIsFetching(false);
  }, []);

  return isFetching ? (
    <div className="getting-data">
      <p>Getting data..</p>
    </div>
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
                <p>{incidentData.length} incident(s) available </p>
              </div>
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
                      <button onClick={clearFilters} className="outline-button">
                        <X size={20} variant={"stroke"} />
                        Clear
                      </button>
                      <button
                        onClick={applyFilters}
                        className="secondary-button"
                      >
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
              <input
                onChange={(e) => {
                  search(e.target.value);
                }}
                type="search"
                name="systemSearch"
                id="systemSearch"
                placeholder="Search the system"
              />

              {selectedItems.length > 0 ? (
                <button
                  onClick={() => exportExcel(selectedItems, "wp_incident_list")}
                  className="secondary-button"
                >
                  <File /> <span>Export</span>
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
          </div>

          <div className="incident-list">
            {isSearching ? (
              <div className="search-results">
                {isSearchingTheDatabase ? (
                  <div className="searching_database">
                    <p>Searching database</p>
                  </div>
                ) : currentSearchResults && currentSearchResults.length > 0 ? (
                  <div className="results-table">
                    <div className="results-count">
                      <span className="count">{searchResults.length}</span>{" "}
                      result(s) found
                    </div>
                    <>
                      <WorkPlaceViolenceTable
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

                        {currentSearchResults &&
                          currentSearchResults.map((incident, index) => (
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
                            className={`pagination-button ${
                              currentPage === number ? "active" : ""
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
                  </div>
                ) : (
                  <div className="no-data-found">
                    <p>No data found with your search found</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <WorkPlaceViolenceTable
                  incidentData={currentIncidentData}
                  handleSelectAll={handleSelectAll}
                  selectedItems={selectedItems}
                  handleSelectedItems={handleSelectedItems}
                  handleNonClickableColumnClick={handleNonClickableColumnClick}
                  navigateToModify={navigateToModify}
                  handleRowClick={handleRowClick}
                  setIncidentData={setIncidentData}
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

                  {currentIncidentData &&
                    currentIncidentData.map((incident, index) => (
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
                      className={`pagination-button ${
                        currentPage === number ? "active" : ""
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

const WorkPlaceViolenceTable = ({
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
    console.log(items);
    console.log("sorting items:", sortBy, direction, field);
    const sortByNumber = (field, direction) => {
      return [...items].sort((a, b) => {
        const aValue = a.original_report ? a.original_report : a.id;
        const bValue = b.original_report ? b.original_report : b.id;

        const result = aValue - bValue;
        return direction && direction === "asc" ? result : -result;
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
          <th className="sort-cell">
            ID
            <SortByNumberIcon
              setSortDesc={setSortDesc}
              handleSortById={handleSortById}
              sortDesc={sortDesc}
            />{" "}
          </th>
          <th>Facility</th>
          <th>Type of incident</th>
          <th>
            Physical injury <br /> description
          </th>
          <th className="sort-cell">
            Incident data & time
            <SortDateIcon
              setSortDesc={setDateRecent}
              handleSortById={handleFilterByDate}
              sortDesc={dateRecent}
            />
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
              className={`table-card ${
                selectedItems.includes(incident) ? "selected" : ""
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
              <td>{incident.original_report || incident.id} </td>
              <td>{incident.report_facility?.name || "Not provided"}</td>
              <td>{incident.incident_type || "Not provided"}</td>
              <td>
                <SliceText
                  text={incident.physical_injury_description || "Not provided"}
                  maxLength={20}
                />
              </td>
              <td>
                {(
                  <div>
                    <DateFormatter dateString={incident.date_of_incident} />,{" "}
                    {incident.time_of_incident || "Time not provided"}
                  </div>
                ) || "-"}
              </td>

              <td>{incident.severity_level || "Not Provided"}</td>
              <td>
                <p
                  className={`follow-up ${
                    incident.status === "Draft"
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
  handleRowClick,
  selectedItems,
  handleSelectedItems,
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
      {items}
      <div className="card-content-items">
        <div className="item">
          <label htmlFor="">Facility: </label>
          <span>{incident?.report_facility?.name || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Incident Type: </label>
          <span>{incident?.incident_type || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Physical injury description: </label>
          <span>{incident?.physical_injury_description}</span>
        </div>
        <div className="item">
          <label htmlFor="">Incident Date & Time: </label>
          <span>
            {(
              <span>
                <DateFormatter dateString={incident?.date_of_incident} />,
                {incident.time_of_incident || "Time not provided"}
              </span>
            ) || "-"}
          </span>
        </div>

        <div className="item">
          <label htmlFor="">Severity: </label>
          <span>{incident?.severity_rating || "Not provided"}</span>
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

export default WorkplaceViolenceList;
