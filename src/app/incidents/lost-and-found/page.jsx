"use client";

import DashboardLayout from "@/app/dashboard/layout";
import LostAndFoundList from "@/components/incidents/incidentLists/LostAndFoundList";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <LostAndFoundList />
    </DashboardLayout>
  );
};

export default page;
