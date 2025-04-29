import { useEffect, useState } from "react";

export const DraftsTab = () => {
    const [drafts, setDrafts] = useState({});
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const [generalIncidents, setGeneralIncidents] = useState(
        drafts.general_incident
    );
    const [grievances, setGrievances] = useState(drafts.grievances);
    const [grievanceInvestigations, setGrievancesInvestigation] = useState([]);
    const [lostAndFoundIncidents, setLostAndFoundIncidents] = useState([]);
    const [employeeIncidents, setEmployeeIncidents] = useState([]);
    const [employeeHealthInvestigations, setEmployeeHealthInvestigations] =
        useState([]);
    const [workplaceViolenceIncidents, setWorkplaceViolenceIncidents] = useState(
        []
    );
    const [adverseDrugReaction, setAdverseDrugReaction] = useState([]);
    const [medicationError, setMedicationError] = useState([]);
    useEffect(() => {
        // Fetch drafts data

        const fetchDrafts = async () => {
            // API call to fetch drafts data
            try {
                const response = await api.get(`incidents/overview/draft/user/`);
                if (response.status === 200) {
                    setDrafts(response.data);
                    setGrievancesInvestigation(response.data.grievance_investigation);
                    setGrievances(response.data.grievance_incident);
                    setGeneralIncidents(response.data.general_incident);
                    setLostAndFoundIncidents(response.data.lost_and_found);
                    setEmployeeIncidents(response.data.employee_incident);
                    setEmployeeHealthInvestigations(response.data.health_investigation);
                    setWorkplaceViolenceIncidents(response.data.workplace_violence);
                    setAdverseDrugReaction(response.data.adverse_drug_reaction);
                    setMedicationError(response.data.medical_error);
                    console.log(response.data);
                    setLoading(false);
                }
            } catch (error) {
                if (error.response) {
                    setError(
                        error.response.data.message ||
                        error.response.error ||
                        "Error fetching drafts data, try again later"
                    );
                } else {
                    setError("Unknown fetching drafts data, try again later");
                }
                setLoading(false);
                console.error(error);
            }
        };

        fetchDrafts();
    }, []);

    return loading ? (
        "Loading"
    ) : (
        <div className="draft-list">
            {error && <div className="error-message">{error}</div>}
            {drafts && drafts.length > 0 ? (
                "No drafts found"
            ) : (
                <div className="drafts-categories">
                    Drafts (
                    {Object.values(drafts).reduce(
                        (acc, currArray) => acc + currArray.length,
                        0
                    )}
                    )
                    {generalIncidents && generalIncidents.length > 0 ? (
                        <DraftCategory
                            incident={generalIncidents}
                            title={"General incident reports"}
                            apiLink={"incident/general"}
                            incidentName={"general"}
                        />
                    ) : (
                        ""
                    )}
                    {grievances && grievances.length > 0 ? (
                        <DraftCategory
                            incident={grievances}
                            title={"Grievance reports"}
                            apiLink={"incident/grievance"}
                            incidentName={"grievance"}
                        />
                    ) : (
                        ""
                    )}
                    {adverseDrugReaction && adverseDrugReaction.length > 0 ? (
                        <DraftCategory
                            incident={adverseDrugReaction}
                            title={"Adverse drug reaction reports"}
                            apiLink={"incident/drug-reaction"}
                            incidentName={"adverse_drug_reaction"}
                        />
                    ) : (
                        ""
                    )}
                    {lostAndFoundIncidents && lostAndFoundIncidents.length > 0 ? (
                        <DraftCategory
                            incident={lostAndFoundIncidents}
                            title={"Lost & Found property reports"}
                            apiLink={"incident/lost_and_found"}
                            incidentName={"lost_and_found"}
                        />
                    ) : (
                        ""
                    )}
                    {workplaceViolenceIncidents &&
                        workplaceViolenceIncidents.length > 0 ? (
                        <DraftCategory
                            incident={workplaceViolenceIncidents}
                            title={"Workplace violence reports"}
                            apiLink={"incident/workplace_violence"}
                            incidentName={"workplace_violence"}
                        />
                    ) : (
                        ""
                    )}
                    {medicationError && medicationError.length > 0 ? (
                        <DraftCategory
                            incident={medicationError}
                            title={"Medication error reports"}
                            apiLink={"incident/medication_error"}
                            incidentName={"medication_error"}
                        />
                    ) : (
                        ""
                    )}
                    {employeeIncidents && employeeIncidents.length > 0 ? (
                        <DraftCategory
                            incident={employeeIncidents}
                            title={"Staff Incident reports"}
                            apiLink={"incident/employee_incident"}
                            incidentName={"employee_incident"}
                        />
                    ) : (
                        ""
                    )}
                </div>
            )}
        </div>
    );
};