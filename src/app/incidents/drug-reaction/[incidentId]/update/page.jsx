'use client'
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/app/dashboard/layout";
import api from "@/utils/api";
import { useParams } from "react-router-dom";
import ModifyAdverseDruReactionForm from "@/components/incidents/modifyIncidents/ModifyAdverseDrugPage";
import { MoveRight } from "lucide-react";
// import { usePermission } from "../../../../contexts/permissionsContext";
import NoResources from "@/components/NoResources";

const ModifyMedicalAdverseDrugReactionIncidentPageContent = ({ }) => {
    const [incident, setIncident] = useState({});
    const { incidentId } = useParams();
    const [hasAccess, setHasAccess] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [adverseDrugReactionId, setAdverseDrugReactionId] = useState(
        localStorage.getItem("adverseDrugReactionId")
    )

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(
                    `/incidents/adverse-drug-reaction/${adverseDrugReactionId}/`
                );
                if (response.status === 200) {

                    setIncident(response.data.incident);
                    setIsLoading(false);
                }
                // if (response.status === 403) {
                //     setHasAccess(false);
                // }
            } catch (error) {
                if (error.response.status === 404) {
                    setIsError(true);
                }

                setIsLoading(false);
            } finally {
                setIsLoading(false);
            }
        };
        fetchIncident();
    }, []);

    return isLoading ? (
        "Getting data..."
    ) : !isError ? (
        <ModifyAdverseDruReactionForm data={incident} />
    ) : (
        "No data"
    );
};

const BreadCrumbs = () => {
    const { incidentId } = useParams();
    return (
        <div className="breadcrumbs">
            <Link to={"/"}>Overview</Link> <MoveRight />
            <Link to={"/incidents/"}>Incidents</Link> <MoveRight />
            <Link to={"/incidents/drug-reaction/"}>
                Anaphylaxis/Adverse Drug Reaction List
            </Link>{" "}
            <MoveRight />
            <Link to={`/incidents/drug-reaction/${incidentId}/`}>
                #{incidentId}
            </Link>{" "}
            <MoveRight />
            <Link className="current-page"> Modify</Link>
        </div>
    );
};

const ModifyMedicalAdverseDrugReactionIncidentPage = () => {
    const [changeBreadCrumbs, setChangeBreadCrumbs] = useState(null);

    useEffect(() => {
        const storedValue = localStorage.getItem("changeBreadCrumbs")
        setChangeBreadCrumbs(storedValue);
    }, [])
    return (
        <DashboardLayout
            children={
                <ModifyMedicalAdverseDrugReactionIncidentPageContent />
            }
        />
    )
};

export default ModifyMedicalAdverseDrugReactionIncidentPage;

// export const FacilityBreadCrumbs = ({ facilityIncidentLink }) => {
//     const [facilityName, setFacilityName] = useState("");
//     const [facilityId, setFacilityId] = useState(null);
//     const { incidentId } = useParams();
//     const [incident, setIncident] = useState({});
//     const [isLoading, setIsLoading] = useState(false);

//     useEffect(() => {
//         setFacilityName(localStorage.getItem("facilityName"));
//         setFacilityId(localStorage.getItem("facilityId"));
//     });
//     return (
//         <div className="breadcrumbs">
//             <Link href={"/"} replace>
//                 Overview
//             </Link>
//             <MoveRight />
//             <Link href={"/facilities/"} replace>
//                 Facilities
//             </Link>
//             <MoveRight />
//             <Link href={`/facilities/${facilityId}/`} replace>
//                 {facilityName}
//             </Link>
//             <MoveRight />
//             <Link href={`/incidents/${facilityIncidentLink}/${incidentId}/`} replace>
//                 #{incidentId}
//             </Link>{" "}
//             <MoveRight />
//             <Link className="current-page"> Modify</Link>
//         </div>
//     );
// };