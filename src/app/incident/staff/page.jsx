"use client";
import DashboardLayout from "@/app/dashboard/layout";
import StaffIncidentList from "@/components/incidents/incidentLists/StaffIncidentList";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <StaffIncidentList />
    </DashboardLayout>
  );
};

export default page;
