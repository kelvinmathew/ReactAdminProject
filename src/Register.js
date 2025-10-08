// src/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    let validationErrors = {};

    // Client-side validation
    if (!username) validationErrors.username = "Username is required";
    if (!email) validationErrors.email = "Email is required";
    else if (!validateEmail(email)) validationErrors.email = "Enter a valid email";

    if (!password) validationErrors.password = "Password is required";
    else if (!validatePassword(password))
      validationErrors.password =
        "Password must be at least 8 chars, include uppercase, lowercase, number & special character";

    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      // Registration API call
      const registerResponse = await fetch(
        "http://127.0.0.1:8000/api/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            email,
            first_name: firstName,
            last_name: lastName,
            password,
            profile: { bio, phone },
          }),
        }
      );

      const registerData = await registerResponse.json();

      if (!registerResponse.ok) {
        console.error("Registration error:", registerData);
        setErrors({
          backend: registerData.detail || JSON.stringify(registerData),
        });
        return;
      }

      // ✅ Redirect to login after successful registration
      alert("Registration successful! Please login.");
      navigate("/login"); // <-- go to login page

    } catch (err) {
      console.error("Network error:", err);
      setErrors({ backend: "Network error. Please try again later." });
    }
  };

  return (
    <div className="register-container">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} noValidate>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="error">{errors.username}</p>}

        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <input
          type="text"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        {errors.backend && <p className="error">{errors.backend}</p>}

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
