"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/app/dashboard/layout";
import api, { API_URL } from "@/utils/api";
import IncidentDetailsHeader from "../IncidentDetailsHeader";
import IncidentTabs from "../IncidentTabs";

import WorkDetailsInfo from "./WorkPlaceDetailsInfo";
import WorkPlaceDetailsContentTab from "./WorkPlaceDetailsContentTab";
import WorkPlaceGeneralInfo from "./WorkPlaceGeneralInfo";
import WorkplaceOtherInfo from "./WorkplaceViolenceOtherInfo";
import WorkplaceDocumentHistory from "./WorkplaceDocumentHistory";
import WorkplaceReviews from "./WorkplaceReviews";

import { ChevronRight } from "lucide-react";
import FilesList from "../../documentHistory/FilesList";
import NoResources from "@/components/NoResources";
import IncidentReviewsTab from "@/components/IncidentReviewsTab";
import IncidentActivitiesTab from "@/components/Activities";

const WorkPlaceDetailsContent = () => {
  const { incidentId } = useParams();
  const [isFetching, setIsFetching] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [incidentStatus, setIncidentStatus] = useState({});
  const [latestIncidentDetails, setLatestIncidentDetails] = useState({});
  const [useOriginalVersion, setUseOriginalVersion] = useState(true);
  const [currentIncidentData, setCurrentIncidentData] = useState({});
  const [reviewsCount, setReviewsCount] = useState();
  const [activitiesCount, setActivitiesCount] = useState();

  const fetchIncidentDetails = async () => {
    setIsFetching(true);
    try {
      let response;

      // Fetch the original version of the incident
      if (useOriginalVersion) {
        response = await api.get(
          `${API_URL}/incidents/workplace-violence/${incidentId}/`
        );
        setIncidentDetails(response.data); // Store the original data
        setCurrentIncidentData(response.data.incident); // Set current data for UI
      } else {
        // Fetch the latest modified version of the incident
        const res = await api.get(
          `${API_URL}/incidents/workplace-violence/${incidentId}/`
        );
        const latestIncident = res.data.modifications.versions.find((mod) => {
          return mod.latest === true;
        });

        if (latestIncident) {
          response = await api.get(
            `${API_URL}/incidents/workplace-violence/${incidentId}/versions/${latestIncident.id}/`
          );
        } else {
          response = res;
        }

        setLatestIncidentDetails(response.data); // Store the latest modified version
        setCurrentIncidentData(response.data.incident); // Set current data for UI
      }

      setIsFetching(false); // Stop loading state
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error);
        console.error("Error fetching incident details:", error);
        setIsFetching(false);
      }
    }
  };

  useEffect(() => {
    fetchIncidentDetails(); // Fetch incident data when version toggles or incidentId changes
  }, [incidentId, useOriginalVersion]);

  useEffect(() => {
    const getIncidentReviews = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/workplace-violence/${incidentId}/reviews/`
        );
        if (response.status === 200) {
          localStorage.setItem("incidentReviewsCount", response.data.length);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error("Authentication error");
        } else {
          toast.error("Failed to fetch incident reviews");
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
          `${API_URL}/activities/list/${incidentId}/`
        );
        if (response.status === 200) {
          localStorage.setItem("documentHistoryCount", response.data.length);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          toast.error("Authentication error");
        } else {
          toast.error("Failed to fetch document History");
          console.error(error);
        }
      }
    };
    getDocumentHistory();
  }, []);
  return (
    <div className="incident-details-page">
      {isFetching ? (
        <div className="fetching-data">Loading data...</div>
      ) : incidentDetails && Object.keys(incidentDetails).length > 0 ? (
        <div className="incident-details">
          {incidentDetails.modifications ? (
            <IncidentDetailsHeader
              data={
                useOriginalVersion ? incidentDetails : latestIncidentDetails
              }
              incidentDetailsId={incidentId}
              apiLink={"workplace-violence"}
              sendTo={"send-to-department"}
              managerAccess={true}
              useOriginalVersion={useOriginalVersion}
              setCurrentIncidentData={setCurrentIncidentData}
              showClosedManager={true}
              model={"workplace_violence_reports"}
              versionCodeName={"view_workplaceviolenceversion"}
              localStorageName={"workplaceViolenceId"}
            />
          ) : (
            ""
          )}

          <div className="details">
            <WorkDetailsInfo
              data={currentIncidentData}
              fullName={
                currentIncidentData?.reported_by
                  ? `${currentIncidentData.reported_by?.last_name} ${currentIncidentData.reported_by?.first_name}`
                  : null
              }
              /* sex={incidentDetails.sex} */
              IncidentDate={currentIncidentData.date_of_incident}
              incidentTime={currentIncidentData.time_of_incident}
              incidentCategory={currentIncidentData.incident_type}
              incidentDetails={
                <WorkPlaceDetailsContentTab data={currentIncidentData} />
              }
            />
            <IncidentTabs
              data={currentIncidentData}
              statuses={incidentStatus}
              generalInformation={
                <WorkPlaceGeneralInfo
                  data={currentIncidentData}
                  incidentStatuses={incidentStatus}
                />
              }
              otherInformation={
                <WorkplaceOtherInfo data={currentIncidentData} />
              }
              documentHistory={
                <IncidentActivitiesTab
                  incidentId={incidentId}
                  incidentType={"workplace_violence_reports"}
                  setCount={setActivitiesCount}
                />
              }
              reviews={
                <IncidentReviewsTab
                  model={"workplace_violence_reports"}
                  codeName={"add_review"}
                  incidentId={incidentId}
                  apiLink={"workplace-violence"}
                  setCount={setReviewsCount}
                />
              }
              documents={<IncidentDocuments incidentId={incidentId} />}
              reviewsCount={reviewsCount}
              incidentDocumentHistoryCount={activitiesCount}
            />
          </div>
        </div>
      ) : (
        "No data"
      )}
    </div>
  );
};

const BreadCrumbs = () => {
  const { incidentId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <ChevronRight />
      <Link href={"/incidents/"}>Incidents</Link> <ChevronRight />
      <Link href={"/incidents/workplace-violence/"}>
        Workplace Violence List
      </Link>{" "}
      <ChevronRight />
      <Link className="current-page"> #{incidentId}</Link>
    </div>
  );
};

const IncidentDocuments = ({ incidentId, apiLink }) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/workplace-violence/${incidentId}/documents/`
        );
        if (response.status === 200) {
          setDocuments(response.data.results);

          localStorage.setItem(
            "incidentDocumentCount",
            response.data.results.length
          );
        }
      } catch (error) {}
    };
    fetchDocuments();
  }, []);
  return <FilesList documents={documents} showDownload={true} />;
};

const WorkPlaceDetails = () => {
  return (
    <div>
      <DashboardLayout children={<WorkPlaceDetailsContent />} />
    </div>
  );
};

export default WorkPlaceDetails;
