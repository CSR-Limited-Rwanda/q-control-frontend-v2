'use client'
import React, { createContext, useContext, useState } from 'react';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    return (
        <EmployeeContext.Provider value={{ selectedEmployee, setSelectedEmployee }}>
            {children}
        </EmployeeContext.Provider>
    );
};

export const useEmployeeContext = () => useContext(EmployeeContext);