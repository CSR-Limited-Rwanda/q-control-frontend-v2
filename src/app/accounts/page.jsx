'use client'
import React, { useState } from 'react'
import DashboardLayout from '../dashboard/layout'
import Accounts from './tabs/Accounts';

const AccountsPage = () => {
  const [activeTab, setActiveTab] = useState("accounts");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };
  return (
    <DashboardLayout>
      <Accounts />
    </DashboardLayout>
  )
}

export default AccountsPage