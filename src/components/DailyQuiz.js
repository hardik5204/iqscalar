import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import dailyQuizService from '../services/dailyQuizService';

const DailyQuiz = () => {
  const { isDarkMode } = useTheme();
  const [question, setQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const loadDailyQuiz = async () => {
      try {
        // Load questions first
        await dailyQuizService.loadQuestions();
        
        // Get today's question
        const todaysQuestion = dailyQuizService.getTodaysQuestion();
        setQuestion(todaysQuestion);
        
        // Check if user has already answered
        const answered = dailyQuizService.hasAnsweredToday();
        setHasAnswered(answered);
        
        if (answered) {
          const todaysAnswer = dailyQuizService.getTodaysAnswer();
          setSelectedAnswer(todaysAnswer.answerIndex);
          setResult({
            isCorrect: todaysAnswer.isCorrect,
            correctAnswer: todaysQuestion.options[todaysQuestion.correctIndex],
            explanation: todaysAnswer.explanation,
            userAnswer: todaysQuestion.options[todaysAnswer.answerIndex]
          });
        }
        
        // Load stats
        const userStats = dailyQuizService.getStats();
        setStats(userStats);
      } catch (error) {
        console.error('Error loading daily quiz:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDailyQuiz();
  }, []);

  const handleAnswerSelect = (answerIndex) => {
    if (hasAnswered) return;
    
    setSelectedAnswer(answerIndex);
    const submitResult = dailyQuizService.submitAnswer(answerIndex);
    setResult(submitResult);
    setHasAnswered(true);
    
    // Update stats
    const updatedStats = dailyQuizService.getStats();
    setStats(updatedStats);
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Verbal-Logical Reasoning':
      case 'Logical Reasoning':
        return '🧠';
      case 'Numerical & Abstract Reasoning':
      case 'Quantitative Aptitude':
        return '🔢';
      case 'Spatial Reasoning':
        return '🔷';
      case 'Pattern Recognition':
        return '🧩';
      default:
        return '❓';
    }
  };

  const getStreakIcon = (streak) => {
    if (streak >= 30) return '🔥';
    if (streak >= 10) return '⚡';
    if (streak >= 5) return '🎯';
    if (streak >= 1) return '✨';
    return '💫';
  };

  if (isLoading) {
    return (
      <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
          : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#3498db] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading today's quiz...
          </p>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
          : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Unable to load today's quiz. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl shadow-xl p-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
        : 'bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">📅</div>
          <div>
            <h3 className={`text-2xl font-bold ${
              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
            }`}>
              Daily Quiz
            </h3>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getCategoryIcon(question.category)}</span>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isDarkMode 
              ? 'bg-blue-900/30 text-blue-300' 
              : 'bg-blue-100 text-blue-600'
          }`}>
            {question.category}
          </span>
        </div>
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className={`text-center p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="text-lg font-bold text-blue-600">{stats.totalAnswered}</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Total
            </div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="text-lg font-bold text-green-600">{stats.accuracy}%</div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Accuracy
            </div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="text-lg font-bold text-orange-600 flex items-center justify-center">
              {getStreakIcon(stats.currentStreak)} {stats.currentStreak}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Current
            </div>
          </div>
          <div className={`text-center p-3 rounded-lg ${
            isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
          }`}>
            <div className="text-lg font-bold text-purple-600 flex items-center justify-center">
              🏆 {stats.bestStreak}
            </div>
            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Best
            </div>
          </div>
        </div>
      )}

      {/* Question */}
      <div className="mb-6">
        <h4 className={`text-lg font-semibold leading-relaxed mb-4 ${
          isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
        }`}>
          {question.question}
        </h4>
        
        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctIndex;
            const showResult = hasAnswered;
            
            let buttonStyle = '';
            if (showResult && isSelected) {
              buttonStyle = isCorrect 
                ? isDarkMode
                  ? 'border-green-500 bg-green-900/30 text-green-200'
                  : 'border-green-500 bg-green-50 text-green-800'
                : isDarkMode
                  ? 'border-red-500 bg-red-900/30 text-red-200'
                  : 'border-red-500 bg-red-50 text-red-800';
            } else if (showResult && isCorrect) {
              buttonStyle = isDarkMode
                ? 'border-green-500 bg-green-900/30 text-green-200'
                : 'border-green-500 bg-green-50 text-green-800';
            } else if (isSelected) {
              buttonStyle = isDarkMode
                ? 'border-blue-500 bg-blue-900/30 text-blue-200'
                : 'border-blue-500 bg-blue-50 text-blue-800';
            } else {
              buttonStyle = isDarkMode
                ? 'border-gray-600 text-gray-200 hover:border-gray-500'
                : 'border-gray-300 text-gray-700 hover:border-gray-400';
            }
            
            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={hasAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-300 ${buttonStyle} ${
                  !hasAnswered ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option}</span>
                  {showResult && isSelected && (
                    <span className="text-sm font-bold">
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                  {showResult && !isSelected && isCorrect && (
                    <span className="text-sm font-bold text-green-600">✓</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className={`p-4 rounded-lg border-l-4 ${
          result.isCorrect
            ? isDarkMode
              ? 'bg-green-900/20 border-green-500 text-green-200'
              : 'bg-green-50 border-green-500 text-green-800'
            : isDarkMode
              ? 'bg-red-900/20 border-red-500 text-red-200'
              : 'bg-red-50 border-red-500 text-red-800'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">
              {result.isCorrect ? '🎉' : '💭'}
            </span>
            <span className="font-bold">
              {result.isCorrect ? 'Correct!' : 'Not quite!'}
            </span>
          </div>
          {!result.isCorrect && (
            <p className="text-sm mb-2">
              <strong>Correct answer:</strong> {result.correctAnswer}
            </p>
          )}
          {result.explanation && (
            <p className="text-sm opacity-90">
              <strong>Explanation:</strong> {result.explanation}
            </p>
          )}
        </div>
      )}

      {/* Status */}
      <div className="mt-6 text-center">
        {hasAnswered ? (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            ✅ Come back tomorrow for a new question!
          </p>
        ) : (
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            💡 Take your time and choose the best answer
          </p>
        )}
      </div>
    </div>
  );
};

export default DailyQuiz;
