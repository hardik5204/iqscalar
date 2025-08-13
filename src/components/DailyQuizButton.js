import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import DailyQuiz from './DailyQuiz';
import dailyQuizService from '../services/dailyQuizService';

const DailyQuizButton = () => {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadQuizStatus = async () => {
      try {
        await dailyQuizService.loadQuestions();
        const answered = dailyQuizService.hasAnsweredToday();
        const stats = dailyQuizService.getStats();
        setHasAnswered(answered);
        setCurrentStreak(stats.currentStreak);
      } catch (error) {
        console.error('Error loading quiz status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizStatus();
  }, []);

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // Refresh status after modal closes
    const answered = dailyQuizService.hasAnsweredToday();
    const stats = dailyQuizService.getStats();
    setHasAnswered(answered);
    setCurrentStreak(stats.currentStreak);
  };

  const getStreakIcon = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 10) return '⚡';
    if (streak >= 5) return '🎯';
    if (streak >= 1) return '✨';
    return '💫';
  };

  const getButtonText = () => {
    if (isLoading) return 'Loading...';
    if (hasAnswered) return 'Completed!';
    return 'Daily Quiz';
  };

  return (
    <>
      {/* Floating Daily Quiz Button */}
      <div className="fixed top-20 right-4 md:right-8 z-40">
        <button
          onClick={handleButtonClick}
          disabled={isLoading}
          className={`group relative overflow-hidden rounded-2xl shadow-2xl transition-all duration-500 hover:scale-110 hover:shadow-3xl ${
            hasAnswered
              ? isDarkMode
                ? 'bg-gradient-to-br from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600'
                : 'bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500'
              : isDarkMode
                ? 'bg-gradient-to-br from-blue-600 to-purple-700 hover:from-blue-500 hover:to-purple-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {/* Animated Background Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
          </div>

          {/* Button Content */}
          <div className="relative flex items-center space-x-3 px-6 py-4">
            {/* Brain Icon with Animation */}
            <div className="relative">
              {/* Glow effect behind brain */}
              <div className="absolute inset-0 bg-white/30 rounded-full blur-md animate-pulse"></div>
              
              {/* Brain SVG Icon */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
                >
                  <path 
                    d="M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7C13 7.55 13.45 8 14 8S15 7.55 15 8V9C15 10.1 15.9 11 17 11C18.1 11 19 10.1 19 9V8C19 6.9 18.1 6 17 6C16.45 6 15.95 6.22 15.59 6.59C15.22 5.64 14.18 5 13 5H12C10.9 5 10 5.9 10 7V8C10 8.55 9.55 9 9 9S8 8.55 8 9V10C8 11.1 7.1 12 6 12C4.9 12 4 11.1 4 10V9C4 7.9 4.9 7 6 7C6.55 7 7.05 7.22 7.41 7.59C7.78 6.64 8.82 6 10 6H11C11.26 6 11.5 6.03 11.73 6.09C11.28 5.47 11 4.76 11 4C11 2.9 11.9 2 12 2ZM6 13C7.1 13 8 13.9 8 15V16C8 17.1 8.9 18 10 18H14C15.1 18 16 17.1 16 16V15C16 13.9 16.9 13 18 13C19.1 13 20 13.9 20 15V16C20 18.21 18.21 20 16 20H8C5.79 20 4 18.21 4 16V15C4 13.9 4.9 13 6 13Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
            </div>

            {/* Text Content */}
            <div className="flex flex-col items-start">
              <div className="flex items-center space-x-2">
                <span className="text-white font-bold text-sm whitespace-nowrap">
                  {getButtonText()}
                </span>
                {hasAnswered && (
                  <span className="text-white/90 text-xs">✓</span>
                )}
              </div>
              
              {/* Streak Display */}
              {currentStreak > 0 && (
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-xs">{getStreakIcon(currentStreak)}</span>
                  <span className="text-white/90 text-xs font-medium">
                    {currentStreak} day{currentStreak !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Notification Dot for New Quiz */}
            {!hasAnswered && !isLoading && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce">
                <div className="absolute inset-0 bg-red-400 rounded-full animate-ping"></div>
              </div>
            )}
          </div>

          {/* Ripple Effect on Click */}
          <div className="absolute inset-0 opacity-0 group-active:opacity-100 bg-white/20 transition-opacity duration-150"></div>
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleModalClose}
          ></div>
          
          {/* Modal Content */}
          <div className={`relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl transition-all duration-300 ${
            isDarkMode 
              ? 'bg-gray-900/95 border border-gray-700/50' 
              : 'bg-white/95'
          }`}>
            {/* Close Button */}
            <button
              onClick={handleModalClose}
              className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors duration-200 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="p-8 pb-0">
              <div className="flex items-center space-x-4 mb-6">
                <div className="text-4xl">🧠</div>
                <div>
                  <h2 className={`text-3xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>
                    Daily Brain Challenge
                  </h2>
                  <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Quiz Component */}
            <div className="p-8">
              <DailyQuiz />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyQuizButton;
