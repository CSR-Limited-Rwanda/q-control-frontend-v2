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

function formatTimeWithAMPM(timeString) {
  // Parse the time string into hours, minutes, and seconds
  const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Calculate AM/PM
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Format the time string
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
}

const handleSearch = (items, searchString) => {
  if (searchString.length > 2) {
    const results = items.filter((item) => {
      return (
        item.patient_name.toLowerCase().includes(searchString.toLowerCase()) ||
        item.incident_type_outcome[0]?.outcome_type
          .toLowerCase()
          .includes(searchString.toLowerCase())
      );
    });
    return results;
  }

  return [];
};

function DrugReactionList() {
  const router = useRouter();
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [drugReactionData, setDrugReactionData] = useState([]);
  const [searchResults, setSearchResults] = useState("");
  const [resultsFound, setResultsFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);

  //filters
  const [filterByOutcome, setFilterByOutcome] = useState("");
  const [filterByDate, setFilterByDate] = useState("");
  const [data, setData] = useState([]); // To hold the table data // To hold filtered data
  const [filters, setFilters] = useState({
    end_date: "",
    start_date: "",
    status: "",
    outcome_type: "",
    patient_type: "",
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Handle filter application
  const applyFilters = () => {
    setIsSearching(true);
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.date_of_adverse_reaction);
      const startDate = filters.start_date
        ? new Date(filters.start_date)
        : null;
      const endDate = filters.end_date ? new Date(filters.end_date) : null;

      const withinDateRange =
        (!startDate || incidentDate >= startDate) &&
        (!endDate || incidentDate <= endDate);

      return (
        withinDateRange &&
        (!filters.status?.toLowerCase() ||
          item.status?.toLowerCase() === filters.status?.toLowerCase()) &&
        (!filters?.outcome_type.toLowerCase() ||
          item?.outcome_type.toLowerCase() ===
            filters?.outcome_type.toLowerCase()) &&
        (!filters?.patient_type.toLowerCase() ||
          item?.patient_type.toLowerCase() ===
            filters?.patient_type.toLowerCase())
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
      date_of_adverse_reaction: "",
      status: "",
      outcome_type: "",
      patient_type: "",
    });
    setIsSearching(false);
    toggleOpenFilters(); // Reset filtered data to all data
  };

  // row click
  const handleRowClick = (drugReactionId) => {
    router.push(`/incident/drug-reaction/${drugReactionId}`);
  };
  const navigateToModify = (drugReactionId) => {
    router.push(`/incident/drug-reaction/${drugReactionId}/modify/`);
    return;
  };

  // allow actions column to be not clickable
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
          item.id.toString().toLowerCase().includes(string.toLowerCase()))
    );
    if (results.length < 0) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }
    setSearchResults(results);
  };

  useEffect(() => {
    const fetchDrugReactionData = async () => {
      try {
        setIsFetching(true);
        const response = await api.get(
          `${API_URL}/incidents/adverse-drug-reaction/`
        );
        if (response.status === 200) {
          console.log(response.data);
          setDrugReactionData(response.data);
          setIsFetching(false);
          setData(response.data);
        }
      } catch (error) {
        console.error(error);
        if (error.response.data.error) {
          setErrorFetching(error.response.data.error);
          setIsFetching(false);
        } else {
          setErrorFetching("An error occurred while fetching incident data.");
          setIsFetching(false);
        }
      }
    };
    fetchDrugReactionData();
    setIsFetching(false);
  }, []);

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
                <h2 className="title">Anaphylaxis/Adverse Drug Reaction </h2>
                <p>{drugReactionData?.length} incident available </p>
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
                      options={["mild", "moderate", "severe"]}
                      placeholder={"Filter by incident outcome"}
                      selected={filters.outcome_type}
                      setSelected={(value) =>
                        setFilters({
                          ...filters,
                          outcome_type: value,
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
                // value={searchString}
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
                      <DrugReactionTable
                        incidentData={searchResults}
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
                          {" "}
                          {selectedItems === searchResults ? (
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
                <DrugReactionTable
                  incidentData={drugReactionData}
                  setIncidentData={setDrugReactionData}
                  handleNonClickableColumnClick={handleNonClickableColumnClick}
                  handleRowClick={handleRowClick}
                  navigateToModify={navigateToModify}
                  selectedItems={selectedItems}
                  handleSelectedItems={handleSelectedItems}
                  handleSelectAll={handleSelectAll}
                />
                <div className="mobile-table">
                  <button
                    onClick={() => handleSelectAll(drugReactionData)}
                    type="button"
                    className="tertiary-button"
                  >
                    {" "}
                    {selectedItems === drugReactionData ? (
                      <SquareCheck />
                    ) : (
                      <Square />
                    )}{" "}
                    Select all
                  </button>

                  {drugReactionData &&
                    drugReactionData.map((incident, index) => (
                      <IncidentTableCard
                        key={index}
                        incident={incident}
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
  );
}

export default DrugReactionList;

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
            ID{" "}
            <SortByNumberIcon
              setSortDesc={setSortDesc}
              handleSortById={handleSortById}
              sortDesc={sortDesc}
            />{" "}
          </th>
          <th>Facility</th>
          <th className="sort-cell">
            Patient/Visitor Name{" "}
            <SortNameIcon
              handleSortById={handleSortByName}
              sortDesc={nameAZ}
              setSortDesc={setNameAZ}
            />
          </th>
          <th>Outcome</th>
          <th className="sort-cell">
            Date & Time{" "}
            <SortDateIcon
              setSortDesc={setDateRecent}
              handleSortById={handleFilterByDate}
              sortDesc={dateRecent}
            />
          </th>
          <th>Severity</th>
          <th>Care Level</th>
          <th>Status</th>
          <th className="action-col">Action</th>
        </tr>
      </thead>
      <tbody>
        {incidentData?.map((data, index) => (
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
            <td>
              <div onClick={() => handleSelectedItems(data)} className="icon">
                {selectedItems.includes(data) ? (
                  <SquareCheck color="orange" />
                ) : (
                  <Square />
                )}
              </div>
            </td>

            <td>{index + 1}</td>
            <td>{data.original_report || data.id} </td>
            <td>{data?.report_facility?.name || "Not provided"}</td>
            <td>
              {data.patient_name?.last_name || data.patient_name?.first_name
                ? `${data.patient_name?.last_name} ${data.patient_name?.first_name}`
                : "Not provided"}
            </td>
            <td>{data.outcome_type || "Not Provided"}</td>
            <td>
              {(
                <div>
                  <DateFormatter dateString={data.date_of_adverse_reaction} />,{" "}
                  {data.incident_time}
                </div>
              ) || "-"}
            </td>

            <td>{data.severity_rating || "Not specified"}</td>

            <td>{data.patient_type || "Not specified"}</td>
            <td>
              {" "}
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
            <td
              onClick={(event) => handleNonClickableColumnClick(event)}
              className="action-col"
            >
              <div className="table-actions">
                {!data.is_resolved && (
                  <Pencil
                    size={20}
                    onClick={() =>
                      navigateToModify(
                        data.original_report ? data.original_report : data.id
                      )
                    }
                  />
                )}

                <Eye
                  size={20}
                  onClick={() =>
                    handleRowClick(
                      data.original_report ? data.original_report : data.id
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
          <label htmlFor="">Patient/Visitor Name: </label>
          <span>
            {`${incident.patient_name?.last_name} ${incident.patient_name?.first_name}` ||
              "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Outcome: </label>
          <span>{incident?.outcome_type}</span>
        </div>
        <div className="item">
          <label htmlFor="">Date & Time: </label>
          <span>
            {" "}
            {(
              <span>
                <DateFormatter
                  dateString={incident?.date_of_adverse_reaction}
                />
                , &nbsp; {incident?.incident_time}
              </span>
            ) || "-"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Severity: </label>
          <span>{incident?.severity_rating || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Care Level: </label>
          <span>{incident?.patient_type || "Not provided"}</span>
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
