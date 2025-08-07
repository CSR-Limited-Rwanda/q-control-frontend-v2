import api from "@/utils/api";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const TaskDetailsPopup = ({ task, discardFn, templateId }) => {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCompleteTask = async () => {
    const payload = {
      status: "Completed",
    };
    try {
      setIsCompleting(true);
      const response = await api.put(
        `/permissions/review-templates/${templateId}/tasks/${task.id}/`,
        payload
      );

      if (response.status === 201 || response.status === 200) {

        // setTimeout(() => {
        // //   window.location.reload();
        // }, 2000);
      }
    } catch (error) {
      console.error("Error adding groups:", error);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="task-details-popup">
      <div className="col-1">
        <h4>Task Details</h4>
        <div className="days">
          <span>{task?.number_of_days_to_complete} Day(s) remaining</span>
        </div>
        <div className="review-task">
          <h3>{task?.description}</h3>
          <span>Admin, Supervisor, Manager review</span>
        </div>

        <div className="col">
          <div className="row">
            <span className="group-title">Assigned group(s)</span>{" "}
            <span className="group-number">{task?.review_groups?.length}</span>
          </div>
          {task?.review_groups?.length > 0 ? (
            <div className="groups-container">
              {task?.review_groups.map((group, index) => (
                <div key={index} className="group-name">
                  {group.name}
                </div>
              ))}
            </div>
          ) : (
            <div className="groups-container">
              <div className="group-name">No assigned group</div>
            </div>
          )}
        </div>
      </div>
      <div className="col-2">
        <span>
          {task?.require_approval_for_all_groups
            ? "Require approval from each group"
            : "Require approval from any group"}
        </span>
        <div className="action-buttons">
          <>
            <button
              className="third-button"
              onClick={() => {
                window.location.reload();
                discardFn();
              }}
            >
              Discard
            </button>
            <button className="primary-button" onClick={handleCompleteTask}>
              {isCompleting ? "Completing..." : "Complete Task"}
            </button>
          </>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPopup;
