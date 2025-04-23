"use client";

import React from "react";

import '@/styles/_dashboard.scss';
import '@/styles/_components.scss';
import DashboardLayout from "./dashboard/layout";
import { useAuthentication } from "@/context/authContext";

const Dashboard = () => {
	return (
		<DashboardLayout>

		</DashboardLayout>
	);
};

export default Dashboard;
