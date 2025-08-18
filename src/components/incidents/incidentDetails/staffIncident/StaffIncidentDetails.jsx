'use client'

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import DashboardLayout from "@/app/dashboard/layout"
import IncidentDetailsHeader from "../IncidentDetailsHeader"
import IncidentTabs from "../IncidentTabs"
import api, { API_URL } from "@/utils/api"
import StaffDetails from "./StaffDetails"
import StaffDetailsContentTab from "./StaffDetailsContentTab"
import StaffGeneralInfo from "./StaffGeneralInfo"
import StaffOtherInformation from "./StaffOtherInformation"
import StaffDocumentHistory from "./StaffDocumentHistory"
import StaffReviews from "./StaffReviewsForm"
import StaffInvestigationInfo from "./StaffInvestigationInfo"
import FilesList from "../../documentHistory/FilesList"
import { MoveRight } from 'lucide-react'
import Link from "next/link"
import IncidentReviewsTab from "@/components/IncidentReviewsTab"
import IncidentActivitiesTab from "@/components/Activities"

const EmployeeDetailsContent = () => {
  const { incidentId } = useParams();
  const [isFetching, setIsFetching] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [incidentStatus, setIncidentStatus] = useState({});
  const [investigationInfo, setInvestigationInfo] = useState({});
  const [latestIncidentDetails, setLatestIncidentDetails] = useState({});
  const [useOriginalVersion, setUseOriginalVersion] = useState(true);
  const [currentIncidentData, setCurrentIncidentData] = useState({});
  const [staffInvestigationId, setStaffInvestigationId] = useState(localStorage.getItem("employee_investigation_id"))
  const [reviewsCount, setReviewsCount] = useState();
  const [activitiesCount, setActivitiesCount] = useState();

  const fetchIncidentDetails = async () => {
    setIsFetching(true);
    try {
      let response;

      if (useOriginalVersion) {
        response = await api.get(`/incidents/staff-incident/${incidentId}/`);
        setIncidentDetails(response.data.incident);
        setCurrentIncidentData(response.data.incident);
      } else {
        const res = await api.get(`${API_URL}/incidents/staff-incident/${incidentId}/`);
        const latestIncident = res.data.modifications.versions.find(mod => mod.latest === true);
        if (latestIncident) {
          response = await api.get(
            `${API_URL}/incidents/staff-incident/${incidentId}/versions/${latestIncident.id}/`
          );
        } else {
          response = res;
        }
        setLatestIncidentDetails(response.data);
        setCurrentIncidentData(response.data.incident);
      }

      // 🔽 NEW: fetch investigation separately
      const investigationRes = await api.get(
        `/incidents/staff-incident/${incidentId}/investigation/`
      );

      if (investigationRes.status === 200) {
        setInvestigationInfo(investigationRes.data);
      } else {
        setInvestigationInfo(null);
      }

      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching incident details:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchIncidentDetails(); // Fetch incident data when version toggles or incidentId changes
  }, [incidentId, useOriginalVersion]);

  useEffect(() => {
    const getIncidentReviews = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/staff-incident/${incidentId}/reviews/`
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
              apiLink={"staff-incident"}
              sendTo={"send-to-department"}
              managerAccess={false}
              useOriginalVersion={useOriginalVersion}
              setCurrentIncidentData={setCurrentIncidentData}
              showClosedManager={true}
            />
          ) : (
            ""
          )}

          <div className="details">
            <StaffDetails
              data={currentIncidentData}
              fullName={`${currentIncidentData.patient_info?.last_name} ${currentIncidentData.patient_info?.first_name}`}
              location={currentIncidentData.location}
              IncidentDate={currentIncidentData.date_of_injury_or_near_miss}
              incidentTime={currentIncidentData.time_of_injury_or_near_miss}
              status={currentIncidentData.status}
              incidentDetails={
                <StaffDetailsContentTab data={currentIncidentData} />
              }
            />
            <IncidentTabs
              data={currentIncidentData}
              statuses={incidentStatus}
              generalInformation={
                <StaffGeneralInfo
                  data={currentIncidentData}
                  incidentStatuses={incidentStatus}
                />
              }
              otherInformation={
                <StaffOtherInformation data={currentIncidentData} />
              }
              documentHistory={
                <IncidentActivitiesTab incidentId={incidentId} incident_type={"staff_incident_reports"} setCount={setActivitiesCount} />
              }
              reviews={<IncidentReviewsTab incidentId={incidentId} apiLink={"staff-incident"} setCount={setReviewsCount} />}
              documents={<IncidentDocuments incidentId={incidentId} />}
              investigation={
                <StaffInvestigationInfo data={investigationInfo} incidentStatuses={incidentStatus} />
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
          `/incidents/staff-incident/${incidentId}/documents/`
        );
        if (response.status === 200) {
          setDocuments(response.data);

          localStorage.setItem("incidentDocumentCount", response.data.length);
        }
      } catch (error) {

      }
    };
    fetchDocuments();
  }, []);
  return <FilesList documents={documents} showDownload={true} />;
};

// export default EmployeeDetailsContent;

const BreadCrumbs = () => {
  const { incidentId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <MoveRight />
      <Link href={"/incidents/"}>Incidents</Link> <MoveRight />
      <Link href={"/incidents/employee/"}>Staff Incident Report</Link>{" "}
      <MoveRight />
      <Link className="current-page"> #{incidentId}</Link>
    </div>
  );
};

const EmployeeIncidentDetails = () => {
  const { incidentId } = useParams();
  const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("changeBreadCrumbs");
    setChangeBreadCrumbs(storedValue);
  }, []);
  return (
    <div>
      <DashboardLayout
        children={<EmployeeDetailsContent />}
      />
    </div>
  );
};

export default EmployeeIncidentDetails;