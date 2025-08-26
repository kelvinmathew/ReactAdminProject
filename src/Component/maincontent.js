import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import './Main.css';



function MainDashboard() {
    return (
        <div className="dashboard-container">
            <main className="main-content">

                {/* Dashboard Page */}
                <div id="dashboard" className="page active">
                    <div className="page-header">
                        <h1 className="page-title">Dashboard</h1>
                        <p className="page-subtitle">Welcome to your admin dashboard</p>
                    </div>

                    <div className="dashboard-cards">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Total Users</h3>
                                <span className="card-icon">👥</span>
                            </div>
                            <div className="card-value">1,247</div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Active Users</h3>
                                <span className="card-icon">✅</span>
                            </div>
                            <div className="card-value">1,108</div>
                        </div>
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Last Month</h3>
                                <span className="card-icon">📈</span>
                            </div>
                            <div className="card-value">2,080</div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">New This Month</h3>
                                <span className="card-icon">📈</span>
                            </div>
                            <div className="card-value">890</div>
                        </div>

                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Revenue</h3>
                                <span className="card-icon">💰</span>
                            </div>
                            <div className="card-value">$12,450</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default MainDashboard; 