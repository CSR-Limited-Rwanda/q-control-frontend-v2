"use client";
import React, { useEffect, useState } from "react";
import "@/styles/accounts/_accounts.scss";
import DashboardLayout from "../dashboard/layout";
import Accounts from "@/components/accounts/tabs/Accounts";
import PermissionGroups from "@/components/accounts/tabs/PermissionGroups";
import Titles from "@/components/accounts/tabs/Titles";
import ReviewGroups from "@/components/accounts/tabs/ReviewGroups";
import { ReviewTemplates } from "@/components/accounts/tabs/ReviewTemplates";
import DepartmentsPage from "@/components/accounts/tabs/Departments";
import { getPermissions, useGetPermissions } from "@/hooks/fetchPermissions";

const AccountsPage = () => {
  const { permissions, loading, error } = useGetPermissions();
  console.log("permissions: ", permissions);
  const baseTabs = [
    {
      name: "Account management",
      id: "accountsManagement",
    },
    {
      name: "Permission groups",
      id: "permissionGroups",
    },
    {
      name: "Departments",
      id: "departments",
    },
    {
      name: "Titles",
      id: "titles",
    },
    {
      name: "Review groups",
      id: "reviewGroups",
    },
    {
      name: "Review templates",
      id: "reviewTemplates",
    },
  ];

  const tabs = React.useMemo(() => {
    if (!permissions) {
      // If no permissions, remove all permission-dependent tabs
      return baseTabs.filter(
        (tab) =>
          ![
            "accountsManagement",
            "permissionGroups",
            "departments",
            "titles",
            "reviewGroups",
            "reviewTemplates",
          ].includes(tab.id)
      );
    }

    let filteredTabs = [...baseTabs];

    if (!permissions.accounts?.includes("view_list")) {
      filteredTabs = filteredTabs.filter(
        (tab) => tab.id !== "accountsManagement"
      );
    }

    if (!permissions.auth?.includes("view_group")) {
      filteredTabs = filteredTabs.filter(
        (tab) => tab.id !== "permissionGroups"
      );
    }

    if (!permissions.base?.includes("view_list")) {
      filteredTabs = filteredTabs.filter((tab) => tab.id !== "departments");
    }

    if (!permissions.accounts?.includes("view_title")) {
      filteredTabs = filteredTabs.filter((tab) => tab.id !== "titles");
    }

    if (!permissions.tasks?.includes("view_reviewgroups")) {
      filteredTabs = filteredTabs.filter((tab) => tab.id !== "reviewGroups");
    }
    if (!permissions.tasks?.includes("view_reviewtemplates")) {
      filteredTabs = filteredTabs.filter((tab) => tab.id !== "reviewTemplates");
    }
    return filteredTabs;
  }, [permissions]);

  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    localStorage.setItem("activeAccountsTab", tab.id);
  };
  useEffect(() => {
    const storedTab = localStorage.getItem("activeAccountsTab");
    if (storedTab) {
      setActiveTab(storedTab);
    } else {
      setActiveTab(tabs[0].id);
    }
  }, []);
  return (
    <DashboardLayout>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div
            onClick={() => handleTabClick(tab)}
            className={`tab ${activeTab === tab.id && "active"} `}
            key={index}
          >
            <span>{tab.name}</span>
          </div>
        ))}
      </div>
      {activeTab === "accountsManagement" && (
        <Accounts permissions={permissions} />
      )}
      {activeTab === "permissionGroups" && (
        <div>
          <PermissionGroups permissions={permissions} />
        </div>
      )}
      {activeTab === "departments" && (
        <div>
          <DepartmentsPage permissions={permissions} />
        </div>
      )}
      {activeTab === "reviewGroups" && (
        <div>
          <ReviewGroups permissions={permissions} />
        </div>
      )}
      {activeTab === "reviewTemplates" && (
        <div>
          <ReviewTemplates permissions={permissions} />
        </div>
      )}
      {activeTab === "titles" && <Titles permissions={permissions} />}
    </DashboardLayout>
  );
};

export default AccountsPage;
