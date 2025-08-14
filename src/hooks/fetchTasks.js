import api from "@/utils/api";

export const fetchTasks = async (params) => {
    try {
        const response = await api.get(`/tasks/?${params}`);
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch tasks.",
            };
        }
    } catch (error) {
        console.error(error);
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
        if (response.status === 200) {
            return {
                success: true,
                data: response.data,
            };
        } else {
            return {
                success: false,
                message: "Failed to fetch user tasks.",
            };
        }
    } catch (error) {
        console.error(error);
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
        console.error(error);
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

export const completeTask = async (taskId) => {
    try {
        const response = await api.patch(`/tasks/${taskId}/`, { "action": "complete" });
        if (response.status === 200) {
            return {
                success: true,
                message: "Task completed successfully.",
            };
        } else {
            return {
                success: false,
                message: "Failed to complete task.",
            };
        }
    } catch (error) {
        console.error(error);
        let errorMessage = "An error occurred while completing the task.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export const submitTask = async (taskId) => {
    try {
        const response = await api.patch(`/tasks/${taskId}/`, { status: "submit" });
        if (response.status === 200) {
            return {
                success: true,
                message: "Task submitted successfully.",
            };
        } else {
            return {
                success: false,
                message: "Failed to submit task.",
            };
        }
    } catch (error) {
        console.error(error);
        let errorMessage = "An error occurred while submitting the task.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}

export const approveTask = async (taskId) => {
    try {
        const response = await api.patch(`/tasks/${taskId}/`, { status: "approve" });

        if (response.status === 200) {
            return {
                success: true,
                message: "Task approved successfully.",
            };
        } else {
            return {
                success: false,
                message: "Failed to approve task.",
            };
        }
    } catch (error) {

        let errorMessage = "An error occurred while approving the task.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.error || error.response.data.message || errorMessage;
        }
        return {
            success: false,
            message: errorMessage,
        };
    }
}