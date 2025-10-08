import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ActivityLog.css";

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonthYear, setSelectedMonthYear] = useState(
    new Date().toLocaleString("en-US", { month: "long", year: "numeric" })
  );

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // ✅ Updated token line
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");

        const res = await axios.get("http://127.0.0.1:8000/api/activity-logs/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter logs by selected month/year
        const filteredLogs = res.data.filter((log) => {
          const logDate = new Date(log.timestamp);
          const [month, year] = selectedMonthYear.split(" ");
          return (
            logDate.toLocaleString("en-US", { month: "long" }) === month &&
            logDate.getFullYear().toString() === year
          );
        });

        setLogs(filteredLogs);
      } catch (err) {
        console.error(err);
        setError("Failed to load activity logs");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [selectedMonthYear]);

  // Generate last 12 months for dropdown
  const generateMonthYearOptions = () => {
    const options = [];
    const currentDate = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      );
      options.push(
        date.toLocaleString("en-US", { month: "long", year: "numeric" })
      );
    }
    return options;
  };

  if (loading) return <p className="loading-message">Loading activity logs...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="activity-log-container">
      <div className="activity-log-header">
        <h2 className="header-title">Activity Log</h2>

        <div className="modern-dropdown">
          <button className="dropdown-btn">
            {selectedMonthYear} <span className="arrow">▼</span>
          </button>
          <div className="dropdown-content">
            {generateMonthYearOptions().map((option) => (
              <div
                key={option}
                className="dropdown-item"
                onClick={() => setSelectedMonthYear(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      </div>

      {logs.length === 0 ? (
        <p className="no-logs-message">
          No activity logs found for {selectedMonthYear}.
        </p>
      ) : (
        <div className="activity-log-list">
          {logs.map((log, index) => (
            <div className="activity-log-item" key={index}>
              <div className="avatar">
                {log.target_user
                  ? log.target_user.charAt(0).toUpperCase()
                  : "U"}
              </div>

              <div className="log-user-info">
                <span className="log-email">
                   {log.username || "No user"}<br />
                  {log.email || "No Email"}
                </span>
              </div>

              <div className="log-statement-action-group">
                <span className="log-statement-prefix">{log.target_user || "Unknown User"}</span>
                <div className="log-action-text">{log.message}</div>
              </div>

              <div className="log-timestamp">
                {new Date(log.timestamp).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
