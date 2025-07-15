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
import SliceText from "@/components/SliceText";
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomSelectInput from "@/components/CustomSelectInput";
import {
  SortByNumberIcon,
  SortDateIcon,
  SortNameIcon,
} from "./StaffIncidentList";

const WorkplaceViolenceList = () => {
  const [incidentData, setIncidentData] = useState([]);
  const [data, setData] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchingTheDatabase, setIsSearchingTheDatabase] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    status: "",
  });

  const [isFetching, setIsFetching] = useState(true);
  const [errorFetching, setErrorFetching] = useState("");

  const router = useRouter();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const currentData = isSearching ? searchResults : incidentData;
  const paginatedData = currentData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const totalPages = Math.ceil(currentData.length / rowsPerPage);

  const handleSelectAll = (items) => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items);
    }
  };

  const handleSelectedItems = (item) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(
        selectedItems.filter((selected) => selected.id !== item.id)
      );
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRowClick = (incidentId) => {
    router.push(`/incident/workplace_violence/${incidentId}`);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/incident/workplace_violence/${incidentId}/modify/`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

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
      setErrorFetching("Error fetching incident data");
      setIsFetching(false);
    }
  };

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
        (!filters.status ||
          item.status.toLowerCase() === filters.status.toLowerCase())
      );
    });
    setIncidentData(newFilteredData);
  };

  const clearFilters = () => {
    setFilters({
      start_date: "",
      end_date: "",
      status: "",
    });
    setIncidentData(data);
  };

  const search = (string) => {
    setIsSearching(true);
    const results = data.filter(
      (item) =>
        item.report_facility?.name
          ?.toLowerCase()
          .includes(string.toLowerCase()) ||
        item.incident_type?.toLowerCase().includes(string.toLowerCase())
    );

    if (results.length === 0) {
      setIsSearchingTheDatabase(true);
      setTimeout(() => {
        setIsSearchingTheDatabase(false);
      }, 3000);
    }

    setSearchResults(results);
  };

  useEffect(() => {
    fetchIncidentData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [incidentData, searchResults]);

  const Pagination = () => (
    <div className="pagination-controls">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((p) => p - 1)}
      >
        Previous
      </button>
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setCurrentPage(i + 1)}
          className={currentPage === i + 1 ? "active" : ""}
        >
          {i + 1}
        </button>
      ))}
      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((p) => p + 1)}
      >
        Next
      </button>
    </div>
  );

  return isFetching ? (
    <p>Loading data...</p>
  ) : errorFetching ? (
    <p>{errorFetching}</p>
  ) : (
    <div className="workplace-violence-list">
      <div className="controls">
        <input
          type="search"
          placeholder="Search incidents..."
          onChange={(e) => search(e.target.value)}
        />
        {selectedItems.length > 0 && (
          <button
            onClick={() =>
              exportExcel(selectedItems, "workplace_violence_incidents")
            }
          >
            <File /> Export Selected
          </button>
        )}
      </div>

      <table>
        <thead>
          <tr>
            <th>
              <div onClick={() => handleSelectAll(paginatedData)}>
                {selectedItems.length === paginatedData.length ? (
                  <SquareCheck />
                ) : (
                  <Square />
                )}
              </div>
            </th>
            <th>No</th>
            <th>ID</th>
            <th>Facility</th>
            <th>Type</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((incident, index) => (
              <tr
                key={index}
                className={selectedItems.includes(incident) ? "selected" : ""}
              >
                <td>
                  <div onClick={() => handleSelectedItems(incident)}>
                    {selectedItems.includes(incident) ? (
                      <SquareCheck color="orange" />
                    ) : (
                      <Square />
                    )}
                  </div>
                </td>
                <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td>{incident.original_report || incident.id}</td>
                <td>{incident.report_facility?.name || "N/A"}</td>
                <td>{incident.incident_type || "N/A"}</td>
                <td>
                  <DateFormatter dateString={incident.date_of_incident} />{" "}
                  {incident.time_of_incident || ""}
                </td>
                <td>{incident.status || "N/A"}</td>
                <td>
                  <Pencil
                    size={18}
                    onClick={() => navigateToModify(incident.id)}
                  />
                  <Eye size={18} onClick={() => handleRowClick(incident.id)} />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>No data found</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination />
    </div>
  );
};

export default WorkplaceViolenceList;

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
            {" "}
            {(
              <span>
                <DateFormatter dateString={incident?.date_of_incident} />,
                &nbsp; {incident.time_of_incident || "Time not provided"}
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
