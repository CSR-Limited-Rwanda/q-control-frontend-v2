import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import CryptoJS from "crypto-js";
import { useRouter } from "next/navigation";
import api from "@/utils/api";

export const useAuthentication = () => {
  const router = useRouter();
  const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;
  const domainName = process.env.NEXT_PUBLIC_DOMAIN_NAME;
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ensure this code runs only on the client side
    if (typeof window === "undefined") return;

    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const encryptedToken = params.get("token");

      if (!encryptionKey) {
        window.location.href = `${domainName}/?error=Invalid encryption key`;
        return;
      }

      // Decrypt the token
      if (encryptedToken) {
        const decryptedToken = decryptToken(encryptedToken, encryptionKey);
        if (!decryptedToken) {
          console.error("Failed to decrypt token");
          setLoading(false);
          return;
        }

        // Store in localStorage
        localStorage.setItem("access", decryptedToken);

        // Clear query parameters from the URL
        const newUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
      }

      // Retrieve token from localStorage
      const token = localStorage.getItem("access");

      if (token) {
        const tokenExpired = isTokenExpired(token);
        if (tokenExpired) {
          setIsAuth(false);
        } else {
          setIsAuth(true);

          const result = await getUserInfoFromToken(token);
          if (result && result.tokenUserInfo) {
            console.log(result);
            setUser(result.tokenUserInfo);
          }
        }
      }

      setLoading(false);
    };

    init(); // Call the async function
  }, []);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "https://www.cohesiveapps.com/";
    }
  };

  return { isAuth, loading, logout, user };
};

function isTokenExpired(token) {
  try {
    if (!token) return true;
    const decodeToken = jwtDecode(token);
    const expirationTime = decodeToken.exp * 1000;
    return expirationTime < Date.now();
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
}

function decryptToken(encryptedToken, key) {
  if (!encryptedToken) return null;
  try {
    const iv = CryptoJS.enc.Hex.parse(encryptedToken.slice(0, 32));
    const encryptedData = CryptoJS.enc.Hex.parse(encryptedToken.slice(32));

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedData },
      CryptoJS.enc.Utf8.parse(key.padEnd(32, "0")),
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }
    );

    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    return decryptedText || null;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

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
    };

    if (!userId) {
      console.error("User ID not found in token");
      return { tokenUserInfo: userInfo, serverUserData: null };
    }

    // Fetch user data from backend
    const response = await api.get(`/users/${userId}/`);
    if (response.status === 200) {
      const serverData = response.data;

      // Store in localStorage
      localStorage.setItem("loggedInUserInfo", JSON.stringify(serverData));
      localStorage.setItem(
        "facilityId",
        JSON.stringify(serverData.facility.id)
      );

      return {
        tokenUserInfo: userInfo,
        serverUserData: serverData,
      };
    } else {
      console.error("Failed to fetch user data. Status:", response.status);
      return { tokenUserInfo: userInfo, serverUserData: null };
    }
  } catch (error) {
    console.error("Error decoding token or fetching user data:", error);
    return null;
  }
}
