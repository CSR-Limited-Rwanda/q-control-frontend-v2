"use client";
import React, { useState, useEffect } from "react";
import { Square, SquareCheck, X } from "lucide-react";
import api from "@/utils/api";
import { SearchInput } from "@/components/forms/Search";

const AccessPermissions = ({ formData, setFormData, userId, handleClose }) => {
  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [facilityDepartmentSelections, setFacilityDepartmentSelections] =
    useState({});
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [facilitySearch, setFacilitySearch] = useState("");
  const [isFetchingFacilities, setIsFetchingFacilities] = useState(false);
  const [isFetchingDepartments, setIsFetchingDepartments] = useState(false);
  const [isSearchingDepartment, setIsSearchingDepartment] = useState(false);
  const [isSearchingFacility, setIsSearchingFacility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFacilities = async () => {
    setIsFetchingFacilities(true);
    try {
      const response = await api.get("/facilities/");
      if (response.status === 200) {
        const formatted = response.data.map((f) => ({
          value: f.id,
          label: f.name,
        }));
        setFacilities(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch facilities:", err);
    } finally {
      setIsFetchingFacilities(false);
    }
  };

  const fetchDepartments = async (facilityId) => {
    setIsFetchingDepartments(true);
    try {
      const response = await api.get(`/departments/?facility_id=${facilityId}`);
      if (response.status === 200) {
        const formatted = response.data.map((d) => ({
          value: d.id,
          label: d.name,
        }));
        setDepartments(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch departments:", err);
    } finally {
      setIsFetchingDepartments(false);
    }
  };

  const toggleFacilities = (id) => {
    setSelectedFacilities((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((fid) => fid !== id)
        : [...prev, id];

      if (updated.includes(id)) {
        setSelectedFacility(id);
      } else {
        if (updated.length > 0) {
          setSelectedFacility(updated[updated.length - 1]);
        } else {
          setSelectedFacility(null);
          setDepartments([]);
        }
      }

      return updated;
    });
  };

  const toggleDepartment = (facilityId, departmentId) => {
    setFacilityDepartmentSelections((prev) => {
      const selected = prev[facilityId] || [];
      const updated = selected.includes(departmentId)
        ? selected.filter((id) => id !== departmentId)
        : [...selected, departmentId];

      return {
        ...prev,
        [facilityId]: updated,
      };
    });
  };

  const filteredFacilities = facilities.filter((f) =>
    f.label.toLowerCase().includes(facilitySearch.toLowerCase())
  );

  const filteredDepartments = departments.filter((d) =>
    d.label.toLowerCase().includes(departmentSearch.toLowerCase())
  );

  const handleSave = async () => {
    const payload = {
      access_to_facilities: selectedFacilities,
      access_to_department: Object.values(
        facilityDepartmentSelections || {}
      ).flat(),
    };

    try {
      setIsLoading(true);
      const response = await api.put(`/users/${userId}/`, payload);
      if (response.status === 200) {
        console.log("Data saved successfully");
        // window.location.reload();
      }
    } catch (error) {
      console.error("Failed to save:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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
      facilityDepartmentSelections,
    }));
  }, [selectedFacilities, facilityDepartmentSelections]);

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="close" onClick={handleClose}>
          <X size={32} />
        </div>
        <div className="card" style={{ marginTop: "20px" }}>
          <div className="form-group">
            <label>Access to facilities</label>
            <SearchInput
              value={facilitySearch}
              setValue={setFacilitySearch}
              isSearching={isSearchingFacility}
            />
            {filteredFacilities.map((facility) => {
              const selected = selectedFacilities.includes(facility.value);
              return (
                <div
                  key={facility.value}
                  onClick={() => toggleFacilities(facility.value)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    margin: "4px 0",
                    gap: "8px",
                  }}
                >
                  {selected ? <SquareCheck /> : <Square />}
                  <span>{facility.label}</span>
                </div>
              );
            })}
          </div>

          <div className="form-group">
            <label>Access to departments</label>
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
                        facilityDepartmentSelections[
                          selectedFacility
                        ]?.includes(value);
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

          <button onClick={handleSave} style={{ marginTop: "1rem" }}>
            {isLoading ? "Saving..." : "Save Access Permissions"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessPermissions;
