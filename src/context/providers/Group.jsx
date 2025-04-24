'use client'
import React, { createContext, useContext, useState } from 'react';

const GroupContext = createContext();

export const GroupProvider = ({ children }) => {
    const [selectedGroup, setSelectedGroup] = useState(null);

    return (
        <GroupContext.Provider value={{ selectedGroup, setSelectedGroup }}>
            {children}
        </GroupContext.Provider>
    );
};

export const useGroupContext = () => useContext(GroupContext);