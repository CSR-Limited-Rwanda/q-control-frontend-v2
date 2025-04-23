import api from "@/utils/api";

export const fetchUsers = async () => {
    try {
        const response = await api.get(`/accounts/users/list/`);
        if (response.status === 200) {
            return {
                success: true,
                users: response.data,
            };
        }
        // Handle unexpected response status
        return {
            success: false,
            error: `Unexpected response status: ${response.status}`,
        };
    } catch (error) {
        console.error("Error fetching users:", error);

        // Extract error message if available
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Unknown error fetching users";

        return {
            success: false,
            error: errorMessage,
        };
    }
};