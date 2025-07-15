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

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(0);
  return `${year}-${month}-${day}`;
}

const MedicationErrorList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [medicationData, setMedicationData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterByDate, setFilterByDate] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [openActionIndex, setOpenActionIndex] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const router = useRouter();

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Calculate pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedicationData = medicationData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const currentSearchResults = searchResults.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(
    (isSearching ? searchResults.length : medicationData.length) / itemsPerPage
  );
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };

  const applyFilters = () => {
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.date_of_error);
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
    setMedicationData(newFilteredData);
    setCurrentPage(1); // Reset to first page when filters are applied
    toggleOpenFilters();
  };

  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
    });
    setMedicationData(data);
    setCurrentPage(1); // Reset to first page when filters are cleared
  };

  const handleRowClick = (incidentId) => {
    router.push(`/incident/medication_error/${incidentId}`);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incident/medication_error/${incidentId}/modify/`);
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
    const results = medicationData.filter(
      (item) =>
        (item.report_facility?.name &&
          item.report_facility.name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.patient_name &&
          item.patient_name.toLowerCase().includes(string.toLowerCase())) ||
        (item.drug_given &&
          item.drug_given.toLowerCase().includes(string.toLowerCase()))
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
    const fetchMedicationData = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/medication-error/`
        );
        if (response.status === 200) {
          const formattedData = response.data.map((item) => ({
            ...item,
            date_of_error: formatDate(item.date_of_error),
          }));
          setMedicationData(formattedData);
          setData(formattedData);
          setIsFetching(false);
        }
      } catch (error) {
        if (error.response?.data?.error) {
          setErrorFetching(error.response.data.error);
        } else {
          setErrorFetching("An error occurred while fetching incident data.");
        }
        setIsFetching(false);
      }
    };
    fetchMedicationData();
  }, []);

  return isFetching ? (
    <>
      <div className="getting-data">
        <p>Getting data..</p>
      </div>
    </>
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
                  <h2 className="title">Medication Error Tracking List</h2>
                  <p>{medicationData.length} incident(s) available</p>
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
                  {isSearchingTheDatabase ? (
                    <div className="searching-database">
                      <p>Searching database</p>
                    </div>
                  ) : currentSearchResults.length > 0 ? (
                    <div className="results-table">
                      <div className="results-count">
                        <span className="count">{searchResults.length}</span>{" "}
                        result(s) found
                      </div>
                      <div>
                        <MedicationErrorTable
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
                              handleSelectAll={handleSelectAll}
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
                  <MedicationErrorTable
                    incidentData={currentMedicationData}
                    handleNonClickableColumnClick={
                      handleNonClickableColumnClick
                    }
                    handleRowClick={handleRowClick}
                    navigateToModify={navigateToModify}
                    selectedItems={selectedItems}
                    handleSelectedItems={handleSelectedItems}
                    handleSelectAll={handleSelectAll}
                    setIncidentData={setMedicationData}
                  />
                  <div className="mobile-table">
                    <button
                      onClick={() => handleSelectAll(medicationData)}
                      type="button"
                      className="tertiary-button"
                    >
                      {medicationData.every((item) =>
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
                    {currentMedicationData.map((incident, index) => (
                      <IncidentTableCard
                        key={index}
                        incident={incident}
                        handleRowClick={handleRowClick}
                        selectedItems={selectedItems}
                        handleSelectedItems={handleSelectedItems}
                        handleSelectAll={handleSelectAll}
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
    </>
  );
};

const MedicationErrorTable = ({
  incidentData,
  handleRowClick,
  handleNonClickableColumnClick,
  navigateToModify,
  selectedItems,
  handleSelectAll,
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
        const nameA = a.patient?.first_name || "";
        const nameB = b.patient?.first_name || "";
        const result = nameA.localeCompare(nameB);
        return direction === "asc" ? result : -result;
      });
    };

    const sortByDateTime = (field) => {
      return [...items].sort((a, b) => {
        const dateA = new Date(a.date_of_error);
        const dateB = new Date(b.date_of_error);
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
            Patient Name
            <SortNameIcon
              handleSortById={handleSortByName}
              sortDesc={nameAZ}
              setSortDesc={setNameAZ}
            />
          </th>
          <th>MRN</th>
          <th className="sort-cell">
            Date & Time
            <SortDateIcon
              setSortDesc={setDateRecent}
              handleSortById={handleFilterByDate}
              sortDesc={dateRecent}
            />
          </th>
          <th>Category</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {incidentData.length > 0 ? (
          incidentData.map((medication, index) => (
            <tr
              onDoubleClick={() =>
                handleRowClick(
                  medication.original_report
                    ? medication.original_report
                    : medication.id
                )
              }
              key={index}
              className={`table-card ${
                selectedItems.includes(medication) ? "selected" : ""
              }`}
            >
              <td>
                <div
                  onClick={() => handleSelectedItems(medication)}
                  className="icon"
                >
                  {selectedItems.includes(medication) ? (
                    <SquareCheck color="orange" />
                  ) : (
                    <Square />
                  )}
                </div>
              </td>
              <td>{index + 1}</td>
              <td>{medication.original_report || medication.id}</td>
              <td>{medication.report_facility?.name || "Not found"}</td>
              <td>
                {medication.patient?.last_name || medication.patient?.first_name
                  ? `${medication.patient?.last_name} ${medication.patient?.first_name}`
                  : "Not provided"}
              </td>
              <td>{medication?.patient?.medical_record_number || "-"}</td>
              <td>
                <DateFormatter dateString={medication.date_of_error} />,{" "}
                {medication.time_of_error}
              </td>
              <td>
                {(() => {
                  try {
                    const errorCat = medication.error_category;
                    if (!errorCat) return "Not specified";

                    if (typeof errorCat === "string") {
                      const parsed = JSON.parse(errorCat);
                      return parsed?.category ?? "Not specified";
                    }

                    return errorCat.category ?? "Not specified";
                  } catch {
                    return "Not specified";
                  }
                })()}
              </td>
              <td>
                <p
                  className={`follow-up ${
                    medication.status === "Draft"
                      ? "in-progress"
                      : medication.status === "Closed"
                      ? "closed"
                      : "Open"
                  }`}
                >
                  {medication.status || "Not specified"}
                </p>
              </td>
              <td
                onClick={(event) => handleNonClickableColumnClick(event)}
                className="action-col"
              >
                <div className="table-actions">
                  {!medication.is_resolved && (
                    <Pencil
                      size={20}
                      onClick={() =>
                        navigateToModify(
                          medication.original_report
                            ? medication.original_report
                            : medication.id
                        )
                      }
                    />
                  )}
                  <Eye
                    size={20}
                    onClick={() =>
                      handleRowClick(
                        medication.original_report
                          ? medication.original_report
                          : medication.id
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
      {items}
      <div className="card-content-items">
        <div className="item">
          <label htmlFor="">Facility: </label>
          <span>{incident?.report_facility?.name || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">MRN: </label>
          <span>
            {incident?.patient?.medical_record_number || "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Patient Name: </label>
          <span>
            {`${incident.patient?.last_name} ${incident.patient?.first_name}` ||
              "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Date & Time: </label>
          <span>
            <span>
              <DateFormatter dateString={incident?.date_of_error} />,{" "}
              {incident?.time_of_error}
            </span>{" "}
            || "-"
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Category: </label>
          <span>{incident?.error_category || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Med classification: </label>
          <span>{incident?.drug_given || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Nurse patient ratio: </label>
          <span>{incident?.provider_name || "Not provided"}</span>
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

export default MedicationErrorList;
