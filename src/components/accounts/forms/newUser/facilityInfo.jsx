import api from "@/utils/api";
import { ChevronDown, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";

const FacilityInfo = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const [facilities, setFacilities] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [titles, setTitles] = useState([]);
  const [isFetchingFacilities, setIsFetchingFacilities] = useState(false);
  const [isFetchingDepartments, setIsFetchingDepartments] = useState(false);
  const [isFetchingTitles, setIsFetchingTitles] = useState(false);

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
        const formattedDepartments = response.data.map((department) => ({
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

  const fetchTitles = async () => {
    setIsFetchingTitles(true);
    try {
      const response = await api.get(`/titles/`);
      if (response.status === 200) {
        const formattedTitles = response.data.map((title) => ({
          value: title.id,
          label: title.name,
        }));
        setTitles(formattedTitles);
      }
    } catch (error) {
      console.error("Error fetching titles:", error);
    } finally {
      setIsFetchingTitles(false);
    }
  };

  const handleSelectFacility = (facility) => {
    setFormData((prevData) => ({
      ...prevData,
      facility: facility || {},
      department: {},
    }));

    if (facility) {
      fetchDepartments(facility.value); // Use `value` as the facility ID
    }
  };

  const handleSelectDepartment = (department) => {
    setFormData((prevData) => ({
      ...prevData,
      department: department || {},
    }));
  };

  useEffect(() => {
    fetchFacilities();
    fetchTitles();
  }, []);

  return (
    <div className="card">
      <div className="half">
        <div className="form-group">
          <label htmlFor="facility">Primary facility</label>
          <Dropdown
            items={facilities}
            label={formData.facility.label || "Select facility"}
            onSelect={handleSelectFacility}
            isLoading={isFetchingFacilities}
          />
        </div>
        <div className="form-group">
          <label htmlFor="department">Department</label>
          <Dropdown
            items={departments}
            label={formData.department.label || "Select department"}
            onSelect={handleSelectDepartment}
            isLoading={isFetchingDepartments}
          />
        </div>
      </div>
      <div className="half">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <Dropdown
            items={titles}
            label={formData.title.name || "Select title"}
            onSelect={(title) =>
              setFormData((prevData) => ({ ...prevData, title }))
            }
            isLoading={isFetchingTitles}
          />
        </div>
      </div>
    </div>
  );
};

export default FacilityInfo;

const Dropdown = ({ items, label, onSelect, isLoading }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSelect = (item) => {
    onSelect(item);
    setShowDropdown(false);
  };

  return (
    <div className={`dropdown ${showDropdown && "show"}`}>
      <div className="header" onClick={() => setShowDropdown(!showDropdown)}>
        <span>{label || "Select item"}</span>
        {isLoading ? (
          <LoaderCircle className="loading-icon" />
        ) : (
          <ChevronDown className="icon" />
        )}
      </div>
      {showDropdown && (
        <div className="content">
          {items.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelect(item)}
              className="dropdown-item"
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
