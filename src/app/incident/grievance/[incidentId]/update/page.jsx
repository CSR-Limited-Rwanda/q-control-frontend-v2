"use client";
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/app/dashboard/layout";
import api from "@/utils/api";
import ModifyGrievanceIncident from "@/components/incidents/modifyIncidents/ModifyGrievanceIncidentPage";
import { MoveRight } from "lucide-react";
import NoResources from "@/components/NoResources";

const ModifyGrievanceIncidentPageContent = () => {
  const [error, setError] = useState();
  const [incident, setIncident] = useState({});
  const [investigation, setInvestigation] = useState();
  const { incidentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [grievanceId, setGrievanceId] = useState(
    localStorage.getItem("grievanceId")
  );

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await api.get(`/incidents/grievance/${grievanceId}/`);

        if (response.status === 200) {
          setInvestigation(response.data.has_investigation);
          setIncident(response.data.incident);
          setIsLoading(false);
          console.log(response.data);
          console.log("weeeee");
        }
      } catch (error) {
        if (error.response.status === 404) {
          setIsError(true);
        }
        setError("Error getting incident data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchIncidentData();
  }, [incidentId]);

  return isLoading ? (
    "Getting data..."
  ) : incident && !isError ? (
    <ModifyGrievanceIncident
      data={incident}
      incidentId={incidentId}
      investigation={investigation}
    />
  ) : (
    <NoResources />
  );
};
const BreadCrumbs = () => {
  const { incidentId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <MoveRight />
      <Link href={"/incidents/"}>Incidents</Link> <MoveRight />
      <Link href={"/incident/grievance/"}>Grievance List</Link> <MoveRight />
      <Link href={`/incident/grievance/${incidentId}/`}>
        #{incidentId}
      </Link>{" "}
      <MoveRight />
      <Link className="current-page"> Modify</Link>
    </div>
  );
};

const ModifyGrievanceIncidentPage = () => {
  const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("changeBreadCrumbs");
    setChangeBreadCrumbs(storedValue);
  }, []);

  return (
    <DashboardLayout
      children={<ModifyGrievanceIncidentPageContent />}
      breadCrumbs={
        changeBreadCrumbs ? (
          <FacilityBreadCrumbs facilityIncidentLink={"grievance"} />
        ) : (
          <BreadCrumbs />
        )
      }
    />
  );
};

export default ModifyGrievanceIncidentPage;
