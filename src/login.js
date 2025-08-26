import React, { useState } from "react";
import './login.css';
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Email validation regex
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    return regex.test(email);
  };

  // Password validation regex
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!email) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Enter a valid email (e.g., user@domain.com)";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      validationErrors.password =
        "Password must be at least 8 chars, include uppercase, lowercase, number & special character";
    }

    setErrors(validationErrors);

    // If any validation errors, stop here
    if (Object.keys(validationErrors).length > 0) return;

    // ✅ Any valid email + password will pass
    navigate("/dashboard");
  };

  return (
    <div className="main">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back!</h2>
        </div>
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          {/* Email Input */}
          <div className="input-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          {/* Options */}
          <div className="options">
            <div className="remember-me">
              <input type="checkbox" id="remember-me" />
            </div>
            <a href="/forgot" className="forgot-password">
              
            </a>
          </div>

          {/* Submit */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
