import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { 
  Home, 
  Plane, 
  Hotel, 
  MapPin, 
  CalendarDays,
  User,
  Settings,
  LogOut 
} from 'lucide-react';
const Sidebar = () => {
  const { sidebarCollapsed, isMobile, sidebarOpen, closeSidebar } = useTheme();
  const location = useLocation();

  const navigationItems = [
    {
      path: '/dashboard',
      name: 'Dashboard',
      icon: <Home size={20} className="sidebar-nav-icon" />
    },
    {
      path: '/bookings',
      name: 'Bookings',
      icon: <CalendarDays size={20} className="sidebar-nav-icon" />
    },
    {
      path: '/flights',
      name: 'Flights',
      icon: <Plane size={20} className="sidebar-nav-icon" />
    },
    {
      path: '/hotels',
      name: 'Hotels',
      icon: <Hotel size={20} className="sidebar-nav-icon" />
    },
    {
      path: '/destinations',
      name: 'Destinations',
      icon: <MapPin size={20} className="sidebar-nav-icon" />
    }
  ];

  const bottomNavigationItems = [
    {
      path: '/profile',
      name: 'Profile',
      icon: <User size={20} className="sidebar-nav-icon" />
    },
    {
      path: '/logout',
      name: 'Logout',
      icon: <LogOut size={20} className="sidebar-nav-icon" />
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
            zIndex: 'var(--z-modal-backdrop)',
            cursor: 'pointer'
          }}
        />
      )}
      
      <aside className={sidebarClasses}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            {sidebarCollapsed ? 'TB' : 'TravelBooking'}
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="sidebar-nav-section">
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
                  <span className="sidebar-nav-icon-wrapper">
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="sidebar-nav-text">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="sidebar-nav-section bottom-section">
            {bottomNavigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                  onClick={item.path === '/logout' ? () => {
                    handleLinkClick();
                    // Add logout logic here
                  } : handleLinkClick}
                >
                  <span className="sidebar-nav-icon-wrapper">
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="sidebar-nav-text">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;