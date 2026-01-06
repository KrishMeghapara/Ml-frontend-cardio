import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Header.css';

const Header = ({ onNavigateHome }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="header" role="banner">
      <div className="header-container">
        <button
          className="logo"
          onClick={onNavigateHome}
          aria-label="CardioPredict - Return to home page"
          type="button"
        >
          <div className="logo-icon-wrapper" aria-hidden="true">
            <svg className="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <div className="logo-content">
            <span className="logo-text">CardioPredict</span>
            <span className="logo-tagline">Health Risk Assessment</span>
          </div>
        </button>

        <nav className="nav" role="navigation" aria-label="Main navigation">
          <div className="nav-item">
            <div className="status-indicator" aria-label="System status: Online">
              <span className="status-dot" aria-hidden="true"></span>
              <span className="status-text">System Online</span>
            </div>
          </div>

          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            type="button"
          >
            {isDark ? (
              <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg className="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
            <span className="theme-label">{isDark ? 'Light' : 'Dark'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;