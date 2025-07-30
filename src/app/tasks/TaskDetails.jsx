import Button from "@/components/forms/Button"
import { completeTask, fetchTaskById, submitTask, approveTask } from "@/hooks/fetchTasks"
import { Calendar, Eye, FileText, Flag, Users, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"

export const TaskDetails = ({ userID, taskId, handleClose }) => {

    const [userPermissions, setUserPermissions] = useState({
        can_edit: false,
        can_delete: false,
        can_view: true,
        can_submit: true,
        can_complete: true,
        can_approve: true
    })
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isCompleting, setIsCompleting] = useState(false)
    const [isApproving, setIsApproving] = useState(false)
    const [error, setError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    const [taskDetails, setTaskDetails] = useState(null)
    const popupRef = useRef(null)


    const handleCompleteTask = async () => {
        setIsCompleting(true)
        const response = await completeTask(taskId)
        if (response.success) {
            setSuccessMessage(response.message)
            setTimeout(() => {
                setSuccessMessage(null)
                handleClose()
            }, 1000);
        } else {
            setError(response.message)
        }
        setIsCompleting(false)
    }

    const handleSubmitTask = async () => {
        setIsSubmitting(true)
        const response = await submitTask(taskId)
        if (response.success) {
            setSuccessMessage(response.message)
            setTimeout(() => {
                setSuccessMessage(null)
                handleClose()
            }, 1000);
        } else {
            setError(response.message)
        }
        setIsSubmitting(false)
    }

    const handleApproveTask = async () => {
        setIsApproving(true)
        const response = await approveTask(taskId)
        if (response.success) {
            setSuccessMessage(response.message)
            setTimeout(() => {
                setSuccessMessage(null)
                handleClose()
            }, 1000);
        } else {
            setError(response.message)
        }
        setIsApproving(false)
    }

    useEffect(() => {
        const fetchTaskDetails = async () => {
            const response = await fetchTaskById(taskId)
            if (response.success) {
                setTaskDetails(response.data)
            } else {
                console.error(response.message)
            }
            setIsLoading(false)
        }
        fetchTaskDetails()
    }, [taskId])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                handleClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [handleClose])

    return (
        <div className='popup'>
            <div className="popup-content" ref={popupRef}>
                <div className="close-icon" onClick={handleClose}>
                    <X />
                </div>
                <h2>Task Details</h2>
                {isLoading && <p>Loading task details...</p>}
                {taskDetails && (
                    <div className='task-details'>

                        <h3 className="task-title">{taskDetails.name}</h3>
                        <p>{taskDetails.description}</p>

                        <div className="priority">
                            <div className='priority-icon'>
                                <Flag color='gray' />
                                <small>Priority</small>
                            </div>

                            <div className={`priority-value ${taskDetails.task_priority === 1 ? 'high' : taskDetails.task_priority === 2 ? 'medium' : 'low'}`}>
                                {taskDetails.task_priority === 1 ? 'High' : taskDetails.task_priority === 2 ? 'Medium' : 'Low'}
                            </div>
                        </div>

                        <div className="deadline">
                            <div className="deadline-icon">
                                <Calendar color='gray' />
                                <small>Deadline</small>
                            </div>
                            <p>{taskDetails.deadline}</p>
                        </div>

                        <div className="assigned-to">
                            <div className="assigned-to-icon">
                                <Users />
                                <small>Assigned To</small>
                            </div>
                            <div className="assigned-to">
                                {
                                    taskDetails?.reviewers?.length > 0 ?
                                        <>
                                            {taskDetails.reviewers.slice(0, 2).map((reviewer, index) => (
                                                <span className='assigned-user' key={index}>{userID && userID === reviewer.id ? 'You' : reviewer.name}</span>
                                            ))}
                                            {taskDetails.reviewers.length > 2 && <span className='more-users'>+{taskDetails.reviewers.length - 2}</span>}
                                        </>
                                        : taskDetails?.review_groups?.length > 0 ?
                                            <>
                                                {taskDetails.review_groups.slice(0, 2).map((group, index) => (
                                                    <span className='assigned-group' key={index}>{group.name}</span>
                                                ))}
                                                {taskDetails.review_groups.length > 2 && <span className='more-groups'>+{taskDetails.review_groups.length - 2}</span>}
                                            </>
                                            : <span className='unassigned'>Unassigned</span>
                                }
                            </div>
                        </div>

                        <div className="incident">
                            <div className="incident-icon">
                                <FileText color='gray' />
                                <small>Incident</small>
                            </div>
                            <div className="incident-container">
                                <p>{taskDetails.incident || 'No incident reported'}</p>
                                {
                                    taskDetails.incident && (
                                        <button type="button" className="light">
                                            <Eye color='gray' />
                                            View Incident
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        {
                            error && <p className='message error'>Error: {error}</p>
                        }

                        <div className="buttons">
                            {userPermissions.can_edit && (
                                <Button text={'Edit Task'} className="gray" />
                            )}
                            {userPermissions.can_delete && (
                                <Button text={'Delete Task'} className="danger" />
                            )}
                            {userPermissions.can_submit && (
                                <Button text={'Submit Task'} className="success" onClick={handleSubmitTask} isLoading={isSubmitting} />
                            )}
                            {userPermissions.can_complete && (
                                <Button onClick={handleCompleteTask} isLoading={isCompleting} text={'Mark complete'} className="light" />
                            )}

                            <Button text={'Back to tasks'} className="gray" onClick={handleClose} />
                        </div>
                    </div>


                )}


            </div>
        </div>
    )
}