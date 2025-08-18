"use client";

import React from "react";
import '@/styles/_dashboard.scss';
import '@/styles/_components.scss';
import '@/styles/_welcomePage.scss';
import DashboardLayout from "./dashboard/layout";
import { useAuthentication } from "@/context/authContext";
import { HelplineActions, quickActions } from "@/constants/quickActions";
import Link from "next/link";

const Dashboard = () => {
	const { user } = useAuthentication();
	return (
		<DashboardLayout>
			<div className="welcome-page">
				<div className="container">
					<h1>Welcome {user?.firstName || "Guest"}</h1>
					<p>This is your dashboard where you can manage your tasks and view your profile.</p>

					<div className="quick-actions">
						{/* quick actions from menu */}
						<h3>Quick Actions</h3>
						<div className="list">
							{
								quickActions.map((action, index) => ((
									<Link key={index} href={action.href} className="action">
										{action.icon}
										<span>{action.label}</span>
									</Link>
								)))
							}
						</div>
					</div>

					<div className="quick-actions">
						{/* quick actions from menu */}
						<h3>Get help</h3>
						<div className="list">
							{
								HelplineActions.map((action, index) => ((
									<Link key={index} href={action.href} className="action" target="_blank" rel="noopener noreferrer">
										{action.icon}
										<span>{action.label}</span>
									</Link>
								)))
							}
						</div>
					</div>
				</div>
			</div>
		</DashboardLayout>
	);
};

export default Dashboard;
