import api from "@/utils/api";

export const fetchUsers = async () => {
    try {
        const response = await api.get(`/users/`);
        if (response.status === 200) {
            return {
                success: true,
                users: response.data.results,
            }
        }
    } catch (error) {
        let errorMessage = "";
        if (error.response && error.response.data) {
            errorMessage =
                error.response.data.message ||
                error.response.data.error ||
                "Error fetching users";
        } else {
            errorMessage = "Unknown error fetching users";
        }
        console.error("Error fetching users:", errorMessage);
        return {
            success: false,
            error: errorMessage,
        };

    }
};