"use client";

import DashboardLayout from "@/app/dashboard/layout";
import WorkplaceViolenceList from "@/components/incidents/incidentLists/WorkplaceViolenceList";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <WorkplaceViolenceList />
    </DashboardLayout>
  );
};

export default page;
