"use client";

import DashboardLayout from "@/app/dashboard/layout";
import GeneralPatientVisitorList from "@/components/incidents/incidentLists/GeneralPatientVisitorList";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <GeneralPatientVisitorList />
    </DashboardLayout>
  );
};

export default page;
