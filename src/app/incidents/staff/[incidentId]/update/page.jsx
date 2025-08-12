"use client"
import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "@/app/dashboard/layout";
import api from "@/utils/api";
import { ArrowRight } from "lucide-react";
import ModifyStaffIncident from "@/components/incidents/modifyIncidents/ModifyStaffIncidentPage";

const ModifyStaffIncidentPageContent = () => {
  const [error, setError] = useState();
  const [incident, setIncident] = useState({});
  const { incidentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [investigation, setInvestigation] = useState();
  const [staffIncidentId, setStaffIncidentId] = useState(localStorage.getItem("staffIncidentId"))

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await api.get(
          `/incidents/staff-incident/${staffIncidentId}/`
        );

        if (response.status === 200) {

          setIncident(response.data.incident);
          setIsLoading(false);
          setInvestigation(response.data.has_investigation);
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
  }, []);

  return isLoading ? (
    "Getting data..."
  ) : incident && !isError ? (
    <ModifyStaffIncident
      data={incident}
      incidentId={incidentId}
      investigation={investigation}
    />
  ) : (
    "No data"
  );
};

const BreadCrumbs = () => {
  const { incidentId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link to={"/"}>Overview</Link> <ArrowRight />
      <Link to={"/incidents/"}>Incidents</Link> <ArrowRight />
      <Link to={"/incidents/employee/"}>Employee Incident Report</Link>{" "}
      <ArrowRight />
      <Link to={`/incidents/employee_incidents/${incidentId}/`}>
        #{incidentId}
      </Link>{" "}
      <ArrowRight />
      <Link className="current-page"> Modify</Link>
    </div>
  );
};

const ModifyStaffIncidentPage = () => {
  const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("changeBreadCrumbs");
    setChangeBreadCrumbs(storedValue);
  }, []);
  return (
    <DashboardLayout
      children={<ModifyStaffIncidentPageContent />}
      breadCrumbs={
        changeBreadCrumbs ? (
          <FacilityBreadCrumbs
            facilityIncidentLink={"employee_health_investigation"}
          />
        ) : (
          <BreadCrumbs />
        )
      }
    />
  );
};

export default ModifyStaffIncidentPage;
