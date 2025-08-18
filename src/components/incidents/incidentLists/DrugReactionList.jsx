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
import { useGetPermissions } from "@/hooks/fetchPermissions";

function formatTimeWithAMPM(timeString) {
  const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

const DrugReactionList = () => {
  const router = useRouter();
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [drugReactionData, setDrugReactionData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [openFilters, setOpenFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
    outcome_type: "",
    patient_type: "",
  });

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDrugReactionData = drugReactionData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentSearchResults = searchResults.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (isSearching ? searchResults.length : drugReactionData.length) /
      itemsPerPage
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
      if (appliedFilters.outcome_type)
        queryParams.append("outcome_type", appliedFilters.outcome_type);
      if (appliedFilters.patient_type)
        queryParams.append("patient_type", appliedFilters.patient_type);

      const response = await api.get(
        `${API_URL}/incidents/adverse-drug-reaction/?${queryParams.toString()}`
      );
      if (response && response.status === 200 && response.data) {
        const formattedData = response.data.map((item) => ({
          ...item,
          date_of_adverse_reaction: item.date_of_adverse_reaction
            ? new Date(item.date_of_adverse_reaction)
                .toISOString()
                .split("T")[0]
            : item.date_of_adverse_reaction,
        }));
        setDrugReactionData(formattedData);
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
      outcome_type: "",
      patient_type: "",
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
    router.push(`/incidents/drug-reaction/${incidentId}`);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incidents/drug-reaction/${incidentId}/update/`);
    localStorage.setItem("adverseDrugReactionId", incidentId);
  };

  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
  };

  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  const search = (string) => {
    setIsSearching(true);
    const results = drugReactionData.filter(
      (item) =>
        (item.patient_name?.first_name &&
          item.patient_name?.first_name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.id &&
          item.id.toString().toLowerCase().includes(string.toLowerCase())) ||
        (item.outcome_type &&
          item.outcome_type.toLowerCase().includes(string.toLowerCase()))
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

  return (
    <PermissionsGuard model={"adverse_drug_reaction"} codename={"view_list"}>
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
                    <h2 className="title">
                      Anaphylaxis/Adverse Drug Reaction Tracking List
                    </h2>
                    <p>{drugReactionData.length} incident(s) available</p>
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
                          options={["mild", "moderate", "severe"]}
                          placeholder="Filter by incident outcome"
                          selected={filters.outcome_type}
                          setSelected={(value) =>
                            setFilters({ ...filters, outcome_type: value })
                          }
                          name="incidentType"
                          id="incidentType"
                        />
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
                        <CustomSelectInput
                          options={["Inpatient", "Outpatient", "ED", "Visitor"]}
                          placeholder="Filter by care Level"
                          selected={filters.patient_type}
                          setSelected={(value) =>
                            setFilters({ ...filters, patient_type: value })
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
                    placeholder="Search by ID, patient or visitor name or facility"
                  />
                  {selectedItems.length > 0 ? (
                    <button
                      onClick={() => exportExcel(selectedItems, "ard_list")}
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
                        <DrugReactionTable
                          incidentData={currentSearchResults}
                          handleNonClickableColumnClick={
                            handleNonClickableColumnClick
                          }
                          setIncidentData={setSearchResults}
                          handleRowClick={handleRowClick}
                          navigateToModify={navigateToModify}
                          selectedItems={selectedItems}
                          handleSelectedItems={handleSelectedItems}
                          handleSelectAll={handleSelectAll}
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
                      </div>
                    ) : (
                      <div className="no-data-found">
                        <p>No data found with your search</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <DrugReactionTable
                      incidentData={currentDrugReactionData}
                      setIncidentData={setDrugReactionData}
                      handleNonClickableColumnClick={
                        handleNonClickableColumnClick
                      }
                      handleRowClick={handleRowClick}
                      navigateToModify={navigateToModify}
                      selectedItems={selectedItems}
                      handleSelectedItems={handleSelectedItems}
                      handleSelectAll={handleSelectAll}
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
      )}
    </PermissionsGuard>
  );
};

const DrugReactionTable = ({
  incidentData,
  handleNonClickableColumnClick,
  handleRowClick,
  navigateToModify,
  handleSelectAll,
  selectedItems,
  handleSelectedItems,
  setIncidentData,
}) => {
  const { permissions } = useGetPermissions();
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
        const dateA = new Date(a.date_of_adverse_reaction);
        const dateB = new Date(b.date_of_adverse_reaction);
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
              Patient/Visitor Name
              <SortNameIcon
                handleSortById={handleSortByName}
                sortDesc={nameAZ}
                setSortDesc={setNameAZ}
              />
            </div>
          </th>
          <th>Outcome</th>
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
          <th>Severity</th>
          <th>Care Level</th>
          <th>Status</th>
          {(permissions?.adverse_drug_reaction?.includes("change_incident") ||
            permissions?.adverse_drug_reaction?.includes("view_details")) && (
            <th className="action-col">Action</th>
          )}
        </tr>
      </thead>
      <tbody>
        {incidentData.length > 0 ? (
          incidentData.map((data, index) => (
            <tr
              onDoubleClick={() =>
                handleRowClick(
                  data.original_report ? data.original_report : data.id
                )
              }
              key={index}
              className={`table-card ${
                selectedItems.includes(data) ? "selected" : ""
              }`}
            >
              <td data-label="Select">
                <div onClick={() => handleSelectedItems(data)} className="icon">
                  {selectedItems.includes(data) ? (
                    <SquareCheck color="orange" />
                  ) : (
                    <Square />
                  )}
                </div>
              </td>
              <td data-label="No"> {index + 1}</td>
              <td data-label="ID">{data.original_report || data.id}</td>
              <td data-label="Facility">
                {data?.report_facility?.name || "Not provided"}
              </td>
              <td data-label="Name">
                {data.patient_name?.last_name && data.patient_name?.first_name
                  ? `${data.patient_name?.last_name} ${data.patient_name?.first_name}`
                  : "Not provided"}
              </td>
              <td data-label="Outcome">
                {data.outcome_type || "Not Provided"}
              </td>
              <td data-label="Date & Time">
                <div>
                  <DateFormatter dateString={data.date_of_adverse_reaction} />,{" "}
                  {data.incident_time
                    ? formatTimeWithAMPM(data.incident_time)
                    : "-"}
                </div>
              </td>
              <td data-label="Severity">
                {data.severity_rating || "Not specified"}
              </td>
              <td data-label="Care Level">
                {data.patient_type || "Not specified"}
              </td>
              <td data-label="Status">
                <p
                  className={`follow-up ${
                    data.status === "Draft"
                      ? "in-progress"
                      : data.status === "Closed"
                      ? "closed"
                      : "Open"
                  }`}
                >
                  {data.status || "Not specified"}
                </p>
              </td>
              {(permissions?.adverse_drug_reaction?.includes(
                "change_incident"
              ) ||
                permissions?.adverse_drug_reaction?.includes(
                  "view_details"
                )) && (
                <td
                  data-label="Action"
                  onClick={(event) => handleNonClickableColumnClick(event)}
                  className="action-col"
                >
                  <div className="table-actions">
                    <PermissionsGuard
                      model={"adverse_drug_reaction"}
                      codename={"change_incident"}
                      isPage={false}
                    >
                      {!data.is_resolved && (
                        <Pencil
                          size={20}
                          onClick={() =>
                            navigateToModify(
                              data.original_report
                                ? data.original_report
                                : data.id
                            )
                          }
                        />
                      )}
                    </PermissionsGuard>

                    <PermissionsGuard
                      model={"adverse_drug_reaction"}
                      codename={"view_details"}
                      isPage={false}
                    >
                      <Eye
                        size={20}
                        onClick={() =>
                          handleRowClick(
                            data.original_report
                              ? data.original_report
                              : data.id
                          )
                        }
                      />
                    </PermissionsGuard>
                  </div>
                </td>
              )}
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

export default DrugReactionList;
