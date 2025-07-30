import { ChevronFirst, ChevronLast } from 'lucide-react'
import React from 'react'

const Pagination = ({ page, totalTasks, pageSize, handlePageChange }) => {
    return (
        <div className="pagination-container">
            <button
                className={`page-number ${page === 1 ? 'disabled' : ''}`}
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
            >
                Previous
            </button>

            {/* Show pagination numbers: first page, current page, next page */}
            <div className="page-numbers">
                {/* Show first page */}
                {page > 1 && (
                    <button className="page-number" onClick={() => handlePageChange(1)}>1</button>
                )}

                {/* Show ellipsis if there's a gap */}
                {page > 2 && <span className="ellipsis">...</span>}

                {/* Current page */}
                <button className="page-number active">{page}</button>

                {/* Show next page */}
                {page < Math.ceil(totalTasks / pageSize) && (
                    <button
                        className="page-number"
                        onClick={() => handlePageChange(page + 1)}
                    >
                        {page + 1}
                    </button>
                )}
            </div>

            <button
                className={`page-number ${page === Math.ceil(totalTasks / pageSize) ? 'disabled' : ''}`}
                onClick={() => handlePageChange(page + 1)}
                disabled={page === Math.ceil(totalTasks / pageSize)}
            >
                Next
            </button>
        </div>
    )
}

export default Pagination