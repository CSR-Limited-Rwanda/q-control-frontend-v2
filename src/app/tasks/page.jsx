'use client'
import '@/styles/_userTasks.scss'
import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../dashboard/layout'
import { fetchTaskById, fetchTasks, fetchUserTasks } from '@/hooks/fetchTasks'
import { createUrlParams } from '@/utils/api'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Calendar, Eye, FileText, Flag, Square, SquareCheck, Users, X } from 'lucide-react'

const TasksPage = () => {
    const [userInfo, setUserInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSearching, setIsSearching] = useState(false)
    const [tasks, setTasks] = useState([])
    const [selectedTask, setSelectedTask] = useState(null)
    const [selectedTasks, setSelectedTasks] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [status, setStatus] = useState(null)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [showTaskDetails, setShowTaskDetails] = useState(false)
    const [parameters, setParameters] = useState({
        page: page,
        page_size: pageSize,
        q: searchQuery,
        status: status,
        sort_by: 'created_at',
        sort_order: 'asc'
    })

    const loadTasks = async (userId) => {

        const queryParams = createUrlParams(parameters)
        const response = await fetchUserTasks(userId, queryParams)
        if (response.success) {
            setTasks(response.data)
        } else {
            setError(response.message)
        }
        setIsLoading(false)
    }

    // check if all tasks are selected
    const isAllTasksSelected = () => {
        return tasks.length > 0 && selectedTasks.length === tasks.length
    }


    // handle select all tasks
    const handleSelectAllTasks = () => {
        if (isAllTasksSelected()) {
            setSelectedTasks([])
        } else {
            setSelectedTasks(tasks.map(task => task.id))
        }

    }

    // handle select task
    const handleSelectTask = (taskId) => {
        if (selectedTasks.includes(taskId)) {
            setSelectedTasks(selectedTasks.filter(id => id !== taskId))
        } else {
            setSelectedTasks([...selectedTasks, taskId])
        }
    }

    // handle open task details
    const handleOpenTaskDetails = (e, taskId) => {
        e.stopPropagation()
        setSelectedTask(taskId)
        setShowTaskDetails(true)
    }


    // handle search query change
    const handleSearchChange = async (e) => {
        setIsSearching(true)
        const query = e.target.value
        setSearchQuery(query)
        setParameters({
            ...parameters,
            q: query,
            page: 1
        })
        setPage(1)

        await loadTasks(userInfo?.id)
        setIsSearching(false)

    }

    // handle sorting tasks
    const handleSortTasks = (sortBy, sortOrder) => {
        setParameters({
            ...parameters,
            sort_by: sortBy,
            sort_order: sortOrder
        })

        // sort tasks based on the selected field and order
        const sortedTasks = [...tasks].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[sortBy] > b[sortBy] ? 1 : -1
            } else {
                return a[sortBy] < b[sortBy] ? 1 : -1
            }
        })
        setTasks(sortedTasks)
    }
    useEffect(() => {
        // Initialize localStorage values on client side
        if (typeof window !== 'undefined') {
            setPage(localStorage.getItem('tasksPage') || 1)
            setPageSize(localStorage.getItem('tasksPageSize') || 10)
        }

        const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('loggedInUserInfo') || 'null') : null
        if (!user && typeof window !== 'undefined') {
            localStorage.removeItem('access')
            window.location.reload()
        }
        setUserInfo(user)
        console.log('User Info:', user)
        if (user?.id) {
            loadTasks(user.id)
        }
    }, [])


    return (
        <DashboardLayout>
            <h1>Tasks Page</h1>
            {isLoading && <p>Loading tasks...</p>}
            {error && <p className='message error'>Error: {error}</p>}
            <div className="filters-container">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <table>
                <thead>
                    <tr>
                        <th>
                            <div onClick={handleSelectAllTasks} className='select-all'>
                                {
                                    tasks.length > 0 && selectedTasks.length === tasks.length ? <SquareCheck /> : <Square />
                                }
                            </div>
                        </th>
                        <th className='sort-cell'>
                            Task Name
                            <div className="sort-icon" onClick={() => handleSortTasks('name', parameters.sort_order === 'asc' ? 'desc' : 'asc')}>
                                {
                                    parameters.sort_by === 'name' && parameters.sort_order === 'asc' ?
                                        <ArrowDownNarrowWide />
                                        : parameters.sort_by === 'name' && parameters.sort_order === 'desc' ?
                                            <ArrowUpNarrowWide />
                                            : <ArrowDownNarrowWide />
                                }
                            </div>
                        </th>
                        <th>Description</th>
                        <th className='sort-cell'>
                            Deadline
                            <div className="sort-icon" onClick={() => handleSortTasks('deadline', parameters.sort_order === 'asc' ? 'desc' : 'asc')}>
                                {
                                    parameters.sort_by === 'deadline' && parameters.sort_order === 'asc' ?
                                        <ArrowDownNarrowWide />
                                        : parameters.sort_by === 'deadline' && parameters.sort_order === 'desc' ?
                                            <ArrowUpNarrowWide />
                                            : <ArrowDownNarrowWide />
                                }
                            </div>
                        </th>
                        <th>Incident</th>
                        <th className='sort-cell' >
                            Status
                            <div className="sort-icon" onClick={() => handleSortTasks('status', parameters.sort_order === 'asc' ? 'desc' : 'asc')}>
                                {
                                    parameters.sort_by === 'status' && parameters.sort_order === 'asc' ?
                                        <ArrowDownNarrowWide />
                                        : parameters.sort_by === 'status' && parameters.sort_order === 'desc' ?
                                            <ArrowUpNarrowWide />
                                            : <ArrowDownNarrowWide />
                                }
                            </div>
                        </th>
                        <th>Priority</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks.map((task) => (
                        <tr className={`task-row ${selectedTasks.includes(task.id) ? 'selected' : ''} ${isSearching ? 'is-searching' : ''}`} key={task.id} onClick={(e) => handleOpenTaskDetails(e, task.id)}>
                            <td>
                                <div onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectTask(task.id);
                                }} className='select-task'>
                                    {selectedTasks.includes(task.id) ? <SquareCheck /> : <Square />}
                                </div>
                            </td>
                            <td>{task.name}</td>
                            <td>{task.description}</td>
                            <td>{task.deadline}</td>
                            <td>{task.incident}</td>
                            <td>{task.status}</td>
                            <td>{
                                task.task_priority === 1 ?
                                    <div className="high priority-value">
                                        <small>High</small>
                                    </div>
                                    : task.task_priority === 2 ?
                                        <div className="medium priority-value">
                                            <small>Medium</small>
                                        </div>
                                        : <div className="low priority-value">
                                            <small>Low</small>
                                        </div>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                showTaskDetails && selectedTask && (
                    <TaskDetails taskId={selectedTask} handleClose={() => setShowTaskDetails(false)} />
                )
            }
        </DashboardLayout>
    )
}

