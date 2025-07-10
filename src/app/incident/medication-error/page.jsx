"use client";

import DashboardLayout from "@/app/dashboard/layout";
import MedicationErrorList from "@/components/incidents/incidentLists/MedicationErrorList";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <MedicationErrorList />
    </DashboardLayout>
  );
};

export default page;
