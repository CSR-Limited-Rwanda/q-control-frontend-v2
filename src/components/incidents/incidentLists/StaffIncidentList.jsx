import React, { useEffect, useState } from "react";
// import "../../assets/css/main/main.css";
import api, { API_URL, exportExcel } from "@/utils/api";

// import TableActionsPopup from "../general/popups/tableActionPopup";
// import { usePermission } from "../../contexts/permissionsContext";
// import NoAccessPage from "../../pages/errorPages/401";

import { useRouter } from "next/navigation";
// import SliceText from "../general/sliceText";
import DateFormatter from "@/components/DateFormatter";
import ModifyPageLoader from "@/components/loader";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import UserPermissions from "@/components/accounts/profile/userPermissions";
import { usePermission } from "@/context/PermissionsContext";

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

const handleSearch = (items, searchString) => {
  if (searchString.length > 2) {
    const results = items.filter((item) => {
      return (
        item.patient.toLowerCase().includes(searchString.toLowerCase()) ||
        item.incident_type.toLowerCase().includes(searchString.toLowerCase()) ||
        item.follow_up.toLowerCase().includes(searchString.toLowerCase())
      );
    });
    return results;
  }
  return [];
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(0);
  return `${year}-${month}-${day}`;
}

const StaffIncidentList = () => {
  //   const permission = usePermission();
  const [errorFetching, setErrorFetching] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [incidentData, setIncidentData] = useState([]);
  const [searchResults, setSearchResults] = useState("");
  const [resultsFound, setResultsFound] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filterByDate, setFilterByDate] = useState(false);

  const [selectedItems, setSelectedItems] = useState([]);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);

  const [openAction, setOpenAction] = useState(false);
  const [openActionIndex, setOpenActionIndex] = useState("");

  const router = useRouter();

  const [data, setData] = useState([]); // To hold the table data // To hold filtered data
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",

    status: "",
  });
  const [openFilters, setOpenFilters] = useState(false);

  // Handle filter application
  const applyFilters = () => {
    const newFilteredData = data.filter((item) => {
      const incidentDate = new Date(item.date_of_injury_or_near_miss);
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
  const toggleAction = (index) => {
    setOpenActionIndex(index);
    setOpenAction(!openAction);
  };

  const handleRowClick = (incidentId) => {
    router.push(`/incident/staff/${incidentId}`);
  };
  const navigateToModify = (incidentId) => {
    router.push(`/incident/staff/${incidentId}/update/`);
    localStorage.setItem("staffIncidentId", incidentId)
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
    if (results.length < 1) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }
    console.log(string, incidentData, results);
    setSearchResults(results);
  };

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await api.get(`${API_URL}/incidents/staff-incident/`);
        if (response.status === 200) {
          // Format the dates before setting the state
          // console.log(response.data)
          const formattedData = response.data.map((item) => ({
            ...item,
            date_of_injury_or_near_miss: formatDate(
              item.date_of_injury_or_near_miss
            ),
          }));
          setIncidentData(formattedData);
          setIsFetching(false);
          setData(formattedData);
          console.log(response.data);
        }
      } catch (error) {
        if (error.response) {
          setErrorFetching(error.response.data.error);
        } else {
          setErrorFetching("An error occurred while fetching incident data.");
        }
        setIsFetching(false);
        console.log(error);
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
                  <h2 className="title">Staff Incident Report</h2>
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
                  placeholder="Search by facility, staff name"
                />

                {selectedItems.length > 0 ? (
                  <button
                    onClick={() =>
                      exportExcel(selectedItems, "staff_incident_list")
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

                      <div>
                        <StaffTable
                          incidentData={searchResults}
                          handleRowClick={handleRowClick}
                          selectedItems={selectedItems}
                          handleSelectedItems={handleSelectedItems}
                          handleSelectAll={handleSelectAll}
                          handleNonClickableColumnClick={
                            handleNonClickableColumnClick
                          }
                          setIncidentData={setSearchResults}
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
                                incident={incident}
                                handleRowClick={handleRowClick}
                                handleSelectedItems={handleSelectedItems}
                                selectedItems={selectedItems}
                              />
                            ))}
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
                  <StaffTable
                    incidentData={incidentData}
                    handleNonClickableColumnClick={
                      handleNonClickableColumnClick
                    }
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
                      {" "}
                      {selectedItems === incidentData ? (
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
                          handleSelectedItems={handleSelectedItems}
                          selectedItems={selectedItems}
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

export default StaffIncidentList;

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
  //   const permission = usePermission();
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
            Staff name{" "}
            <SortNameIcon
              handleSortById={handleSortByName}
              sortDesc={nameAZ}
              setSortDesc={setNameAZ}
            />{" "}
          </th>

          {/* <th>Brief description of incident & Type of injury</th> */}
          <th>Claims Notified</th>
          <th className="sort-cell">
            Injury Date & Time
            <SortDateIcon
              setSortDesc={setDateRecent}
              handleSortById={handleFilterByDate}
              sortDesc={dateRecent}
            />
          </th>
          {/* <th>Claim </th> */}
          <th>Claim contact & PH </th>
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
              <td>{employee.original_report || employee.id} </td>
              <td>{employee.report_facility?.name || "Not provided"}</td>
              <td>
                {employee.patient_info?.last_name ||
                employee.patient_info?.first_name
                  ? `${employee.patient_info?.last_name} ${employee.patient_info?.first_name}`
                  : "Not provided"}
              </td>

              {/* <td>
                            {(
                              <SliceText
                                text={employee.incident_description}
                                maxLength={25}
                              />
                            ) || "-"}
                          </td> */}
              <td>{employee.claim || "Not Specified"}</td>
              <td>
                {(
                  <div>
                    <DateFormatter
                      dateString={employee.date_of_injury_or_near_miss}
                    />
                    ,&nbsp;{employee.time_of_injury_or_near_miss}
                  </div>
                ) || "-"}
              </td>
              <td>{employee.claim || "Not Specified"}</td>
              {/* <td>{employee.claim || "Not Specified"}</td> */}
              {/* header add - claims */}
              <td>
                {" "}
                <p
                  className={`follow-up ${
                    employee.status === "Draft"
                      ? "in-progress"
                      : employee.status === "Closed"
                      ? "closed"
                      : "Open"
                  }`}
                >
                  {employee.status || "Not specified"}
                </p>
              </td>
              {/* <td
                            onClick={() => toggleAction(index)}
                            className="action-col"
                          >
                            <MoreHorizontalSquare01Icon
                              size={24}
                              variant={"stroke"}
                            />
                            {openAction && openActionIndex === index ? (
                              <TableActionsPopup
                                incidentId={employee.id}
                                detailPageLink={"/incident/employee_incident"}
                                deleteAPI={""}
                                editPageLink={""}
                              />
                            ) : (
                              ""
                            )}
                          </td> */}
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
  handleSelectedItems,
  selectedItems,
}) => {
  //   const permission = usePermission();
  return (
    <div className="table-card">
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
          <label htmlFor="">Staff Name: </label>
          <span>{incident?.name || "Not provided"}</span>
        </div>

        <div className="item">
          <label htmlFor="">Injury Date & Time: </label>
          <span>
            {" "}
            {(
              <span>
                <DateFormatter
                  dateString={incident?.date_of_injury_or_near_miss}
                />
                , &nbsp; {incident?.time_of_injury_or_near_miss}
              </span>
            ) || "-"}
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
            className={`follow-up ${
              incident?.status === "Draft"
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

export const SortNameIcon2 = ({ handleSortById, sortDesc, setSortDesc }) => {
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
