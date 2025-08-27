import CloseIcon from "@/components/CloseIcon";
import Button from "@/components/forms/Button";
import PermissionsGuard from "@/components/PermissionsGuard";
import {
  approveTask,
  completeTask,
  fetchTaskById,
  fetchTaskPermissions,
  submitTask,
} from "@/hooks/fetchTasks";
import { set } from "date-fns";
import {
  Calendar,
  Eye,
  FileText,
  Flag,
  LoaderCircle,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export const TaskDetails = ({ taskId, handleClose }) => {
  const [loadingPermissions, setLoadingPermissions] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [error, setError] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const popupRef = useRef(null);
  const router = useRouter();

  const handleCompleteTask = async () => {
    setIsCompleting(true);
    const response = await completeTask(taskId);
    if (response.success) {
      toast.success(response.message);
      handleClose();
    } else {
      setError(response.message);
    }
    setIsCompleting(false);
  };

  const handleSubmitTask = async () => {
    setIsSubmitting(true);
    const response = await submitTask(taskId);
    if (response.success) {
      toast.success(response.message);
      handleClose();
    } else {
      setError(response.message);
    }
    setIsSubmitting(false);
  };

  const handleApproveTask = async () => {
    setIsApproving(true);
    const response = await approveTask(taskId);
    if (response.success) {
      toast.success(response.message);
      handleClose();
    } else {
      setError(response.message);
    }
    setIsApproving(false);
  };

  // Function to handle navigation and localStorage based on incident_type
  const handleIncidentClick = (incidentId, reportName) => {
    let url = `/incidents/general/${incidentId}/`;
    if (!reportName) {
      localStorage.setItem("generalIncidentId", incidentId);
    } else {
      switch (reportName) {
        case "General Patient Visitor":
          localStorage.setItem("generalIncidentId", incidentId);
          url = `/incidents/general/${incidentId}/`;
          break;
        case "Adverse Drug Reaction":
          localStorage.setItem("adverseDrugReactionId", incidentId);
          url = `/incidents/drug-reaction/${incidentId}/`;
          break;
        case "Lost and Found":
          localStorage.setItem("lostAndFoundId", incidentId);
          url = `/incidents/lost-and-found/${incidentId}/`;
          break;
        case "Medication Error":
          localStorage.setItem("medicationErrorIncidentId", incidentId);
          url = `/incidents/medication-error/${incidentId}/`;
          break;
        case "Staff Incident Report":
          localStorage.setItem("staffIncidentId", incidentId);
          url = `/incidents/staff/${incidentId}/`;
          break;
        case "workplace violence":
          localStorage.setItem("workplaceViolenceId", incidentId);
          url = `/incidents/workplace-violence/${incidentId}/`;
          break;
        case "Grievance":
          localStorage.setItem("grievanceId", incidentId);
          url = `/incidents/grievance/${incidentId}/`;
          break;
        default:
          localStorage.setItem("generalIncidentId", incidentId);
          url = `/incidents/general/${incidentId}/`;
          break;
      }
    }
    router.push(url);
  };

  useEffect(() => {
    const fetchTaskDetailsAndPermissions = async () => {
      setIsLoading(true);
      setLoadingPermissions(true);

      try {
        const [taskResponse, permissionsResponse] = await Promise.all([
          fetchTaskById(taskId),
          fetchTaskPermissions(taskId),
        ]);

        if (taskResponse.success) {
         
          setTaskDetails(taskResponse.data);
        } else {
          console.error("Task details error:", taskResponse.message);
        }

        if (!permissionsResponse.success) {
          console.error("Permissions error:", permissionsResponse.message);
        }

        setPermissions(permissionsResponse.data);
      } catch (error) {
        console.error("Error fetching task data:", error);
      } finally {
        setIsLoading(false);
        setLoadingPermissions(false);
      }
    };

    fetchTaskDetailsAndPermissions();
  }, [taskId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  return (
    <div className="popup">
      <div className="popup-content" ref={popupRef}>
        <CloseIcon onClick={handleClose} />
        <h2>Task Details</h2>
        {isLoading && <p>Loading task details...</p>}
        {taskDetails && (
          <div className="task-details">
            <h3 className="task-title">{taskDetails.name}</h3>
            <p>{taskDetails.description}</p>

            <div className="priority">
              <div className="priority-icon">
                <Flag color="gray" />
                <small>Priority</small>
              </div>
              <div
                className={`priority-value ${
                  taskDetails.task_priority === 1
                    ? "high"
                    : taskDetails.task_priority === 2
                    ? "medium"
                    : "low"
                }`}
              >
                {taskDetails.task_priority === 1
                  ? "High"
                  : taskDetails.task_priority === 2
                  ? "Medium"
                  : "Low"}
              </div>
            </div>

            <div className="deadline">
              <div className="deadline-icon">
                <Calendar color="gray" />
                <small>Deadline</small>
              </div>
              <p>{taskDetails.deadline}</p>
            </div>

            <div className="assigned-to">
              <div className="assigned-to-icon">
                <Users />
                <small>Assigned to</small>
              </div>
              {taskDetails.review_groups?.length > 0 && (
                <div className="task-assigned-to">
                  {taskDetails.review_groups.map((reviewer, index) => (
                    <Link
                      className="card"
                      href={`/accounts/review-groups/${reviewer.id}/tasks`}
                      key={index}
                    >
                      {reviewer.name}
                    </Link>
                  ))}
                </div>
              )}
              {taskDetails.reviewers?.length > 0 && (
                <div className="task-assigned-to">
                  {taskDetails.reviewers.map((reviewer, index) => (
                    <Link
                      className="card"
                      href={`/accounts/${reviewer.id}/tasks`}
                      key={index}
                    >
                      {reviewer.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="incident">
              <div className="incident-icon">
                <FileText color="gray" />
                <small>Incident</small>
              </div>
              <div className="incident-container">
                <p>
                  {taskDetails.incident?.incident_type ||
                    "No incident reported"}
                </p>
                {taskDetails.incident?.id && (
                  <button
                    type="button"
                    className="light"
                    onClick={() =>
                      handleIncidentClick(
                        taskDetails.incident.id,
                        taskDetails.incident.incident_type
                      )
                    }
                  >
                    <Eye color="gray" />
                    View Incident
                  </button>
                )}
              </div>
            </div>
            {error && <p className="message error">Error: {error}</p>}

            {loadingPermissions ? (
              <LoaderCircle className="loading-icon" />
            ) : (
              <div className="buttons">
                {permissions.can_complete_task && (
                  <Button
                    text={"Complete Task"}
                    onClick={() => handleCompleteTask(taskDetails.id)}
                    isLoading={isCompleting}
                  />
                )}
                {permissions.can_submit_task && (
                  <Button
                    text={"Submit Task"}
                    className="secondary"
                    onClick={() => handleSubmitTask(taskDetails.id)}
                    isLoading={isSubmitting}
                  />
                )}
                {permissions.can_approve_task && (
                  <Button
                    onClick={handleApproveTask}
                    isLoading={isApproving}
                    text={"Approve Task"}
                    className="light"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
