import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

const Topbar = () => {
  const { toggleSidebar, toggleTheme, theme } = useTheme();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState({ name: '', email: '' });
  const dropdownRef = useRef(null);

  /* grab user info from localStorage once */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setUser({ name: stored.name ?? 'Guest', email: stored.email ?? '' });
  }, []);

  /* close dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (e) =>
      dropdownRef.current && !dropdownRef.current.contains(e.target) && setDropdownOpen(false);
    if (dropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.clear();           // remove token + user
    window.location.href = '/login';
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg
            className="menu-toggle-icon"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
          </svg>
        </button>

        <div className="topbar-title">
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              color: "var(--text-primary)",
            }}
          >
            Budget Management
          </h1>
        </div>
      </div>

      <div className="topbar-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <svg
              className="theme-toggle-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M21.4 13.7C20.2 14.4 18.8 14.8 17.3 14.8c-5 0-9.1-4.1-9.1-9.1 0-1.5.4-2.9 1.1-4.1C5.1 3.1 2 6.6 2 10.9 2 16.9 6.9 21.8 12.9 21.8c4.3 0 7.8-3.1 9.3-7.2-.3.1-.5.1-.8.1z" />
            </svg>
          ) : (
            <svg
              className="theme-toggle-icon"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2.2l1.4 2.8 3.2.5-2.3 2.2.5 3.2L12 9.5 9.2 10.9l.5-3.2L7.4 5.5l3.2-.5L12 2.2zm0 3.8c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6z" />
            </svg>
          )}
        </button>

        <div className="theme-toggle topbar-user" ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="user-toggle"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-label="User menu"
          >
            <svg 
              className="user-toggle-icon" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {dropdownOpen && (
            <div
              className="user-dropdown"
              style={{
                position: 'absolute',
                top: '3rem',
                right: 0,
                background: 'var(--background)',
                border: '1px solid var(--border-color, rgba(0,0,0,0.1))',
                boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                borderRadius: '12px',
                padding: '1rem',
                minWidth: '220px',
                zIndex: 1000,
                backdropFilter: 'blur(8px)',
              }}
            >
              {/* User Avatar Circle */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.1))'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'var(--primary, #007bff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '600',
                  fontSize: '16px',
                  marginRight: '12px'
                }}>
                  {user.name.charAt(0).toUpperCase() || 'G'}
                </div>
                <div>
                  <div style={{ 
                    fontWeight: '600', 
                    marginBottom: '2px',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}>
                    {user.name}
                  </div>
                  <div style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-secondary)',
                    opacity: 0.7
                  }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div style={{ marginBottom: '12px' }}>
                <button
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--hover-background, rgba(0,0,0,0.05))'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                  Profile
                </button>
                
                <button
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'transparent',
                    color: 'var(--text-primary)',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--hover-background, rgba(0,0,0,0.05))'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/>
                  </svg>
                  Settings
                </button>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'var(--danger, #dc3545)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '8px' }}>
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;