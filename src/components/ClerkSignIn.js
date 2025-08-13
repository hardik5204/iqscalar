import React from 'react';
import { SignIn } from '@clerk/clerk-react';
import { useTheme } from '../contexts/ThemeContext';

const ClerkSignIn = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float ${
          isDarkMode 
            ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/15' 
            : 'bg-gradient-to-r from-blue-300/40 to-purple-300/30'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-blob1 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-purple-500/15 to-pink-500/20' 
            : 'bg-gradient-to-r from-purple-300/30 to-pink-300/40'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl animate-blob2 ${
          isDarkMode 
            ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/20' 
            : 'bg-gradient-to-r from-cyan-300/30 to-blue-300/40'
        }`}></div>
        
        {/* Animated particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 rounded-full animate-ping ${
              isDarkMode ? 'bg-blue-400/20' : 'bg-blue-400/30'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Light grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className={`absolute top-10 left-10 w-1 h-1 rounded-full ${
            isDarkMode ? 'bg-blue-400/15' : 'bg-blue-400/20'
          }`}></div>
          <div className={`absolute top-20 right-20 w-1 h-1 rounded-full ${
            isDarkMode ? 'bg-purple-400/15' : 'bg-purple-400/20'
          }`}></div>
          <div className={`absolute bottom-20 left-20 w-1 h-1 rounded-full ${
            isDarkMode ? 'bg-pink-400/15' : 'bg-pink-400/20'
          }`}></div>
          <div className={`absolute bottom-10 right-10 w-1 h-1 rounded-full ${
            isDarkMode ? 'bg-cyan-400/15' : 'bg-cyan-400/20'
          }`}></div>
          <div className={`absolute top-1/2 left-1/4 w-1 h-1 rounded-full ${
            isDarkMode ? 'bg-blue-400/15' : 'bg-blue-400/20'
          }`}></div>
          <div className={`absolute top-1/4 right-1/4 w-1 h-1 rounded-full ${
            isDarkMode ? 'bg-purple-400/15' : 'bg-purple-400/20'
          }`}></div>
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          {/* Header Section */}
          <div className="text-center animate-fade-in">
            <div className="mb-6 relative">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
                <span className="text-3xl">🧠</span>
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-40"></div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className={`text-transparent bg-clip-text bg-gradient-to-r animate-gradient ${
                isDarkMode 
                  ? 'from-gray-100 via-blue-400 to-purple-400' 
                  : 'from-gray-700 via-blue-600 to-purple-600'
              }`}>
                Welcome Back
              </span>
            </h1>
            <p className={`text-xl font-light ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Sign in to your CORTEXA account
            </p>
          </div>

          {/* Clerk SignIn Component */}
          <div className="relative animate-fade-in-delay">
            <div className={`backdrop-blur-xl rounded-3xl p-8 shadow-2xl border relative overflow-hidden ${
              isDarkMode 
                ? 'bg-gray-800/40 border-gray-700/50' 
                : 'bg-white/40 border-white/50'
            }`}>
              {/* Card glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl blur-xl"></div>
              
              <div className="relative z-10">
                <SignIn 
                  appearance={{
                    elements: {
                      formButtonPrimary: 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-2xl',
                      card: 'bg-transparent shadow-none',
                      headerTitle: `text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-[#34495e]'}`,
                      headerSubtitle: `${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`,
                      socialButtonsBlockButton: `backdrop-blur-md border rounded-2xl hover:scale-105 transition-all duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700/30 border-gray-600/40 hover:bg-gray-600/50 text-gray-200' 
                          : 'bg-white/30 border-white/40 hover:bg-white/50'
                      }`,
                      formFieldInput: `w-full px-4 py-3 backdrop-blur-md border-2 rounded-2xl transition-all duration-300 placeholder-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 ${
                        isDarkMode 
                          ? 'bg-gray-700/20 border-gray-600/30 text-gray-200' 
                          : 'bg-white/20 border-white/30 text-gray-700'
                      }`,
                      formFieldLabel: `font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-[#34495e]'}`,
                      footerActionLink: 'text-blue-600 hover:text-purple-600 font-semibold transition-all duration-300 hover:scale-105',
                      dividerLine: `${isDarkMode ? 'bg-gray-600/30' : 'bg-white/30'}`,
                      dividerText: `font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkSignIn; 