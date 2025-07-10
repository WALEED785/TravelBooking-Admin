// src/components/common/Topbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

/*  MUI icons (only icons, no MUI layout)  */
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Topbar = () => {
  /* ---- context helpers ---- */
  const { toggleSidebar, toggleTheme, theme } = useTheme();
  const navigate = useNavigate();

  /* ---- dropdown / refs ---- */
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ---- user & countdown ---- */
  const [user, setUser] = useState({ username: 'Guest', role: '', expiry: '' });
  const [countdown, setCountdown] = useState('--:--');

  /* === Read user once from localStorage === */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setUser({
      username: stored.username || 'Guest',
      role: stored.role || '',
      expiry: stored.expiry || ''
    });
  }, []);

  /* === Token–expiry countdown + auto‑logout === */
  useEffect(() => {
    if (!user.expiry) return;

    const timer = setInterval(() => {
      const diff = new Date(user.expiry).getTime() - Date.now();
      if (diff <= 0) {
        clearInterval(timer);
        handleLogout();
      } else {
        const m = Math.floor(diff / 60000);
        const s = Math.floor((diff % 60000) / 1000)
          .toString()
          .padStart(2, '0');
        setCountdown(`${m}:${s}`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [user.expiry]);

  /* === Close dropdown when clicking outside === */
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleOutside = (e) =>
      dropdownRef.current && !dropdownRef.current.contains(e.target) && setDropdownOpen(false);
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [dropdownOpen]);

  /* ---------- handlers ---------- */
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/auth/login';
  };

  const goToProfile = () => {
    setDropdownOpen(false);
    navigate('/profile');
  };

  /* ---------- render ---------- */
  return (
    <header className="topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
          <MenuIcon fontSize="inherit" />
        </button>

        <div className="topbar-title">
          <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--text-primary)' }}>
            Travel-Booking
          </h1>
        </div>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        {/* countdown */}
        <span style={{ marginRight: '1rem', fontSize: '.9rem', color: 'var(--text-primary)' }}>
          Session&nbsp;expires&nbsp;in&nbsp;<strong>{countdown}</strong>
        </span>

        {/* theme toggle */}
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </button>

        {/* user avatar & dropdown */}
        <div
          className="theme-toggle topbar-user"
          ref={dropdownRef}
          style={{ position: 'relative' }}
        >
          <button
            className="user-toggle"
            onClick={() => setDropdownOpen((o) => !o)}
            aria-label="User menu"
          >
            <AccountCircleIcon />
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
                backdropFilter: 'blur(8px)'
              }}
            >
              {/* avatar + name */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: '1px solid var(--border-color, rgba(0,0,0,0.1))'
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--primary, #007bff)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 16,
                    marginRight: 12
                  }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 2,
                      fontSize: 14,
                      color: 'var(--text-primary)'
                    }}
                  >
                    {user.username}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      opacity: 0.7,
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {user.role}
                  </div>
                </div>
              </div>

              {/* menu buttons */}
              <button onClick={goToProfile} style={btnStyle}>
                Profile
              </button>
              <button onClick={handleLogout} style={{ ...btnStyle, color: 'var(--danger, #dc3545)' }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

/* shared inline style for dropdown buttons */
const btnStyle = {
  width: '100%',
  padding: '8px 12px',
  background: 'transparent',
  color: 'var(--text-primary)',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  textAlign: 'left',
  transition: 'background-color 0.2s ease'
};

export default Topbar;
