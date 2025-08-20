"use client";

import toast from "react-hot-toast";
import "@/styles/_login.scss";
import { CheckSquare, Key, Mail, Square } from "lucide-react";
import React, { useState } from "react";
import Button from "../forms/Button";
import { useAuthentication } from "@/context/authContext";
import { authService } from "@/services/auth";

const LoginPopup = () => {
  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useAuthentication();

  const handleSubmit = async () => {
    // Clear any previous toasts
    toast.dismiss();

    if (!username || !password) {
      toast.error("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(username, password);

      if (result.success) {
        // Use the auth context login method
        const loginSuccess = await login(
          result.accessToken,
          result.refreshToken
        );

        if (loginSuccess) {
          toast.success("Login successful!");
          // No need to reload the window, the auth context will handle the state update
        }
      } else {
        toast.error(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="background">{/* holds the background */}</div>
      <div className="login-page-content">
        <div className="form">
          <img src="/logo-blue.svg" alt="" className="logo" />
          <h1>Log into your account</h1>
          <p>
            Please enter your credentials to access the cohesive quality control
            platform
          </p>

          {/* {errorMessage && <p className="message error">{errorMessage}</p>}

          {successMessage && <p className="message success">{successMessage}</p>} */}

          <form>
            <div className="form-control">
              <label htmlFor="">Enter your Email</label>
              <div className="icon-input">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-control"
                  placeholder="Enter your email"
                />
                <Mail size={20} className="icon" />
              </div>
            </div>
            <div className="form-control">
              <label htmlFor="">Password</label>
              <div className="icon-input">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter your password"
                />
                <Key size={20} className="icon" />
              </div>
            </div>

            <div className="links">
              {/* remember me */}
              <div
                className="remember-me"
                onClick={() => setRememberMe(!rememberMe)}
              >
                {rememberMe ? <CheckSquare size={20} /> : <Square size={20} />}
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              {/* forgot password */}
              <div className="forgot-password">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>
            <Button
              text={"Login"}
              isLoading={isLoading}
              onClick={handleSubmit}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
