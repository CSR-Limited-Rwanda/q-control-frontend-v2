"use client";

import DashboardLayout from "@/app/dashboard/layout";
import DrugReactionList from "@/components/incidents/incidentLists/DrugReactionList";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <DrugReactionList />
    </DashboardLayout>
  );
};

export default page;
