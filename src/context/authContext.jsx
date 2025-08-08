'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import api from "@/utils/api";

// Create AuthContext
const AuthContext = createContext({
  user: null,
  fullUserData: null,
  isAuth: false,
  loading: true,
  login: () => { },
  getUser: () => { },
  getFullUserData: () => { },
  logout: () => { },
  refreshAuth: () => { },
});

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fullUserData, setFullUserData] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if token exists and is valid
  const checkTokenValidity = () => {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("access");

    if (!token) {
      return false;
    }

    try {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      // Check if token is expired
      if (expirationTime < currentTime) {
        // Token is expired, clear localStorage
        localStorage.clear();
        return false;
      }

      return true;
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.clear();
      return false;
    }
  };

  // Initialize authentication state
  const initializeAuth = async () => {
    setLoading(true);

    const tokenIsValid = checkTokenValidity();

    if (tokenIsValid) {
      const token = localStorage.getItem("access");
      const result = await getUserInfoFromToken(token);

      if (result && result.tokenUserInfo) {
        setUser(result.tokenUserInfo);
        setFullUserData(result.serverUserData);
        setIsAuth(true);
      } else {
        // Failed to get user info, clear auth state
        localStorage.clear();
        setUser(null);
        setFullUserData(null);
        setIsAuth(false);
      }
    } else {
      setUser(null);
      setFullUserData(null);
      setIsAuth(false);
    }

    setLoading(false);
  };

  // Login function
  const login = async (token, refreshToken = null) => {
    try {
      if (typeof window === "undefined") return false;

      localStorage.setItem("access", token);
      if (refreshToken) {
        localStorage.setItem("refresh", refreshToken);
      }

      const result = await getUserInfoFromToken(token);

      if (result && result.tokenUserInfo) {
        setUser(result.tokenUserInfo);
        setFullUserData(result.serverUserData);
        setIsAuth(true);
        return true;
      } else {
        localStorage.clear();
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      localStorage.clear();
      return false;
    }
  };
  // Get user info function (synchronous)
  const getUser = () => {
    return user;
  };

  // Get full user data function (synchronous)
  const getFullUserData = () => {
    return fullUserData;
  };
  // Logout function
  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      setUser(null);
      setFullUserData(null);
      setIsAuth(false);
    }
  };

  // Refresh authentication state
  const refreshAuth = () => {
    initializeAuth();
  };

  // Initialize auth on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  // Set up token expiration checking interval
  useEffect(() => {
    if (isAuth) {
      const interval = setInterval(() => {
        const tokenIsValid = checkTokenValidity();
        if (!tokenIsValid && isAuth) {
          logout();
        }
      }, 60000); // Check every minute

      return () => clearInterval(interval);
    }
  }, [isAuth]);

  const value = {
    user,
    fullUserData,
    isAuth,
    loading,
    login,
    logout,
    getUser,
    getFullUserData,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuthentication = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuthentication must be used within an AuthProvider');
  }

  return context;
};

// Helper function to get user info from token
async function getUserInfoFromToken(token) {
  try {
    if (!token) {
      console.error("Token is not provided");
      return null;
    }

    // Decode the token
    const decodedToken = jwtDecode(token);
    const userId = decodedToken.user_id;

    // Extract basic user info from token
    const userInfo = {
      id: userId,
      firstName: decodedToken.first_name,
      lastName: decodedToken.last_name,
      email: decodedToken.email,
      role: decodedToken.role || null,
      facility: decodedToken.facility || null,
      department: decodedToken.department || null,
      profileId: decodedToken.profile_id,
    };

    if (!userId) {
      console.error("User ID not found in token");
      return { tokenUserInfo: userInfo, serverUserData: null };
    }

    // Fetch user data from backend
    try {
      const response = await api.get(`/users/${userId}/`);
      if (response.status === 200) {
        const serverData = response.data;

        // Store in localStorage
        localStorage.setItem("loggedInUserInfo", JSON.stringify(serverData));
        if (serverData.facility && serverData.facility.id) {
          localStorage.setItem(
            "facilityId",
            JSON.stringify(serverData.facility.id)
          );
        }
        if (serverData.department && serverData.department.id) {
          localStorage.setItem(
            "departmentId",
            JSON.stringify(serverData.department.id)
          );
        }

        return {
          tokenUserInfo: userInfo,
          serverUserData: serverData,
        };
      } else {
        console.warn("Failed to fetch user data from server, using token data only");
        return { tokenUserInfo: userInfo, serverUserData: null };
      }
    } catch (apiError) {
      console.warn("Error fetching user data from server:", apiError.response?.data || apiError.message);
      console.warn("Proceeding with token data only");
      return { tokenUserInfo: userInfo, serverUserData: null };
    }
  } catch (error) {
    console.error("Error decoding token or fetching user data:", error);
    return null;
  }
}
