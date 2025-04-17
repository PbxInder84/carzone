import React, { createContext, useContext, useEffect, useState } from 'react';

// Create a context for theme management
const ThemeContext = createContext();

// Theme mode options
export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Provider component that makes theme available throughout the app
export const ThemeProvider = ({ children }) => {
  // Try to get stored theme or use system preference as default
  const [theme, setTheme] = useState(() => {
    // Check localStorage first (client-side only)
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      // Check for system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return THEME_MODES.DARK;
      }
    }
    return THEME_MODES.LIGHT;
  });
  
  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === THEME_MODES.LIGHT ? THEME_MODES.DARK : THEME_MODES.LIGHT;
    setTheme(newTheme);
  };
  
  // Update localStorage and apply class to document when theme changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('theme', theme);
    
    // Apply appropriate class to document root
    if (theme === THEME_MODES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Set a data attribute for easier debugging
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Ensure theme is applied on initial render
  useEffect(() => {
    // Apply the theme immediately after mounting
    const currentTheme = localStorage.getItem('theme') || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? THEME_MODES.DARK 
        : THEME_MODES.LIGHT);
    
    if (currentTheme === THEME_MODES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, []);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 