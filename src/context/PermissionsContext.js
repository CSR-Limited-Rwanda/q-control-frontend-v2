import React, { createContext, useState, useEffect, useContext } from "react";
import api from "@/utils/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL

// Fetch permissions from the API
const fetchPermissions = async () => {
  try {
    const response = await api.get(`${API_URL}/accounts/permissions/`);
    if (response.status === 200) {
      return response.data.permissions;
    } else {
      return [];
    }
  } catch (error) {

    // window.customToast.error("You are logged out");
    return [];
  }
};

// Fetch departments from the API
const fetchDepartments = async () => {
  try {
    const response = await api.get(`${API_URL}/accounts/profile/`);
    if (response.status === 200) {
      return response.data.departments.map((department) => department.name);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching departments: ", error);
    return [];
  }
};

// Create contexts
const PermissionsContext = createContext();
const DepartmentsContext = createContext();

// Permissions Provider
export const PermissionsProvider = ({ children }) => {
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    const fetchAndSetPermissions = async () => {
      const permissions = await fetchPermissions();
      setPermissions(permissions);
    };

    fetchAndSetPermissions();
  }, []);

  return (
    <PermissionsContext.Provider value={permissions}>
      {children}
    </PermissionsContext.Provider>
  );
};

// Departments Provider
export const DepartmentsProvider = ({ children }) => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const fetchAndSetDepartments = async () => {
      const departments = await fetchDepartments();
      setDepartments(departments);
    };

    fetchAndSetDepartments();
  }, []);

  return (
    <DepartmentsContext.Provider value={departments}>
      {children}
    </DepartmentsContext.Provider>
  );
};

// Custom hooks to use the contexts
export const usePermission = () => {
  return useContext(PermissionsContext);
};

export const useDepartments = () => {
  return useContext(DepartmentsContext);
};
