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

    const params = new URLSearchParams(window.location.search);
    const encryptedToken = params.get("token");

    if (!encryptionKey) {
      window.location.href = `${domainName}/?error=Invalid encryption key`;
      return; // Prevent further execution
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

        const userInfo = getUserInfoFromToken(token);
        if (userInfo) {
          setUser(userInfo);
        }
      }
    }
    setLoading(false);
  }, []); // Empty dependency array ensures this runs only once

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

    // Extract user information
    const userInfo = {
      firstName: decodedToken.first_name,
      lastName: decodedToken.last_name,
      email: decodedToken.email,
    };

    const userId = decodedToken.user_id;
    const response = await api.get(`/users/${userId}/`);
    if (response.status === 200) {
      console.log("User data:", response.data);
      localStorage.setItem("loggedInUserInfo", JSON.stringify(response.data));
      localStorage.setItem(
        "facilityId",
        JSON.stringify(response.data.facility.id)
      );
      return response.data;
    } else {
      console.error("Failed to fetch user data. Status:", response.status);
    }

    return userInfo;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
