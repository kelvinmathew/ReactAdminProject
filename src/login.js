// src/Component/Login.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Cleanup old tokens on component mount
  useEffect(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!email || !password) {
      setErrors({ form: "Email and password are required" });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("access_token", data.access);
        localStorage.setItem("refresh_token", data.refresh);

        toast.success("🎉 Login successful!", { position: "top-right", autoClose: 3000 });

        setTimeout(() => navigate("/dashboard"), 1000);
      } else {
        setErrors({ form: data.detail || "Invalid credentials" });
      }
    } catch (err) {
      setErrors({ form: "Network error, try again later" });
    }
  };

  return (
    <div className="main">
      <ToastContainer />
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {errors.form && <p className="error-text">{errors.form}</p>}
          <div className="input-group">
            <label>Username</label>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
