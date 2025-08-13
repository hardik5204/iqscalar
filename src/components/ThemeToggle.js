import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = ({ className = "", size = "default" }) => {
  const { isDarkMode, toggleTheme, isTransitioning } = useTheme();

  const sizeClasses = {
    small: "w-8 h-8 text-sm",
    default: "w-10 h-10 text-base",
    large: "w-12 h-12 text-lg"
  };

  return (
    <button
      onClick={toggleTheme}
      disabled={isTransitioning}
      className={`
        ${sizeClasses[size]}
        ${className}
        relative overflow-hidden rounded-full transition-all duration-300 transform
        ${isDarkMode 
          ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
          : 'bg-gray-100 hover:bg-gray-200 text-orange-500'
        }
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${isDarkMode ? 'focus:ring-offset-gray-900' : 'focus:ring-offset-white'}
        disabled:opacity-50 disabled:cursor-not-allowed
        group shadow-lg hover:shadow-xl
      `}
      title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      aria-label={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {/* Background glow effect */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300
        ${isDarkMode 
          ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20' 
          : 'bg-gradient-to-r from-orange-400/20 to-yellow-400/20'
        }
        opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100
      `} />
      
      {/* Icon container */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {/* Sun Icon */}
        <svg
          className={`
            absolute transition-all duration-500 ease-in-out
            ${isDarkMode 
              ? 'opacity-0 scale-0 rotate-180' 
              : 'opacity-100 scale-100 rotate-0'
            }
            ${isTransitioning ? 'animate-spin' : ''}
          `}
          fill="currentColor"
          viewBox="0 0 24 24"
          width="60%"
          height="60%"
        >
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>

        {/* Moon Icon */}
        <svg
          className={`
            absolute transition-all duration-500 ease-in-out
            ${isDarkMode 
              ? 'opacity-100 scale-100 rotate-0' 
              : 'opacity-0 scale-0 -rotate-180'
            }
            ${isTransitioning ? 'animate-pulse' : ''}
          `}
          fill="currentColor"
          viewBox="0 0 24 24"
          width="60%"
          height="60%"
        >
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
        </svg>
      </div>

      {/* Ripple effect */}
      <div className={`
        absolute inset-0 rounded-full transition-all duration-300
        ${isDarkMode 
          ? 'bg-yellow-400/30' 
          : 'bg-orange-400/30'
        }
        scale-0 group-active:scale-100 group-active:opacity-100
        opacity-0
      `} />
    </button>
  );
};

export default ThemeToggle; 