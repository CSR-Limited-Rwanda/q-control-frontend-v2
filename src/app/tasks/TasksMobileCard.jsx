import { ArrowDownNarrowWide, ArrowUpNarrowWide, Square, SquareCheck } from 'lucide-react';
import React from 'react'

const TasksMobileCard = ({ tasks, selectedTasks, handleSelectAllTasks, handleSortTasks, parameters, handleOpenTaskDetails, handleSelectTask, isSearching }) => {
    return (
        <div className="mobile-table">
            <div onClick={handleSelectAllTasks} className='select-all'>
                {
                    tasks.length > 0 && selectedTasks.length === tasks.length ? <> <SquareCheck /> unSelect all</> : <> <Square /> Select all</>

                }
            </div>
            <div className="sort-options">
                <div className="sort-option">
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
                </div>
                <div className="sort-option">
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
                </div>

                <div className="sort-option">
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
                </div>
            </div>
            {
                tasks.map((task) => (
                    <div className="table-card" key={task.id} onClick={(e) => handleOpenTaskDetails(e, task.id)}>
                        <div className="card-header">
                            <div className="id-number">
                                <h3>{task.name}</h3>
                                <div className="icons">
                                    <div onClick={(e) => {
                                        e.stopPropagation();
                                        handleSelectTask(task.id);
                                    }} className='select-task'>
                                        {selectedTasks.includes(task.id) ? <SquareCheck /> : <Square />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="meta">
                            <small>Deadline: </small>
                            <p>{task.deadline}</p>
                        </div>
                        <div className="meta">
                            <small>Status: </small>
                            <p>{task.status}</p>
                        </div>
                        <div className="meta">
                            <small>Priority: </small>
                            {
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
                                        </div>
                            }
                        </div>

                    </div>
                ))
            }
        </div>
    )
}

export default TasksMobileCard