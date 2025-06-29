import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const Sidebar = () => {
  const { sidebarCollapsed, isMobile, sidebarOpen, closeSidebar } = useTheme();
  const location = useLocation();

  const navigationItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: (
        <svg className="sidebar-nav-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" />
        </svg>
      )
    },
    {
      path: '/budget',
      name: 'Budget',
      icon: (
        <svg className="sidebar-nav-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
        </svg>
      )
    },
    {
      path: '/expenses',
      name: 'Expenses',
      icon: (
        <svg className="sidebar-nav-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
        </svg>
      )
    },
    {
      path: '/ai',
      name: 'AI Assistant',
      icon: (
        <svg className="sidebar-nav-icon" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
        </svg>
      )
    }
  ];

  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  const sidebarClasses = `sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${isMobile && sidebarOpen ? 'open' : ''}`;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 'var(--z-modal-backdrop)'
          }}
        />
      )}
      
      <aside className={sidebarClasses}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            BudgetApp
          </div>
        </div>
        
        <nav className="sidebar-nav">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/dashboard' && location.pathname === '/');
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                {item.icon}
                <span className="sidebar-nav-text">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;