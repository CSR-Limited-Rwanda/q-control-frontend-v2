'use client'
import '@/styles/_userTasks.scss'
import DashboardLayout from '@/app/dashboard/layout'
import { TaskDetails } from '@/app/tasks/TaskDetails'
import { Filters } from '@/app/tasks/TaskFilters'
import TasksMobileCard from '@/app/tasks/TasksMobileCard'
import TasksTable from '@/app/tasks/TasksTable'
import { fetchUserTasks } from '@/hooks/fetchTasks'
import { createUrlParams } from '@/utils/api'
import { PlusCircle, Printer } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const UserTasks = () => {
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
            <TasksMobileCard handleSelectAllTasks={handleSelectAllTasks} isSearching={isSearching} parameters={parameters} tasks={tasks} selectedTasks={selectedTasks} handleSelectTask={handleSelectTask} handleOpenTaskDetails={handleOpenTaskDetails} handleSortTasks={handleSortTasks} />

            {
                showTaskDetails && selectedTask && (
                    <TaskDetails taskId={selectedTask} handleClose={() => setShowTaskDetails(false)} />
                )
            }
        </DashboardLayout>
    )
}

export default UserTasks