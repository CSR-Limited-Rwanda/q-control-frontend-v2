'use client';
import '@/styles/_login.scss';
import { Key, LoaderCircle, Mail } from "lucide-react";
import React, { useState } from "react";
import Button from "../forms/Button";
import { useAuthentication } from "@/context/authContext";
import { authService } from "@/services/auth";

const LoginPopup = () => {
  const { login } = useAuthentication();
  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // validate form
    setErrorMessage("");
    setSuccessMessage("");

    if (!username || !password) {
      setErrorMessage("Email and password are required");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.login(username, password);

      if (result.success) {
        const loginSuccess = await login(result.accessToken, result.refreshToken);

        if (loginSuccess) {
          setSuccessMessage("Login successful!");
          // The AuthContext will handle the authentication state
          // No need to reload the page
        } else {
          setErrorMessage("Failed to authenticate user. Please try again.");
        }
      } else {
        setErrorMessage(result.error);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="background">
        {/* holds the background */}
      </div>
      <div className="login-page-content">
        <div className="form">
          <img src="/logo-blue.svg" alt="" className='logo' />
          <h1>Log into your account</h1>
          <p>Please enter your credentials to access the cohesive quality control platform</p>

          {errorMessage && <p className="message error">{errorMessage}</p>}

          {successMessage && <p className="message success">{successMessage}</p>}

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
                <Mail className="icon" />
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
                <Key className="icon" />
              </div>
            </div>

            <div className="links">
              {/* remember me */}
              <div className="remember-me">
                <input type="checkbox" id="rememberMe" />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              {/* forgot password */}
              <div className="forgot-password">
                <a href="/forgot-password">Forgot password?</a>
              </div>
            </div>
            <Button text={"Login"} isLoading={isLoading} onClick={handleSubmit} />
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPopup;
