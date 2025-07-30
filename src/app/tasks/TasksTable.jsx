import { ArrowDownNarrowWide, ArrowUpNarrowWide, Square, SquareCheck } from 'lucide-react';
import React from 'react'
import Pagination from './Pagination';

const TasksTable = ({
    tasks,
    selectedTasks,
    handleSelectAllTasks,
    handleSortTasks,
    parameters,
    handleOpenTaskDetails,
    handleSelectTask,
    isSearching,
    userID,
    // pagination related props
    page,
    totalTasks,
    pageSize,
    handlePageChange
}) => {
    return (
        <div className="table-container">

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
                        <th>
                            Assigned to
                        </th>
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
                            <td className='assigned-to'>
                                {
                                    task?.reviewers?.length > 0 ?
                                        <>
                                            {task.reviewers.slice(0, 2).map((reviewer, index) => (
                                                <span className='assigned-user' key={index}>{userID && userID === reviewer.id ? 'You' : reviewer.name}</span>
                                            ))}
                                            {task.reviewers.length > 2 && <span className='more-users'>+{task.reviewers.length - 2}</span>}
                                        </>
                                        : task?.review_groups?.length > 0 ?
                                            <>
                                                {task.review_groups.slice(0, 2).map((group, index) => (
                                                    <span className='assigned-group' key={index}>{group.name}</span>
                                                ))}
                                                {task.review_groups.length > 2 && <span className='more-groups'>+{task.review_groups.length - 2}</span>}
                                            </>
                                            : <span className='unassigned'>Unassigned</span>
                                }
                            </td>
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
                <tfoot>
                </tfoot>
            </table>
            <Pagination
                page={page}
                totalTasks={totalTasks}
                pageSize={pageSize}
                handlePageChange={handlePageChange}
            />
        </div>
    )
}

export default TasksTable