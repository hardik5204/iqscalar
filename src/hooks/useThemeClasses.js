import { useTheme } from '../contexts/ThemeContext';

export const useThemeClasses = () => {
  const { isDarkMode, colors } = useTheme();

  return {
    // Background classes
    bgPrimary: isDarkMode ? 'bg-gray-900' : 'bg-white',
    bgSecondary: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    bgTertiary: isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
    
    // Text classes
    textPrimary: isDarkMode ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textTertiary: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    
    // Border classes
    borderPrimary: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    borderSecondary: isDarkMode ? 'border-gray-600' : 'border-gray-300',
    
    // Hover classes
    hoverBg: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100',
    hoverBgSecondary: isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200',
    
    // Card classes
    cardBg: isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
    cardShadow: isDarkMode ? 'shadow-xl shadow-black/10' : 'shadow-lg shadow-gray-900/5',
    
    // Input classes
    inputBg: isDarkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300',
    inputFocus: isDarkMode ? 'focus:border-blue-400 focus:ring-blue-400/20' : 'focus:border-blue-500 focus:ring-blue-500/20',
    
    // Utility functions
    getThemeClass: (lightClass, darkClass) => isDarkMode ? darkClass : lightClass,
    
    // Theme colors
    colors,
    isDarkMode
  };
}; 