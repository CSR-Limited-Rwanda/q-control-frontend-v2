"use client";

import toast from "react-hot-toast";
import React, { useState, useEffect, useMemo } from "react";
import {
  MoveRight,
  Notebook,
  PlusCircle,
  PlusIcon,
  ListFilter,
} from "lucide-react";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import AddDepartment from "../forms/department/AddDepartment";
import "../../../styles/facilities/_facilities.scss";
import { format } from "date-fns";
import SortControl from "@/utils/SortControl";
import PermissionsGuard from "@/components/PermissionsGuard";
import { useGetPermissions } from "@/hooks/fetchPermissions";

const DepartmentsPage = () => {
  const { permissions } = useGetPermissions();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    field: "created_at",
    direction: "desc",
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
        toast.error("Error fetching facilities");
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
        toast.error("Error fetching departments");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [selectedFacilityId]);

  // sorting
  const sortedDepartments = useMemo(() => {
    if (!departments) return [];

    const sortableDepartments = [...departments];
    return sortableDepartments.sort((a, b) => {
      if (sortConfig.field === "created_at") {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) return sortConfig.direction === "asc" ? -1 : 1;
      if (nameA > nameB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [departments, sortConfig]);

  const handleSortChange = (config) => {
    setSortConfig(config);
  };

  const handleDepartmentClick = (department_id) => {
    if (permissions && permissions.base?.includes("view_details")) {
      router.push(
        `/facilities/${selectedFacilityId}/departments/${department_id}`
      );
    } else {
      return;
    }
  };

  const handleDepartmentAdded = (newDepartment) => {
    setDepartments((prev) =>
      Array.isArray(prev) ? [...prev, newDepartment] : [newDepartment]
    );
  };

  function formatDate(isoString) {
    return format(new Date(isoString), "dd/MM/yyyy");
  }

  return (
    <PermissionsGuard model="base" codename="view_list">
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

        {!isLoading && selectedFacilityId && (
          <div className="departments">
            <div className="departments-titles">
              <div className="first-col">
                <h3>Departments</h3>
                <p>Available departments</p>
              </div>
              <div className="second-col">
                <PermissionsGuard
                  model="base"
                  codename="add_department"
                  isPage={false}
                >
                  <button onClick={() => setShowAddDepartment(true)}>
                    <PlusIcon />
                    Add department
                  </button>
                </PermissionsGuard>

                <SortControl
                  options={[
                    { value: "name", label: "Name" },
                    { value: "created_at", label: "Date added" },
                  ]}
                  defaultField="created_at"
                  defaultDirection="desc"
                  onChange={handleSortChange}
                />
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
                        <p className="date">
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
    </PermissionsGuard>
  );
};

export default DepartmentsPage;
