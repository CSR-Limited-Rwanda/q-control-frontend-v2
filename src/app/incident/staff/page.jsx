"use client";
import DashboardLayout from "@/app/dashboard/layout";
import StaffIncidentList from "@/components/incidents/incidentLists/StaffIncidentList";
import React from "react";

const page = () => {
  return <DashboardLayout children={<StaffIncidentList />} />;
};

export default page;
