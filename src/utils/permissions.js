export const getCurrentUser = () => {
    try {
        const token = sessionStorage.getItem('access');
        if (!token) return null;

        return decodeToken(token);
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

export const hasPermission = (permission) => {
    const user = getCurrentUser();
    if (!user) return false;

    switch (permission) {
        case 'isStaff':
            return user.is_staff === true;
        default:
            return false;
    }
};

const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(window.atob(base64));
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};