"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/layout";
import IncidentDetailsHeader from "../IncidentDetailsHeader";
import IncidentDetails from "../generalIncidents/IncidentDetails";
import IncidentTabs from "../IncidentTabs";
import api, { API_URL } from "@/utils/api";
import GrievanceDetailsContentTab from "./GrievanceDetailsContentTab";
import GrievanceIncidentGeneralInfo from "./GrievanceIncidentGeneralInfo";
import GrivanceDocumentHistory from "./GrievanceDocumentHistory";
import GrievanceReview from "./GrievanceReview";
import GrievanceInvestigationInfo from "./GrievanceInvestigationInfo";
import FilesList from "../../documentHistory/FilesList";
import NoResources from "@/components/NoResources";
import { ChevronRight } from "lucide-react";
import IncidentReviewsTab from "@/components/IncidentReviewsTab";
import IncidentActivitiesTab from "@/components/Activities";
// css
import "../../../../styles/_generalIncidentDetailsPage.scss";

const GrievanceDetailsContent = () => {
  const { incidentId } = useParams();
  const [isFetching, setIsFetching] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [investigationDetails, setInvestigationDetails] = useState({});
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
          `${API_URL}/incidents/grievance/${incidentId}/`
        );
        setIncidentDetails(response.data); // Store the original data
        setCurrentIncidentData(response.data.incident); // Set current data for UI
        setInvestigationDetails(response.data.investigation); //
      } else {
        // Fetch the latest modified version of the incident
        const res = await api.get(
          `${API_URL}/incidents/grievance/${incidentId}/`
        );
        const latestIncident = res.data.modifications.versions.find((mod) => {
          return mod.latest === true;
        });

        if (latestIncident) {
          response = await api.get(
            `${API_URL}/incidents/grievance/${incidentId}/versions/${latestIncident.id}/`
          );
        } else {
          response = res;
        }

        setLatestIncidentDetails(response.data); // Store the latest modified version
        setCurrentIncidentData(response.data.incident); // Set current data for UI
      }
      const investigationRes = await api.get(
        `/incidents/grievance/${incidentId}/investigation/`
      );
      if (investigationRes.status === 200) {
        setInvestigationDetails(investigationRes.data);
      }
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      console.log(error);
    }
  };

  // UseEffect to fetch data when either the incidentId or useOriginalVersion changes
  useEffect(() => {
    fetchIncidentDetails(); // Fetch incident data when version toggles or incidentId changes
  }, [incidentId, useOriginalVersion]);

  useEffect(() => {
    const getIncidentReviews = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/grievance/${incidentId}/reviews/`
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
        <div className="fetching-data">Loading data</div>
      ) : incidentDetails && Object.keys(incidentDetails).length > 0 ? (
        <div className="incident-details">
          {incidentDetails.modifications ? (
            <IncidentDetailsHeader
              data={
                useOriginalVersion ? incidentDetails : latestIncidentDetails
              }
              incidentDetailsId={incidentId}
              apiLink={"grievance"}
              sendTo={"send-to-department"}
              managerAccess={false}
              useOriginalVersion={useOriginalVersion}
              setCurrentIncidentData={setCurrentIncidentData}
              showClosedManager={false}
              model={"patient_visitor_grievance"}
              versionCodeName={"view_grievanceversion"}
              localStorageName={"grievanceId"}
            />
          ) : (
            ""
          )}

          <div className="details">
            <IncidentDetails
              data={currentIncidentData}
              fullName={
                currentIncidentData.form_initiated_by
                  ? `${currentIncidentData.form_initiated_by?.last_name} ${currentIncidentData.form_initiated_by?.first_name}`
                  : null
              }
              age={currentIncidentData?.patient_name?.age}
              dateBirth={currentIncidentData?.form_initiated_by?.date_of_birth}
              IncidentDate={currentIncidentData.date}
              incidentTime={currentIncidentData.incident_time}
              incidentCategory={currentIncidentData.category}
              incidentDetails={
                <GrievanceDetailsContentTab data={currentIncidentData} />
              }
              hasSex={false}
              hasInitiated={true}
            />
            <IncidentTabs
              data={currentIncidentData}
              //   statuses={incidentStatus}
              generalInformation={
                <GrievanceIncidentGeneralInfo
                  data={currentIncidentData}
                  incidentStatuses={incidentStatus}
                />
              }
              otherInformation={"No other information"}
              documentHistory={
                <IncidentActivitiesTab
                  incidentId={incidentId}
                  incident_type={"patient_visitor_grievance"}
                  setCount={setActivitiesCount}
                />
              }
              reviews={
                <IncidentReviewsTab
                  model={"patient_visitor_grievance"}
                  codeName={"add_review"}
                  incidentId={incidentId}
                  apiLink={"grievance"}
                  setCount={setReviewsCount}
                />
              }
              documents={<IncidentDocuments incidentId={incidentId} />}
              investigation={
                <GrievanceInvestigationInfo
                  data={investigationDetails}
                  incidentStatuses={incidentStatus}
                />
              }
              showInvestigationTab={true}
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

const IncidentDocuments = ({ incidentId, apiLink }) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/grievance/${incidentId}/documents/`
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
const BreadCrumbs = () => {
  const { grievanceId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link to={"/"}>Overview</Link> <ChevronRight />
      <Link to={"/incidents/"}>Incidents</Link> <ChevronRight />
      <Link to={"/incidents/grievance/"}>Grievance List</Link> <ChevronRight />
      <Link className="current-page"> #{grievanceId}</Link>
    </div>
  );
};

const GrievanceDetails = () => {
  return (
    <div>
      <DashboardLayout
        children={<GrievanceDetailsContent />}
        // breadCrumbs={
        //   changeBreadCrumbs ? (
        //     <FacilityDetailsBreadCrumbs incidentID={grievanceId} />
        //   ) : (
        //     <BreadCrumbs />
        //   )
        // }
      />
    </div>
  );
};

export default GrievanceDetails;