export default TasksPage


export const TaskDetails = ({ taskId, handleClose }) => {
    const [userPermissions, setUserPermissions] = useState({
        can_edit: false,
        can_delete: false,
        can_view: true,
        can_submit: false,
        can_complete: true
    })
    const [isLoading, setIsLoading] = useState(true)
    const [taskDetails, setTaskDetails] = useState(null)
    const popupRef = useRef(null)

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
                        {/* <p><strong>Name:</strong> {taskDetails.name}</p>
                        <p><strong>Description:</strong> {taskDetails.description}</p>
                        <p><strong>Deadline:</strong> {taskDetails.deadline}</p>
                        <p><strong>Incident:</strong> {taskDetails.incident}</p>
                        <p><strong>Status:</strong> {taskDetails.status}</p>
                        <p><strong>Priority:</strong> {taskDetails.task_priority === 1 ? 'High' : taskDetails.task_priority === 2 ? 'Medium' : 'Low'}</p> */}

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

                        {/* <div className="assigned-to">
                            <div className="assigned-to-icon">
                                <Users />
                                <small>Assigned To</small>
                            </div>
                            <p>{taskDetails.assigned_to}</p>
                        </div> */}

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

                        <div className="buttons">
                            {userPermissions.can_edit && (
                                <button type="button" className="primary">
                                    Edit Task
                                </button>
                            )}
                            {userPermissions.can_delete && (
                                <button type="button" className="danger">
                                    Delete Task
                                </button>
                            )}
                            {userPermissions.can_submit && (
                                <button type="button" className="success">
                                    Submit Task
                                </button>
                            )}
                            {userPermissions.can_complete && (
                                <button type="button" className="light">
                                    Mark complete
                                </button>
                            )}

                            <button className="gray" onClick={handleClose}>
                                Back to tasks
                            </button>
                        </div>
                    </div>


                )}


            </div>
        </div>
    )
}