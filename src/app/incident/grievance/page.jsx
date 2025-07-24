"use client";

import DashboardLayout from "@/app/dashboard/layout";
import PatientVisitorGrievanceList from "@/components/incidents/incidentLists/PatientVisitorGrievanceList";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <PatientVisitorGrievanceList />
    </DashboardLayout>
  );
};

export default page;
