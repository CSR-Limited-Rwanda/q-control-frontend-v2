"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  MoveRight,
  Notebook,
  PlusCircle,
  PlusIcon,
  ListFilter
} from "lucide-react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import AddDepartment from "../forms/department/AddDepartment";
import "../../../styles/facilities/_facilities.scss";
import { format } from "date-fns";

const DepartmentsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: 'name',
    direction: 'asc',
  });
  const router = useRouter();

  // Fetch all facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/facilities/`);
        if (response.status === 200) {
          setFacilities(response.data);
        }
      } catch (error) {
        setErrorMessage("Error fetching facilities");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  // Fetch departments when a facility is selected
  useEffect(() => {
    if (!selectedFacilityId) return;

    const fetchDepartments = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/facilities/departments/`, {
          params: { facility_id: selectedFacilityId },
        });
        if (response.status === 200) {
          setDepartments(response.data.results);
        }
      } catch (error) {
        setErrorMessage("Error fetching departments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [selectedFacilityId]);

  // sorting
  const sortedDepartments = useMemo(() => {
    if (!departments) return []

    const sortableDepartments = [...departments]
    return sortableDepartments.sort((a, b) => {
      if (sortConfig.field === 'created_at') {
        const dateA = new Date(a.created_at)
        const dateB = new Date(b.created_at)
        return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA
      }
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) return sortConfig.direction === 'asc' ? -1 : 1
      if (nameA > nameB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [departments, sortConfig])

  const handleSortChange = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }

  const handleDepartmentClick = (department_id) => {
    router.push(
      `/facilities/${selectedFacilityId}/departments/${department_id}`
    );
  };

  const handleDepartmentAdded = (newDepartment) => {
    setDepartments(prev => Array.isArray(prev) ? [...prev, newDepartment] : [newDepartment]);
  }

  function formatDate(isoString) {
    return format(new Date(isoString), 'dd/MM/yyyy')
  }

  return (
    <div>
      <div className="facility-select">
        <label htmlFor="facility">Select a Facility:</label>
        <select
          id="facility"
          value={selectedFacilityId}
          onChange={(e) => setSelectedFacilityId(e.target.value)}
          disabled={isLoading}
        >
          <option value="">-- Choose a Facility --</option>
          {Array.isArray(facilities) &&
            facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
        </select>
      </div>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      {!isLoading && selectedFacilityId && (
        <div className="departments">
          <div className="departments-titles">
            <div className="first-col">
              <h3>
                Departments
              </h3>
              <p>Available departments</p>
            </div>
            <div className="second-col">
              <button onClick={() => setShowAddDepartment(true)}>
                <PlusIcon />
                Add department
              </button>
              <div className="sort-controls">
                <div>
                  <ListFilter
                    size={24}
                    onClick={() => handleSortChange(sortConfig.field)}
                    className="sort-btn"
                  >
                    {sortConfig.direction === 'asc' ? '↑' : '↓'}
                  </ListFilter>
                </div>
                <select
                  value={sortConfig.field}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="sort-select"
                >
                  <option>Sort By: Name</option>
                  <option>Sort By: Date Added</option>
                </select>
              </div>
            </div>
          </div>
          {showAddDepartment && (
            <AddDepartment
              facilityId={selectedFacilityId}
              onClose={() => setShowAddDepartment(false)}
              onDepartmentAdded={handleDepartmentAdded}
            />
          )}
          <div className="departments-list">
            {sortedDepartments.length > 0
              ? sortedDepartments.map((department) => (
                <div
                  key={department.id}
                  className="department-item"
                  onClick={() => handleDepartmentClick(department.id)}
                >
                  <Notebook size={30} className="department-icon" />
                  <div>
                    <h3 className="department-title">{department.name}</h3>
                    <p
                      className="date"
                    >
                      Created on {formatDate(department.created_at)}
                    </p>
                  </div>
                </div>
              ))
              : "No departments found"}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;
