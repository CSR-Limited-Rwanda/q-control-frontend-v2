"use client";
import React, { useState } from "react";
import { X, SquareCheckBig, LoaderCircle, Plus, Square } from "lucide-react";
import ErrorMessage from "../messages/ErrorMessage";
import SuccessMessage from "../messages/SuccessMessage";
import api from "@/utils/api";
import CloseIcon from "../CloseIcon";

const NewDepartmentForm = ({ setShowNewDepartmentForm, staff, facility }) => {
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [headOfDepartment, setHeadOfDepartment] = useState(null);
  const [departmentFacility, setDepartmentFacility] = useState(
    facility || null
  );
  const [addToAllFacilities, setAddToAllFacilities] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    const departmentData = {
      name: name,
      description: description,
      header_of_department: headOfDepartment,
      facility_id: departmentFacility.id,
      add_to_all: addToAllFacilities,
    };

    if (!name || !headOfDepartment) {
      setErrorMessage("Please fill all required fields");

      return;
    }

    try {
      setLoading(true);

      const response = await api.post(`departments/new/`, departmentData);
      if (response.status === 201) {
        const message = response.data.facilities_added
          ? response.data.facilities_added.map((fa) => fa)
          : facility.name;
        setSuccessMessage(
          response.data.facilities_added
            ? `Department created and added to ${message.join(", ")}`
            : `Department created and added to ${message}`
        );
        setLoading(false);
      } else if (response.status === 409) {
        const message = response.data.facilities_added.map((fa) => fa);
        setSuccessMessage(
          `Department exits in ${facility.name} it is added to ${message.join(
            ", "
          )}`
        );
        setLoading(false);
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(
          error.response.data.message ||
            error.response.data.error ||
            "Error creating department"
        );
      } else {
        setErrorMessage("Unknown error creating department");
      }
      setLoading(false);
    }
  };

  const handleAddToAllFacilities = () => {
    setAddToAllFacilities(!addToAllFacilities);
  };
  return (
    <div className="new-department">
      <h3>New department</h3>
      <p>Add fields necessary and click add new department button</p>
      <CloseIcon onClick={() => setShowNewDepartmentForm(false)} />

      {errorMessage && <ErrorMessage message={errorMessage} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      <form className="form">
        <div className="field">
          <label htmlFor="deptName">Department name *</label>
          <input
            type="text"
            id="deptName"
            name="deptName"
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter name"
          />
        </div>
        <div className="field">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Enter description"
          />
        </div>
        <div className="field">
          <label htmlFor="headOfDepartment">Head of Department *</label>
          {/* data list input */}
          <input
            value={headOfDepartment}
            onChange={(e) => setHeadOfDepartment(e.target.value)}
            list="employees"
            type="text"
            name=""
            id=""
            placeholder="Choose HOD"
          />
          <datalist id="employees">
            {staff &&
              staff.map((s, index) => (
                <option key={s.id} value={s.email}>
                  {s.first_name} {s.last_name} {s.email}
                </option>
              ))}
          </datalist>
        </div>

        <div className="field">
          <label htmlFor="departmentFacility">
            Department Facility * {facility && facility.name}
          </label>
          {/* data list input */}
          <input
            list="facilities"
            type="text"
            name=""
            id=""
            placeholder="Choose facility"
            value={facility && facility.name}
          />
          <datalist id="facilities">
            {facilities &&
              facilities.map((facility) => (
                <option key={facility.id} value={facility}>
                  {facility.name}
                </option>
              ))}
          </datalist>
        </div>
        <div onClick={handleAddToAllFacilities} className="check-box">
          {addToAllFacilities ? <SquareCheckBig /> : <Square />}
          <label htmlFor="">Add to all hospital</label>
        </div>
      </form>

      <button
        onClick={handleSubmit}
        disabled={loading}
        type="button"
        className="primary-button"
      >
        {loading ? (
          <LoaderCircle className="loading-icon" size={20} />
        ) : (
          <Plus size={20} />
        )}
        Add new department
      </button>
    </div>
  );
};

export default NewDepartmentForm;

const CustomCheckbox = (value, setValue) => {
  return <div className="custom-check-box"></div>;
};
