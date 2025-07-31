'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/app/dashboard/layout";
import IncidentDetailsHeader from "../IncidentDetailsHeader";
import IncidentDetails from "../generalIncidents/IncidentDetails";
import IncidentTabs from "../IncidentTabs";
import api,{API_URL} from "@/utils/api";
import GrievanceDetailsContentTab from "./GrievanceDetailsContentTab";
import GrievanceIncidentGeneralInfo from "./GrievanceIncidentGeneralInfo";
import GrivanceDocumentHistory from "./GrievanceDocumentHistory";
import GrievanceReview from "./GrievanceReview";
import GrievanceInvestigationInfo from "./GrievanceInvestigationInfo";
import FilesList from "../../documentHistory/FilesList";
import NoResources from "@/components/NoResources";
import { ChevronRight } from 'lucide-react';
// css
import "../../../../styles/_generalIncidentDetailsPage.scss"

const GrievanceDetailsContent = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [investigationDetails, setInvestigationDetails] = useState({});
  const [incidentStatus, setIncidentStatus] = useState({});
  const [latestIncidentDetails, setLatestIncidentDetails] = useState({});
  const [useOriginalVersion, setUseOriginalVersion] = useState(true);
  const [currentIncidentData, setCurrentIncidentData] = useState({});
  const [grievanceId, setGrievanceId] = useState(
    localStorage.getItem("grievanceId")
  );

  const fetchIncidentDetails = async () => {
    setIsFetching(true);
    try {
      let response;
      // Fetch the original version of the incident
      if (useOriginalVersion) {
        response = await api.get(
          `${API_URL}/incidents/grievance/${grievanceId}/`
        );
        setIncidentDetails(response.data); // Store the original data
        setCurrentIncidentData(response.data); // Set current data for UI
        console.log(response.data);
        setInvestigationDetails(response.data.investigation); //
      } else {
        // Fetch the latest modified version of the incident
        const res = await api.get(
          `${API_URL}/incidents/grievance/${grievanceId}/`
        );
        const latestIncident = res.data.modifications.versions.find((mod) => {
          return mod.latest === true;
        });

        if (latestIncident) {
          response = await api.get(
            `${API_URL}/incidents/grievance/${grievanceId}/versions/${latestIncident.id}/`
          );
          console.log(response.data);
          console.log(latestIncident);
        } else {
          response = res;
        }

        setLatestIncidentDetails(response.data); // Store the latest modified version
        setCurrentIncidentData(response.data); // Set current data for UI
        setInvestigationDetails(response.data.investigation);
      }
      setIsFetching(false);
    } catch (error) {
      console.log(error);
      setIsFetching(false);
    }
    // try {
    //   const response = await api.get(
    //     `${API_URL}/incidents/grievance/${grievanceId}/`
    //   );
    //   if (response.status === 200) {
    //     //   setIncidentStatus(response.data.statuses);
    //     console.log(response.data);
    //     setIncidentDetails(response.data.grievance);
    //     setInvestigationDetails(response.data.investigation);
    //     setIsFetching(false);
    //   }
    //   console.log(incidentDetails);
    // } catch (error) {
    //   console.log(error);
    //   setIsFetching(false);
    // }
  };

  // UseEffect to fetch data when either the incidentId or useOriginalVersion changes
  useEffect(() => {
    fetchIncidentDetails(); // Fetch incident data when version toggles or incidentId changes
  }, [grievanceId, useOriginalVersion]);

  useEffect(() => {
    const getIncidentReviews = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/grievance/${grievanceId}/reviews/`
        );
        if (response.status === 200) {
          localStorage.setItem("incidentReviewsCount", response.data.length);
        }
      } catch (error) {
        if (error.response && error.response.status === 403) {
          window.customToast.error("Authentication error");
        } else {
          // window.customToast.error("Failed to fetch incident reviews");
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
          `${API_URL}/activities/list/${grievanceId}/`
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
              incidentDetailsId={grievanceId}
              apiLink={"grievance"}
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
              data={currentIncidentData}
              fullName={
                currentIncidentData.incident?.form_initiated_by
                  ? `${currentIncidentData.incident?.form_initiated_by?.last_name} ${currentIncidentData.incident?.form_initiated_by?.first_name}`
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
              otherInformation={
                "No other information"
              }
              documentHistory={
                <GrivanceDocumentHistory incidentId={grievanceId} />
              }
              reviews={<GrievanceReview incidentId={grievanceId} />}
              documents={<IncidentDocuments incidentId={grievanceId} />}
              investigation={
                <GrievanceInvestigationInfo data={investigationDetails} />
              }
              showInvestigationTab={true}
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
  const { grievanceId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link to={"/"}>Overview</Link> <ChevronRight />
      <Link to={"/incidents/"}>Incidents</Link> <ChevronRight />
      <Link to={"/incident/grievance/"}>Grievance List</Link>{" "}
      <ChevronRight />
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
