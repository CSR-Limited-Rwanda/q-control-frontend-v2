import api, { API_URL } from '@/utils/api';
import axios from 'axios';

export const authService = {
    async login(username, password) {
        try {
            const response = await axios.post(`${API_URL}/accounts/login/`, {
                username,
                password,
            });

            if (response.status === 200) {
                const { access, refresh } = response.data;
                localStorage.setItem('access', access);
                if (refresh) {
                    localStorage.setItem('refresh', refresh);
                }
                return {
                    success: true,
                    accessToken: access,
                    refreshToken: refresh,
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid credentials',
                };
            }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed. Please try again.',
            };
        }
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refresh');

            if (!refreshToken) {
                throw new Error('No refresh token found');
            }

            const response = await api.post('/auth/refresh/', {
                refresh: refreshToken,
            });

            if (response.status === 200) {
                const { access } = response.data;
                localStorage.setItem('access', access);
                return {
                    success: true,
                    accessToken: access,
                };
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (error) {
            // If refresh fails, clear tokens and redirect to login
            localStorage.clear();
            return {
                success: false,
                error: 'Session expired. Please log in again.',
            };
        }
    },
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/accounts/password-reset-request/`, { email });

        if (response.status === 200) {
            return {
                success: true,
                message: 'A code has been sent to your email.',
            };
        } else {
            return {
                success: false,
                error: 'Failed to send reset code. Please try again.',
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.detail || 'An unexpected error occurred. Please try again.',
        };
    }
}

export const resetPassword = async (payload) => {

    try {
        const response = await axios.post(`${API_URL}/accounts/reset-password/`, payload);

        if (response.status === 200) {
            return {
                success: true,
                message: 'Password has been reset successfully.',
            };
        } else {
            return {
                success: false,
                error: 'Failed to reset password. Please try again.',
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.response?.data?.message || 'An unexpected error occurred. Please try again.',
        };
    }
};