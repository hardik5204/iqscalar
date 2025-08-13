import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check localStorage for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Add transition class for smooth theme changes
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    // Update document class for Tailwind dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Only auto-update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    setIsDarkMode(prev => !prev);
    
    // Reset transition flag after animation
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  // Theme-aware color utilities
  const getThemeColors = () => ({
    primary: isDarkMode ? '#3b82f6' : '#3498db',
    secondary: isDarkMode ? '#8b5cf6' : '#8e44ad',
    background: isDarkMode ? '#111827' : '#ffffff',
    surface: isDarkMode ? '#1f2937' : '#f9fafb',
    text: isDarkMode ? '#f9fafb' : '#111827',
    textSecondary: isDarkMode ? '#d1d5db' : '#6b7280',
    border: isDarkMode ? '#374151' : '#e5e7eb',
  });

  const value = {
    isDarkMode,
    toggleTheme,
    theme: isDarkMode ? 'dark' : 'light',
    isTransitioning,
    colors: getThemeColors(),
    // Utility functions
    getThemeClass: (lightClass, darkClass) => isDarkMode ? darkClass : lightClass,
    getBgClass: () => isDarkMode ? 'bg-gray-900' : 'bg-white',
    getTextClass: () => isDarkMode ? 'text-gray-100' : 'text-gray-900',
    getSecondaryTextClass: () => isDarkMode ? 'text-gray-300' : 'text-gray-600',
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={`transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}; 