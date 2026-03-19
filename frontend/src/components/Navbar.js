import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { to: '/workouts',  icon: '💪', label: 'Workouts' },
  { to: '/exercises', icon: '🏃', label: 'Exercises' },
  { to: '/diet',      icon: '🥗', label: 'Diet' },
  { to: '/progress',  icon: '📈', label: 'Progress' },
];

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="navbar-hamburger"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="Toggle navigation"
      >
        <span /><span /><span />
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="navbar-overlay" onClick={closeMenu} />
      )}

      <aside className={`navbar ${mobileOpen ? 'navbar--open' : ''}`}>
        {/* Logo */}
        <div className="navbar__logo">
          <span className="navbar__logo-icon">🏋️</span>
          <span className="navbar__logo-text">Fit Peak</span>
        </div>

        {/* Nav links */}
        <nav className="navbar__nav">
          <p className="navbar__section-label">Menu</p>
          {NAV_LINKS.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={closeMenu}
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              <span className="navbar__link-icon">{icon}</span>
              <span className="navbar__link-label">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="navbar__user">
          <div className="navbar__user-avatar">
            {user?.name?.[0]?.toUpperCase() || user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="navbar__user-info">
            <p className="navbar__user-name">
              {user?.name || user?.username || 'User'}
            </p>
            <p className="navbar__user-email">{user?.email || ''}</p>
          </div>
          <button className="navbar__logout" onClick={handleLogout} title="Logout">
            ⏻
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
