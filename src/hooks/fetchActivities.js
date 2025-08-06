import api from "@/utils/api";

export const fetchActivities = async (id, type) => {
    try {
        const response = await api.get(`/activities/list/${id}/?incident_type=${type}`);
        console.log("Incident Activities Response: ", response);
        if (response.status === 200) {
            return {
                success: true,
                data: [
                    // incident one
                    {
                        "id": 1,
                        "incident": id,
                        "activity_message": "Incident sent to",
                        "activity_highlight": {
                            "name": "Quality assurance",
                            "id": 1
                        },
                        "activity_date": "2023-10-01T12:00:00Z",
                        "destination": {
                            "name": "Quality assurance",
                            "id": 1
                        },
                        "files": [],
                        "created_by": {
                            "id": 1,
                            "first_name": "John",
                            "last_name": "Doe",
                            "position": "Quality Assurance Manager"
                        },
                        "activity_type": "incident_sent",
                    }
                    ,
                    // incident two
                    {
                        "id": 2,
                        "incident": id,
                        "activity_message": "Incident is send from",
                        "activity_highlight": {
                            "name": "Investigation team",
                            "id": 2
                        },
                        "activity_date": "2023-10-02T14:30:00Z",
                        "destination": null,
                        "files": [],
                        "created_by": {
                            "id": 2,
                            "first_name": "Jane",
                            "last_name": "Smith",
                            "position": "Investigator"
                        },
                        "activity_type": "incident_sent",
                    }

                    // incident three
                    ,
                    {
                        "id": 3,
                        "incident": id,
                        "activity_message": "3 incoming ",
                        "activity_highlight": {
                            "name": "documents",
                            "id": 3
                        },
                        "activity_date": "2023-10-03T09:15:00Z",
                        "destination": null,
                        "files": [
                            {
                                "name": "incident_report",
                                "url": "https://example.com/documents/incident_report.pdf",
                                "id": 1,
                                "file_type": "pdf"
                            },
                            {
                                "name": "investigation_notes",
                                "url": "https://example.com/documents/investigation_notes.docx",
                                "id": 2,
                                "file_type": "docx"
                            },
                            {
                                "name": "evidence_photos",
                                "url": "https://example.com/documents/evidence_photos.zip",
                                "id": 3,
                                "file_type": "zip"
                            }
                        ],
                        "created_by": {
                            "id": 3,
                            "first_name": "Alice",
                            "last_name": "Johnson",
                            "position": "Document Specialist"
                        },
                        "activity_type": "documents_uploaded",
                    }
                    // incident four
                    ,
                    {
                        "id": 4,
                        "incident": id,
                        "activity_message": "Incident is closed by",
                        "activity_highlight": null,
                        "activity_date": "2023-10-04T16:45:00Z",
                        "destination": null,
                        "files": [],
                        "created_by": {
                            "id": 4,
                            "first_name": "Bob",
                            "last_name": "Williams",
                            "position": "Incident Manager"
                        },
                        "activity_type": "incident_closed",
                    }
                ],
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch activities.",
            };
        }
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred while fetching activities.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}