'use client'
import React, { useState, useEffect } from "react";
import { MoveRight, Notebook } from 'lucide-react';
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import AddDepartment from "../forms/department/AddDepartment";
import '../../../styles/facilities/_facilities.scss'

const DepartmentsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [errorMessage, setErrorMessage] = useState("");
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const router = useRouter()

  // Fetch all facilities on mount
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/facilities/`);
        if (response.status === 200) {
          // console.log('facilities', response.data)
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
          setDepartments(response.data);
          console.log(response.data);
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

  const handleDepartmentClick = (department_id) => {
    router.push(`/facilities/${selectedFacilityId}/departments/${department_id}`)
  }

  const handleDepartmentAdded = (newDepartment) => {
    setDepartments(prev => [...prev, newDepartment])
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
              <h3>Departments</h3>
              <p>Available departments</p>
            </div>
            <div className="second-col">
              <button
                onClick={() => setShowAddDepartment(true)}
              >
                Add department
              </button>
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
            {Array.isArray(departments) && departments.length > 0 ?
              departments.map((department) => (
                <div
                  key={department.id} className="department-item"
                  onClick={() => handleDepartmentClick(department.id)}
                >
                  <Notebook size={30} className="department-icon" />
                  <div>
                    <h3 className="department-title">{department.name}</h3>
                    <p>Members: {Array.isArray(department.members) ? department.members.length : department.members}</p>
                  </div>
               
                </div>
              )) : 'No departments found'}
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;