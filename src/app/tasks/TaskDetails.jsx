import CloseIcon from "@/components/CloseIcon";
import Button from "@/components/forms/Button";
import { completeTask, fetchTaskById } from "@/hooks/fetchTasks";
import { Calendar, Eye, FileText, Flag, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const TaskDetails = ({ taskId, handleClose }) => {
  const [userPermissions, setUserPermissions] = useState({
    can_edit: false,
    can_delete: false,
    can_view: true,
    can_submit: false,
    can_complete: true,
  });
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

            {/* <div className="assigned-to">
                            <div className="assigned-to-icon">
                                <Users />
                                <small>Assigned To</small>
                            </div>
                            <p>{taskDetails.assigned_to}</p>
                        </div> */}

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
              {userPermissions.can_edit && (
                <Button text={"Edit Task"} className="gray" />
              )}
              {userPermissions.can_delete && (
                <Button text={"Delete Task"} className="danger" />
              )}
              {userPermissions.can_submit && (
                <Button text={"Submit Task"} className="success" />
              )}
              {userPermissions.can_complete && (
                <Button
                  onClick={handleCompleteTask}
                  isLoading={isSubmitting}
                  text={"Mark complete"}
                  className="light"
                />
              )}

              <Button
                text={"Back to tasks"}
                className="gray"
                onClick={handleClose}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
