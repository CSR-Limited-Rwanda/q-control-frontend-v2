import api from '@/utils/api';

const authService = {
    async login(username, password) {
        try {
            const response = await api.post('/accounts/login/', {
                username,
                password,
            });

            if (response.status === 200) {
                const { access, refresh } = response.data;
                localStorage.setItem('loggedInUserInfo', JSON.stringify(response.data.user_info));
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

export default authService;
