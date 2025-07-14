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

const GeneralPatientVisitorList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const [incidentData, setIncidentData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);

  const [searchResults, setSearchResults] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [openFilters, setOpenFilters] = useState(false);
  const router = useRouter();
  const [startDate, setStartDate] = useState(null);

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
    incident_type: "",
    category: "",
  });

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
  const applyFilters = () => {
    setIsSearching(true);
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.incident_date);
      const startDate = filters.start_date
        ? new Date(filters.start_date)
        : null;
      const endDate = filters.end_date ? new Date(filters.end_date) : null;

      const withinDateRange =
        (!startDate || incidentDate >= startDate) &&
        (!endDate || incidentDate <= endDate);

      return (
        withinDateRange &&
        (!filters?.status?.toLowerCase() ||
          item?.status?.toLowerCase() === filters?.status?.toLowerCase()) &&
        (!filters?.incident_type?.toLowerCase() ||
          item?.incident_type?.toLowerCase() ===
            filters?.incident_type?.toLowerCase()) &&
        (!filters.category.toLowerCase() ||
          item?.category?.toLowerCase() === filters?.category?.toLowerCase())
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

  // Clear filters
  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
      incident_type: "",
      category: "",
    });
    setIsSearching(false); // Reset filtered data to all data
    toggleOpenFilters();
  };

  // row click
  const handleRowClick = (incidentId) => {
    router.push(`/incident/general/${incidentId}`);
  };
  const navigateToModify = (incidentId) => {
    router.push(`/incident/general/${incidentId}/modify/`);
  };

  // allow actions column to be not clickable
  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
  };
  const toggleOpenFilters = () => {
    setOpenFilters(!openFilters);
  };
  const toggleAction = (index) => {
    setOpenAction(!openAction);
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
    if (results.length < 1) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }
    setSearchResults(results);
  };

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await api.get(`${API_URL}/incidents/general-visitor/`);
        if (response && response.status === 200 && response.data) {
          const formattedData = response.data.map((item) => ({
            ...item,
            incident_date: formatDate(item.incident_date),
          }));
          setData(formattedData);

          setIncidentData(formattedData);
          setIsFetching(false);
          console.log(response.data);
        } else {
          setErrorFetching("Unexpected response format.");
          setIsFetching(false);
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          setErrorFetching(error.response.data.error);
        } else {
          setErrorFetching("An error occurred while fetching incident data.");
        }
        setIsFetching(false);
      }
    };
    fetchIncidentData();
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
          <div className="tab-container incidents-tab">
            <div className="tab-header">
              <div className="title-container-action">
                <div className="title-container">
                  <h2 className="title">Incident Tracking List</h2>
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
                        options={["Inpatient", "Outpatient", "ED", "Visitor"]}
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
                  // value={searchString}
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
                    {" "}
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
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="results-table">
                      <div className="results-count">
                        <span className="count">{searchResults.length}</span>{" "}
                        result(s) found
                      </div>
                      <>
                        <GeneralIncidentTable
                          incidentData={searchResults}
                          handleSelectAll={handleSelectAll}
                          selectedItems={selectedItems}
                          handleSelectedItems={handleSelectedItems}
                          handleNonClickableColumnClick={
                            handleNonClickableColumnClick
                          }
                          navigateToModify={navigateToModify}
                          handleRowClick={handleRowClick}
                        />

                        <div className="mobile-table">
                          <button
                            onClick={() => handleSelectAll(searchResults)}
                            type="button"
                            className="tertiary-button"
                          >
                            {" "}
                            {selectedItems === incidentData ? (
                              <SquareCheck />
                            ) : (
                              <Square />
                            )}{" "}
                            Select all
                          </button>

                          {searchResults &&
                            searchResults.map((incident, index) => (
                              <IncidentTableCard
                                key={index}
                                incident={incident}
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
                      <p>No data found with your search found</p>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <GeneralIncidentTable
                    incidentData={incidentData}
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
                  <div className="mobile-table">
                    <button
                      onClick={() => handleSelectAll(incidentData)}
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

                    {incidentData &&
                      incidentData.map((incident, index) => (
                        <IncidentTableCard
                          key={index}
                          incident={incident}
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
          </div>
        )}
      </div>
    </>
  );
};

export default GeneralPatientVisitorList;

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
            />
          </th>
          <th>Type of incident</th>
          <th className="sort-cell">
            Date & Time{" "}
            <SortDateIcon
              setSortDesc={setDateRecent}
              handleSortById={handleFilterByDate}
              sortDesc={dateRecent}
            />
          </th>
          <th>Severity</th>
          <th>Care level</th>
          <th>Status</th>
          <th className="action-col">Action</th>
        </tr>
      </thead>
      <tbody>
        {incidentData.length > 0 &&
          incidentData.map((incident, index) => (
            <tr
              // onDoubleClick={() => handleRowClick(incident.id)}
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
              <td className="tag">
                {incident.original_report || incident.id}{" "}
                {incident.is_modified ? (
                  <div className="tag-data">Edited</div>
                ) : (
                  ""
                )}
              </td>
              <td>{incident.report_facility?.name || "Not provided"}</td>
              <td>
                {incident.patient_visitor?.last_name &&
                incident.patient_visitor?.first_name
                  ? `${incident.patient_visitor?.last_name} ${incident.patient_visitor?.first_name}`
                  : "Not provided"}
              </td>
              <td>{incident.incident_type || "Not provided"}</td>
              <td>
                {(
                  <div>
                    <DateFormatter dateString={incident.incident_date} />
                    ,&nbsp; {incident.incident_time}
                  </div>
                ) || "-"}
              </td>
              <td>{incident.severity_rating || "Not provided"}</td>
              <td>{incident.category || "Not provided"}</td>
              <td>
                {" "}
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
          ))}
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
          <span>{incident.report_facility?.name || "Not provided"}</span>
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

// a function to perform sorting on an array
// we can sort by id(bigger or smaller), facility name (a-z, z-a), date and time (recent, oldest)

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
      return items; // Return unsorted if the sortBy criteria doesn't match
  }
};
