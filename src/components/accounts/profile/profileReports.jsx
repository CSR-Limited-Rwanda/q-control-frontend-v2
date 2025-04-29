import api from "@/utils/api";
import React, { useEffect, useState } from "react";
const ProfileReports = ({ userId }) => {
    const [reports, setReports] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchReports = async () => {
            try {
                setError("")
                setIsLoading(true)
                // const response = await api.get(`accounts/profile/${userId && userId}/incidents/`)
                // setReports(response.data.user_incidents)
                setIsLoading(false)
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message || error.response.data.error || 'Error fetching reports data')
                } else {
                    setError('Unknown fetching reports data')
                }
                console.error(error)
                setIsLoading(false)
            }
        }

        fetchReports()
    }, [])
    return isLoading ? '..loading' : (
        <div className='reports'>
            {
                error && <div className="error-message">{error}</div>
            }
            {
                reports && reports.length > 0 ?
                    reports.map((report, index) => (
                        <div key={index} className={`user-report ${report.status === 'Draft' ? 'draft' : ''}`}>
                            {
                                <div className="icon">
                                    {report.status === 'Draft' ? <NoteEditIcon /> : <NoteDoneIcon />}
                                </div>
                            }
                            <div className="report-content">
                                <h4>{report.category}</h4>
                                <small>Created on {<DateFormatter dateString={report.created_at} />}</small>
                            </div>
                        </div>
                    )) :
                    <p>No reports found</p>
            }
        </div>
    )
}

export default ProfileReports