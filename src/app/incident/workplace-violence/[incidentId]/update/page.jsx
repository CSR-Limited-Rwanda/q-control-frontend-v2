'use client'
import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/layout";
import api, { API_URL } from "@/utils/api";
import ModifyWorkplaceIncident from "@/components/incidents/modifyIncidents/ModifyWorkplaceViolence";
import { MoveRight } from "lucide-react";
// import { FacilityBreadCrumbs } from "../../drugReactionIncident/modifyMedicalAdverseDrugReactionIncidentPage";
import NoResources from "@/components/NoResources";

const ModifyWorkplaceIncidentPageContent = () => {
  const [error, setError] = useState();
  const [incident, setIncident] = useState({});
  const [incidentData, setIncidentData] = useState([])
  const { incidentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [workplaceViolenceId, setGeneralIncidentId] = useState(
    localStorage.getItem("workplaceViolenceId")
  )
  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await api.get(
          `/incidents/workplace-violence/${workplaceViolenceId}/`
        );

        if (response.status === 200) {
          console.log(response.data.incident);
          setIncident(response.data.incident);
          console.log("Incident data here: ", response.data.incident);
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
  }, []);

  return isLoading ? (
    "Gettting data..."
  ) : incident && !isError ? (
    <ModifyWorkplaceIncident data={incident} incidentId={incidentId} />
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
      <Link href={"/incident/workplace-violence/"}>
        Work Place Violence List
      </Link>{" "}
      <MoveRight />
      <Link href={`/incident/workplace-violence/${incidentId}/`}>
        #{incidentId}
      </Link>{" "}
      <MoveRight />
      <Link className="current-page"> Modify</Link>
    </div>
  );
};
const ModifyWorkplaceIncidentPage = () => {
    const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null)

    useEffect(() => {
      const storedValue = localStorage.getItem("changeBreadCrumbs")
      setChangeBreadCrumbs(storedValue);
    }, [])
  return (
    <DashboardLayout
      children={<ModifyWorkplaceIncidentPageContent />}
      breadCrumbs={
        changeBreadCrumbs ? (
          <FacilityBreadCrumbs facilityIncidentLink={"workplace_violence"} />
        ) : (
          <BreadCrumbs />
        )
      }
    />
  );
};

export default ModifyWorkplaceIncidentPage;