'use client'
import '@/styles/_userTasks.scss'
import React, { useEffect, useState, useRef } from 'react'
import DashboardLayout from '../dashboard/layout'
import { fetchTaskById, fetchTasks, fetchUserTasks } from '@/hooks/fetchTasks'
import { createUrlParams } from '@/utils/api'
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Calendar, ChevronFirst, ChevronLast, Eye, FileText, Filter, Flag, PlusCircle, Printer, SlidersHorizontal, Square, SquareCheck, Users, X } from 'lucide-react'
import { TaskDetails } from './TaskDetails'
import { Filters } from './TaskFilters'
import TasksTable from './TasksTable'
import TasksMobileCard from './TasksMobileCard'
import { set } from 'date-fns'
import Pagination from './Pagination'

const TasksPage = () => {
    const [totalTasks, setTotalTasks] = useState(null)
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
        page: 1,
        page_size: 10,
        q: '',
        status: null,
        sort_by: 'created_at',
        sort_order: 'asc'
    })


    const loadTasks = async (userId, customParams = null) => {
        const queryParams = createUrlParams(customParams || parameters)
        console.log('Query Params:', queryParams)
        const response = await fetchTasks(queryParams)
        if (response.success) {
            setTasks(response.data.results)
            setTotalTasks(response.data.total_count)
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
        setParameters(prev => ({
            ...prev,
            q: query,
            page: 1
        }))
        setPage(1)
        setIsSearching(false)
    }

    // handle sorting tasks
    const handleSortTasks = (sortBy, sortOrder) => {
        setParameters(prev => ({
            ...prev,
            sort_by: sortBy,
            sort_order: sortOrder
        }))
    }

    // handle page size change
    const handlePageSizeChange = (e) => {
        const newSize = e.target.value
        setPageSize(newSize)
        setParameters(prev => ({
            ...prev,
            page_size: newSize,
            page: 1
        }))
        localStorage.setItem('tasksPageSize', newSize)
        setPage(1)
    }

    // handle page change
    const handlePageChange = (newPage) => {
        const totalPages = Math.ceil(totalTasks / pageSize)
        if (newPage >= 1 && newPage <= totalPages) {
            // Update state
            setPage(newPage)
            setParameters(prev => ({
                ...prev,
                page: newPage
            }))
            localStorage.setItem('tasksPage', newPage)
        }
    }

    useEffect(() => {
        // Initialize localStorage values on client side
        if (typeof window !== 'undefined') {
            const storedPageSize = localStorage.getItem('tasksPageSize') || 10
            const storedPage = localStorage.getItem('tasksPage') || 1

            setPageSize(storedPageSize)
            setPage(storedPage)
            setParameters(prev => ({
                ...prev,
                page_size: storedPageSize,
                page: 1
            }))
        }

        const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('loggedInUserInfo') || 'null') : null
        if (!user && typeof window !== 'undefined') {
            localStorage.removeItem('access')
            window.location.reload()
        }
        setUserInfo(user)
        console.log('User Info:', user)
    }, [])

    // Separate useEffect to load tasks when userInfo and parameters are ready
    useEffect(() => {
        if (userInfo?.id && parameters.page_size) {
            loadTasks(userInfo.id)
        }
    }, [userInfo, parameters])


    return (
        <DashboardLayout>
            <h1>Tasks Page</h1>
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
                    <div className="page-size-number">
                        <p>Showing</p>
                        <input type="number" name="pageSize" id="pageSize" value={pageSize} onChange={handlePageSizeChange} />
                        <p>of</p> {totalTasks} <p>tasks</p>
                    </div>
                    <Filters filters={[parameters]} setFilters={setParameters} handleFilterChange={() => loadTasks(userInfo?.id)} />
                </div>
            </div>

            <TasksTable
                handleSelectAllTasks={handleSelectAllTasks}
                isSearching={isSearching}
                parameters={parameters}
                tasks={tasks}
                selectedTasks={selectedTasks}
                handleSelectTask={handleSelectTask}
                handleOpenTaskDetails={handleOpenTaskDetails}
                handleSortTasks={handleSortTasks}
                userID={userInfo?.id}
                //  pagination related props
                page={page}
                totalTasks={totalTasks}
                pageSize={pageSize}
                handlePageChange={handlePageChange}
            />
            <TasksMobileCard userID={userInfo?.id} handleSelectAllTasks={handleSelectAllTasks} isSearching={isSearching} parameters={parameters} tasks={tasks} selectedTasks={selectedTasks} handleSelectTask={handleSelectTask} handleOpenTaskDetails={handleOpenTaskDetails} handleSortTasks={handleSortTasks} />
            {
                showTaskDetails && selectedTask && (
                    <TaskDetails userID={userInfo?.id} taskId={selectedTask} handleClose={() => setShowTaskDetails(false)} />
                )
            }
        </DashboardLayout>
    )
}

export default TasksPage

