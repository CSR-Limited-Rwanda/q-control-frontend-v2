"use client";
import "@/styles/accounts/_accounts.scss";
import DashboardLayout from "@/app/dashboard/layout";
import { useGroupContext } from "@/context/providers/Group";
import api from "@/utils/api";
import { ChevronUp, SquareCheck, SquarePen, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { PermissionGroupCard } from "@/components/accounts/cards/PermissionsCard";
import UsersCard from "@/components/accounts/cards/UsersCard";

const page = () => {
  const { selectedGroup, setSelectedGroup } = useGroupContext();

  return (
    <DashboardLayout>
      <div className="group-details">
        <PermissionGroupCard />
        <UsersCard />
      </div>
    </DashboardLayout>
  );
};

export default page;
