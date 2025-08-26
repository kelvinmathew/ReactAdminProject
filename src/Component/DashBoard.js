import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import './Main.css';
import SideBar from './SideBar';
import MainDashboard from './maincontent';



function Dashboard() {
    return (
        <div className='hee'>
            <SideBar />
            <MainDashboard />

        </div>
    );
}

export default Dashboard; 