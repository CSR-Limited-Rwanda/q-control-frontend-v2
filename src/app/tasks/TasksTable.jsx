import { ArrowDownNarrowWide, ArrowUpNarrowWide, Square, SquareCheck } from 'lucide-react';
import React from 'react'
import { Table } from '../tables/page';

const TasksTable = ({ tasks, selectedTasks, handleSelectAllTasks, handleSortTasks, parameters, handleOpenTaskDetails, handleSelectTask, isSearching }) => {
    const actions = [
        { label: 'View', onClick: (task) => handleOpenTaskDetails(task.id), customClass: 'normal' },
        { label: 'Edit', onClick: (task) => console.log('Edit', task.id), customClass: 'action' },
        { label: 'Delete', onClick: (task) => console.log('Delete', task.id), customClass: 'danger' }
    ];

    const newTasks = tasks.map(task => ({
        id: task.id || 'N/A',
        name: task.name || 'N/A',
        description: task.description || 'N/A',
        deadline: task.deadline || 'N/A',
        incident: task.incident || 'N/A',
        status: task.status || 'N/A',
        priority: task.priority || 'N/A',
    }));
    return (

        // <table>
        //     <thead>
        //         <tr>
        //             <th>
        //                 <div onClick={handleSelectAllTasks} className='select-all'>
        //                     {
        //                         tasks.length > 0 && selectedTasks.length === tasks.length ? <SquareCheck /> : <Square />
        //                     }
        //                 </div>
        //             </th>
        //             <th className='sort-cell'>
        //                 Task Name
        //                 <div className="sort-icon" onClick={() => handleSortTasks('name', parameters.sort_order === 'asc' ? 'desc' : 'asc')}>
        //                     {
        //                         parameters.sort_by === 'name' && parameters.sort_order === 'asc' ?
        //                             <ArrowDownNarrowWide />
        //                             : parameters.sort_by === 'name' && parameters.sort_order === 'desc' ?
        //                                 <ArrowUpNarrowWide />
        //                                 : <ArrowDownNarrowWide />
        //                     }
        //                 </div>
        //             </th>
        //             <th>Description</th>
        //             <th className='sort-cell'>
        //                 Deadline
        //                 <div className="sort-icon" onClick={() => handleSortTasks('deadline', parameters.sort_order === 'asc' ? 'desc' : 'asc')}>
        //                     {
        //                         parameters.sort_by === 'deadline' && parameters.sort_order === 'asc' ?
        //                             <ArrowDownNarrowWide />
        //                             : parameters.sort_by === 'deadline' && parameters.sort_order === 'desc' ?
        //                                 <ArrowUpNarrowWide />
        //                                 : <ArrowDownNarrowWide />
        //                     }
        //                 </div>
        //             </th>
        //             <th>Incident</th>
        //             <th className='sort-cell' >
        //                 Status
        //                 <div className="sort-icon" onClick={() => handleSortTasks('status', parameters.sort_order === 'asc' ? 'desc' : 'asc')}>
        //                     {
        //                         parameters.sort_by === 'status' && parameters.sort_order === 'asc' ?
        //                             <ArrowDownNarrowWide />
        //                             : parameters.sort_by === 'status' && parameters.sort_order === 'desc' ?
        //                                 <ArrowUpNarrowWide />
        //                                 : <ArrowDownNarrowWide />
        //                     }
        //                 </div>
        //             </th>
        //             <th>Priority</th>
        //         </tr>
        //     </thead>
        //     <tbody>
        //         {tasks.map((task) => (
        //             <tr className={`task-row ${selectedTasks.includes(task.id) ? 'selected' : ''} ${isSearching ? 'is-searching' : ''}`} key={task.id} onClick={(e) => handleOpenTaskDetails(e, task.id)}>
        //                 <td>
        //                     <div onClick={(e) => {
        //                         e.stopPropagation();
        //                         handleSelectTask(task.id);
        //                     }} className='select-task'>
        //                         {selectedTasks.includes(task.id) ? <SquareCheck /> : <Square />}
        //                     </div>
        //                 </td>
        //                 <td>{task.name}</td>
        //                 <td>{task.description}</td>
        //                 <td>{task.deadline}</td>
        //                 <td>{task.incident}</td>
        //                 <td>{task.status}</td>
        //                 <td>{
        //                     task.task_priority === 1 ?
        //                         <div className="high priority-value">
        //                             <small>High</small>
        //                         </div>
        //                         : task.task_priority === 2 ?
        //                             <div className="medium priority-value">
        //                                 <small>Medium</small>
        //                             </div>
        //                             : <div className="low priority-value">
        //                                 <small>Low</small>
        //                             </div>}
        //                 </td>
        //             </tr>
        //         ))}
        //     </tbody>
        // </table>

        <Table headers={['ID', 'Name', 'Description', 'Deadline', 'Incident', 'Status', 'Priority', "Actions"]} actions={actions} data={newTasks} />
    )
}

export default TasksTable