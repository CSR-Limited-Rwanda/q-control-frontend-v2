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
} from "./StaffIncidentList";
import PermissionsGuard from "@/components/PermissionsGuard";

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(0);
  return `${year}-${month}-${day}`;
}

const GeneralPatientVisitorList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
    incident_type: "",
    category: "",
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

  const fetchFilteredData = async () => {
    try {
      setIsFetching(true);
      const queryParams = new URLSearchParams();
      if (filters.start_date)
        queryParams.append("start_date", filters.start_date);
      if (filters.end_date) queryParams.append("end_date", filters.end_date);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.incident_type)
        queryParams.append("incident_type", filters.incident_type);
      if (filters.category) queryParams.append("category", filters.category);

      const response = await api.get(
        `${API_URL}/incidents/general-visitor/?${queryParams.toString()}`
      );
      if (response && response.status === 200 && response.data) {
        const formattedData = response.data.map((item) => ({
          ...item,
          incident_date: formatDate(item.incident_date),
        }));
        setIncidentData(formattedData);
        setSearchResults([]);
        setIsSearching(false);
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

  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
      incident_type: "",
      category: "",
    });
    setSearchResults([]);
    setIsSearching(false);
    setCurrentPage(1);
    setOpenFilters(false);
    fetchFilteredData();
  };

  const handleRowClick = (incidentId) => {
    router.push(`/incidents/general/${incidentId}`);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incidents/general/${incidentId}/update/`);
    localStorage.setItem("generalIncidentId", incidentId);
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
        (item.patient_visitor?.first_name &&
          item.patient_visitor?.first_name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.patient_visitor?.last_name &&
          item.patient_visitor?.last_name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.incident_type &&
          item.incident_type.toLowerCase().includes(string.toLowerCase())) ||
        (item.follow_up &&
          item.follow_up.toLowerCase().includes(string.toLowerCase())) ||
        (item.report_facility &&
          item.report_facility?.name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.id &&
          item.id.toString().toLowerCase().includes(string.toLowerCase()))
    );
    setSearchResults(results);
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchFilteredData();
  }, []);

  return (
    <PermissionsGuard model={"general_patient_visitor"} codename={"view_list"}>
      {isFetching ? (
        <ModifyPageLoader />
      ) : (
        <>
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
                      <h2 className="title">
                        General Patient Visitor Incident Tracking List
                      </h2>
                      <p>{incidentData.length} incident(s) available</p>
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
                            options={[
                              "Fall related",
                              "Treatment related",
                              "Equipment Malfunction/Defect",
                              "Others",
                              "",
                            ]}
                            placeholder={"Filter by type of incident"}
                            selected={filters.incident_type}
                            setSelected={(value) =>
                              setFilters({
                                ...filters,
                                incident_type: value,
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
                          <CustomSelectInput
                            options={[
                              "Inpatient",
                              "Outpatient",
                              "ED",
                              "Visitor",
                            ]}
                            placeholder={"Filter by care Level"}
                            selected={filters.category}
                            setSelected={(value) =>
                              setFilters({ ...filters, category: value })
                            }
                            name="careLevel"
                            id="careLevel"
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
                              <X size={20} variant={"stroke"} />
                              Clear
                            </button>
                            <button
                              onClick={() => {
                                fetchFilteredData();
                                toggleOpenFilters();
                              }}
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
                      onChange={(e) => search(e.target.value)}
                      type="search"
                      name="systemSearch"
                      id="systemSearch"
                      placeholder="Search by ID, name, facility, or severity"
                    />
                    {selectedItems.length > 0 ? (
                      <button
                        onClick={() =>
                          exportExcel(selectedItems, "general_incident_list")
                        }
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
                      {currentSearchResults.length > 0 ? (
                        <div className="results-table">
                          <div className="results-count">
                            <span className="count">
                              {searchResults.length}
                            </span>{" "}
                            result(s) found
                          </div>
                          <>
                            <GeneralIncidentTable
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
                                onClick={() =>
                                  handlePageChange(currentPage - 1)
                                }
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
                                onClick={() =>
                                  handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                              >
                                Next
                              </button>
                            </div>
                          </>
                        </div>
                      ) : (
                        <div className="no-data-found">
                          <p>No data found with your search</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <GeneralIncidentTable
                        incidentData={currentIncidentData}
                        setIncidentData={setIncidentData}
                        handleSelectAll={handleSelectAll}
                        selectedItems={selectedItems}
                        handleSelectedItems={handleSelectedItems}
                        handleNonClickableColumnClick={
                          handleNonClickableColumnClick
                        }
                        navigateToModify={navigateToModify}
                        handleRowClick={handleRowClick}
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
        </>
      )}
    </PermissionsGuard>
  );
};

const GeneralIncidentTable = ({
  incidentData,
  setIncidentData,
  handleSelectAll,
  selectedItems,
  handleSelectedItems,
  handleNonClickableColumnClick,
  navigateToModify,
  handleRowClick,
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
        const nameA = a.patient_visitor?.first_name || "";
        const nameB = b.patient_visitor?.first_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByDateTime = (field) => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.incident_date);
        const dateB = new Date(b.incident_date);
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
          <th>
            <div className="sort-cell">
              Date & Time
              <SortDateIcon
                setSortDesc={setDateRecent}
                handleSortById={handleFilterByDate}
                sortDesc={dateRecent}
              />
            </div>
          </th>
          <th>Care level</th>
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
              <td data-label="ID" className="tag">
                {incident.original_report || incident.id}
                {incident.is_modified ? (
                  <div className="tag-data">Edited</div>
                ) : (
                  ""
                )}
              </td>
              <td data-label="Facility">
                {incident.report_facility?.name || "Not provided"}
              </td>
              <td data-label="Name">
                {incident.patient_visitor?.last_name &&
                incident.patient_visitor?.first_name
                  ? `${incident.patient_visitor?.last_name} ${incident.patient_visitor?.first_name}`
                  : "Not provided"}
              </td>
              <td data-label="Date & Time">
                <div>
                  <DateFormatter dateString={incident.incident_date} />,{" "}
                  {incident.incident_time || "-"}
                </div>
              </td>
              <td data-label="Care level">
                {incident.severity_rating || "Not provided"}
              </td>
              <td data-label="Status">
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
                data-label="Action"
                onClick={(event) => handleNonClickableColumnClick(event)}
                className="action-col"
              >
                <div className="table-actions">
                  <PermissionsGuard
                    model={"general_patient_visitor"}
                    codename={"change_incident"}
                    isPage={false}
                  >
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
                  </PermissionsGuard>

                  <PermissionsGuard
                    model={"general_patient_visitor"}
                    codename={"view_details"}
                    isPage={false}
                  >
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
                  </PermissionsGuard>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="11">No data found</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default GeneralPatientVisitorList;
