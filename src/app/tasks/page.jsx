'use client'
import '@/styles/_userTasks.scss'
import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../dashboard/layout'
import { fetchTaskById, fetchTasks, fetchUserTasks } from '@/hooks/fetchTasks'
import { createUrlParams } from '@/utils/api'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Calendar, Eye, FileText, Filter, Flag, PlusCircle, Printer, SlidersHorizontal, Square, SquareCheck, Users, X } from 'lucide-react'
import { TaskDetails } from './TaskDetails'
import { Filters } from './TaskFilters'
import TasksTable from './TasksTable'
import TasksMobileCard from './TasksMobileCard'
import { useAuthentication } from '@/context/authContext'

const TasksPage = () => {
    const { user } = useAuthentication()
    const [totalTasks, setTotalTasks] = useState(null)
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


    const loadTasks = async () => {

        const queryParams = createUrlParams(parameters)

        const response = await fetchTasks(queryParams)
        if (response.success) {
            setTasks(response.data.results)
            setTotalTasks(response.data.count)
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
    const handleOpenTaskDetails = (taskId) => {
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
        loadTasks()
    }, [])


    return (
        <DashboardLayout>
            {isLoading && <p>Loading tasks...</p>}
            {error && <p className='message error'>Error: {error}</p>}
            <div className="filters-container">
                <div className="header-search">
                    <div className="headers">
                        <h2>Tasks</h2>
                        <small>{totalTasks} Available</small>
                    </div>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="actions">
                    {
                        selectedTasks.length > 0 && <>
                            <button className='primary'> <PlusCircle /><span> Create Task</span></button>
                            <button className='secondary'><Printer /><span> Export Tasks</span></button>
                        </>
                    }
                    <Filters filters={[parameters]} setFilters={setParameters} handleFilterChange={() => loadTasks(userInfo?.id)} />
                </div>
            </div>

            <TasksTable handleSelectAllTasks={handleSelectAllTasks} isSearching={isSearching} parameters={parameters} tasks={tasks} selectedTasks={selectedTasks} handleSelectTask={handleSelectTask} handleOpenTaskDetails={handleOpenTaskDetails} handleSortTasks={handleSortTasks} />
            {/* <TasksMobileCard handleSelectAllTasks={handleSelectAllTasks} isSearching={isSearching} parameters={parameters} tasks={tasks} selectedTasks={selectedTasks} handleSelectTask={handleSelectTask} handleOpenTaskDetails={handleOpenTaskDetails} handleSortTasks={handleSortTasks} /> */}

            {
                showTaskDetails && selectedTask && (
                    <TaskDetails taskId={selectedTask} handleClose={() => setShowTaskDetails(false)} />
                )
            }
        </DashboardLayout>
    )
}

export default TasksPage

