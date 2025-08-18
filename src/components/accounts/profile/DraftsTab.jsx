import DateFormatter from "@/components/DateFormatter";
import api from "@/utils/api";
import { Eye, NotebookPen, Pencil, Square, SquareCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

export const DraftCategory = ({
  incident,
  title,
  apiLink,
  incidentName,
  fetchDrafts,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleSelectedItems = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    } else {
      setSelectedItems(
        selectedItems.filter((selectedItem) => selectedItem.id !== item.id)
      );
    }
  };

  const handleRowClick = (incidentId) => {
    router.push(`/${apiLink}/${incidentId}`);
    localStorage.setItem("canViewDraft", true);
  };

  const navigateToModify = (incidentId) => {
    router.push(`/${apiLink}/${incidentId}/update/`);
    localStorage.setItem("canModifyDraft", true);
  };

  const handleNonClickableColumnClick = (event) => {
    localStorage.setItem("canViewDraft", true);
    event.stopPropagation();
  };

  const handleSelectAll = (items) => {
    if (
      selectedItems.length === items.length &&
      items.every((item) =>
        selectedItems.some((selected) => selected.id === item.id)
      )
    ) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items);
    }
  };

  const handleDeleteDraft = async () => {
    if (selectedItems.length > 0) {
      try {
        setIsLoading(true);
        const response = await api.delete(`accounts/profile/drafts/`, {
          data: {
            draft_ids: selectedItems.map((item) => ({
              id: item.id,
              category: incidentName,
            })),
          },
        });

        if (response.status === 204 || response.status === 200) {
          setIsLoading(false);
          toast.success("Draft(s) deleted successfully");
          setSelectedItems([]);
          fetchDrafts();
        } else {
          toast.error("Unexpected response from server");
          console.error(response.data);
          setSelectedItems([]);
          setIsLoading(false);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to delete drafts"
        );
        console.error(error);
        setIsLoading(false);
        setSelectedItems([]);
      }
    } else {
      toast.error(
        "No draft(s) selected, select draft(s) to be deleted"
      );
      setSelectedItems([]);
    }
    setShowDeleteModal(false);
  };

  const handleDeleteClick = () => {
    if (selectedItems.length > 0) {
      setShowDeleteModal(true);
    } else {
      toast.error(
        "No draft(s) selected, select draft(s) to be deleted"
      );
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="categories">
      <div className="categories-header">
        <div className="categories-title">
          <NotebookPen />
          <h3>
            {title} ({incident.length})
          </h3>
        </div>
        <button
          className={`delete-draft-button ${isLoading ? "processing" : ""}`}
          onClick={handleDeleteClick}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Delete draft"}
        </button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Confirm Deletion</h2>
            <p className="modal-message">
              Are you sure you want to delete {selectedItems.length} draft
              {selectedItems.length > 1 ? "s" : ""}? This action cannot be
              undone.
            </p>
            <div className="modal-actions">
              <button className="cancel-button" onClick={handleCancelDelete}>
                Cancel
              </button>
              <button className="delete-button" onClick={handleDeleteDraft}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <table className="drafts-table">
        <thead>
          <tr className="table-header">
            <th>
              <div onClick={() => handleSelectAll(incident)}>
                {selectedItems.length === incident.length &&
                  incident.every((item) =>
                    selectedItems.some((selected) => selected.id === item.id)
                  ) ? (
                  <SquareCheck />
                ) : (
                  <Square />
                )}
              </div>
            </th>
            <th>No</th>
            <th>ID</th>
            <th>Current step</th>
            <th>Created at</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {incident &&
            incident.map((draft, index) => (
              <tr
                key={index}
                className={`table-row ${selectedItems.includes(draft) ? "selected" : ""
                  }`}
              >
                <td>
                  <div
                    onClick={() => handleSelectedItems(draft)}
                    className="icon"
                  >
                    {selectedItems.includes(draft) ? (
                      <SquareCheck color="#f97316" />
                    ) : (
                      <Square />
                    )}
                  </div>
                </td>
                <td>{index + 1}</td>
                <td>{draft.id}</td>
                <td>{draft.current_step}</td>
                <td>
                  <DateFormatter dateString={draft.created_at} />
                </td>
                <td>
                  <p
                    className={`follow-up ${draft.status === "Draft"
                      ? "in-progress"
                      : draft.status === "Closed"
                        ? "closed"
                        : "open"
                      }`}
                  >
                    {draft.status || "Not specified"}
                  </p>
                </td>
                <td
                  onClick={(event) => handleNonClickableColumnClick(event)}
                  className="action-col"
                >
                  <div className="table-actions">
                    {!draft.is_resolved && (
                      <Pencil
                        size={20}
                        onClick={() => navigateToModify(draft.id)}
                      />
                    )}
                    <Eye size={20} onClick={() => handleRowClick(draft.id)} />
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export const DraftsTab = () => {
  const [drafts, setDrafts] = useState({});
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);
  const [generalIncidents, setGeneralIncidents] = useState([]);
  const [grievances, setGrievances] = useState([]);
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

  const fetchDrafts = async () => {
    try {
      const response = await api.get(`accounts/profile/drafts/`);
      if (response.status === 200) {
        setDrafts(response.data);
        setGrievancesInvestigation(response.data.grievance_investigation || []);
        setGrievances(response.data.grievance_incident || []);
        setGeneralIncidents(response.data.general_incident || []);
        setLostAndFoundIncidents(response.data.lost_and_found || []);
        setEmployeeIncidents(response.data.staff_incident_report || []);
        setEmployeeHealthInvestigations(
          response.data.health_investigation || []
        );
        setWorkplaceViolenceIncidents(response.data.workplace_violence || []);
        setAdverseDrugReaction(response.data.adverse_drug_reaction || []);
        setMedicationError(response.data.medical_error || []);
        setLoading(false);
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        error.response?.error ||
        "Error fetching drafts data, try again later"
      );
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);

  return loading ? (
    <div className="loading">Loading...</div>
  ) : (
    <div className="draft-list">
      {error && <div className="error-message">{error}</div>}
      {Object.keys(drafts).length === 0 ||
        Object.values(drafts).every((arr) => arr.length === 0) ? (
        <div className="no-drafts">No drafts found</div>
      ) : (
        <div className="drafts-categories">
          <h2 className="drafts-title">
            Drafts (
            {Object.values(drafts).reduce(
              (acc, currArray) => acc + (currArray?.length || 0),
              0
            )}
            )
          </h2>
          {generalIncidents && generalIncidents.length > 0 ? (
            <DraftCategory
              incident={generalIncidents}
              title={"General incident reports"}
              apiLink={"incidents/general"}
              incidentName={"general_incident"}
              fetchDrafts={fetchDrafts}
            />
          ) : null}
          {grievances && grievances.length > 0 ? (
            <DraftCategory
              incident={grievances}
              title={"Grievance reports"}
              apiLink={"incidents/grievance"}
              incidentName={"grievance_incident"}
              fetchDrafts={fetchDrafts}
            />
          ) : null}
          {adverseDrugReaction && adverseDrugReaction.length > 0 ? (
            <DraftCategory
              incident={adverseDrugReaction}
              title={"Adverse drug reaction reports"}
              apiLink={"incidents/drug-reaction"}
              incidentName={"adverse_drug_reaction"}
              fetchDrafts={fetchDrafts}
            />
          ) : null}
          {lostAndFoundIncidents && lostAndFoundIncidents.length > 0 ? (
            <DraftCategory
              incident={lostAndFoundIncidents}
              title={"Lost & Found property reports"}
              apiLink={"incidents/lost-and-found"}
              incidentName={"lost_and_found"}
              fetchDrafts={fetchDrafts}
            />
          ) : null}
          {workplaceViolenceIncidents &&
            workplaceViolenceIncidents.length > 0 ? (
            <DraftCategory
              incident={workplaceViolenceIncidents}
              title={"Workplace violence reports"}
              apiLink={"incidents/workplace-violence"}
              incidentName={"workplace_violence"}
              fetchDrafts={fetchDrafts}
            />
          ) : null}
          {medicationError && medicationError.length > 0 ? (
            <DraftCategory
              incident={medicationError}
              title={"Medication error reports"}
              apiLink={"incidents/medical-error"}
              incidentName={"medical_error"}
              fetchDrafts={fetchDrafts}
            />
          ) : null}
          {employeeIncidents && employeeIncidents.length > 0 ? (
            <DraftCategory
              incident={employeeIncidents}
              title={"Staff Incident reports"}
              apiLink={"incidents/staff"}
              incidentName={"staff_incident_report"}
              fetchDrafts={fetchDrafts}
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
