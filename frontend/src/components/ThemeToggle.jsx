import React from 'react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTheme, THEME_MODES } from './layout/ThemeContext';

const ThemeToggle = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === THEME_MODES.DARK;

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 ${className} ${
        isDark 
        ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <FaSun className="w-5 h-5" />
      ) : (
        <FaMoon className="w-5 h-5" />
      )}
    </button>
  );
};

export default ThemeToggle; 