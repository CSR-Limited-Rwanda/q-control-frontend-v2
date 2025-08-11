import { ArrowDownNarrowWide, ArrowUpNarrowWide, Eye, Pencil, Square, SquareCheck, Trash } from 'lucide-react';
import React from 'react'
import { Table } from '../tables/page';

const TasksTable = ({ tasks, selectedTasks, handleSelectAllTasks, handleSortTasks, parameters, handleOpenTaskDetails, handleSelectTask, isSearching }) => {
    const newTasks = tasks.map(task => ({
        id: task.id || 'N/A',
        name: task.name || 'N/A',
        deadline: task.deadline || 'N/A',
        incident: task.incident || 'N/A',
        status: task.status || 'N/A',
        priority: task.priority || 'N/A',
    }));
    return (



        <table>
            <thead>
                <tr>
                    <th>
                        <div onClick={handleSelectAllTasks} className='select-all'>
                            {
                                tasks.length > 0 && selectedTasks.length === tasks.length ? <SquareCheck size={18} /> : <Square size={18} />
                            }
                        </div>
                    </th>
                    <th>ID</th>
                    <th>
                        <div className="sort-cell">
                            Name
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
                    </th>
                    <th>
                        <div className="sort-cell">
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
                    </th>
                    <th>Incident</th>
                    <th>
                        <div className="sort-cell">
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
                    </th>
                    <th>Priority</th>
                </tr>
            </thead>
            <tbody>
                {newTasks.map((task) => (
                    <tr key={task.id} className={`task-row ${selectedTasks.includes(task.id) ? 'selected' : ''} ${isSearching ? 'is-searching' : ''}`} onClick={(e) => handleOpenTaskDetails(task.id)}>
                        <td data-label="Select">
                            <div onClick={(e) => {
                                e.stopPropagation();
                                handleSelectTask(task.id);
                            }} className='select-task'>
                                {selectedTasks.includes(task.id) ? <SquareCheck size={18} /> : <Square size={18} />}
                            </div>
                        </td>
                        <td data-label="ID">{task.id}</td>
                        <td data-label="Name">{task.name}</td>
                        <td data-label="Deadline">{task.deadline}</td>
                        <td data-label="Incident">{task.incident}</td>
                        <td data-label="Status">{task.status}</td>
                        <td data-label="Priority">{task.priority}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default TasksTable