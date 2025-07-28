import { useEffect, useState } from "react";
import { TemplateDetails } from "./TemplateDetails";
import { fetchReviewTemplates } from "@/hooks/fetchReviewTemplates";

export const ReviewTemplates = ({ selectedTemplate, setSelectedTemplate }) => {
    const [templates, setTemplates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    // Simulate fetching templates
    useEffect(() => {
        const fetchTemplates = async () => {
            const response = await fetchReviewTemplates('page_size=10');
            if (response.success) {
                setTemplates(response.data);
            } else {
                setIsError(response.message);
            }
        };
        fetchTemplates();
    }, []);
    return (
        <div className="review-templates-container">
            <h3>Review Templates</h3>
            {
                selectedTemplate ? (
                    <TemplateDetails template={selectedTemplate} />

                ) :
                    <div className="templates-list">
                        {isLoading ? (
                            <p>Loading templates...</p>
                        ) : isError ? (
                            <p>Error loading templates.</p>
                        ) : (
                            <>
                                {templates.map((template) => (
                                    <div className='template' key={template.id} onClick={() => setSelectedTemplate(template)}>
                                        {template.name}
                                    </div>
                                ))}</>
                        )}
                    </div>
            }
        </div>
    )
}