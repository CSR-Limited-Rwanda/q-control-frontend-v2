'use client'
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MoveRight, Notebook } from 'lucide-react';
import api from "@/utils/api";
import FacilityDepartments from "@/components/pages/facilities/FacilityDepartments";

const DepartmentsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState();
  const [selectedDepartment, setSelectedDepartment] = useState(null)
  const [errorMessage, setErrorMessage] = useState("");

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
          // console.log(response.data);
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
          <div className="departments-list">
            <div className="department-item">
              <Notebook size={30} className="department-icon" />
              {departments.map((department) => (
                <div key={department.id}>
                  <h3 className="department-title">{department.name}</h3>
                  <p>Members:{department.members}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;