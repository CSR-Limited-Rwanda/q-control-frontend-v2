'use client'
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/app/dashboard/layout";
import api from "@/utils/api";
import ModifyMedicalErrorForm from "@/components/incidents/modifyIncidents/ModifyMedicationErrorPage";
import { MoveRight } from "lucide-react";
import Link from "next/link";
// import { FacilityBreadCrumbs } from "../../drugReactionincidents/modifyMedicalAdverseDrugReactionIncidentPage";
import NoResources from "@/components/NoResources";

const PageContent = () => {
  const [error, setError] = useState();
  const [incidentData, setIncidentData] = useState({});
  const { incidentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [medicationErrorIncidentId, setMedicationErrorIncidentId] = useState(
    localStorage.getItem("medicationErrorIncidentId")
  )

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(
          `/incidents/medication-error/${medicationErrorIncidentId}/`
        );

        if (response.status === 200) {
          setIncidentData(response.data.incident);

          setIsLoading(false);
        }
      } catch (error) {
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
    <ModifyMedicalErrorForm data={incidentData} />
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
      <Link href={"/incidents/medication_error/"}>Medication Error List</Link>{" "}
      <MoveRight />
      <Link href={`/incidents/medication_error/${incidentId}/`}>
        #{incidentId}
      </Link>{" "}
      <MoveRight />
      <Link className="current-page"> Modify</Link>
    </div>
  );
};

const ModifyMedicalErrorIncidentPage = () => {
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

export default ModifyMedicalErrorIncidentPage;