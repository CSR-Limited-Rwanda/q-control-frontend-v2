import { useEffect, useState } from "react";
import { TemplateDetails } from "./TemplateDetails";
import { fetchReviewTemplates } from "@/hooks/fetchReviewTemplates";
import { set } from "date-fns";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export const ReviewTemplates = ({
  setCurrentStep,
  selectedTemplate,
  setSelectedTemplate,
  handleShowNewTemplateForm,
}) => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  // Simulate fetching templates

  const handleNext = (template) => {
    setSelectedTemplate(template);
    setCurrentStep(2);
  };
  useEffect(() => {
    const fetchTemplates = async () => {
      const response = await fetchReviewTemplates("page_size=10");
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
      {selectedTemplate ? (
        <TemplateDetails template={selectedTemplate} />
      ) : (
        <div className="templates-list">
          {isLoading ? (
            <p>Loading templates...</p>
          ) : isError ? (
            <p>Error loading templates.</p>
          ) : (
            <>
              {templates.map((template) => (
                <div
                  className="template"
                  key={template.id}
                  onClick={() => handleNext(template)}
                >
                  {template.name}
                </div>
              ))}

              <div
                onClick={handleShowNewTemplateForm}
                className="btn light"
                href={"/review-templates/new"}
              >
                <PlusCircle />
                New template
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
