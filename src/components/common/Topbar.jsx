import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const Topbar = () => {
  const { toggleSidebar, toggleTheme, theme } = useTheme();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button 
          className="menu-toggle" 
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg className="menu-toggle-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>
        
        <div className="topbar-title">
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Budget Management
          </h1>
        </div>
      </div>
      
      <div className="topbar-right">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="theme-toggle-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.4 13.7C20.2 14.4 18.8 14.8 17.3 14.8c-5 0-9.1-4.1-9.1-9.1 0-1.5.4-2.9 1.1-4.1C5.1 3.1 2 6.6 2 10.9 2 16.9 6.9 21.8 12.9 21.8c4.3 0 7.8-3.1 9.3-7.2-.3.1-.5.1-.8.1z"/>
            </svg>
          ) : (
            <svg className="theme-toggle-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.2l1.4 2.8 3.2.5-2.3 2.2.5 3.2L12 9.5 9.2 10.9l.5-3.2L7.4 5.5l3.2-.5L12 2.2zm0 3.8c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z"/>
            </svg>
          )}
        </button>
        
        <div className="topbar-user">
          <button className="btn btn-ghost">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;