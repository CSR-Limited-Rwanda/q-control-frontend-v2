'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/app/dashboard/layout";
import IncidentDetailsHeader from "../IncidentDetailsHeader";
import IncidentDetails from "../generalIncidents/IncidentDetails";
import IncidentTabs from "../IncidentTabs";
import api, {API_URL} from "@/utils/api";
import MedicationDetailsContentTab from "./MedicationDetailsContentTab";
import MedicationGeneralInfo from "./MedicationGeneralInfo";
import MedicationOtherInformation from "./MedicationOtherInformation";
import MedicationDocumentHistory from "./MedicationDocumentHistory";
import MedicationReviews from "./MedicationReviews";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import FilesList from "../../documentHistory/FilesList";

// css
import "../../../../styles/_generalIncidentDetailsPage.scss"

const MedicationDetailsContent = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [incidentStatus, setIncidentStatus] = useState({});
  const [latestIncidentDetails, setLatestIncidentDetails] = useState({});
  const [useOriginalVersion, setUseOriginalVersion] = useState(true);
  const [currentIncidentData, setCurrentIncidentData] = useState({});
  const [medicationId, setMedicationId] = useState(
    localStorage.getItem("medicationErrorIncidentId")
  );

  const fetchIncidentDetails = async () => {
    setIsFetching(true);

    try {
      let response;
      // Fetch the original version of the incident
      if (useOriginalVersion) {
        response = await api.get(
          `${API_URL}/incidents/medication-error/${medicationId}/`
        );
        setIncidentDetails(response.data); // Store the original data
        setCurrentIncidentData(response.data); // Set current data for UI
        console.log(response.data);
      } else {
        // Fetch the latest modified version of the incident
        const res = await api.get(
          `${API_URL}/incidents/medication-error/${medicationId}/`
        );
        const latestIncident = res.data.modifications.versions.find((mod) => {
          return mod.latest === true;
        });

        if (latestIncident) {
          response = await api.get(
            `${API_URL}/incidents/medication-error/${medicationId}/versions/${latestIncident.id}/`
          );
          console.log(response.data);
          console.log(latestIncident);
        } else {
          response = res;
        }

        setLatestIncidentDetails(response.data); // Store the latest modified version
        setCurrentIncidentData(response.data); // Set current data for UI
      }
      setIsFetching(false);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }

  };

  useEffect(() => {
    fetchIncidentDetails(); // Fetch incident data when version toggles or incidentId changes
  }, [medicationId, useOriginalVersion]);

  useEffect(() => {
    const getIncidentReviews = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/medication-error/${medicationId}/reviews/`
        );
        if (response.status === 200) {
          localStorage.setItem("incidentReviewsCount", response.data.length);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          window.customToast.error("Authentication error");
        } else {
          window.customToast.error("Failed to fetch incident reviews");
          console.error(error);
        }
      }
    };
    getIncidentReviews();
  }, []);
  useEffect(() => {
    const getDocumentHistory = async () => {
      try {
        const response = await api.get(
          `${API_URL}/activities/list/${medicationId}/`
        );
        if (response.status === 200) {
          localStorage.setItem("documentHistoryCount", response.data.length);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          window.customToast.error("Authentication error");
        } else {
          window.customToast.error("Failed to fetch document History");
          console.error(error);
        }
      }
    };
    getDocumentHistory();
  }, []);
  return (
    <div className="incident-details-page">
      {isFetching ? (
        <div className="fetching-data">Loading data</div>
      ) : incidentDetails && Object.keys(incidentDetails).length > 0 ? (
        <div className="incident-details">
          {incidentDetails.modifications ? (
            <IncidentDetailsHeader
              data={{
                incident: useOriginalVersion ? incidentDetails : latestIncidentDetails,
                modifications: useOriginalVersion 
                  ? incidentDetails?.modifications 
                  : latestIncidentDetails?.modifications
              }}
              incidentDetailsId={medicationId}
              apiLink={"medication-error"}
              sendTo={"send-to-department"}
              managerAccess={false}
              useOriginalVersion={useOriginalVersion}
              setCurrentIncidentData={setCurrentIncidentData}
              showClosedManager={false}
            />
          ) : (
            ""
          )}

          <div className="details">
            <IncidentDetails
              data={currentIncidentData.incident}
              fullName={
                currentIncidentData.incident?.patient
                  ? `${currentIncidentData.incident?.patient?.last_name} ${currentIncidentData.incident?.patient?.first_name}`
                  : null
              }
              sex={currentIncidentData.incident?.patient?.gender}
              IncidentDate={currentIncidentData.incident?.date_of_error}
              incidentTime={currentIncidentData.incident?.time_of_error}
              incidentCategory={currentIncidentData.incident?.category}
              incidentDetails={
                <MedicationDetailsContentTab data={currentIncidentData} />
              }
              hasSex={false}
            />
            <IncidentTabs
              data={currentIncidentData}
              statuses={incidentStatus}
              generalInformation={
                <MedicationGeneralInfo
                  data={currentIncidentData}
                  incidentStatuses={incidentStatus}
                />
              }
              otherInformation={
                <MedicationOtherInformation data={currentIncidentData} />
              }
              documentHistory={
                <MedicationDocumentHistory incidentId={medicationId} />
              }
              reviews={<MedicationReviews incidentId={medicationId} />}
              documents={<IncidentDocuments incidentId={medicationId} />}
            />
          </div>
        </div>
      ) : (
        "No data"
      )}
    </div>
  );
};

const IncidentDocuments = ({ incidentId, apiLink }) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/medication-error/${incidentId}/documents/`
        );
        if (response.status === 200) {
          setDocuments(response.data);
          console.log(response.data);
          localStorage.setItem("incidentDocumentCount", response.data.length);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDocuments();
  }, []);
  return <FilesList documents={documents} showDownload={true} />;
};
const BreadCrumbs = () => {
  const { medicationId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <ChevronRight />
      <Link href={"/incidents/"}>Incidents</Link> <ChevronRight />
      <Link href={"/incident/medication-error/"}>Medication Error List</Link>{" "}
      <ChevronRight />
      <Link className="current-page">#{medicationId}</Link>
    </div>
  );
};
const MedicationDetails = () => {
  return (
    <div>
      <DashboardLayout
        children={<MedicationDetailsContent />}
      />
    </div>
  );
};

export default MedicationDetails;
