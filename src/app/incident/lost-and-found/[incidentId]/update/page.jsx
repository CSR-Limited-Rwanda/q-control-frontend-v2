'use client'
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/app/dashboard/layout";
import api, {API_URL} from "@/utils/api";
import ModifyLostFound from "@/components/incidents/modifyIncidents/ModifyLostAndFoundPage";
import { MoveRight } from "lucide-react";
// import { FacilityBreadCrumbs } from "../../drugReactionIncident/modifyMedicalAdverseDrugReactionIncidentPage";
import NoResources from "@/components/NoResources";

const ModifyLostFoundPageContent = () => {
  const [error, setError] = useState();
  const [incident, setIncident] = useState({});
  const { incidentId } = useParams();
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lostAndFoundId, setLostAndFoundId] = useState(
    localStorage.getItem("lostAndFoundId")
  )

  useEffect(() => {
    const fetchIncidentData = async () => {
      setIsLoading(true);
      try {
        const response = await api.get(
          `${API_URL}/incidents/lost-found/${lostAndFoundId}/`
        );
        if (response.status === 200) {
          console.log(response.data.incident);
          setIncident(response.data.incident);
          setIsLoading(false);
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
  ) : !isError ? (
    <ModifyLostFound data={incident} incidentId={incidentId} />
  ) : (
    "No data"
  );
};

const BreadCrumbs = () => {
  const { incidentId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <MoveRight />
      <Link href={"/incidents/"}>Incidents</Link> <MoveRight />
      <Link href={"/incident/lost-and-found/"}>
        Lost & Found Property report
      </Link>{" "}
      <MoveRight />
      <Link href={`/incident/lost_and_found/${incidentId}/`}>
        #{incidentId}
      </Link>{" "}
      <MoveRight />
      <Link className="current-page"> Modify</Link>
    </div>
  );
};

const ModifyLostFoundPage = () => {
    const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null)

    useEffect(() => {
      const storedValue = localStorage.getItem("changeBreadCrumbs")
      setChangeBreadCrumbs(storedValue);
    }, [])
  return (
    <DashboardLayout
      children={<ModifyLostFoundPageContent />}
    />
  );
};

export default ModifyLostFoundPage;