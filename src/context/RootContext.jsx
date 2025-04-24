'use client'
import React from 'react';
import { GroupProvider } from './providers/Group';
import { EmployeeProvider } from './providers/Employee';

const RootProvider = ({ children }) => {
    return (
        <GroupProvider>
            <EmployeeProvider>
                {children}
            </EmployeeProvider>
        </GroupProvider>
    );
};

export default RootProvider;