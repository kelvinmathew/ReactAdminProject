import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import SideBar from "./Component/SideBar";
import Dashboard from "./Component/DashBoard";
import UserList from "./Component/listuser";
import Profile from "./Component/profile";




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
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
         
         


       

        
      </Routes>
    </Router>
  );
}

export default App;
