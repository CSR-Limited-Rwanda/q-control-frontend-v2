import CloseIcon from "@/components/CloseIcon";
import Button from "@/components/forms/Button";
import PermissionsGuard from "@/components/PermissionsGuard";
import { completeTask, fetchTaskById, submitTask } from "@/hooks/fetchTasks";
import { Calendar, Eye, FileText, Flag, Users, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export const TaskDetails = ({ taskId, handleClose }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [taskDetails, setTaskDetails] = useState(null);
  const popupRef = useRef(null);

  const handleCompleteTask = async () => {
    setIsSubmitting(true);
    const response = await completeTask(taskId);
    if (response.success) {
      setSuccessMessage(response.message);
      setTimeout(() => {
        setSuccessMessage(null);
        handleClose();
      }, 1000);
    } else {
      setError(response.message);
    }
    setIsSubmitting(false);
  };

  const handleSubmitTask = async () => {
    setIsSubmitting(true);
    const response = await submitTask(taskId);
    if (response.success) {
      setSuccessMessage(response.message);
      setTimeout(() => {
        setSuccessMessage(null);
        handleClose();
      }, 1000);
    } else {
      setError(response.message);
    }
    setIsSubmitting(false);
  };

  const handleEditTask = () => {
    router.push(`/tasks/${taskId}/edit`);
  }

  useEffect(() => {
    const fetchTaskDetails = async () => {
      const response = await fetchTaskById(taskId);
      if (response.success) {
        setTaskDetails(response.data);
      } else {
        console.error(response.message);
      }
      setIsLoading(false);
    };
    fetchTaskDetails();
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
                className={`priority-value ${taskDetails.task_priority === 1
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
              {
                taskDetails.review_groups?.length > 0 &&
                <div className="task-assigned-to">{taskDetails.review_groups.map((reviewer, index) => (
                  <Link className="card" href={`/accounts/review-groups/${reviewer.id}/tasks`} key={index}>{reviewer.name}</Link>
                ))}</div>
              }
              {
                taskDetails.reviewers?.length > 0 &&
                <div className="task-assigned-to">{taskDetails.reviewers.map((reviewer, index) => (
                  <Link className="card" href={`/accounts/${reviewer.id}/tasks`} key={index}>{reviewer.name}</Link>
                ))}</div>
              }
            </div>

            <div className="incident">
              <div className="incident-icon">
                <FileText color="gray" />
                <small>Incident</small>
              </div>
              <div className="incident-container">
                <p>{taskDetails.incident || "No incident reported"}</p>
                {taskDetails.incident && (
                  <button type="button" className="light">
                    <Eye color="gray" />
                    View Incident
                  </button>
                )}
              </div>
            </div>
            {error && <p className="message error">Error: {error}</p>}
            <div className="buttons">
              <Button text={"Submit Task"} className="success" onClick={() => handleSubmitTask(taskDetails.id)} />
              <Button
                onClick={handleCompleteTask}
                isLoading={isSubmitting}
                text={"Mark complete"}
                className="light"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
