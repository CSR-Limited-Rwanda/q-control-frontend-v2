import api from "@/utils/api";

export const fetchTasks = async (params) => {
    try {
        const response = await api.get(`/tasks/?${params}`);
        console.log(response);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data.results,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch tasks.",
            };
        }
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred while fetching tasks.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export const fetchUserTasks = async (userId, params) => {
    try {
        const response = await api.get(`/users/${userId}/tasks/?${params}`);
        console.log(response.data);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data.results,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch user tasks.",
            };
        }
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred while fetching user tasks.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export const fetchTaskById = async (taskId) => {
    try {
        const response = await api.get(`/tasks/${taskId}/`);
        console.log(response);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch task.",
            };
        }
    } catch (error) {
        console.log(error);
        let errorMessage = "An error occurred while fetching the task.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

