"use client";
import React, { useState, useEffect } from "react";
import { Square, SquareCheck, X } from "lucide-react";
import api from "@/utils/api";
import { SearchInput } from "@/components/forms/Search";

const AccessPermissions = ({
  formData,
  setFormData,
  userId,
  handleClose,
  email,
}) => {
  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState(
    formData.access_to_facilities || []
  );
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [selectedDepartments, setSelectedDepartments] = useState(
    formData.access_to_department || []
  );
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [facilitySearch, setFacilitySearch] = useState("");
  const [isFetchingFacilities, setIsFetchingFacilities] = useState(false);
  const [isFetchingDepartments, setIsFetchingDepartments] = useState(false);
  const [isSearchingDepartment, setIsSearchingDepartment] = useState(false);
  const [isSearchingFacility, setIsSearchingFacility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch facilities
  const fetchFacilities = async () => {
    setIsFetchingFacilities(true);
    try {
      const response = await api.get("/facilities/");
      if (response.status === 200) {
        const formatted = response.data.map((f) => ({
          id: f.id,
          name: f.name,
        }));
        setFacilities(formatted);

        const matched = formatted.filter((f) =>
          formData.access_to_facilities.some((facility) => facility.id === f.id)
        );
        setSelectedFacilities(matched);
        if (matched.length > 0) {
          setSelectedFacility(matched[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch facilities:", err);
    } finally {
      setIsFetchingFacilities(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async (facilityId) => {
    setIsFetchingDepartments(true);
    try {
      const response = await api.get(`/departments/?facility_id=${facilityId}`);
      if (response.status === 200) {
        const formatted = response.data.map((d) => ({
          id: d.id,
          name: d.name,
        }));
        setDepartments(formatted);

        // Merge matched departments with existing selectedDepartments
        const matched = formatted.filter((d) =>
          formData.access_to_department.some((dept) => dept.id === d.id)
        );
        setSelectedDepartments((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          const newSelected = matched.filter((d) => !existingIds.has(d.id));
          return [...prev, ...newSelected];
        });
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    } finally {
      setIsFetchingDepartments(false);
    }
  };

  // Toggle Facility Selection
  const toggleFacility = (facility) => {
    setSelectedFacilities((prev) => {
      const exists = prev.find((f) => f.id === facility.id);
      const updated = exists
        ? prev.filter((f) => f.id !== facility.id)
        : [...prev, facility];

      setSelectedFacility(
        updated.length > 0 ? updated[updated.length - 1] : null
      );
      if (updated.length === 0) {
        setDepartments([]);
      }

      return updated;
    });
  };

  // Toggle Department Selection
  const toggleDepartment = (department) => {
    setSelectedDepartments((prev) => {
      const exists = prev.find((d) => d.id === department.id);
      return exists
        ? prev.filter((d) => d.id !== department.id)
        : [...prev, department];
    });
  };

  const filteredFacilities = facilities.filter((f) =>
    f.name.toLowerCase().includes(facilitySearch.toLowerCase())
  );

  const filteredDepartments = departments.filter((d) =>
    d.name.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  // Save handler
  const handleSave = async () => {
    const payload = {
      access_to_facilities: selectedFacilities.map((f) => f.id),
      access_to_departments: selectedDepartments.map((d) => d.id),
      email: email,
    };

    try {
      setIsLoading(true);
      const response = await api.put(`/users/${userId}/`, payload);
      if (response.status === 200) {
        console.log("Data saved successfully");
        window.location.reload();
        console.log(response.data);
      }
    } catch (error) {
      console.error("Failed to save:", error);
      alert("There was an error");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch facilities on mount
  useEffect(() => {
    fetchFacilities();
  }, []);

  // Fetch departments when selected facility changes
  useEffect(() => {
    if (selectedFacility) {
      fetchDepartments(selectedFacility.id);
      setDepartmentSearch("");
    }
  }, [selectedFacility]);

  // Sync formData with selections
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      access_to_facilities: selectedFacilities,
      access_to_department: selectedDepartments,
    }));
  }, [selectedFacilities, selectedDepartments]);

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Edit Access Permissions</h3>
        <div className="close" onClick={handleClose}>
          <X size={32} />
        </div>
        <div className="card">
          <div className="form-group">
            <label>Access to facilities</label>
            <SearchInput
              value={facilitySearch}
              setValue={setFacilitySearch}
              isSearching={isSearchingFacility}
            />
            {filteredFacilities.map((facility) => {
              const selected = selectedFacilities.some(
                (f) => f.id === facility.id
              );
              return (
                <div
                  key={facility.id}
                  onClick={() => toggleFacility(facility)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    margin: "4px 0",
                    gap: "8px",
                  }}
                >
                  {selected ? <SquareCheck /> : <Square />}
                  <span>{facility.name}</span>
                </div>
              );
            })}
          </div>

          <div className="form-group">
            <label>Access to departments</label>
            {selectedFacilities?.length === 0 ? (
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
                    filteredDepartments.map((department) => {
                      const checked = selectedDepartments.some(
                        (d) => d.id === department.id
                      );
                      return (
                        <div
                          key={department.id}
                          onClick={() => toggleDepartment(department)}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                            margin: "4px 0",
                          }}
                        >
                          {checked ? <SquareCheck /> : <Square />}
                          <span style={{ marginLeft: "8px" }}>
                            {department.name}
                          </span>
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

          <button onClick={handleSave} style={{ marginTop: "1rem" }}>
            {isLoading ? "Saving..." : "Save Access Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessPermissions;
