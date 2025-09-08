"use client";
import "@/styles/_userTasks.scss";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../dashboard/layout";
import { fetchTasks } from "@/hooks/fetchTasks";
import { createUrlParams } from "@/utils/api";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  Calendar,
  Eye,
  FileText,
  Filter,
  Flag,
  PlusCircle,
  Printer,
  SlidersHorizontal,
  Square,
  SquareCheck,
  Users,
  X,
  Loader2,
} from "lucide-react";
import { TaskDetails } from "./TaskDetails";
import { Filters } from "./TaskFilters";
import TasksTable from "./TasksTable";
import { useAuthentication } from "@/context/authContext";
import PermissionsGuard from "@/components/PermissionsGuard";
import debounce from "lodash/debounce";

const TasksPage = () => {
  const { user } = useAuthentication();
  const [totalTasks, setTotalTasks] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [parameters, setParameters] = useState({
    page: 1,
    page_size: 10,
    q: "",
    status: null,
    sort_by: "created_at",
    sort_order: "asc",
  });
  const profileId = user?.profileId;

  // Load tasks from backend
  const loadTasks = async () => {
    setIsLoading(true);
    const queryParams = createUrlParams(parameters);
    const response = await fetchTasks(queryParams);
    if (response.success) {
      setTasks(response.data.results || []);
      setTotalTasks(response.data.count || 0);
    } else {
      setError(response.message);
    }
    setIsLoading(false);
    setIsSearching(false);
  };

  // Debounced search handler
  const debouncedSearch = debounce((query) => {
    setParameters((prev) => ({
      ...prev,
      q: query,
      page: 1,
    }));
    setPage(1);
  }, 500);

  // Handle search query change
  const handleSearchChange = (e) => {
    setIsSearching(true);
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle select all tasks
  const handleSelectAllTasks = () => {
    if (selectedTasks.length === tasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
  };

  // Handle select task
  const handleSelectTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  // Handle open task details
  const handleOpenTaskDetails = (taskId) => {
    setSelectedTask(taskId);
    setShowTaskDetails(true);
  };

  // Handle sorting tasks (send to backend)
  const handleSortTasks = (sortBy, sortOrder) => {
    setParameters((prev) => ({
      ...prev,
      sort_by: sortBy,
      sort_order: sortOrder,
    }));
  };

  // Load tasks when parameters change
  useEffect(() => {
    loadTasks();
  }, [parameters]);

  // Initialize page and pageSize from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPage = localStorage.getItem("tasksPage") || 1;
      const storedPageSize = localStorage.getItem("tasksPageSize") || 10;
      setPage(Number(storedPage));
      setPageSize(Number(storedPageSize));
      setParameters((prev) => ({
        ...prev,
        page: Number(storedPage),
        page_size: Number(storedPageSize),
      }));
    }
  }, []);

  return (
    <DashboardLayout>
      <PermissionsGuard
        btnLink={`accounts/${profileId}/tasks`}
        model={"tasks"}
        codename={"view_list"}
        btnText="My Tasks"
        message="You currently don’t have access to view any tasks. To view your tasks, click the button below."
      >
        {error && <p className="message error">Error: {error}</p>}
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
            {selectedTasks.length > 0 && (
              <>
                {/* <button className="primary">
                  <PlusCircle />
                  <span> Create Task</span>
                </button> */}
                <button className="secondary">
                  <Printer />
                  <span> Export Tasks</span>
                </button>
              </>
            )}
            <Filters
              filters={[parameters]}
              setFilters={setParameters}
              handleFilterChange={loadTasks}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <Loader2 className="spinner" />
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            {searchQuery ? (
              <p>No tasks match your search.</p>
            ) : (
              <p>No tasks available.</p>
            )}
          </div>
        ) : (
          <TasksTable
            handleSelectAllTasks={handleSelectAllTasks}
            isSearching={isSearching}
            parameters={parameters}
            tasks={tasks}
            selectedTasks={selectedTasks}
            handleSelectTask={handleSelectTask}
            handleOpenTaskDetails={handleOpenTaskDetails}
            handleSortTasks={handleSortTasks}
          />
        )}

        {showTaskDetails && selectedTask && (
          <TaskDetails
            taskId={selectedTask}
            handleClose={() => setShowTaskDetails(false)}
          />
        )}
      </PermissionsGuard>
    </DashboardLayout>
  );
};

export default TasksPage;
