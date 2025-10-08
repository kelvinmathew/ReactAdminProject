// src/Component/AuthProvider.js
import React, { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthProvider({ children }) {
  const navigate = useNavigate();

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh_token");
    if (!refreshToken) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/token/refresh/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("access_token", data.access);
        console.log("Access token refreshed:", new Date().toLocaleTimeString());
      } else {
        console.error("Refresh failed:", data);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    } catch (err) {
      console.error("Network error while refreshing token:", err);
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    // For testing, refresh every 10 seconds. Change to 2*60*1000 for 2 minutes
    const interval = setInterval(refreshAccessToken, 10 * 1000);
    return () => clearInterval(interval);
  }, [refreshAccessToken]);

  return <>{children}</>;
}
