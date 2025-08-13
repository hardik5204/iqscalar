import React, { useState, useEffect, useCallback } from 'react';
import testService from '../services/testService';
import { useTheme } from '../contexts/ThemeContext';

const TestPage = ({ onComplete, questions: providedQuestions, category, isPractice = false }) => {
  const { isDarkMode } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [practiceStats, setPracticeStats] = useState({
    answered: 0,
    correct: 0,
    incorrect: 0,
    skipped: 0
  });
  const [userId] = useState(() => {
    // Generate or retrieve user ID from localStorage
    let id = localStorage.getItem('IQSCALAR_user_id');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('IQScalar_user_id', id);
    }
    return id;
  });

  const initializeTest = useCallback(async () => {
    setIsLoading(true);
    
    if (isPractice && providedQuestions) {
      // Use provided practice questions
      setQuestions(providedQuestions);
      setIsLoading(false);
    } else {
      // Wait for questions to load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const testQuestions = testService.generateTest(userId, 15);
      setQuestions(testQuestions);
      setIsLoading(false);
    }
  }, [userId, isPractice, providedQuestions]);

  const handleFinishTest = useCallback(() => {
    // Convert answers object to array
    const answersArray = questions.map((_, index) => answers[index] || null);
    
    if (isPractice) {
      // Calculate practice results using practice service
      const practiceService = require('../services/practiceService').default;
      const results = practiceService.calculatePracticeResults(questions, answersArray);
      onComplete(results);
    } else {
      // Calculate results using test service
      const results = testService.calculateResults(questions, answersArray);
      onComplete(results);
    }
  }, [questions, answers, onComplete, isPractice]);

  const handleTimeUp = useCallback(() => {
    // Auto-submit when time runs out
    handleFinishTest();
  }, [handleFinishTest]);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !isPractice) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [testStarted, timeLeft, handleTimeUp, isPractice]);

  const handleStartTest = () => {
    setTestStarted(true);
  };

  const handleAnswer = (answerIndex) => {
    const previousAnswer = answers[currentQuestion];
    const isCorrect = answerIndex === questions[currentQuestion]?.correctIndex;
    
    setAnswers(prev => ({ ...prev, [currentQuestion]: answerIndex }));
    
    // Update practice stats
    if (isPractice) {
      setPracticeStats(prev => {
        let newStats = { ...prev };
        
        // Remove previous answer from stats if it existed
        if (previousAnswer !== undefined) {
          if (previousAnswer === questions[currentQuestion]?.correctIndex) {
            newStats.correct--;
            newStats.answered--;
          } else if (previousAnswer === null) {
            newStats.skipped--;
            // Don't decrement answered for previously skipped questions
          } else {
            newStats.incorrect--;
            newStats.answered--;
          }
        }
        
        // Add new answer to stats
        if (answerIndex === null) {
          newStats.skipped++;
          // Don't increment answered for skipped questions
        } else if (isCorrect) {
          newStats.correct++;
          newStats.answered++;
        } else {
          newStats.incorrect++;
          newStats.answered++;
        }
        
        console.log('Updated practice stats:', newStats);
        return newStats;
      });
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'numerical_reasoning':
      case 'Quantitative Aptitude':
        return '🔢';
      case 'logical_reasoning':
      case 'Logical Reasoning':
      case 'Verbal-Logical Reasoning':
        return '🧠';
      case 'spatial_reasoning':
      case 'Series':
        return '🔷';
      default:
        return '❓';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'numerical_reasoning':
      case 'Quantitative Aptitude':
        return 'from-blue-500 to-cyan-500';
      case 'logical_reasoning':
      case 'Logical Reasoning':
      case 'Verbal-Logical Reasoning':
        return 'from-purple-500 to-pink-500';
      case 'spatial_reasoning':
      case 'Series':
        return 'from-green-500 to-emerald-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-premium-loading w-16 h-16 border-4 border-[#3498db] border-t-transparent rounded-full mx-auto mb-4"></div>
          <h2 className={`font-premium text-2xl font-bold mb-2 ${isDarkMode ? 'text-gray-100' : 'text-[#34495e]'}`}>Preparing Your Test</h2>
                      <p className="font-premium text-gray-600 dark:text-gray-300 transition-colors duration-300">Loading questions and generating your personalized test...</p>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    const userProgress = testService.getUserProgress(userId);
    const testStats = testService.getTestStatistics();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Test Introduction */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 transition-colors duration-300">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-[#3498db] to-[#8e44ad] rounded-full flex items-center justify-center text-4xl mx-auto mb-6 animate-premium-glow">
                🧠
              </div>
              <h1 className={`font-display text-4xl font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-[#34495e]'}`}>
                {isPractice ? 'Practice Session' : 'IQScalar IQ Test'}
              </h1>
                              <p className="font-premium text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
                {isPractice 
                  ? `Practice ${category ? category.toLowerCase() : 'mixed'} questions to improve your skills`
                  : 'Challenge your cognitive abilities with our scientifically-designed assessment'
                }
              </p>
            </div>

            {/* Test Statistics */}
            {!isPractice && (
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                    : 'bg-gradient-to-br from-blue-50 to-blue-100'
                }`}>
                  <div className="text-3xl font-bold text-blue-600 mb-2">{testStats.totalQuestions}</div>
                  <div className={`font-premium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Total Questions</div>
                </div>
                <div className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                    : 'bg-gradient-to-br from-purple-50 to-purple-100'
                }`}>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{testStats.categories}</div>
                  <div className={`font-premium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Categories</div>
                </div>
                <div className={`text-center p-6 rounded-2xl transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-gray-800 to-gray-700' 
                    : 'bg-gradient-to-br from-green-50 to-green-100'
                }`}>
                  <div className="text-3xl font-bold text-green-600 mb-2">{testStats.totalPossibleTests}</div>
                  <div className={`font-premium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Possible Tests</div>
                </div>
              </div>
            )}

            {/* User Progress */}
            {!isPractice && (
              <div className={`rounded-2xl p-6 mb-8 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-gray-800 to-gray-700' 
                  : 'bg-gradient-to-r from-gray-50 to-blue-50'
              }`}>
                <h3 className={`font-premium text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>Your Progress</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className={`font-premium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Tests Completed</span>
                      <span className="font-bold text-[#3498db]">{userProgress.testCount}</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${
                      isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      <div 
                        className="bg-gradient-to-r from-[#3498db] to-[#8e44ad] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${userProgress.progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-premium mb-1 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Remaining Tests</div>
                    <div className="font-bold text-2xl text-[#8e44ad]">{userProgress.remainingTests}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Test Instructions */}
            <div className={`rounded-2xl p-6 mb-8 border transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-blue-900/20 border-blue-700/50' 
                : 'bg-blue-50 border-blue-200'
            }`}>
              <h3 className={`font-premium font-bold mb-4 ${
                isDarkMode ? 'text-blue-200' : 'text-[#34495e]'
              }`}>
                {isPractice ? 'Practice Instructions:' : 'Test Instructions:'}
              </h3>
              <ul className={`font-premium space-y-2 ${
                isDarkMode ? 'text-blue-100' : 'text-gray-700'
              }`}>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>•</span>
                  {isPractice 
                    ? `This practice contains ${questions.length} questions ${category ? `from ${category}` : 'from various categories'}`
                    : 'This test contains 10 questions from different cognitive categories'
                  }
                </li>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>•</span>
                  {isPractice ? 'No time limit for practice sessions' : 'You have 30 minutes to complete the test'}
                </li>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>•</span>
                  You can navigate between questions using Previous/Next buttons
                </li>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>•</span>
                  Each question has only one correct answer
                </li>
                <li className="flex items-start">
                  <span className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>•</span>
                  Your answers are automatically saved as you progress
                </li>
                {isPractice && (
                  <li className="flex items-start">
                    <span className={`mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`}>•</span>
                    Practice sessions can be repeated unlimited times
                  </li>
                )}
              </ul>
            </div>

            {/* Start Button */}
            <div className="text-center">
              <button
                onClick={handleStartTest}
                className="btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-premium font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {isPractice ? 'Start Practice Session' : 'Start Your IQ Test'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 mb-8 transition-colors duration-300">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className={`font-display text-2xl font-bold ${isDarkMode ? 'text-gray-100' : 'text-[#34495e]'}`}>
                {isPractice ? 'Practice Session' : 'IQScalar IQ Test'}
              </h1>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-premium font-medium bg-gradient-to-r ${getCategoryColor(questions[currentQuestion]?.category)} text-white`}>
                  {getCategoryIcon(questions[currentQuestion]?.category)} {questions[currentQuestion]?.category?.replace('_', ' ')}
                </span>
                {isPractice && category && (
                  <span className="ml-2 px-3 py-1 rounded-full text-sm font-premium font-medium bg-blue-100 text-blue-600">
                    {category}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              {!isPractice ? (
                <>
                  <div className="font-premium text-sm text-gray-600">Time Remaining</div>
                  <div className={`font-display text-2xl font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-[#3498db]'}`}>
                    {formatTime(timeLeft)}
                  </div>
                </>
              ) : (
                <>
                  <div className="font-premium text-sm text-gray-600">Practice Mode</div>
                  <div className="font-display text-lg font-bold text-green-600">
                    No Time Limit
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-[#3498db] to-[#8e44ad] h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="font-premium text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            {isPractice && (
              <div className="flex space-x-4 text-sm">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-green-600 font-medium">{practiceStats.correct} Correct</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-red-600 font-medium">{practiceStats.incorrect} Incorrect</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                  <span className={`font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{practiceStats.skipped} Skipped</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Question Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 mb-8 transition-colors duration-300">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-premium font-medium bg-gradient-to-r ${getCategoryColor(questions[currentQuestion]?.category)} text-white mr-4`}>
                  {getCategoryIcon(questions[currentQuestion]?.category)} {questions[currentQuestion]?.category?.replace('_', ' ')}
                </span>
                <span className="font-premium text-sm text-gray-500">
                  {isPractice ? `Practice Question ${currentQuestion + 1}` : `Question ${questions[currentQuestion]?.testQuestionId}`}
                </span>
              </div>
              {isPractice && (
                <div className="text-right">
                  <div className="font-premium text-sm text-gray-600">Current Score</div>
                  <div className="font-display text-lg font-bold text-[#3498db]">
                    {practiceStats.answered > 0 ? Math.round((practiceStats.correct / practiceStats.answered) * 100) : 0}%
                  </div>
                </div>
              )}
            </div>
            <h2 className={`font-premium text-xl font-semibold leading-relaxed ${isDarkMode ? 'text-gray-100' : 'text-[#34495e]'}`}>
              {questions[currentQuestion]?.question}
            </h2>
            {isPractice && (
              <div className={`mt-4 p-4 border rounded-lg ${
                isDarkMode 
                  ? 'bg-blue-900/20 border-blue-700/50 text-blue-200' 
                  : 'bg-blue-50 border-blue-200 text-blue-800'
              }`}>
                <div className="flex items-center">
                  <span className="text-lg mr-2">💡</span>
                  <span className="font-premium text-sm">
                    Take your time to think through this question. You can change your answer anytime before finishing the practice.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            {questions[currentQuestion]?.options.map((option, index) => {
              const isSelected = answers[currentQuestion] === index;
              const isCorrect = index === questions[currentQuestion]?.correctIndex;
              const showFeedback = isPractice && isSelected;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 hover:shadow-lg ${
                    isSelected
                      ? isPractice
                        ? isCorrect 
                          ? isDarkMode
                            ? 'border-green-500 bg-gradient-to-r from-green-900/50 to-emerald-900/50 shadow-lg'
                            : 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg'
                          : isDarkMode
                            ? 'border-red-500 bg-gradient-to-r from-red-900/50 to-pink-900/50 shadow-lg'
                            : 'border-red-500 bg-gradient-to-r from-red-50 to-pink-50 shadow-lg'
                        : isDarkMode
                          ? 'border-blue-500 bg-gradient-to-r from-blue-900/50 to-indigo-900/50 shadow-lg'
                          : 'border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-lg'
                      : isDarkMode
                        ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full border-2 mr-4 flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? isPractice
                            ? isCorrect
                              ? 'border-green-500 bg-green-500 scale-110'
                              : 'border-red-500 bg-red-500 scale-110'
                            : 'border-blue-500 bg-blue-500 scale-110'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <div className="w-4 h-4 bg-white rounded-full animate-scale-in"></div>
                        )}
                      </div>
                      <span className={`font-premium text-lg ${
                        isSelected
                          ? isPractice
                            ? isCorrect 
                              ? isDarkMode ? 'text-green-200' : 'text-green-800'
                              : isDarkMode ? 'text-red-200' : 'text-red-800'
                            : isDarkMode ? 'text-blue-200' : 'text-blue-800'
                          : isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {option}
                      </span>
                    </div>
                    {showFeedback && (
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isCorrect 
                          ? isDarkMode 
                            ? 'bg-green-900/50 text-green-200'
                            : 'bg-green-100 text-green-700'
                          : isDarkMode
                            ? 'bg-red-900/50 text-red-200'
                            : 'bg-red-100 text-red-700'
                      }`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <div className="flex space-x-3">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className={`px-8 py-4 rounded-2xl font-premium font-semibold transition-all duration-300 ${
                  currentQuestion === 0
                    ? isDarkMode
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                }`}
              >
                ← Previous
              </button>
              
              {isPractice && (
                <button
                  onClick={() => {
                    console.log('Skip button clicked, current answer:', answers[currentQuestion]);
                    handleAnswer(null);
                    console.log('After skip, answer set to null');
                    // Auto-advance to next question after skipping
                    setTimeout(() => {
                      if (currentQuestion < questions.length - 1) {
                        setCurrentQuestion(currentQuestion + 1);
                      }
                    }, 100);
                  }}
                  className={`px-6 py-4 rounded-2xl font-premium font-semibold transition-all duration-300 ${
                    answers[currentQuestion] === null
                      ? isDarkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-400 text-white'
                      : isDarkMode
                        ? 'bg-gray-700 text-gray-200 hover:bg-gray-600 hover:scale-105'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 hover:scale-105'
                  }`}
                >
                  Skip Question
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {isPractice && (
                <div className="text-center">
                  <div className={`font-premium text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Answered</div>
                  <div className="font-display text-lg font-bold text-[#3498db]">
                    {practiceStats.answered}/{questions.length}
                  </div>
                </div>
              )}
              
              {isPractice && practiceStats.answered === questions.length && (
                <div className="text-center">
                  <div className={`font-premium text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>All Questions Answered!</div>
                  <div className={`font-display text-sm font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                    Ready to finish
                  </div>
                </div>
              )}
              
              <button
                onClick={handleNext}
                className="btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white px-8 py-4 rounded-2xl font-premium font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
              >
                {currentQuestion === questions.length - 1 
                  ? (isPractice ? 'Finish Practice' : 'Finish Test') 
                  : 'Next →'
                }
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className={`rounded-2xl p-6 border transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-blue-900/20 border-blue-700/50' 
            : 'bg-blue-50 border-blue-200'
        }`}>
          <h3 className={`font-premium font-bold mb-3 ${
            isDarkMode ? 'text-blue-200' : 'text-[#34495e]'
          }`}>
            {isPractice ? 'Practice Tips:' : 'Quick Tips:'}
          </h3>
          <div className={`grid md:grid-cols-2 gap-4 font-premium text-sm ${
            isDarkMode ? 'text-blue-100' : 'text-gray-700'
          }`}>
            {isPractice ? (
              <>
                <div>• Take your time to think through each question</div>
                <div>• You can change your answers anytime before finishing</div>
                <div>• No time limit - practice at your own pace</div>
                <div>• See immediate feedback on your answers</div>
                <div>• Track your progress with real-time statistics</div>
                <div>• Practice sessions can be repeated unlimited times</div>
              </>
            ) : (
              <>
                <div>• Read each question carefully before answering</div>
                <div>• You can go back to previous questions anytime</div>
                <div>• The test will auto-submit when time runs out</div>
                <div>• Your answers are saved automatically</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 