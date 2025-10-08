import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './MainDashboard.css';

function MainDashboard() {
  const statsData = [
    { title: "Total Users", value: "1,247", icon: "👥", color: "#ff6b81" },
    { title: "Active Users", value: "1,108", icon: "✅", color: "#1dd1a1" },
    { title: "Revenue", value: "$12,450", icon: "💰", color: "#54a0ff" },
    { title: "Customer Rating", value: "4.8/5", icon: "⭐", color: "#feca57" },
  ];

  const projectsData = [
    { name: "Website Redesign", progress: 80, status: "On Track" },
    { name: "Mobile App Launch", progress: 55, status: "Delayed" },
    { name: "Marketing Campaign", progress: 100, status: "Completed" },
    { name: "Zoho CRM Integration", progress: 40, status: "In Progress" },
  ];

  const activityFeed = [
    { user: "John Doe", action: "uploaded a new file", time: "2 mins ago" },
    { user: "Jane Smith", action: "completed a project", time: "1 hr ago" },
    { user: "Alex Johnson", action: "joined the team", time: "3 hrs ago" },
    { user: "Emily Davis", action: "sent a message", time: "5 hrs ago" },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="header-title">Dashboard</h1>
          <p className="header-subtitle">Your modern admin panel</p>
        </div>
        <div className="header-right">
          <button className="header-btn">📅 Select Month</button>
          <button className="header-btn">🔔 Notifications</button>
          <div className="profile-avatar">A</div>
        </div>
      </header>

      {/* Stats Cards - Glassmorphism */}
      <section className="stats-cards">
        {statsData.map((stat, idx) => (
          <div
            className="stat-card-glass"
            key={idx}
            style={{ borderTop: `4px solid ${stat.color}` }}
          >
            <div className="stat-icon-glass">{stat.icon}</div>
            <div className="stat-info-glass">
              <p className="stat-title-glass">{stat.title}</p>
              <h3 className="stat-value-glass">{stat.value}</h3>
            </div>
          </div>
        ))}
      </section>

      {/* Projects Section */}
      <section className="projects-section-glass">
        <h2>Ongoing Projects</h2>
        <div className="projects-cards">
          {projectsData.map((proj, idx) => (
            <div className="project-card" key={idx}>
              <h3>{proj.name}</h3>
              <div className="progress-bar-glass">
                <div
                  className="progress-glass"
                  style={{ width: `${proj.progress}%` }}
                ></div>
              </div>
              <p className={`status ${proj.status.replace(" ", "").toLowerCase()}`}>
                {proj.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Activity Feed */}
      <section className="activity-feed-glass">
        <h2>Recent Activity</h2>
        <ul>
          {activityFeed.map((act, idx) => (
            <li key={idx}>
              <strong>{act.user}</strong> {act.action} <span>{act.time}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default MainDashboard;
