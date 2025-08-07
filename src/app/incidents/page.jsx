"use client";

import React from "react";
import DashboardLayout from "../dashboard/layout";
import Link from "next/link";
import "@/styles/_incidentTrackingPage.scss";
import {
  Briefcase,
  FileText,
  Paperclip,
  PillBottle,
  Settings,
  Syringe,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();

  const handleClick = (link) => {
    router.push(link);
  }
  return (
    <DashboardLayout>
      <div className="tabs-content">
        {/* {activeTab === "all" && (
           
          )} */}
        <div className="incidents-reports">
          <div
            onClick={() => handleClick("/incidents/general/")}
            className="incident-report"
          >
            <div className="icon">
              <FileText size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>General Incident Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </div>

          <div
            onClick={() => handleClick("/incidents/drug-reaction/")}
            className="incident-report"
          >
            <div className="list-icon">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="icon">
              <Syringe size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>Anaphylaxis/Adverse Drug Reaction Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </div>

          <div
            onClick={() => handleClick("/incidents/staff/")}
            className="incident-report"
          >
            <div className="list-icon">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="icon">
              <Users size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>Staff Incident Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </div>

          <div
            onClick={() => handleClick("/incidents/grievance/")}
            className="incident-report"
          >
            <div className="list-icon">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="icon">
              <Paperclip size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>Complaint & Grievance Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </div>

          <div
            onClick={() => handleClick("/incidents/lost-and-found/")}
            className="incident-report"
          >
            <div className="list-icon">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="icon">
              <Settings size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>Lost & Found Property Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </div>

          <div
            onClick={() => handleClick("/incidents/workplace-violence/")}
            className="incident-report"
          >
            <div className="list-icon">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="icon">
              <Briefcase size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>Workplace Violence Incident Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </div>

          <div
            onClick={() => handleClick("/incidents/medication-error/")}
            className="incident-report"
          >
            <div className="list-icon">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="icon">
              <PillBottle size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>Medication Error Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </div>
        </div>
        {/* {activeTab === "drafts" && (
            <div className="drafts">
              <div className="drafts">
                <DraftsTab />
              </div>
            </div>
          )} */}
      </div>
    </DashboardLayout>
  );
};

export default page;
