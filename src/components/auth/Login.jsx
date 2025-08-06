import { Key, LoaderCircle, Mail } from "lucide-react";
import React, { useState } from "react";
import Button from "../forms/Button";

const LoginPopup = () => {
  // login form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [isLoading, setIsLoading] = useState("");

  const handleSubmit = () => {
    // validate form
    setErrorMessage("");
    setSuccessMessage("");
    if (!username || !password) {
      setErrorMessage("Email and password are required");
      return;
    }
    // simulate login

    localStorage.setItem("isLoggedIn", true);

    setIsLoading(true);
    setTimeout(() => {
      window.location.reload();
      setIsLoading(false);
    }, 2000);
  };
  return (
    <div className="popup login-popup">
      <div className="popup-content">
        <h3>Login</h3>
        <p>Enter your username or email and click login</p>

        {errorMessage && <p className="message error">{errorMessage}</p>}

        {successMessage && <p className="message success">{successMessage}</p>}

        <form>
          <div className="form-group">
            <label htmlFor="">Username or Email</label>
            <div className="icon-input">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="form-control"
                placeholder="Enter your username or email"
              />
              <Mail className="icon" />
            </div>
          </div>
          <div className="form-group">
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
          <Button text={"Login"} isLoading={isLoading} onClick={handleSubmit} />
        </form>
      </div>
    </div>
  );
};

export default LoginPopup;
