import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Main.css';

function SideBar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", icon: "📊", label: "Dashboard" },
    { path: "/userlist", icon: "👥", label: "User List" },
    { path: "/activelog", icon: "👥", label: "Activity Log" },
    { path: "/profile", icon: "👤", label: "My Profile" },
    
  ];

  // ✅ Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest(".sidebar") && !e.target.closest(".sidebar-toggle")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* ✅ Header bar with toggle button (only visible on mobile) */}
      <div className="top-nav">
        <div className="toggle-container">
         
          <button
            className="sidebar-toggle"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>
        <h5 className="top-title">Admin Panel</h5>
      </div>

      {/* Sidebar */}
      <nav className={`sidebar ${isOpen ? "active" : ""}`}>
        <div className="logo">
          <h6>Admin Panel</h6>
        </div>
        <ul className="nav-menu">
          {navItems.map((item, index) => (
            <li key={index} className="nav-item">
              <Link
                className="nav-link"
                to={item.path}
                onClick={() => setIsOpen(false)} // close after click
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default SideBar;
