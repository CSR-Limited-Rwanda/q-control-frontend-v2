'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/layout";
import IncidentDetailsHeader from "../IncidentDetailsHeader";
import IncidentDetails from "../generalIncidents/IncidentDetails";
import IncidentTabs from "../IncidentTabs";
import api, { API_URL } from "@/utils/api";
import DrugReactionContentTab from "./DrugReactionContentTab";
import DrugReactionGeneraInfo from "./DrugReactionGeneralInfo";
import DrugReactionOtherInformation from "./DrugReactionOtherInformation";
import DrugReactionDocumentHistory from "./DrugReactionDocumentHistory";
import DrugReactionReviews from "./DrugReactionReviews";
import FilesList from "../../documentHistory/FilesList";
import { ChevronRight } from "lucide-react";
import IncidentReviewsTab from "@/components/IncidentReviewsTab";
import NoResources from "@/components/NoResources";

// css
import "../../../../styles/_generalIncidentDetailsPage.scss"

const BreadCrumbs = () => {
  const { drugReactionId } = useParams();
  return (
    <div className="breadcrumbs">
      <Link href={"/"}>Overview</Link> <ChevronRight />
      <Link href={"/incidents/"}>Incidents</Link> <ChevronRight />
      <Link href={"/incidents/drug-reaction/"}>
        Anaphylaxis/Adverse Drug Reaction List
      </Link>{" "}
      <ChevronRight />
      <Link className="current-page"> #{drugReactionId}</Link>
    </div>
  );
};

export const FacilityDetailsBreadCrumbs = ({ incidentID }) => {
  const [facilityName, setFacilityName] = useState("");
  const [facilityId, setFacilityId] = useState(null);

  useEffect(() => {
    setFacilityName(localStorage.getItem("facilityName"));
    setFacilityId(localStorage.getItem("facilityId"));
  });
  return (
    <div className="breadcrumbs">
      <Link href={"/"} replace>
        Overview
      </Link>
      <ChevronRight />
      <Link href={"/facilities/"} replace>
        Facilities
      </Link>
      <ChevronRight />
      <Link href={`/facilities/${facilityId}/`} replace>
        {facilityName}
      </Link>
      <ChevronRight />
      <Link className="current-page" replace>
        #{incidentID}
      </Link>{" "}
    </div>
  );
};

function DrugReactionDetailsContent() {
  const [isFetching, setIsFetching] = useState(true);
  const [incidentDetails, setIncidentDetails] = useState({});
  const [latestIncidentDetails, setLatestIncidentDetails] = useState({});
  const [useOriginalVersion, setUseOriginalVersion] = useState(true);
  const [currentIncidentData, setCurrentIncidentData] = useState({});
  const [hasAccess, setHasAccess] = useState(true);
  //   const [incidentStatus, setIncidentStatus] = useState({});
  const { incidentId } = useParams()
  const [reviewsCount, setReviewsCount] = useState();

  const fetchIncidentDetails = async () => {
    setIsFetching(true);
    try {
      let response;

      // Fetch the original version of the incident
      if (useOriginalVersion) {
        response = await api.get(
          `${API_URL}/incidents/adverse-drug-reaction/${incidentId}/`
        );
        setIncidentDetails(response.data.incident); // Store the original data
        setCurrentIncidentData(response.data.incident); // Set current data for UI
        console.log(response.data);
      } else {
        // Fetch the latest modified version of the incident
        const res = await api.get(
          `${API_URL}/incidents/adverse-drug-reaction/${incidentId}/`
        );
        const latestIncident = res.data.modifications.versions.find((mod) => {
          return mod.latest === true;
        });
        if (res.status === 403) {
          setHasAccess(false);
        }

        if (latestIncident) {
          response = await api.get(
            `${API_URL}/incidents/adverse-drug-reaction/${incidentId}/versions/${latestIncident.id}/`
          );
          console.log(response.data);
          console.log(latestIncident);
          if (response.status === 403) {
            setHasAccess(false);
          }
        } else {
          response = res;
        }

        setLatestIncidentDetails(response.data.incident); // Store the latest modified version
        setCurrentIncidentData(response.data.incident); // Set current data for UI
      }

      setIsFetching(false); // Stop loading state
    } catch (error) {
      console.error("Error fetching incident details:", error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchIncidentDetails();
    console.log("currentincidentdata: ", currentIncidentData); // Fetch incident data when version toggles or incidentId changes
  }, [incidentId, useOriginalVersion]);

  useEffect(() => {
    const getIncidentReviews = async () => {
      try {
        const response = await api.get(
          `${API_URL}/incidents/adverse-drug-reaction/${incidentId}/reviews/`
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
          `${API_URL}/activities/list/${incidentId}/`
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
  return hasAccess ? (
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
              apiLink={"adverse_drug_reaction"}
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
              fullName={`${currentIncidentData.patient_name?.last_name} ${currentIncidentData.patient_name?.first_name} `}
              sex={currentIncidentData.patient_name?.gender}
              IncidentDate={currentIncidentData.incident_date}
              incidentTime={currentIncidentData.incident_time}
              incidentCategory={currentIncidentData.patient_type}
              incidentDetails={
                <DrugReactionContentTab data={currentIncidentData} />
              }
            />
            <IncidentTabs
              data={currentIncidentData}
              //   statuses={incidentStatus}
              generalInformation={
                <DrugReactionGeneraInfo
                  data={currentIncidentData}
                //   incidentStatuses={incidentStatus}
                />
              }
              otherInformation={
                <DrugReactionOtherInformation data={{
                  incident: currentIncidentData
                }} />
              }
              documentHistory={
                <DrugReactionDocumentHistory incidentId={incidentId} />
              }
              reviews={<IncidentReviewsTab incidentId={incidentId} apiLink={"adverse-drug-reaction"} setCount={setReviewsCount} />}
              documents={<IncidentDocuments incidentId={incidentId} />}
              reviewsCount={reviewsCount}
            />
          </div>
        </div>
      ) : (
        "No data"
      )}
    </div>
  ) : (
    <div className="no-access-text">You don't have access to this page</div>
  );
}
const IncidentDocuments = ({ incidentId, apiLink }) => {
  const [documents, setDocuments] = useState([]);
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(
          `/incidents/adverse_drug_reaction/${incidentId}/documents/`
        );
        if (response.status === 200) {
          setDocuments(response.data);
          console.log("Drug reaction: ", response.data);

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
function DrugReactionDetails() {
  //   const changeBreadCrumbs = localStorage.getItem("changeBreadCrumbs");
  //   const { drugReactionId } = useParams();
  return (
    <div>
      <DashboardLayout
        children={<DrugReactionDetailsContent />}
      // breadCrumbs={
      //   changeBreadCrumbs ? (
      //     <FacilityDetailsBreadCrumbs incidentID={drugReactionId} />
      //   ) : (
      //     <BreadCrumbs />
      //   )
      // }
      />
    </div>
  );
}

export default DrugReactionDetails;
