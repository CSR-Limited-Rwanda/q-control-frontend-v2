import api from "@/utils/api";

export const fetchReviewTemplates = async (params) => {
    try {
        const response = await api.get(`/permissions/review-templates/?${params}`);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data.results,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch review templates.",
            };
        }
    } catch (error) {

        let errorMessage = "An error occurred while fetching review templates.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export const fetchReviewTemplateById = async (templateId) => {
    try {
        const response = await api.get(`/permissions/review-templates/${templateId}/`);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch review template.",
            };
        }
    } catch (error) {

        let errorMessage = "An error occurred while fetching review template.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export const fetchReviewTemplateTasks = async (templateId) => {
    try {
        const response = await api.get(`/permissions/review-templates/${templateId}/tasks/`);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data.results,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch review template tasks.",
            };
        }
    } catch (error) {

        let errorMessage = "An error occurred while fetching review template tasks.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}