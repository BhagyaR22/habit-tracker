import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-ink border-b border-sage/30 dark:border-sage/20">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl font-display font-semibold text-ink dark:text-cream"
        >
          Habit Tracker
        </NavLink>

        {/* Navigation */}
        {user && (
          <div className="flex items-center gap-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `font-body transition ${
                  isActive
                    ? 'text-moss dark:text-sage font-semibold'
                    : 'text-ink/70 dark:text-cream/70 hover:text-moss dark:hover:text-sage'
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/calendar"
              className={({ isActive }) =>
                `font-body transition ${
                  isActive
                    ? 'text-moss dark:text-sage font-semibold'
                    : 'text-ink/70 dark:text-cream/70 hover:text-moss dark:hover:text-sage'
                }`
              }
            >
              Calendar
            </NavLink>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="px-3 py-2 rounded-lg border border-sage/40 dark:border-sage/30 text-ink dark:text-cream hover:bg-cream dark:hover:bg-white/10 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-clay text-white hover:opacity-90 transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}