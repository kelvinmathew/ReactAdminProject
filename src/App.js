// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Register from "./Register";
import Dashboard from "./Component/DashBoard";
import SideBar from "./Component/SideBar";
import UserList from "./Component/listuser";
import Profile from "./Component/profile";
import ActivityLog from "./Component/ActivityLog";
import AuthProvider from "./Component/AuthProvider";

// Layout wrapper for pages with sidebar
const Layout = ({ children }) => (
  <div className="layout-container">
    <SideBar />
    <div className="main-content">{children}</div>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/userlist" element={<Layout><UserList /></Layout>} />
          <Route path="/activelog" element={<Layout><ActivityLog /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
