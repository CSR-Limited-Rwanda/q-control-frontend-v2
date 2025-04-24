'use client'
import React, { useState } from 'react'
import '@/styles/_accounts.scss';
import DashboardLayout from '../dashboard/layout'
import Accounts from '@/components/accounts/tabs/Accounts';
import PermissionGroups from '@/components/accounts/tabs/PermissionGroups';

const AccountsPage = () => {
  const tabs = [
    {
      name: "Accounts management",
      id: "accountsManagement"
    },
    {
      name: "Permission groups",
      id: "permissionGroups"
    },
    {
      name: "Review groups",
      id: "reviewGroups"
    },
    {
      name: "Review templates",
      id: "reviewTemplates"
    }
  ]
  const [activeTab, setActiveTab] = useState(tabs[1].id);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
  };


  return (
    <DashboardLayout>
      <div className="tabs">
        {tabs.map((tab, index) => (
          <div onClick={() => handleTabClick(tab)} className={`tab ${activeTab === tab.id && 'active'} `} key={index}>
            <span>{tab.name}</span>
          </div>
        ))}
      </div>
      {
        activeTab === 'accountsManagement' && <Accounts />
      }
      {
        activeTab === 'permissionGroups' && <div><PermissionGroups /></div>
      }
      {
        activeTab === 'reviewGroups' && <div>Review groups</div>
      }
      {
        activeTab === 'reviewTemplates' && <div>Review templates</div>
      }
    </DashboardLayout>
  )
}

export default AccountsPage