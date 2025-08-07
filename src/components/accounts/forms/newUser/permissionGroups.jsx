"use client";
import React, { useEffect, useCallback } from "react";
import { useState } from "react";
import { LoaderCircle, Search, Square, SquareCheck, X } from "lucide-react";
import api from "@/utils/api";
import { SearchInput } from "@/components/forms/Search";

const PermissionGroups = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [groups, setGroups] = useState([]);
  const [addToPermissionGroups, setAddToPermissionGroups] = useState(true);
  const [hasReviewPermissions, setHasReviewPermissions] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const isFocused = document.activeElement;
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);

  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isFetchingDepartments, setIsFetchingDepartments] = useState(false);
  const [isFetchingFacilities, setIsFetchingFacilities] = useState(false);
  const [facilityDepartmentSelections, setFacilityDepartmentSelections] =
    useState({});
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [facilitySearch, setFacilitySearch] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingDepartment, setIsSearchingDepartment] = useState(false);
  const [isSearchingFacility, setIsSearchingFacility] = useState(false);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/permissions/?search=${searchQuery}`);
      setGroups(response.data);
    } catch (error) {
      setErrorMessage("Failed to fetch groups");

    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const toggleFacilities = (id) => {
    setSelectedFacilities((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];

      if (updated.includes(id)) {
        setSelectedFacility(id); // Newly selected facility gets its departments shown
      } else {
        if (updated.length > 0) {
          setSelectedFacility(updated[updated.length - 1]); // Show departments from most recently selected
        } else {
          setSelectedFacility(null); // No facility selected
          setDepartments([]); // Clear departments
        }
      }

      return updated;
    });
  };
  const toggleDepartment = (facilityId, departmentId) => {
    setFacilityDepartmentSelections((prevSelections) => {
      const currentSelections = prevSelections[facilityId] || [];
      const isAlreadySelected = currentSelections.includes(departmentId);
      return {
        ...prevSelections,
        [facilityId]: isAlreadySelected
          ? currentSelections.filter((id) => id !== departmentId)
          : [...currentSelections, departmentId],
      };
    });
  };

  const fetchFacilities = async () => {
    setIsFetchingFacilities(true);
    try {
      const response = await api.get("/facilities/");
      if (response.status === 200) {
        const formattedFacilities = response.data.map((facility) => ({
          value: facility.id,
          label: facility.name,
        }));
        setFacilities(formattedFacilities);
      }
    } catch (error) {
      console.error("Error fetching facilities:", error);
    } finally {
      setIsFetchingFacilities(false);
    }
  };
  const fetchDepartments = async (facilityId) => {
    setIsFetchingDepartments(true);
    try {
      const response = await api.get(`/departments/?facility_id=${facilityId}`);
      if (response.status === 200) {
        const formattedDepartments = response.data.results.map((department) => ({
          value: department.id,
          label: department.name,
        }));
        setDepartments(formattedDepartments);
      }
    } catch (error) {
      console.error("Error fetching departments:", error);
    } finally {
      setIsFetchingDepartments(false);
    }
  };
  const filteredDepartments = departments.filter(({ label }) =>
    label.toLowerCase().includes(departmentSearch.toLowerCase())
  );
  const filteredFacilities = facilities.filter(({ label }) =>
    label.toLowerCase().includes(facilitySearch.toLowerCase())
  );
  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/permissions/");
      setPermissions(response.data);
    } catch (error) {

      setErrorMessage("Failed to fetch permissions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.length >= 3) {
      setIsSearching(true);
      fetchGroups();
    } else if (searchQuery.length === 0 && isFocused) {
      setIsSearching(true);
      fetchGroups();
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleCheckPermissionGroup = (group) => {
    setFormData((prevData) => {
      const isGroupSelected = prevData.permissionGroups.some(
        (item) => item.id === group.id
      );
      const updatedGroups = isGroupSelected
        ? prevData.permissionGroups.filter((item) => item.id !== group.id)
        : [...prevData.permissionGroups, group];

      return {
        ...prevData,
        permissionGroups: updatedGroups,
      };
    });
  };

  const handleHasReviewPermissions = () => {
    setFormData((prevData) => ({
      ...prevData,
      hasReviewPermissions: !prevData.hasReviewPermissions,
    }));
  };

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      handleSearch();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    fetchGroups();
    fetchFacilities();
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      fetchDepartments(selectedFacility);
      setDepartmentSearch("");
    }
  }, [selectedFacility]);
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      selectedFacilities,
    }));
  }, [selectedFacilities]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      facilityDepartmentSelections,
    }));
  }, [facilityDepartmentSelections]);

  useEffect(() => {

  }, [formData.selectedFacilities, formData.facilityDepartmentSelections]);
  useEffect(() => {

  }, [formData.permissionGroups]);

  return (
    <div className="form">
      <div className="card">
        <div className="form-group">
          <label htmlFor="permissionLevel">Access to facilities</label>
          <SearchInput
            value={facilitySearch}
            setValue={setFacilitySearch}
            isSearching={isSearchingFacility}
          />
          {filteredFacilities.map((facility, index) => {
            const selected = selectedFacilities.includes(
              Number(facility.value)
            );
            return (
              <div
                key={index}
                onClick={() => toggleFacilities(Number(facility.value))}
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  gap: "5px",
                  margin: "4px 0",
                }}
              >
                {selected ? <SquareCheck /> : <Square />}
                <span style={{ marginLeft: "8px" }}>{facility.label}</span>
              </div>
            );
          })}
        </div>
        <div className="form-group">
          <label htmlFor="departmentAccess">Access to departments</label>
          {selectedFacilities.length === 0 ? (
            <p>
              No department found, check facilities to see their departments.
            </p>
          ) : (
            <>
              <SearchInput
                value={departmentSearch}
                setValue={setDepartmentSearch}
                isSearching={isSearchingDepartment}
              />
              <div style={{ marginTop: "12px" }}>
                {isFetchingDepartments ? (
                  <p>Loading departments...</p>
                ) : filteredDepartments.length > 0 ? (
                  filteredDepartments.map(({ value, label }) => {
                    const checked =
                      facilityDepartmentSelections[selectedFacility]?.includes(
                        value
                      );
                    return (
                      <div
                        key={value}
                        onClick={() =>
                          toggleDepartment(selectedFacility, value)
                        }
                        style={{
                          display: "flex",
                          alignItems: "center",
                          cursor: "pointer",
                          margin: "4px 0",
                        }}
                      >
                        {checked ? <SquareCheck /> : <Square />}
                        <span style={{ marginLeft: "8px" }}>{label}</span>
                      </div>
                    );
                  })
                ) : (
                  <p>No departments found.</p>
                )}
              </div>
            </>
          )}
        </div>

        <div className="check-box" onClick={handleHasReviewPermissions}>
          {formData.hasReviewPermissions ? <SquareCheck /> : <Square />}
          <label htmlFor="hasReviewPermissions">Has review permissions</label>
        </div>
        <div
          className="check-box"
          onClick={() => setAddToPermissionGroups(!addToPermissionGroups)}
        >
          {addToPermissionGroups ? <SquareCheck /> : <Square />}
          <label htmlFor="addToPermissionGroups">
            Add to permission groups
          </label>
        </div>
      </div>
      {addToPermissionGroups ? (
        <>
          <div className="card permission-groups">
            <SearchInput
              value={searchQuery}
              setValue={setSearchQuery}
              isSearching={isSearching}
            />
            <h3>Permission Roles</h3>
            {isLoading && groups.length < 1 ? (
              <p>Loading...</p>
            ) : errorMessage ? (
              <p>{errorMessage}</p>
            ) : (
              <div>
                {groups.map((group) => (
                  <div
                    onClick={() => handleCheckPermissionGroup(group)}
                    className="group check-box"
                    key={group.id}
                  >
                    {formData.permissionGroups.some(
                      (item) => item.id === group.id
                    ) ? (
                      <SquareCheck />
                    ) : (
                      <Square />
                    )}
                    <p>{group.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="permissions-list">
          <h3>Permissions</h3>
        </div>
      )}
    </div>
  );
};

export default PermissionGroups;
