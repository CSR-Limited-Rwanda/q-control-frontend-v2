"use client";
import { useState } from "react";
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
import PermissionsGuard from "@/components/PermissionsGuard";
import AccessDeniedPage from "@/components/AccessDenied";

const incidentConfigs = [
  {
    title: "General Incident Reports",
    icon: <FileText size={24} />,
    link: "/incidents/general/",
    model: "general_patient_visitor",
  },
  {
    title: "Anaphylaxis/Adverse Drug Reaction Reports",
    icon: <Syringe size={24} />,
    link: "/incidents/drug-reaction/",
    model: "adverse_drug_reaction",
  },
  {
    title: "Staff Incident Reports",
    icon: <Users size={24} />,
    link: "/incidents/staff/",
    model: "staff_incident_reports",
  },
  {
    title: "Complaint & Grievance Reports",
    icon: <Paperclip size={24} />,
    link: "/incidents/grievance/",
    model: "patient_visitor_grievance",
  },
  {
    title: "Lost & Found Property Reports",
    icon: <Settings size={24} />,
    link: "/incidents/lost-and-found/",
    model: "lost_and_found",
  },
  {
    title: "Workplace Violence Incident Reports",
    icon: <Briefcase size={24} />,
    link: "/incidents/workplace-violence/",
    model: "workplace_violence_reports",
  },
  {
    title: "Medication Error Reports",
    icon: <PillBottle size={24} />,
    link: "/incidents/medication-error/",
    model: "medication_error",
  },
];

const page = () => {
  const router = useRouter();
  const [visibleIncidentCount, setVisibleIncidentCount] = useState(0);

  const handleClick = (link) => {
    router.push(link);
  };

  const handleVisibleIncident = () => {
    setVisibleIncidentCount((prev) => prev + 1);
  };

  return (
    <DashboardLayout>
      <div className="tabs-content">
        <div className="incidents-reports">
          {incidentConfigs.map(({ title, icon, link, model }) => (
            <PermissionsGuard
              key={link}
              model={model}
              codename="view_list"
              isPage={false}
            >
              <div
                onClick={() => handleClick(link)}
                className="incident-report"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClick(link);
                  }
                }}
              >
                <div className="list-icon">
                  <i className="fa-solid fa-ellipsis-vertical" />
                  <i className="fa-solid fa-ellipsis-vertical" />
                </div>
                <div className="icon">{icon}</div>
                <div className="text">
                  <h3>{title}</h3>
                </div>
              </div>
            </PermissionsGuard>
          ))}

          {visibleIncidentCount === 0 && <AccessDeniedPage />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default page;
