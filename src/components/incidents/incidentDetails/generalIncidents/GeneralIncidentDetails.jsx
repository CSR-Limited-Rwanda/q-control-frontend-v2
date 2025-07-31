'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import DashboardLayout from "@/app/dashboard/layout";
import IncidentDetailsHeader from "../IncidentDetailsHeader";
import IncidentDetails from "./IncidentDetails";
import IncidentTabs from "../IncidentTabs";
import GeneralIncidentDetailsContentTab from "./GeneralIncidentDetailsContentTab";
import api, { API_URL } from "@/utils/api";
import GeneralIncidentOtherInformation from "./GeneralIncidentOtherInformation";
import GeneralIncidentGeneralInformation from "./GeneralIncidentGeneralInformation";
import GeneralIncidentReviews from "./GeneralIncidentReviews";
import GeneralIncidentDocumentHistory from "./GeneralIncidentDocumentHistory";
import { ChevronRight } from "lucide-react";
import FilesList from "../../documentHistory/FilesList";
// import { FacilityDetailsBreadCrumbs } from "./DrugReactionDetails";
import NoResources from "@/components/NoResources";
import SendForReview from "../sendForReview/sendForReview";

// css
import '../../../../styles/_generalIncidentDetailsPage.scss'

const GeneralIncidentDetailsContent = () => {
    const { incidentId } = useParams();
    const [isFetching, setIsFetching] = useState(true);
    const [incidentDetails, setIncidentDetails] = useState({});
    const [latestIncidentDetails, setLatestIncidentDetails] = useState({});
    const [useOriginalVersion, setUseOriginalVersion] = useState(true);
    const [currentIncidentData, setCurrentIncidentData] = useState({});

    // Fetch incident details based on the selected version
    const fetchIncidentDetails = async () => {
        setIsFetching(true);
        try {
            let response;

            // Fetch the original version of the incident
            if (useOriginalVersion) {
                response = await api.get(`${API_URL}/incidents/general-visitor/${incidentId}/`);
                console.log(response.data);
                setIncidentDetails(response.data); // Store the original data
                setCurrentIncidentData(response.data); // Set current data for UI
            } else {
                // Fetch the latest modified version of the incident
                const res = await api.get(
                    `${API_URL}/incidents/general-visitor/${incidentId}/`
                );
                const latestIncident = res.data.modifications.versions.find((mod) => {
                    return mod.latest === true;
                });

                if (latestIncident) {
                    response = await api.get(
                        `${API_URL}/incidents/general-visitor/${incidentId}/versions/${latestIncident.id}/`
                    );
                    console.log(response.data);
                    console.log(latestIncident);
                } else {
                    response = res;
                }

                setLatestIncidentDetails(response.data); // Store the latest modified version
                setCurrentIncidentData(response.data); // Set current data for UI
            }

            setIsFetching(false); // Stop loading state
        } catch (error) {
            console.error("Error fetching incident details:", error);
            setIsFetching(false);
        }
    };

    console.log("real details ", incidentDetails);
    // UseEffect to fetch data when either the incidentId or useOriginalVersion changes
    useEffect(() => {
        fetchIncidentDetails(); // Fetch incident data when version toggles or incidentId changes
    }, [incidentId, useOriginalVersion]); // Dependencies trigger re-fetch

    return (
        <div className="incident-details-page">
            {isFetching ? (
                <div className="fetching-data">Loading data...</div>
            ) : incidentDetails && Object.keys(incidentDetails).length > 0 ? (
                <div className="incident-details">
                    <IncidentDetailsHeader
                        data={useOriginalVersion ? incidentDetails : latestIncidentDetails}
                        incidentDetailsId={incidentId}
                        apiLink={"general-visitor"}
                        sendTo={"send-to-department"}
                        useOriginalVersion={useOriginalVersion}
                        setCurrentIncidentData={setCurrentIncidentData} // Update UI on toggle
                        showClosedManager={false}
                    />
                    <div className="details">
                        <IncidentDetails
                            data={currentIncidentData} // Use current incident data here
                            fullName={
                                (currentIncidentData?.patient_visitor?.last_name || "") +
                                " " +
                                (currentIncidentData?.patient_visitor?.first_name || "")
                            }
                            sex={currentIncidentData?.patient_visitor?.gender || ""}
                            IncidentDate={currentIncidentData?.incident_date}
                            IncidentDOB={currentIncidentData?.patient_visitor?.date_of_birth}
                            IncidentPatientAge={currentIncidentData?.patient_visitor?.age}
                            incidentTime={currentIncidentData?.incident_time}
                            incidentCategory={currentIncidentData?.category}
                            incidentDetails={
                                <GeneralIncidentDetailsContentTab data={currentIncidentData} />
                            }
                        />
                        <IncidentTabs
                            data={currentIncidentData}
                            statuses={currentIncidentData}
                            generalInformation={
                                <GeneralIncidentGeneralInformation
                                    data={currentIncidentData}
                                    incidentStatuses={currentIncidentData}
                                />
                            }
                            otherInformation={
                                <GeneralIncidentOtherInformation data={currentIncidentData} />
                            }
                            reviews={<GeneralIncidentReviews />}
                            documentHistory={
                                <GeneralIncidentDocumentHistory incidentId={incidentId} />
                            }
                            documents={<IncidentDocuments incidentId={incidentId} />}
                        />
                    </div>
                </div>
            ) : (
                "No data"
            )}
        </div>
    );
};

const IncidentDocuments = ({ incidentId }) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await api.get(
                    `/incidents/general-visitor/${incidentId}/documents/`
                );
                if (response.status === 200) {
                    setDocuments(response.data);
                    console.log("Fetched: ", response.data);
                    localStorage.setItem("incidentDocumentCount", response.data.length);
                }
            } catch (error) {
                console.error("Error fetching documents:", error);
            }
        };
        fetchDocuments();
    }, []);

    return (
        <FilesList
            setDocuments={setDocuments}
            documents={documents}
            showDownload={true}
        />
    );
};

const BreadCrumbs = () => {
    const { incidentId } = useParams();
    return (
        <div className="breadcrumbs">
            <Link href={"/"}>Overview</Link> <ChevronRight />
            <Link href={"/incidents/"}>Incidents</Link> <ChevronRight />
            <Link href={"/incident/general/"}>General Incidents List</Link>{" "}
            <ChevronRight />
            <Link className="current-page"> #{incidentId}</Link>
        </div>
    );
};

const GeneralIncidentDetails = () => {
    const { incidentId } = useParams();
    const [sendForReview, setSendForReview] = useState(false);
    const [incidentDetails, setIncidentDetails] = useState({});

    useEffect(() => {
        // Fetch incident details using incidentId
        const fetchIncidentDetails = async () => {
            try {
                const response = await api.get(`/incidents/general-visitor/${incidentId}/`);
                setIncidentDetails(response.data);
            } catch (error) {
                console.error("Error fetching incident details:", error);
            }
        };

        fetchIncidentDetails();
    }, [incidentId]);
    return (
        <div>
            <DashboardLayout
                children={<GeneralIncidentDetailsContent />}
            >
                {/* {
                    sendForReview ?
                        <SendForReview path={'general-visitor'} incidentID={incidentId} handleClose={() => setSendForReview(false)} /> :
                        <button onClick={() => setSendForReview(true)}>Send for Review</button>
                } */}
            </DashboardLayout>
        </div>
    );
};

export default GeneralIncidentDetails;