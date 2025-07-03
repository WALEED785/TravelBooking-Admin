import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="content-wrapper">
          <Outlet /> {/* This renders the matched child route */}
        </div>
      </div>
    </div>
  );
};

export default Layout;