import React, { useState } from 'react';
import logoImage from '../assets/logo-iq.png';

const Logo = ({ className = "w-8 h-8", showText = true, size = "default" }) => {
  const [imageError, setImageError] = useState(false);
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return "w-8 h-8";
      case "medium":
        return "w-12 h-12";
      case "large":
        return "w-16 h-16";
      case "xlarge":
        return "w-20 h-20";
      default:
        return "w-12 h-12";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "small":
        return "text-sm";
      case "medium":
        return "text-lg";
      case "large":
        return "text-xl";
      case "xlarge":
        return "text-2xl";
      default:
        return "text-lg";
    }
  };

  return (
    <div className={`flex items-center ${showText ? 'space-x-2' : ''} ${className}`}>
      {/* Logo Image Container */}
      <div className={`${getSizeClasses()} relative flex-shrink-0`}>
        {!imageError ? (
          <img 
            src={logoImage}
            alt="IQScalar Logo" 
            className="w-full h-full object-contain rounded-lg shadow-sm"
            onError={() => setImageError(true)}
            onLoad={() => console.log('Logo loaded successfully')}
          />
        ) : (
          // Fallback CSS-based logo
          <div className={`${getSizeClasses()} bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm flex items-center justify-center text-white font-bold`}>
            <span className="text-xs">IQ</span>
          </div>
        )}
        {/* Premium glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Text - Only show if showText is true */}
      {showText && (
        <div className="flex items-center flex-shrink-0">
          <span className={`font-display font-bold ${getTextSize()} tracking-tight`}>
            <span className="text-[#3498db]">IQ</span>
            <span className="text-[#8e44ad]">Scalar</span>
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo; 