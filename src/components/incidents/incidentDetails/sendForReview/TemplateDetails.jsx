import { fetchReviewTemplateTasks } from "@/hooks/fetchReviewTemplates";
import { CheckSquare2, Square } from "lucide-react";
import { useEffect, useState } from "react";

export const TemplateDetails = ({ template }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [templateDetails, setTemplateDetails] = useState(null);

    useEffect(() => {
        const fetchTemplateDetails = async () => {
            setIsLoading(true);
            const response = await fetchReviewTemplateTasks(template.id);
            if (response.success) {
                console.log(response.data)
                setTemplateDetails(response.data);
            } else {
                console.error(response.message);
            }
            setIsLoading(false);
        };
        fetchTemplateDetails();
    }, [template]);
    return (
        <div className="template-details-container">
            <h3>{templateDetails?.length} Tasks</h3>
            {isLoading ? (
                <p>Loading template details...</p>
            ) : (
                <div>
                    {isLoading ? (
                        <p>Loading template tasks...</p>
                    ) : (
                        <div className="template-tasks">
                            {templateDetails && templateDetails.map((task) => (
                                <div className='template-task' key={task.id}>
                                    <div className="name-days">
                                        <span> Task {task.task_priority}</span>
                                        <span >{task.number_of_days_to_complete} days</span>
                                    </div>

                                    <div className="template-assigned-group">
                                        <div className="task-details">
                                            <h4>{task.name}</h4>
                                            <p>{task.description}</p>
                                        </div>
                                        <div className="template-review-groups">
                                            <small>Assigned groups <span className='number-of-groups'>{task?.review_groups?.length}</span></small>
                                            {task?.review_groups?.map((group) => (
                                                <p key={group.id} className="template-review-group">
                                                    {group.name}
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="approval">
                                        {
                                            task?.require_approval_for_all_groups ?  <span>Require approval from each group</span> : <span>Require approval from any group</span>
                                        }
                                       
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}