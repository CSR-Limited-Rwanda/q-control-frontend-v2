"use client";
import { useState, useEffect } from "react";
import { HousePlug } from "lucide-react";
import { useAuthentication } from "@/context/authContext";
export const FacilityCard = () => {
  const { user } = useAuthentication()
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
      <p>{user.facility?.name}</p>
    </div>
  );
};
