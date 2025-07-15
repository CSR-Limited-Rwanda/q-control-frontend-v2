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
  SortNameIcon2,
} from "./StaffIncidentList";

const handleSearch = (items, searchString) => {
  if (searchString.length > 2) {
    const results = items.filter((item) => {
      return (
        item.person_taking_report &&
        item.person_taking_report
          .toLowerCase()
          .includes(searchString.toLowerCase())
        // (item.incident_type && item.incident_type.toLowerCase().includes(searchString.toLowerCase())) ||
        // (item.follow_up && item.follow_up.toLowerCase().includes(searchString.toLowerCase()))
      );
    });
    return results;
  }
  return [];
};

const formatTime = (timeString) => {
  const [hours, minutes, seconds] = timeString.split(":");
  return `${hours}:${minutes}:${seconds.split(".")[0]}`; // Exclude milliseconds
};

const LostAndFoundList = () => {
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  // const [filterByDate, setFilterByDate] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [openActionIndex, setOpenActionIndex] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);

  // filters
  const [filterByType, setFilterByType] = useState("");
  const [filterByStatus, setFilterByStatus] = useState("");
  const [filterByCareLevel, setFilterByCareLevel] = useState("");

  const [filterByDate, setFilterByDate] = useState();
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

  // Handle filter application
  const applyFilters = () => {
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.date_reported);
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
    setIncidentData(newFilteredData); // Update filtered data state
    toggleOpenFilters();
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
    });
    setIncidentData(data); // Reset filtered data to all data
  };

  const handleRowClick = (incidentId) => {
    router.push(`/incident/lost_and_found/${incidentId}`);
  };
  const navigateToModify = (incidentId) => {
    router.push(`/incident/lost_and_found/${incidentId}/modify/`);
  };

  const handleNonClickableColumnClick = (event) => {
    event.stopPropagation();
  };

  const search = (string) => {
    setIsSearching(true);
    const results = incidentData.filter(
      (item) =>
        (item.person_taking_report &&
          item.person_taking_report
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.report_facility?.name &&
          item.report_facility?.name
            .toLowerCase()
            .includes(string.toLowerCase())) ||
        (item.name_of_person_reporting_loss &&
          item.name_of_person_reporting_loss
            .toLowerCase()
            .includes(string.toLowerCase()))
    );

    if (results.length < 0) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }
    console.log(
      "Lost and found: ",
      results.length,
      " in ",
      incidentData.length
    );
    setSearchResults(results);
  };

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await api.get(`${API_URL}/incidents/lost-found/`);
        if (response.status === 200) {
          const formattedData = response.data.map((item) => ({
            ...item,
            date_reported: formatDate(item.date_reported),
          }));
          console.log("API Response:", response.data);
          setIncidentData(formattedData);
          setData(formattedData);
        } else {
          setErrorFetching(`Error fetching data: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching incident data:", error);
        if (error.response && error.response.data.error) {
          setErrorFetching(error.response.data.error);
        } else {
          setErrorFetching("An error occurred while fetching incident data.");
        }
      } finally {
        setIsFetching(false);
      }
    };
    fetchIncidentData();
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
    <div className="getting-data">
      <p>Getting data...</p>
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
                <h2 className="title">Lost & Found Property report</h2>
                <p>{incidentData.length} incidents available</p>
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
                // value={searchString}
                type="search"
                name="systemSearch"
                id="systemSearch"
                placeholder="Search the system"
              />

              {selectedItems.length > 0 ? (
                <button
                  onClick={() =>
                    exportExcel(selectedItems, "lost_and_found_incident_list")
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
                        <LostFOundTable
                          incidentData={searchResults}
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
                                handleSelectAll={handleSelectAll}
                              />
                            ))}
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
                  <LostFOundTable
                    incidentData={incidentData}
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
                          handleRowClick={handleRowClick}
                          selectedItems={selectedItems}
                          handleSelectedItems={handleSelectedItems}
                          handleSelectAll={handleSelectAll}
                        />
                      ))}
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

export default LostAndFoundList;
const LostFOundTable = ({
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
          <th>Facility</th>
          <th>
            <div className="sort-cell">
              Date & Time Reported
              <SortDateIcon
                setSortDesc={setDateRecent}
                handleSortById={handleFilterByDate}
                sortDesc={dateRecent}
              />
            </div>
          </th>
          <th>
            <div className="sort-cell">
              Person taking report
              <SortNameIcon
                handleSortById={handleSortByName}
                sortDesc={nameAZ}
                setSortDesc={setNameAZ}
              />{" "}
            </div>
          </th>
          {/* <th>Description of items</th> */}
          <th>
            <div className="sort-cell">
              Person reporting{" "}
              <SortNameIcon2
                handleSortById={handleSortByName2}
                sortDesc={nameAZ2}
                setSortDesc={setNameAZ2}
              />{" "}
            </div>
          </th>
          {/* <th>Items released</th> */}
          {/* <th>Location found</th> */}
          {/* <th>Location disposed</th> */}
          {/* <th>Date items were disposed</th> */}
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
              {/* check box */}

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

              {/* No */}
              <td>{index + 1}</td>
              {/* Incident Id */}
              <td>{incident.original_report || incident.id} </td>
              {/* facility */}
              <td>{incident.report_facility?.name || "Not provided"}</td>
              {/* date time reported */}
              <td>
                {(
                  <div>
                    <DateFormatter dateString={incident.date_reported} />
                    ,&nbsp; {formatTime(incident.time_reported)}
                  </div>
                ) || "-"}
              </td>
              {/* person reporting */}
              <td>
                {" "}
                {`${incident.taken_by?.last_name} ${incident.taken_by?.first_name} ` ||
                  "Not provided"}
              </td>
              {/* person reporting */}
              <td>
                {incident?.reported_by?.last_name ||
                incident?.reported_by?.first_name
                  ? `${incident?.reported_by?.last_name} ${incident?.reported_by?.first_name}`
                  : "Not provided"}
              </td>
              {/* <td>{incident.location_found || "Not provided"}</td> */}

              {/* location */}
              {/* <td>
                {incident.location_returned || "Not provided"}
              </td> */}

              {/* status */}
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
              {/* action */}

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
  handleSelectAll,
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
          <label htmlFor="">Date & Time: </label>
          <span>
            {" "}
            {(
              <span>
                <DateFormatter dateString={incident?.date_reported} />, &nbsp;{" "}
                {incident?.time_reported}
              </span>
            ) || "-"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Person taking report: </label>
          <span>
            {" "}
            {`${incident.taken_by?.last_name} ${incident.taken_by?.first_name}` ||
              "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Person reporting: </label>
          <span>
            {" "}
            {`${incident?.reported_by?.last_name} ${incident?.reported_by?.first_name}` ||
              "Not provided"}
          </span>
        </div>
        <div className="item">
          <label htmlFor="">Location found: </label>
          <span>{incident?.location_found || "Not provided"}</span>
        </div>
        <div className="item">
          <label htmlFor="">Location disposed: </label>
          <span>{incident?.location_returned || "Not provided"}</span>
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
