import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const { sidebarCollapsed } = useTheme();
  
  // Define routes where we don't want to show sidebar and topbar
  const authRoutes = ['/login', '/register'];
  const isAuthRoute = authRoutes.includes(location.pathname);

  if (isAuthRoute) {
    return (
      <div className="auth-layout">
        {children}
      </div>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <Topbar />
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;