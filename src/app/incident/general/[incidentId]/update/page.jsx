"use client"
import api, {API_URL} from "@/utils/api";
import DashboardLayout from "@/app/dashboard/layout";
import ModifyPageLoader from "@/components/loader";
// import { useParams } from "react-router-dom";
import { useParams } from "next/navigation";
// import GeneralFieldsForm from "./generalFields";
// import IncidentTypeForm from "./incidentType";
// import OutcomeForm from "./outcomeForm";
import "../../../../../styles/_modifyIncident.scss"
import ModifyGeneralIncidentForm from "@/components/incidents/modifyIncidents/ModifyGeneralIncidentPage"
import { MoveRight } from 'lucide-react';
import Link from "next/link";
// import { FacilityBreadCrumbs } from "../../drugReactionIncident/modifyMedicalAdverseDrugReactionIncidentPage.jsx";
import NoResources from "@/components/NoResources";
import { useEffect, useState } from "react";


const PageContent = () => {
  const [incidentData, setIncidentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { incidentId } = useParams();
  const [isError, setIsError] = useState(false);
  const [generalIncidentId, setGeneralIncidentId] = useState(
    localStorage.getItem("generalIncidentId")
  )
  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/incidents/general-visitor/${generalIncidentId}/`
        );
        if (response.status === 200) {
            console.log(response.data.incident);
          setIncidentData(response.data.incident);
          console.log("Incident data: ", response.data.incident);
          setIsLoading(false);
        }
      } catch (error) {
        // setIsLoading(false);
        console.log("new error", error);

        if (error.response.status && error.response.status === 403) {
          window.customToast.error("You are not allowed to view this incident");
        } else if (error.response.status === 404) {
          setIsError(true);
        } else {
          window.customToast.error("There was an error");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchIncidentData();
  }, [incidentId]);

  return isLoading ? (
    "Getting data..."
  ) : incidentData && !isError ? (
    <ModifyGeneralIncidentForm data={incidentData} />
  ) : (
    "No dara"
  );
};

const BreadCrumbs = () => {
  const { incidentId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <ArrowRight01Icon />
      <Link href={"/incidents/"}>Incidents</Link> <ArrowRight01Icon />
      <Link href={"/incident/general/"}>General Incidents List</Link>{" "}
      <MoveRight />
      <Link href={`/incident/general/${incidentId}/`}>#{incidentId}</Link>{" "}
      <MoveRight />
      <Link className="current-page"> Modify</Link>
    </div>
  );
};

const ModifyGeneralIncident = ({ incidentId }) => {
  const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null)

  useEffect(() => {
    const storedValue = localStorage.getItem("changeBreadCrumbs")
    setChangeBreadCrumbs(storedValue);
  }, [])
  return (
    <DashboardLayout
      children={<PageContent />}
    
    />
  );
};

export default ModifyGeneralIncident;