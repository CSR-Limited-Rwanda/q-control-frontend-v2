import api from "@/utils/api";

export const fetchUsers = async (params) => {
    try {
        const response = await api.get(`/users/?${params}`);

        if (response.status === 200) {
            return {
                success: true,
                data: response.data.results,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch users.",
            };
        }
    } catch (error) {

        let errorMessage = "An error occurred while fetching users.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}