import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import practiceService from '../services/practiceService';

const PracticePage = ({ onStartPractice }) => {
  const { isDarkMode } = useTheme();
  const [practiceData, setPracticeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [practiceMode, setPracticeMode] = useState('category'); // 'category' or 'mixed'
  const [numQuestions, setNumQuestions] = useState(10);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Load practice data on component mount
  useEffect(() => {
    const loadPracticeData = async () => {
      try {
        await practiceService.loadPracticeQuestions();
        const stats = practiceService.getPracticeStatistics();
        console.log('Practice stats loaded:', stats);
        setPracticeData(stats);
      } catch (error) {
        console.error('Error loading practice data:', error);
        // Set fallback data if loading fails
        setPracticeData({
          totalQuestions: 0,
          categories: ['Verbal-Logical Reasoning', 'Numerical & Abstract Reasoning', 'Spatial Reasoning', 'Pattern Recognition'],
          questionsPerCategory: [
            { category: 'Verbal-Logical Reasoning', count: 25 },
            { category: 'Numerical & Abstract Reasoning', count: 25 },
            { category: 'Spatial Reasoning', count: 25 },
            { category: 'Pattern Recognition', count: 25 }
          ]
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPracticeData();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Verbal-Logical Reasoning':
        return '🧠';
      case 'Numerical & Abstract Reasoning':
        return '⚡';
      case 'Spatial Reasoning':
        return '🔮';
      case 'Pattern Recognition':
        return '💎';
      default:
        return '✨';
    }
  };

  const handleStartPractice = () => {
    const questions = practiceService.generatePracticeQuestions(
      practiceMode === 'mixed' ? null : selectedCategory, 
      numQuestions
    );
    onStartPractice(questions, selectedCategory);
  };

  const tips = [
    {
      title: "Get Enough Sleep",
      description: "A well-rested mind performs better on cognitive tests.",
      icon: "😴"
    },
    {
      title: "Practice Regularly",
      description: "Consistent practice improves cognitive abilities over time.",
      icon: "📅"
    },
    {
      title: "Stay Hydrated",
      description: "Proper hydration helps maintain optimal brain function.",
      icon: "💧"
    },
    {
      title: "Take Breaks",
      description: "Short breaks help maintain focus and prevent mental fatigue.",
      icon: "⏰"
    }
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      {/* Premium Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: -1 }}>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-200/20 to-purple-200/20 rounded-full blur-3xl animate-premium-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-indigo-200/15 to-cyan-200/15 rounded-full blur-3xl animate-premium-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 relative z-10">
        {/* Premium Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-block relative mb-8">
            {/* Premium Floating Accent Elements */}
            <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-r from-blue-200 to-purple-200 rounded-full blur-lg opacity-40 animate-premium-float"></div>
            <div className="absolute -bottom-6 -right-6 w-8 h-8 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-lg opacity-40 animate-premium-float" style={{animationDelay: '1s'}}></div>
            
            <h1 className="font-display text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad] mb-6 animate-gradient tracking-tight">
              Practice & Preparation
            </h1>
            <div className="h-1.5 w-32 bg-gradient-to-r from-[#3498db] via-[#6c63ff] to-[#8e44ad] rounded-full mx-auto mb-8 shadow-lg"></div>
          </div>
          <p className={`font-premium text-xl max-w-4xl mx-auto leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Enhance your cognitive abilities with our comprehensive practice tests and premium preparation materials designed for optimal learning.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-32">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-[#3498db] border-r-[#8e44ad]"></div>
              <div className="absolute inset-0 animate-spin rounded-full h-16 w-16 border-4 border-transparent border-b-[#6c63ff] border-l-[#3498db]" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Practice Categories */}
            <div className="lg:col-span-2 space-y-8">
              <div className="inline-block relative">
                <h2 className="font-display text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#34495e] via-[#3498db] to-[#8e44ad]">
                  Practice Categories
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-[#3498db] to-[#8e44ad] rounded-full mt-2 opacity-60"></div>
              </div>
              
              {/* Premium Practice Mode Selection */}
              <div className={`rounded-3xl shadow-xl p-8 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-300'
              }`}>
                <h3 className={`font-premium text-xl font-bold mb-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>Practice Mode</h3>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={() => setPracticeMode('category')}
                    className={`px-6 py-3 rounded-2xl font-premium font-semibold transition-all duration-300 transform hover:scale-105 ${
                      practiceMode === 'category'
                        ? 'bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white shadow-lg'
                        : isDarkMode 
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' 
                          : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50'
                    }`}
                  >
                    Category Practice
                  </button>
                  <button
                    onClick={() => setPracticeMode('mixed')}
                    className={`px-6 py-3 rounded-2xl font-premium font-semibold transition-all duration-300 transform hover:scale-105 ${
                      practiceMode === 'mixed'
                        ? 'bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white shadow-lg'
                        : isDarkMode 
                          ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50' 
                          : 'bg-gray-100/50 text-gray-600 hover:bg-gray-200/50'
                    }`}
                  >
                    Mixed Practice
                  </button>
                </div>
                
                {practiceMode === 'category' && (
                  <div className="mb-6">
                    <label className={`block text-sm font-premium font-semibold mb-3 ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      Select Category:
                    </label>
                    <select
                      value={selectedCategory || ''}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value || null);
                      }}
                      className={`w-full p-4 rounded-lg border-2 focus:ring-2 transition-colors duration-300 ${
                        isDarkMode 
                          ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-blue-400/20' 
                          : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-200'
                      }`}
                      style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
                    >
                      <option value="">Choose a category...</option>
                      {practiceData?.categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                <div className="mb-6">
                  <label className={`block text-sm font-premium font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Number of Questions:
                  </label>
                  <select
                    value={numQuestions}
                    onChange={(e) => {
                      setNumQuestions(parseInt(e.target.value));
                    }}
                    className={`w-full p-4 rounded-lg border-2 focus:ring-2 transition-colors duration-300 ${
                      isDarkMode 
                        ? 'border-gray-600 bg-gray-700 text-white focus:border-blue-400 focus:ring-blue-400/20' 
                        : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-200'
                    }`}
                    style={{ position: 'relative', zIndex: 10, pointerEvents: 'auto' }}
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                    <option value={25}>25 Questions</option>
                  </select>
                </div>
                


                <button
                  onClick={handleStartPractice}
                  disabled={practiceMode === 'category' && !selectedCategory}
                  className="w-full btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-premium font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  🚀 Start Practice Session
                </button>
              </div>
              
              {/* Premium Available Categories */}
              <div className="grid md:grid-cols-2 gap-6">
                {practiceData?.questionsPerCategory.map((categoryData, index) => (
                  <div
                    key={categoryData.category}
                    className={`card-premium rounded-3xl shadow-xl p-8 transition-all duration-500 hover:-translate-y-2 cursor-pointer border group ${
                      isDarkMode 
                        ? 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 backdrop-blur-xl' 
                        : 'bg-white/70 border-white/50 hover:bg-white/90 backdrop-blur-xl'
                    }`}
                    onClick={() => {
                      setSelectedCategory(categoryData.category);
                      setPracticeMode('category');
                      // Start practice with selected category
                      const questions = practiceService.generatePracticeQuestions(categoryData.category, numQuestions);
                      onStartPractice(questions, categoryData.category);
                    }}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: 'fadeInUp 0.8s ease-out forwards'
                    }}
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{getCategoryIcon(categoryData.category)}</div>
                      <span className="px-4 py-2 rounded-full text-xs font-premium font-bold bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                        {categoryData.count} questions
                      </span>
                    </div>
                    <h3 className={`font-premium text-xl font-bold mb-3 transition-colors duration-300 ${
                      isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                    }`}>{categoryData.category}</h3>
                    <p className={`font-premium mb-6 leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      Practice {categoryData.category.toLowerCase()} questions to enhance your cognitive abilities.
                    </p>
                    <div className="flex justify-between items-center text-sm">
                      <span className={`font-premium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>{categoryData.count} questions available</span>
                      <span className="text-[#3498db] font-premium font-semibold group-hover:text-[#8e44ad] transition-colors duration-300">Click to select →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Sidebar */}
            <div className="space-y-8">
              {/* Quick Start */}
              <div className={`card-premium rounded-3xl shadow-xl p-8 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white/70 border-white/50 backdrop-blur-xl'
              }`}>
                <h3 className={`font-premium text-xl font-bold mb-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>⚡ Quick Start</h3>
                <button
                  onClick={() => {
                    const questions = practiceService.generatePracticeQuestions(null, 10);
                    onStartPractice(questions, 'Mixed Practice');
                  }}
                  className="w-full btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-premium font-bold py-4 px-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Start Random Practice
                </button>
              </div>

              {/* Premium Tips */}
              <div className={`card-premium rounded-3xl shadow-xl p-8 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white/70 border-white/50 backdrop-blur-xl'
              }`}>
                <h3 className={`font-premium text-xl font-bold mb-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>💡 Preparation Tips</h3>
                <div className="space-y-6">
                  {tips.map((tip, index) => (
                    <div key={index} className="flex items-start space-x-4 group">
                      <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{tip.icon}</div>
                      <div>
                        <h4 className={`font-premium font-bold text-sm mb-2 ${
                          isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                        }`}>{tip.title}</h4>
                        <p className={`font-premium text-sm leading-relaxed ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Premium Progress */}
              <div className={`card-premium rounded-3xl shadow-xl p-8 border transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white/70 border-white/50 backdrop-blur-xl'
              }`}>
                <h3 className={`font-premium text-xl font-bold mb-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>📈 Your Progress</h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className={`font-premium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Tests Completed</span>
                      <span className="font-premium font-bold text-[#3498db]">12</span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div className="bg-gradient-to-r from-[#3498db] to-[#6c63ff] h-3 rounded-full shadow-lg transition-all duration-1000" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className={`font-premium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Average Score</span>
                      <span className="font-premium font-bold text-[#8e44ad]">85%</span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div className="bg-gradient-to-r from-[#8e44ad] to-[#6c63ff] h-3 rounded-full shadow-lg transition-all duration-1000" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-3">
                      <span className={`font-premium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>Study Time</span>
                      <span className="font-premium font-bold text-[#3498db]">8.5 hrs</span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div className="bg-gradient-to-r from-[#3498db] to-[#8e44ad] h-3 rounded-full shadow-lg transition-all duration-1000" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PracticePage; 