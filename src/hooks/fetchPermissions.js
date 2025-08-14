import { useState, useEffect } from "react";
import api from "@/utils/api";

export const fetchPermissions = async () => {
    try {
        const response = await api.get("/accounts/user-permissions")
        if (response.status === 200) {
            // store permissions securely in sessions storage
            sessionStorage.setItem("userPermissions", JSON.stringify(response.data));
            return {
                success: true,
                data: response.data
            }
        }
    } catch (error) {
        console.error("Error fetching permissions:", error);
        let errorMessage = "An error occurred while fetching permissions.";
        if (error.response && error.response.data) {
            errorMessage = error.response.data.message || error.response.data.error || errorMessage;
        }
        return {
            success: false,
            error: errorMessage
        };
    }
};

export const useGetPermissions = () => {
    const [permissions, setPermissions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getPermissions = async () => {
            try {
                setLoading(true);
                setError(null);

                // Check if permissions are already in sessionStorage
                const storedPermissions = sessionStorage.getItem("userPermissions");
                if (storedPermissions) {
                    setPermissions(JSON.parse(storedPermissions));
                    setLoading(false);
                    return;
                }

                // If not in storage, fetch from API
                const result = await fetchPermissions();
                if (result.success) {
                    setPermissions(result.data);
                } else {
                    setError(result.error);
                }
            } catch (err) {
                setError("Failed to load permissions");
                console.error("Error in useGetPermissions:", err);
            } finally {
                setLoading(false);
            }
        };

        getPermissions();
    }, []);

    const refetchPermissions = async () => {
        try {
            setLoading(true);
            setError(null);

            // Clear stored permissions and fetch fresh data
            sessionStorage.removeItem("userPermissions");
            const result = await fetchPermissions();

            if (result.success) {
                setPermissions(result.data);
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Failed to refetch permissions");
            console.error("Error refetching permissions:", err);
        } finally {
            setLoading(false);
        }
    };

    return {
        permissions,
        loading,
        error,
        refetchPermissions
    };
};

// Keep the old getPermissions function for backward compatibility
export const getPermissions = async () => {
    const permissions = sessionStorage.getItem("userPermissions");
    if (permissions) {
        return JSON.parse(permissions);
    }
    else {
        // try and fetch permissions
        const result = await fetchPermissions();
        return result.success ? result.data : null;
    }
}