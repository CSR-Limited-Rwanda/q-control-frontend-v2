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

const page = () => {
  return (
    <DashboardLayout>
      <div className="tabs-content">
        {/* {activeTab === "all" && (
           
          )} */}
        <div className="incidents-reports">
          <Link
            href={"/incident/general/"}
            onClick={() => {
              localStorage.removeItem("changeBreadCrumbs");
            }}
            className="incident-report"
          >
            <div className="list-icon">
              <i className="fa-solid fa-ellipsis-vertical"></i>
              <i className="fa-solid fa-ellipsis-vertical"></i>
            </div>
            <div className="icon">
              <FileText size={24} variant={"stroke"} />
            </div>
            <div className="text">
              <h3>General Incident Reports</h3>
              {/* <small>Last updated on 24 June, 2023</small> */}
            </div>
          </Link>

          <Link
            href={"/incident/drug-reaction/"}
            className="incident-report"
            onClick={() => {
              localStorage.removeItem("changeBreadCrumbs");
            }}
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
          </Link>

          <Link
            href={"/incident/staff/"}
            onClick={() => {
              localStorage.removeItem("changeBreadCrumbs");
            }}
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
          </Link>

          <Link
            href={"/incident/grievance/"}
            onClick={() => {
              localStorage.removeItem("changeBreadCrumbs");
            }}
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
          </Link>

          <Link
            href={"/incident/lost-and-found/"}
            className="incident-report"
            onClick={() => {
              localStorage.removeItem("changeBreadCrumbs");
            }}
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
          </Link>

          <Link
            href={"/incident/workplace-violence/"}
            className="incident-report"
            onClick={() => {
              localStorage.removeItem("changeBreadCrumbs");
            }}
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
          </Link>

          <Link
            href={"/incident/medication-error/"}
            className="incident-report"
            onClick={() => {
              localStorage.removeItem("changeBreadCrumbs");
            }}
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
          </Link>
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
