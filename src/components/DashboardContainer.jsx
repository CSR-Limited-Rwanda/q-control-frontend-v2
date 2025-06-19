'use client'
import { useState, useEffect } from 'react';
import { HousePlug } from 'lucide-react';
export const FacilityCard = () => {
    const [activeAccount, setActiveAccount] = useState({});
    useEffect(() => {
      const savedAccount = localStorage.getItem("activeAccount");
      if (savedAccount && savedAccount !== "undefined") {
        setActiveAccount(JSON.parse(savedAccount));
      }
    }, []);
    return (
      <div className="facility-card">
        <HousePlug color="gray" />
        <p className="facility">Facility: </p>
        <p>{activeAccount?.name}</p>
      </div>
    );
  };