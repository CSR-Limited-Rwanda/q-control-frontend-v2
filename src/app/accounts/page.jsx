'use client'
import React, { useEffect, useState } from 'react'
import '@/styles/accounts/_accounts.scss';
import DashboardLayout from '../dashboard/layout'
import Accounts from '@/components/accounts/tabs/Accounts';
import PermissionGroups from '@/components/accounts/tabs/PermissionGroups';
import Titles from '@/components/accounts/tabs/Titles';
import ReviewGroups from '@/components/accounts/tabs/ReviewGroups';


const AccountsPage = () => {
  const tabs = [
    {
      name: "Account management",
      id: "accountsManagement"
    },
    {
      name: "Permission groups",
      id: "permissionGroups"
    },
    {
      name: "Titles",
      id: "titles"
    },
    {
      name: "Review groups",
      id: "reviewGroups"
    },
    // {
    //   name: "Review templates",
    //   id: "reviewTemplates"
    // }
  ]

  const [activeTab, setActiveTab] = useState(null);

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    localStorage.setItem('activeAccountsTab', tab.id);
  };
  useEffect(() => {
    const storedTab = localStorage.getItem('activeAccountsTab');
    if (storedTab) {
      setActiveTab(storedTab);
    } else {
      setActiveTab(tabs[0].id);
    }
  }, [])
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
        activeTab === 'reviewGroups' && <div><ReviewGroups /></div>
      }
      {
        activeTab === 'reviewTemplates' && <div>Review templates</div>
      }
      {
        activeTab === 'titles' && <Titles />
      }
    </DashboardLayout>
  )
}

export default AccountsPage