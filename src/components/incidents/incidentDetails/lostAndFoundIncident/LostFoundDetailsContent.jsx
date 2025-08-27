"use client";

import toast from "react-hot-toast";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/layout";
import IncidentDetailsHeader from "../IncidentDetailsHeader";
import IncidentTabs from "../IncidentTabs";
import api, { API_URL } from "@/utils/api";
import LostFoundDetailsContentTab from "./LostFoundDetailsContentTab";
import LostFoundGeneralInfo from "./LostFoundGeneralInfo";
import LostDetails from "./LostAndFoundDetails";
import { ArrowRight } from "lucide-react";
import LostAndfoundDocumentHistory from "./LostAndFoundDocumentHistory";
import LostAndFoundReviews from "./LostAndFoundReview";
import FilesList from "../../documentHistory/FilesList";
import IncidentReviewsTab from "@/components/IncidentReviewsTab";
import IncidentActivitiesTab from "@/components/Activities";
import NoResources from "@/components/NoResources";

// css
import "../../../../styles/_generalIncidentDetailsPage.scss";

const LostFoundDetailsContent = () => {
  const [isFetching, setIsFetching] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [incidentStatus, setIncidentStatus] = useState({});
  const [latestIncidentDetails, setLatestIncidentDetails] = useState({});
  const [useOriginalVersion, setUseOriginalVersion] = useState(true);
  const [currentIncidentData, setCurrentIncidentData] = useState({});
  const { incidentId } = useParams();
  const [reviewsCount, setReviewsCount] = useState();
  const [activitiesCount, setActivitiesCount] = useState();

  const fetchIncidentDetails = async () => {
    setIsFetching(true);
    try {
      let response;
      if (useOriginalVersion) {
        response = await api.get(
          `${API_URL}/incidents/lost-found/${incidentId}/`
        );
        setIncidentDetails(response.data); // <-- Don't destructure here
        setCurrentIncidentData(response.data.incident);
      } else {
        const res = await api.get(
          `${API_URL}/incidents/lost-found/${incidentId}/`
        );
        const latestIncident = res.data.modifications.versions.find(
          (mod) => mod.latest === true
        );

        if (latestIncident) {
          response = await api.get(
            `${API_URL}/incidents/lost-found/${incidentId}/versions/${latestIncident.id}/`
          );
          setLatestIncidentDetails(response.data); // <-- Don't destructure here
          setCurrentIncidentData(response.data.incident);
        } else {
          setLatestIncidentDetails(res.data); // <-- Don't destructure here
          setCurrentIncidentData(res.data.incident);
        }
      }

      setIsFetching(false);
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error);
        console.error("Error fetching incident details:", error);
        setIsFetching(false);
      }
    }
  };

  useEffect(() => {
    fetchIncidentDetails();
  }, [incidentId, useOriginalVersion]);
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
          <IncidentDetailsHeader
            data={{
              incident: useOriginalVersion
                ? incidentDetails
                : latestIncidentDetails,
              modifications: useOriginalVersion
                ? incidentDetails?.modifications
                : latestIncidentDetails?.modifications,
            }}
            incidentDetailsId={incidentId}
            apiLink={"lost-found"}
            sendTo={"send-to-department"}
            managerAccess={false}
            useOriginalVersion={useOriginalVersion}
            setCurrentIncidentData={setCurrentIncidentData}
            showClosedManager={false}
            model={"lost_and_found"}
            versionCodeName={"view_lostandfoundversion"}
            localStorageName={"lostAndFoundId"}
          />

          <div className="details">
            <LostDetails
              data={currentIncidentData}
              //   location={incidentDetails.item_description}
              //   ActionTaken={incidentDetails.action_taken}
              //   PersonTakingReport={incidentDetails.person_taking_report || '-'}
              //   Relationship={incidentDetails.relation_to_patient}
              //   LocationFound={incidentDetails.data.location_found}
              incidentDetails={
                <LostFoundDetailsContentTab
                  data={{
                    incident: currentIncidentData,
                  }}
                />
              }
            />
            <IncidentTabs
              data={{
                incident: currentIncidentData,
              }}
              statuses={incidentStatus}
              generalInformation={
                <LostFoundGeneralInfo
                  data={currentIncidentData}
                  incidentStatuses={incidentStatus}
                />
              }
              //   otherInformation={
              //     <LostFoundDetailsOtherInformation data={currentIncidentData} />
              //   }
              documentHistory={
                <IncidentActivitiesTab
                  incidentId={incidentId}
                  incidentType={"lost_and_found"}
                  setCount={setActivitiesCount}
                />
              }
              reviews={
                <IncidentReviewsTab
                  model={"lost_and_found"}
                  codeName={"add_review"}
                  incidentId={incidentId}
                  apiLink={"lost-found"}
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

const IncidentDocuments = ({ incidentId, apiLink }) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/lost-found/${incidentId}/documents/`
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
  }, [incidentId]);
  return (
    <FilesList
      documents={documents}
      showDownload={true}
      setDocuments={setDocuments}
      apiLink={"lost_and_found"}
      incidentId={incidentId}
    />
  );
};

const BreadCrumbs = () => {
  const { incidentId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <ArrowRight />
      <Link href={"/incidents/"}>Incidents</Link> <ArrowRight />
      <Link href={"/incidents/lost-and-found/"}>
        Lost & Found Property report
      </Link>{" "}
      <ArrowRight />
      <Link className="current-page"> #{incidentId}</Link>
    </div>
  );
};

const LostFoundDetails = () => {
  const { incidentId } = useParams();
  const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null);

  useEffect(() => {
    const storedValue = localStorage.getItem("changeBreadCrumbs");
    setChangeBreadCrumbs(storedValue);
  }, []);
  return (
    <div>
      <DashboardLayout
        children={<LostFoundDetailsContent />}
        // breadCrumbs={
        //   changeBreadCrumbs ? (
        //     <FacilityDetailsBreadCrumbs incidentID={incidentId} />
        //   ) : (
        //     <BreadCrumbs />
        //   )
        // }
      />
    </div>
  );
};

export default LostFoundDetails;
