import api from "@/utils/api";

export const fetchReviews = async (incidentId, apiLink) => {
    try {
        const response = await api.get(`/incidents/${apiLink}/${incidentId}/reviews/`);
        console.log(response);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch reviews.",
            };
        }
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred while fetching reviews.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export const createReview = async (incidentId, apiLink, reviewData) => {
    try {
        const response = await api.post(`/incidents/${apiLink}/${incidentId}/reviews/`, reviewData);
        console.log(response);
        if (response.status === 201) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: "Failed to create review.",
            };
        }
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred while creating the review.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}