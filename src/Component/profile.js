import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from "react";
import './Profile.css';

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "Software Engineer",
    bio: ""
  });

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      // ✅ Updated token line
      const token = localStorage.getItem("access_token") || localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProfile({
            fullName: `${data.first_name || ""} ${data.last_name || ""}`,
            email: data.email || "",
            phone: data.profile?.phone || "",
            bio: data.profile?.bio || "",
            role: "Software Engineer"
          });
        } else {
          setMessage("Failed to load profile data.");
        }
      } catch (err) {
        setMessage("Network error. Could not load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // ✅ Updated token line
    const token = localStorage.getItem("access_token") || localStorage.getItem("token");
    if (!token) {
      setMessage("Authentication required to update profile.");
      return;
    }

    const [first_name, ...rest] = profile.fullName.split(" ");
    const last_name = rest.join(" ");

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/users/me/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          first_name,
          last_name,
          email: profile.email,
          profile: {
            phone: profile.phone,
            bio: profile.bio
          }
        })
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const data = await response.json();
        setMessage(`Failed to update profile: ${data.detail || JSON.stringify(data)}`);
      }
    } catch (err) {
      setMessage("Network error. Please try again later.");
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-state">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <p className="profile-subtitle">Your personal information</p>
      </div>

      <div className="profile-card">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                className="form-control sleek-input"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                className="form-control sleek-input"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                className="form-control sleek-input"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">Role</label>
              <input
                type="text"
                id="role"
                className="form-control sleek-input"
                value={profile.role}
                readOnly
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="bio" className="form-label">Bio</label>
            <textarea
              id="bio"
              className="form-control sleek-input"
              name="bio"
              rows="3"
              value={profile.bio}
              onChange={handleChange}
            ></textarea>
          </div>
        </form>

        {message && (
          <p >
           
          </p>
        )}
      </div>
    </div>
  );
}
