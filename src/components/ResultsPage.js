import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import CertificateModal from './CertificateModal';
import certificateService from '../services/certificateService';
import userService from '../services/userService';

const ResultsPage = ({ results, onDownloadCertificate, onRetakeTest, isPractice = false, onBackToPractice }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('overview');
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  
  // Save test results to user service
  useEffect(() => {
    if (results && !isPractice) {
      const testEntry = userService.addTestResult({
        ...results,
        type: 'Full IQ Test',
        isPractice: false
      });
      console.log('Test result saved:', testEntry);
    }
  }, [results, isPractice]);
  
  const { 
    // score is available but not directly used in UI
    percentage, 
    totalQuestions, 
    correctAnswers, 
    wrongAnswers,
    results: questionResults,
    categoryPerformance,
    timestamp,
    testId,
    iqScore: iqFromService
  } = results;

  const getIQScore = (pct) => {
    // prefer service-provided, else fallback mapping
    if (typeof iqFromService === 'number') return iqFromService;
    if (pct >= 95) return 140;
    if (pct >= 90) return 130;
    if (pct >= 85) return 125;
    if (pct >= 80) return 120;
    if (pct >= 75) return 115;
    if (pct >= 70) return 110;
    if (pct >= 65) return 105;
    if (pct >= 60) return 100;
    if (pct >= 55) return 95;
    if (pct >= 50) return 90;
    if (pct >= 45) return 85;
    if (pct >= 40) return 80;
    return 75;
  };

  const getPerformanceLevel = (pct) => {
    if (pct >= 90) return { level: "Exceptional", color: "text-green-600", bg: "bg-green-100", icon: "🏆" };
    if (pct >= 80) return { level: "Above Average", color: "text-blue-600", bg: "bg-blue-100", icon: "⭐" };
    if (pct >= 70) return { level: "Good", color: "text-yellow-600", bg: "bg-yellow-100", icon: "👍" };
    if (pct >= 60) return { level: "Average", color: "text-orange-600", bg: "bg-orange-100", icon: "📊" };
    if (pct >= 50) return { level: "Below Average", color: "text-red-600", bg: "bg-red-100", icon: "📉" };
    return { level: "Needs Improvement", color: "text-red-600", bg: "bg-red-100", icon: "💡" };
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

  const performance = getPerformanceLevel(percentage);
  const iqScore = iqFromService || getIQScore(percentage);

  const formatDate = (ts) => {
    return new Date(ts).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDownloadCertificate = () => {
    setIsCertificateModalOpen(true);
  };

  const handleGenerateCertificate = async (userData) => {
    setIsGeneratingCertificate(true);
    try {
      await certificateService.generateCertificate(userData, results);
      setIsCertificateModalOpen(false);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert('There was an error generating your certificate. Please try again.');
    } finally {
      setIsGeneratingCertificate(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8 transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`font-display text-4xl md:text-5xl font-bold mb-4 ${
            isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
          }`}>
            {isPractice ? 'Practice Results' : 'Your Test Results'}
          </h1>
          <p className={`font-premium text-xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {isPractice 
              ? 'Great job completing your practice session!'
              : 'Congratulations on completing your IQScalar IQ assessment!'
            }
          </p>
          <div className={`font-premium text-sm mt-2 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {isPractice 
              ? `Practice completed on ${formatDate(timestamp)} | Practice ID: ${results.practiceId || 'N/A'}`
              : `Test completed on ${formatDate(timestamp)} | Test ID: ${testId}`
            }
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className={`rounded-2xl shadow-lg p-2 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'details', label: 'Question Details', icon: '📝' },
              { id: 'categories', label: 'Category Analysis', icon: '🎯' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-premium font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white shadow-lg'
                    : isDarkMode
                      ? 'text-gray-300 hover:text-[#3498db] hover:bg-gray-700'
                      : 'text-gray-600 hover:text-[#3498db] hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Results Card */}
            <div className="md:col-span-2">
              <div className={`rounded-3xl shadow-xl p-8 mb-8 ${
                isDarkMode ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="text-center mb-8">
                  <div className="text-7xl font-display font-bold text-[#3498db] mb-2">{iqScore}</div>
                  <div className={`text-2xl font-premium font-semibold mb-4 ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>IQ Score</div>
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-premium font-semibold ${performance.bg} ${performance.color}`}>
                    <span className="mr-2">{performance.icon}</span>
                    {performance.level}
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className={`text-center p-6 rounded-2xl ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-blue-900/30 to-cyan-900/30' 
                      : 'bg-gradient-to-br from-blue-50 to-cyan-50'
                  }`}>
                    <div className="text-3xl font-display font-bold text-blue-600 mb-2">{correctAnswers}/{totalQuestions}</div>
                    <div className={`font-premium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Correct Answers</div>
                  </div>
                  <div className={`text-center p-6 rounded-2xl ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-purple-900/30 to-pink-900/30' 
                      : 'bg-gradient-to-br from-purple-50 to-pink-50'
                  }`}>
                    <div className="text-3xl font-display font-bold text-purple-600 mb-2">{percentage.toFixed(1)}%</div>
                    <div className={`font-premium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Accuracy</div>
                  </div>
                  <div className={`text-center p-6 rounded-2xl ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30' 
                      : 'bg-gradient-to-br from-green-50 to-emerald-50'
                  }`}>
                    <div className="text-3xl font-display font-bold text-green-600 mb-2">{wrongAnswers}</div>
                    <div className={`font-premium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Incorrect</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className={`flex justify-between font-premium text-sm mb-2 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <span>Your Performance</span>
                    <span>{percentage.toFixed(1)}%</span>
                  </div>
                  <div className={`w-full rounded-full h-4 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                  }`}>
                    <div 
                      className="bg-gradient-to-r from-[#3498db] to-[#8e44ad] h-4 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Category Performance Summary */}
                <div>
                  <h3 className={`font-premium text-xl font-bold mb-4 ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>Category Performance</h3>
                  <div className="space-y-4">
                    {Object.entries(categoryPerformance).map(([category, stats]) => (
                      <div key={category} className={`flex items-center justify-between p-4 rounded-2xl ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}>
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getCategoryIcon(category)}</span>
                          <div>
                            <div className={`font-premium font-semibold capitalize ${
                              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                            }`}>
                              {category.replace('_', ' ')}
                            </div>
                            <div className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {stats.correct}/{stats.total} correct
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-display font-bold text-[#3498db]">
                            {stats.percentage.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {stats.percentage >= 80 ? 'Excellent' : 
                             stats.percentage >= 60 ? 'Good' : 'Needs Practice'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Certificate Card - Only for actual tests */}
              {!isPractice && (
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="font-premium text-xl font-bold text-[#34495e] mb-4">Get Your Certificate</h3>
                  <p className="font-premium text-gray-600 mb-4">
                    Download your official IQScalar IQ test certificate with authentication number.
                  </p>
                  <button
                    onClick={handleDownloadCertificate}
                    disabled={isGeneratingCertificate}
                    className="w-full btn-premium bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-premium font-semibold py-3 px-6 rounded-2xl hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingCertificate ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-premium-loading w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Generating...
                      </div>
                    ) : (
                      'Download Certificate'
                    )}
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="font-premium text-xl font-bold text-[#34495e] mb-4">
                  {isPractice ? 'Continue Practicing' : 'Improve Your Score'}
                </h3>
                <p className="font-premium text-gray-600 mb-4">
                  {isPractice 
                    ? 'Keep practicing to improve your cognitive abilities and skills.'
                    : 'Practice more to improve your cognitive abilities and achieve a higher score.'
                  }
                </p>
                <div className="space-y-3">
                  {isPractice && onBackToPractice && (
                    <button
                      onClick={onBackToPractice}
                      className="w-full bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-premium font-semibold py-3 px-6 rounded-2xl hover:scale-105 hover:shadow-lg transition-all duration-300"
                    >
                      Back to Practice
                    </button>
                  )}
                  <button
                    onClick={onRetakeTest}
                    className="w-full bg-gray-200 text-[#34495e] font-premium font-semibold py-3 px-6 rounded-2xl hover:bg-gray-300 transition-all duration-300"
                  >
                    {isPractice ? 'Practice Again' : 'Take Another Test'}
                  </button>
                </div>
              </div>

              {/* IQ Scale */}
              <div className="bg-white rounded-3xl shadow-xl p-6">
                <h3 className="font-premium text-xl font-bold text-[#34495e] mb-4">IQ Scale Reference</h3>
                <div className="space-y-3 font-premium text-sm">
                  <div className="flex justify-between">
                    <span>140+</span>
                    <span className="text-green-600 font-semibold">Genius</span>
                  </div>
                  <div className="flex justify-between">
                    <span>130-139</span>
                    <span className="text-green-600 font-semibold">Exceptional</span>
                  </div>
                  <div className="flex justify-between">
                    <span>120-129</span>
                    <span className="text-blue-600 font-semibold">Above Average</span>
                  </div>
                  <div className="flex justify-between">
                    <span>110-119</span>
                    <span className="text-yellow-600 font-semibold">High Average</span>
                  </div>
                  <div className="flex justify-between">
                    <span>90-109</span>
                    <span className="text-gray-600 font-semibold">Average</span>
                  </div>
                  <div className="flex justify-between">
                    <span>80-89</span>
                    <span className="text-orange-600 font-semibold">Below Average</span>
                  </div>
                  <div className="flex justify-between">
                    <span>&lt;80</span>
                    <span className="text-red-600 font-semibold">Needs Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Question Details Tab */}
        {activeTab === 'details' && (
          <div className={`rounded-3xl shadow-xl p-8 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`font-display text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
            }`}>Question-by-Question Analysis</h2>
            <div className="space-y-4">
              {questionResults.map((result, index) => (
                <div key={index} className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  result.isCorrect 
                    ? isDarkMode
                      ? 'border-green-700 bg-green-900/20' 
                      : 'border-green-200 bg-green-50'
                    : isDarkMode
                      ? 'border-red-700 bg-red-900/20'
                      : 'border-red-200 bg-red-50'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-premium font-medium mr-3 ${
                        result.isCorrect 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-premium font-medium bg-gradient-to-r ${getCategoryColor(result.category)} text-white`}>
                        {getCategoryIcon(result.category)} {result.category.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`font-premium text-sm ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Q{result.testQuestionId}</span>
                  </div>
                  
                  <h3 className={`font-premium text-lg font-semibold mb-3 ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>
                    {result.question}
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className={`font-premium text-sm mb-2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>Your Answer:</div>
                      <div className={`p-3 rounded-lg ${
                        result.isCorrect 
                          ? isDarkMode
                            ? 'bg-green-900/30 text-green-300' 
                            : 'bg-green-100 text-green-800'
                          : isDarkMode
                            ? 'bg-red-900/30 text-red-300'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {result.userAnswerText || 'Not answered'}
                      </div>
                    </div>
                    {!result.isCorrect && (
                      <div>
                        <div className={`font-premium text-sm mb-2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Correct Answer:</div>
                        <div className={`p-3 rounded-lg ${
                          isDarkMode 
                            ? 'bg-green-900/30 text-green-300' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {result.correctAnswerText}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {result.explanation && (
                    <div className={`rounded-lg p-4 border ${
                      isDarkMode 
                        ? 'bg-blue-900/20 border-blue-700/50' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className={`font-premium text-sm font-semibold mb-1 ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-800'
                      }`}>Explanation:</div>
                      <div className={`font-premium text-sm ${
                        isDarkMode ? 'text-blue-200' : 'text-blue-700'
                      }`}>{result.explanation}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Analysis Tab */}
        {activeTab === 'categories' && (
          <div className={`rounded-3xl shadow-xl p-8 ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`font-display text-2xl font-bold mb-6 ${
              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
            }`}>Detailed Category Analysis</h2>
            <div className="space-y-8">
              {Object.entries(categoryPerformance).map(([category, stats]) => (
                <div key={category} className={`border rounded-2xl p-6 ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="flex items-center mb-6">
                    <span className="text-4xl mr-4">{getCategoryIcon(category)}</span>
                    <div>
                      <h3 className={`font-premium text-2xl font-bold capitalize ${
                        isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                      }`}>
                        {category.replace('_', ' ')}
                      </h3>
                      <p className={`font-premium ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {stats.correct} out of {stats.total} questions correct
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className={`text-center p-6 rounded-2xl ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-700 to-gray-600' 
                        : 'bg-gradient-to-br from-gray-50 to-gray-100'
                    }`}>
                      <div className="text-3xl font-display font-bold text-[#3498db] mb-2">
                        {stats.percentage.toFixed(1)}%
                      </div>
                      <div className={`font-premium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Performance</div>
                    </div>
                    <div className={`text-center p-6 rounded-2xl ${
                      isDarkMode 
                        ? 'bg-gradient-to-br from-gray-700 to-gray-600' 
                        : 'bg-gradient-to-br from-gray-50 to-gray-100'
                    }`}>
                      <div className="text-3xl font-display font-bold text-[#8e44ad] mb-2">
                        {stats.correct}/{stats.total}
                      </div>
                      <div className={`font-premium ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>Questions</div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className={`flex justify-between font-premium text-sm mb-2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <span>Category Performance</span>
                      <span>{stats.percentage.toFixed(1)}%</span>
                    </div>
                    <div className={`w-full rounded-full h-3 ${
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          stats.percentage >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                          stats.percentage >= 60 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                          'bg-gradient-to-r from-orange-500 to-red-500'
                        }`}
                        style={{ width: `${stats.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className={`rounded-lg p-4 border ${
                    isDarkMode 
                      ? 'bg-blue-900/20 border-blue-700/50' 
                      : 'bg-blue-50 border-blue-200'
                  }`}>
                    <div className={`font-premium text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-blue-300' : 'text-blue-800'
                    }`}>Category Description:</div>
                    <div className={`font-premium text-sm ${
                      isDarkMode ? 'text-blue-200' : 'text-blue-700'
                    }`}>
                      {category === 'numerical_reasoning' || category === 'Quantitative Aptitude' ? 'Tests your ability to work with numbers, patterns, and mathematical concepts.' : null}
                      {category === 'logical_reasoning' || category === 'Logical Reasoning' || category === 'Verbal-Logical Reasoning' ? 'Evaluates your capacity for logical thinking, problem-solving, and analytical reasoning.' : null}
                      {category === 'spatial_reasoning' || category === 'Series' ? 'Measures your ability to visualize and manipulate spatial relationships and patterns.' : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificate Modal */}
        <CertificateModal
          isOpen={isCertificateModalOpen}
          onClose={() => setIsCertificateModalOpen(false)}
          onGenerateCertificate={handleGenerateCertificate}
          testResults={{ ...results, iqScore }}
        />
      </div>
    </div>
  );
};

export default ResultsPage; 