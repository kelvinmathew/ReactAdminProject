import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import "./Main.css"; // keep your existing CSS
import SideBar from "./SideBar";

export default function Profile() {
  const [profile, setProfile] = useState({
    fullName: "Kelvin Mathew Philipose",
    email: "kelvin@gmail.com",
    phone: "6238253297",
    role: "Software engineer",
    bio: "Experienced Software engineer with over 5 years of experience managing web applications and user systems."
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Profile updated successfully!");
    console.log("Updated profile:", profile);
  };

  return (
    <div className="spacebt"><SideBar />
      <div id="profile" className="page active" >
        <div className="page-header" style={{ marginLeft: "16px", marginTop: "19px" }}>
          <h1 className="page-title" >My Profile</h1>
          <p className="page-subtitle">Manage your personal information</p>
        </div>

        <div className="profile-form"  >
          <form onSubmit={handleSubmit}   >
            <div className="form-group" >
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={profile.fullName}
                pattern="^[A-Za-z]+(\s[A-Za-z]+)+$"
                title="Enter your first and last name using only letters"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={profile.email}
                pattern="^[^@]+@[^@]+\.(com|in)$"
                title="Enter Valid Mail Id"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={profile.phone}
                pattern="^[6-9]\d{9}$"
                title="Please enter a 10-digit number"
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                value={profile.role}
                readOnly
              />
            </div>

            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                className="form-control"
                name="bio"
                rows="4"
                value={profile.bio}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginLeft: "18px", marginTop: "18px", width: "9rem", height: "1.88rem" }} >
              Update Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
