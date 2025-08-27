"use client";
import "@/styles/_userTasks.scss";
import DashboardLayout from "@/app/dashboard/layout";
import { Filters } from "@/app/tasks/TaskFilters";
import TasksTable from "@/app/tasks/TasksTable";
import MessageComponent from "@/components/MessageComponet";
import { fetchUserTasks } from "@/hooks/fetchTasks";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  PlusCircle,
  Printer,
  Square,
  SquareCheck,
} from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { createUrlParams } from "@/utils/api";
import { TaskDetails } from "@/app/tasks/TaskDetails";

const ProfileTasks = () => {
  const { accountId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTasks, setTotalTasks] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [parameters, setParameters] = useState({
    page: page,
    page_size: pageSize,
    q: searchQuery,
    status: status,
    sort_by: "created_at",
    sort_order: "asc",
  });

  const loadTasks = async () => {
    const queryParams = createUrlParams(parameters);

    const response = await fetchUserTasks(queryParams);
    if (response.success) {
      setTasks(response.data.results);
      setTotalTasks(response.data.count);
    } else {
      setError(response.message);
    }
    setIsLoading(false);
  };

  // handle select all tasks
  const handleSelectAllTasks = () => {
    if (isAllTasksSelected()) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(tasks.map((task) => task.id));
    }
  };

  // handle select task
  const handleSelectTask = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  // handle open task details
  const handleOpenTaskDetails = (taskId) => {
    setSelectedTask(taskId);
    setShowTaskDetails(true);
  };

  // handle search query change
  const handleSearchChange = async (e) => {
    setIsSearching(true);
    const query = e.target.value;
    setSearchQuery(query);
    setParameters({
      ...parameters,
      q: query,
      page: 1,
    });
    setPage(1);

    await loadTasks();
    setIsSearching(false);
  };

  // handle sorting tasks
  const handleSortTasks = (sortBy, sortOrder) => {
    setParameters({
      ...parameters,
      sort_by: sortBy,
      sort_order: sortOrder,
    });

    // sort tasks based on the selected field and order
    const sortedTasks = [...tasks].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
    setTasks(sortedTasks);
  };
  // check if all tasks are selected
  const isAllTasksSelected = () => {
    return tasks.length > 0 && selectedTasks.length === tasks.length;
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetchUserTasks(accountId);

      if (response.success) {
        setTasks(
          response.data.results.map((task) => ({
            id: task.id || "N/A",
            name: task.name || "N/A",
            deadline: task.deadline || "N/A",
            incident: task.incident || "N/A",
            status: task.status || "N/A",
            priority: task.priority || "N/A",
          }))
        );
      } else {
        setError(response.error);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);
  return (
    <DashboardLayout>
      <div className="project-tasks">
        <h1>Profile Tasks</h1>
        {/* <div className="filters-container">
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
                        <Filters filters={[parameters]} setFilters={setParameters} handleFilterChange={() => loadTasks()} />
                    </div>
                </div> */}
        {isLoading ? (
          <p>Loading...</p>
        ) : error ? (
          <MessageComponent errorMessage={error} />
        ) : (
          <table>
            <thead>
              <tr>
                <th>
                  <div onClick={handleSelectAllTasks} className="select-all">
                    {tasks.length > 0 &&
                    selectedTasks.length === tasks.length ? (
                      <SquareCheck size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </div>
                </th>
                <th>ID</th>
                <th>
                  <div
                    className="sort-cell"
                    onClick={() =>
                      handleSortTasks(
                        "name",
                        parameters.sort_order === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    Name
                    <div className="sort-icon">
                      {parameters.sort_by === "name" &&
                      parameters.sort_order === "asc" ? (
                        <ArrowDownNarrowWide size={18} />
                      ) : parameters.sort_by === "name" &&
                        parameters.sort_order === "desc" ? (
                        <ArrowUpNarrowWide size={18} />
                      ) : (
                        <ArrowDownNarrowWide size={18} />
                      )}
                    </div>
                  </div>
                </th>
                <th>
                  <div
                    className="sort-cell"
                    onClick={() =>
                      handleSortTasks(
                        "deadline",
                        parameters.sort_order === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    Deadline
                    <div className="sort-icon">
                      {parameters.sort_by === "deadline" &&
                      parameters.sort_order === "asc" ? (
                        <ArrowDownNarrowWide size={18} />
                      ) : parameters.sort_by === "deadline" &&
                        parameters.sort_order === "desc" ? (
                        <ArrowUpNarrowWide size={18} />
                      ) : (
                        <ArrowDownNarrowWide size={18} />
                      )}
                    </div>
                  </div>
                </th>
                <th>Incident</th>
                <th>
                  <div
                    className="sort-cell"
                    onClick={() =>
                      handleSortTasks(
                        "status",
                        parameters.sort_order === "asc" ? "desc" : "asc"
                      )
                    }
                  >
                    Status
                    <div className="sort-icon">
                      {parameters.sort_by === "status" &&
                      parameters.sort_order === "asc" ? (
                        <ArrowDownNarrowWide size={18} />
                      ) : parameters.sort_by === "status" &&
                        parameters.sort_order === "desc" ? (
                        <ArrowUpNarrowWide size={18} />
                      ) : (
                        <ArrowDownNarrowWide size={18} />
                      )}
                    </div>
                  </div>
                </th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr
                  key={task.id}
                  className={`task-row ${
                    selectedTasks.includes(task.id) ? "selected" : ""
                  } ${isSearching ? "is-searching" : ""}`}
                  onClick={(e) => handleOpenTaskDetails(task.id)}
                >
                  <td data-label="Select">
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTask(task.id);
                      }}
                      className="select-task"
                    >
                      {selectedTasks.includes(task.id) ? (
                        <SquareCheck size={18} />
                      ) : (
                        <Square size={18} />
                      )}
                    </div>
                  </td>
                  <td data-label="ID">{task.id}</td>
                  <td data-label="Name">{task.name}</td>
                  <td data-label="Deadline">{task.deadline}</td>
                  <td data-label="Incident">
                    {task.incident?.incident_type || "Not provided"}
                  </td>
                  <td data-label="Status">{task.status}</td>
                  <td data-label="Priority">{task.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {showTaskDetails && selectedTask && (
          <TaskDetails
            taskId={selectedTask}
            handleClose={() => setShowTaskDetails(false)}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default ProfileTasks;
