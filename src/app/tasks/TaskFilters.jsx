import { SlidersHorizontal, X } from "lucide-react"
import { useState } from "react"

export const Filters = ({ filters, setFilters, handleFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleStatusChange = (e) => {
        const newStatus = e.target.value
        setFilters(prev => ({
            ...prev,
            status: newStatus,
            page: 1
        }))
    }

    const handlePriorityChange = (e) => {
        const newPriority = e.target.value
        setFilters(prev => ({
            ...prev,
            priority: newPriority,
            page: 1
        }))
    }

    const requireApprovalChange = (e) => {
        const requireApproval = e.target.checked
        setFilters(prev => ({
            ...prev,
            require_approval: requireApproval,
            page: 1
        }))
    }

    const deadlineChange = (e) => {
        const newDeadline = e.target.value
        setFilters(prev => ({
            ...prev,
            deadline: newDeadline,
            page: 1
        }))
    }

    const handleCreatedAtChange = (e) => {
        const newCreatedAt = e.target.value
        setFilters(prev => ({
            ...prev,
            created_at: newCreatedAt,
            page: 1
        }))
    }

    const toggleFilters = () => {
        handleFilterChange()
        setIsOpen(false)
    }

    const clearFilters = () => {
        setFilters({
            page: 1,
            page_size: 10,
            q: '',
            status: '',
            sort_by: 'created_at',
            sort_order: 'asc',
            priority: '',
            require_approval: false,
            deadline: '',
            created_at: ''
        })
        handleFilterChange()
        setIsOpen(false)
    }
    return (
        <div className="filters-wrapper">
            <div className="filters-button" onClick={() => setIsOpen(!isOpen)}>
                {
                    isOpen ? <X onClick={() => setIsOpen(false)} /> : <SlidersHorizontal />
                }
            </div>

            {
                isOpen && <div className="filters">
                    <h3>Filter tasks</h3>
                    <div className="form-input">
                        Filter by status
                        <select name="status" id="status" onChange={handleStatusChange}>
                            <option value="">All</option>
                            <option value="open">Open</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="form-input">
                        Filter by priority
                        <select name="priority" id="priority" onChange={handlePriorityChange}>
                            <option value="">All</option>
                            <option value="1">High</option>
                            <option value="2">Medium</option>
                            <option value="3">Low</option>
                        </select>
                    </div>
                    <div className="checkbox">
                        <input type="checkbox" id="requireApproval" checked={filters.require_approval} onChange={requireApprovalChange} />
                        <label htmlFor="requireApproval">Require Approval</label>
                    </div>
                    <div className="form-input">
                        <label htmlFor="deadline">Filter by deadline</label>
                        <input type="date" id="deadline" onChange={deadlineChange} />
                    </div>
                    <div className="form-input card">
                        <label htmlFor="createdAt">Filter by date created</label>
                        <div className="form-group">
                            <div className="form-input">
                                <label htmlFor="createdAtStart">Start date</label>
                                <input type="date" id="createdAtStart" onChange={handleCreatedAtChange} />
                            </div>
                            <div className="form-input">
                                <label htmlFor="createdAtEnd">End date</label>
                                <input type="date" id="createdAtEnd" onChange={handleCreatedAtChange} />
                            </div>
                        </div>
                    </div>
                    <div className="buttons">
                        <button type="button" className="gray" onClick={clearFilters}>Clear</button>
                        <button className="primary" onClick={toggleFilters}>Apply Filters</button>

                    </div>
                </div>
            }
        </div>
    )
}