"use client";

import toast from "react-hot-toast";
import BackButton from "@/components/forms/BackButton";
import Button from "@/components/forms/Button";
import { forgotPassword, resetPassword } from "@/services/auth";
import "@/styles/_login.scss";
import { ArrowLeft, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);

  // new password
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // handle form submission
  const handleSubmit = async () => {
    localStorage.setItem("passwordResetEmail", username);
    // validate form

    setIsLoading(true);

    const response = await forgotPassword(username);
    if (response.success) {
      toast.success(response.message);
      setUsername("");
      setResetCodeSent(true);
    } else {
      toast.error(response.error);
    }
    setIsLoading(false);
  };

  // handle reset code submission
  const handleResetCodeSubmit = async () => {
    // get the email from local storage
    const email = localStorage.getItem("passwordResetEmail");
    if (!email) {
      toast.error("No email found. Please try again.");
      return;
    }

    setIsLoading(true);
    const payload = {
      code: resetCode,
      new_password: newPassword,
      email: email,
    };
    const response = await resetPassword(payload);
    if (response.success) {
      toast.success(response.message);
      setResetCode("");
      setNewPassword("");
      router.push("/");
      localStorage.removeItem("passwordResetEmail");
    } else {
      toast.error(response.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="background">{/* holds the background */}</div>
      <div className="login-page-content">
        <div className="form">
          <h1>Forgot Password</h1>
          <p>Please enter your email to reset your password.</p>

          {resetCodeSent ? (
            <>
              <form action="">
                <div className="form-control">
                  <label htmlFor="passResetCode">Reset code</label>
                  <input
                    type="text"
                    id="passResetCode"
                    placeholder="Enter your reset code here"
                    autoComplete="off"
                    value={resetCode}
                    onChange={(e) => setResetCode(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="Enter your new password"
                    autoComplete="off"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Button
                  text={"Back to Login"}
                  onClick={handleResetCodeSubmit}
                />
              </form>
              <p>
                A reset code has been sent to your email. Please check your
                inbox.
              </p>
            </>
          ) : (
            <>
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
                <div className="buttons">
                  <Button
                    text={"Send Reset Link"}
                    isLoading={isLoading}
                    onClick={handleSubmit}
                  />
                </div>
              </form>
              <p className="note">
                You will receive an email with instructions to reset your
                password.
              </p>
            </>
          )}

          <BackButton onClick={() => router.push("/")} text={"Back to Login"} />
        </div>
      </div>
    </div>
  );
};

export default page;
