import React, { useState } from "react";
import "@/styles/_dashboard.scss";
import "@/styles/_components.scss";
import {
  Menu,
  ChevronLeft,
  ChevronRight,
  X,
  CirclePlus,
  LoaderCircle,
} from "lucide-react";
import LoginPopup from "@/components/auth/Login";
import { useAuthentication } from "@/context/authContext";
import Image from "next/image";
import FormChoicesPopup from "@/components/forms/FormChoices";
import GeneralIncidentForm from "@/components/incidents/incidentForms/GeneralIncidentForms/GeneralIncidentForm";
import PopUp from "@/components/incidents/PopUp";
import EmployeeIncidentForm from "@/components/incidents/incidentForms/EmployeeIncidentForms/EmployeeIncidentForm";
import LostAndFoundForm from "@/components/incidents/incidentForms/LostAndFoundForms/LostAndFoundForm";
import GrievanceForm from "@/components/incidents/incidentForms/GrievanceForms/GrievanceForm";
import MedicationErrorForm from "@/components/incidents/incidentForms/MedicationErrorForms/MedicationErrorForm";
import DrugReactionForm from "@/components/incidents/incidentForms/DrugReactionForms/DrugReactionForm";
import WorkplaceViolenceIncidentForm from "@/components/incidents/incidentForms/WorkplaceViolenceForms/WorkPlaceViolenceForm";
import SubmitComplaintForm from "@/components/forms/SubmitComplaintForm";
import { menuItems } from "@/constants/menuItems";
import { ProfileContainer } from "@/components/accounts/ProfileContainer";
import { ProfileMessages } from "@/components/accounts/ProfileMessages";
import { ProfileNotification } from "@/components/accounts/ProfileNotification";
import { MenuItem } from "./MenuItem";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isFormChoicesOpen, setIsFormCHoicesOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { isAuth, loading } = useAuthentication();

  const handleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
  };




  const toggleFormChoicesOpen = () => {
    setIsFormCHoicesOpen(!isFormChoicesOpen);
  };

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <LoaderCircle className="spinner" size={40} />
      </div>
    );
  }

  if (!isAuth) {
    return <LoginPopup />;
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside
        className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""
          } ${showMobileMenu ? "mobile-open" : ""}`}
      >
        <div className="logo">
          <Image src={"/logo.svg"} width={52} height={32} alt="logo" />
          <h2 className="brand-name">Q-Control</h2>
          <X onClick={handleMobileMenu} className="close-mobile" />
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} index={index} />
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main
        className={`main ${isSidebarCollapsed ? "sidebar-collapsed" : ""
          }`}
      >
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div
              className="sidebar-toggle"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              {isSidebarCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </div>

            <div className="mobile-menu" onClick={handleMobileMenu}>
              {
                showMobileMenu ?
                  <X /> :
                  <Menu />
              }
            </div>


          </div>

          <div className="header-actions">
            <button
              onClick={toggleFormChoicesOpen}
              className="add-incident-btn"
            >
              <CirclePlus />
              <span>Add New</span>
              {isFormChoicesOpen ? (
                <FormChoicesPopup
                  togglePopup={togglePopup}
                  setSelectedForm={setSelectedForm}
                />
              ) : (
                ""
              )}
            </button>
            <ProfileMessages />
            <ProfileNotification />
            <ProfileContainer />
          </div>

        </header>

        {/* Page Content */}
        <div className="content">
          {isPopupOpen ? (
            <PopUp
              togglePopup={togglePopup}
              isPopupOpen={isPopupOpen}
              popupContent={
                selectedForm === "general" ? (
                  <GeneralIncidentForm togglePopup={togglePopup} />
                ) : selectedForm === "lostAndFound" ? (
                  <LostAndFoundForm togglePopup={togglePopup} />
                ) : selectedForm === "employee" ? (
                  <EmployeeIncidentForm togglePopup={togglePopup} />
                ) : selectedForm === "medicationError" ? (
                  <MedicationErrorForm togglePopup={togglePopup} />
                ) : selectedForm === "grievance" ? (
                  <GrievanceForm togglePopup={togglePopup} />
                ) : selectedForm === "reactionReport" ? (
                  <DrugReactionForm togglePopup={togglePopup} />
                ) : selectedForm === "workPlaceViolence" ? (
                  <WorkplaceViolenceIncidentForm togglePopup={togglePopup} />
                ) : selectedForm === "healthIncident" ? (
                  <HealthIncidentInvestigationForm
                    togglePopup={togglePopup}
                  />
                ) : selectedForm === "verbalComplaint" ? (
                  <VerbalComplaintForm />
                ) : selectedForm === "grievanceInvestigation" ? (
                  <GrievanceInvestigationForm />
                ) : selectedForm === "complaintForm" ? (
                  <SubmitComplaintForm
                    hasHeight={false}
                    handleSubmitComplaint={togglePopup}
                  />
                ) : (
                  ""
                )
              }
            />
          ) : (
            ""
          )}
          {children}

        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;


