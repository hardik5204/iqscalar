import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import userService from '../services/userService';

const AccountPage = () => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');

  const [testHistory, setTestHistory] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [userStats, setUserStats] = useState(null);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = userService.getUserData();
        const userSettings = userService.getSettings();
        const history = userService.getTestHistory();
        const userAchievements = userService.getAchievements();
        const stats = userService.getUserStats();

        setUserData(user);
        setSettings(userSettings);
        setTestHistory(history);
        setAchievements(userAchievements);
        setUserStats(stats);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    try {
      setSaveStatus('saving');
      const updatedUser = userService.updateProfile(userData);
      setUserData(updatedUser);
      setSaveStatus('saved');
      
      // Clear save status after 3 seconds
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleSettingChange = (category, key, value) => {
    try {
      const updatedSettings = userService.updateSetting(category, key, value);
      setSettings(updatedSettings);
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      userService.clearAllData();
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen py-8 transition-colors duration-300 flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-4 border-[#3498db] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your account...
          </p>
        </div>
      </div>
    );
  }

  if (!userData || !settings) {
    return (
      <div className={`min-h-screen py-8 transition-colors duration-300 flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
          : 'bg-gradient-to-br from-blue-50 to-purple-50'
      }`}>
        <div className="text-center">
          <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Error loading account data. Please refresh the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
          }`}>
            My Account
          </h1>
          <p className={`text-xl ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Manage your profile, view your progress, and customize your experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className={`rounded-2xl shadow-xl p-6 sticky top-8 ${
              isDarkMode 
                ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                : 'bg-white'
            }`}>
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-[#3498db] to-[#8e44ad] rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className={`text-xl font-semibold ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>{userData.name}</h3>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>{userData.email}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'profile', label: 'Profile', icon: '👤' },
                  { id: 'history', label: 'Test History', icon: '📋' },
                  { id: 'achievements', label: 'Achievements', icon: '🏆' },
                  { id: 'settings', label: 'Settings', icon: '⚙️' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white'
                        : isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700/50' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${
                    isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                  }`}>Profile Information</h2>
                  {saveStatus && (
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      saveStatus === 'saved' 
                        ? 'bg-green-100 text-green-700' 
                        : saveStatus === 'saving'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {saveStatus === 'saved' && '✓ Saved'}
                      {saveStatus === 'saving' && '⏳ Saving...'}
                      {saveStatus === 'error' && '✗ Error'}
                    </div>
                  )}
                </div>

                {/* User Stats Summary */}
                {userStats && (
                  <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-blue-50'
                    }`}>
                      <div className="text-2xl font-bold text-blue-600">{userStats.totalTests}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Tests Completed
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-green-50'
                    }`}>
                      <div className="text-2xl font-bold text-green-600">{userStats.averageScore}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Average IQ Score
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-purple-50'
                    }`}>
                      <div className="text-2xl font-bold text-purple-600">{userStats.averageAccuracy}%</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Average Accuracy
                      </div>
                    </div>
                    <div className={`p-4 rounded-lg ${
                      isDarkMode ? 'bg-gray-700/50' : 'bg-orange-50'
                    }`}>
                      <div className="text-2xl font-bold text-orange-600">{userStats.earnedAchievements}</div>
                      <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        Achievements
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Full Name</label>
                    <input
                      type="text"
                      value={userData.name || ''}
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Email</label>
                    <input
                      type="email"
                      value={userData.email || ''}
                      onChange={(e) => setUserData({...userData, email: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Phone</label>
                    <input
                      type="tel"
                      value={userData.phone || ''}
                      onChange={(e) => setUserData({...userData, phone: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Country</label>
                    <input
                      type="text"
                      value={userData.country || ''}
                      onChange={(e) => setUserData({...userData, country: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Member Since</label>
                    <input
                      type="text"
                      value={formatDate(userData.joinDate)}
                      readOnly
                      className={`w-full px-4 py-3 border rounded-lg cursor-not-allowed transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-800 border-gray-600 text-gray-400' 
                          : 'bg-gray-100 border-gray-300 text-gray-500'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Timezone</label>
                    <input
                      type="text"
                      value={userData.timezone || ''}
                      onChange={(e) => setUserData({...userData, timezone: e.target.value})}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#3498db] focus:border-transparent transition-colors duration-300 ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900'
                      }`}
                    />
                  </div>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saveStatus === 'saving'}
                  className="mt-6 bg-gradient-to-r from-[#3498db] to-[#8e44ad] text-white font-bold py-3 px-8 rounded-lg hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {activeTab === 'history' && (
              <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>Test History</h2>
                
                {testHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>No Tests Completed Yet</h3>
                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Take your first IQ test to see your results here.
                    </p>
                  </div>
                ) : (
                <div className="space-y-4">
                    {testHistory.map((test, index) => (
                      <div key={test.id || index} className={`flex items-center justify-between p-4 rounded-lg transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                      }`}>
                      <div className="flex items-center space-x-4">
                          <div className="text-2xl">
                            {test.isPractice ? '🎯' : '📋'}
                          </div>
                        <div>
                            <div className={`font-semibold ${
                              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                            }`}>
                              {test.type}
                              {test.isPractice && (
                                <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                                  Practice
                                </span>
                              )}
                            </div>
                            <div className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                              {formatDate(test.date)}
                            </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-[#3498db]">{test.score}</div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {test.accuracy} • {test.time}
                          </div>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>Achievements</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={achievement.id || index} className={`p-6 rounded-lg transition-all duration-300 ${
                      achievement.status === 'earned' 
                        ? isDarkMode 
                          ? 'bg-green-900/30 border border-green-500/30' 
                          : 'bg-green-50 border border-green-200'
                        : isDarkMode 
                          ? 'bg-gray-700/50 border border-gray-600/30' 
                          : 'bg-gray-50'
                    }`}>
                      <div className="flex items-start space-x-4">
                        <div className={`text-3xl ${
                          achievement.status === 'earned' ? 'animate-pulse' : ''
                        }`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-2 ${
                            isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                          }`}>
                            {achievement.name}
                          </h3>
                          <p className={`text-sm mb-3 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {achievement.description}
                          </p>
                          {achievement.status === 'earned' ? (
                            <div className="flex items-center space-x-2">
                              <span className="text-green-600 text-sm font-semibold">✓ Earned</span>
                              <span className={`text-xs ${
                                isDarkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {formatDate(achievement.earned)}
                              </span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                                  Progress
                                </span>
                                <span className="font-semibold text-[#3498db]">
                                  {achievement.progress}/{achievement.total}
                                </span>
                              </div>
                              <div className={`w-full rounded-full h-2 ${
                                isDarkMode ? 'bg-gray-600' : 'bg-gray-200'
                              }`}>
                                <div 
                                  className="bg-gradient-to-r from-[#3498db] to-[#8e44ad] h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className={`rounded-2xl shadow-xl p-8 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800/50 border border-gray-700/50 backdrop-blur-xl' 
                  : 'bg-white'
              }`}>
                <h2 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                }`}>Account Settings</h2>
                
                <div className="space-y-6">
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Notification Preferences</h3>
                    <div className="space-y-4">
                      {settings?.notifications && Object.entries(settings.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <div className={`font-semibold capitalize ${
                              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                            }`}>
                              {key} Notifications
                            </div>
                            <div className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              Receive {key} notifications about your progress and achievements
                            </div>
                          </div>
                          <button
                            onClick={() => handleSettingChange('notifications', key, !value)}
                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                              value ? 'bg-[#3498db]' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              value ? 'transform translate-x-6' : 'transform translate-x-1'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Privacy Settings</h3>
                    <div className="space-y-4">
                      {settings?.privacy && Object.entries(settings.privacy).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                        <div>
                            <div className={`font-semibold ${
                              isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                            }`}>
                              {key === 'publicProfile' ? 'Public Profile' : 'Data Sharing'}
                            </div>
                            <div className={`text-sm ${
                              isDarkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                              {key === 'publicProfile' 
                                ? 'Allow others to see your achievements' 
                                : 'Share anonymous data for research'
                              }
                            </div>
                          </div>
                          <button
                            onClick={() => handleSettingChange('privacy', key, !value)}
                            className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                              value ? 'bg-[#3498db]' : isDarkMode ? 'bg-gray-600' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                              value ? 'transform translate-x-6' : 'transform translate-x-1'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                      </div>

                  {/* Data Export */}
                  <div>
                    <h3 className={`text-lg font-semibold mb-4 ${
                      isDarkMode ? 'text-gray-200' : 'text-[#34495e]'
                    }`}>Data Management</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className={`font-semibold ${
                            isDarkMode ? 'text-gray-100' : 'text-[#34495e]'
                          }`}>Export Your Data</div>
                          <div className={`text-sm ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Download all your test data and achievements
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            const data = userService.exportUserData();
                            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `IQScalar-data-${new Date().toISOString().split('T')[0]}.json`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                          Export Data
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={`pt-6 border-t ${
                    isDarkMode ? 'border-gray-600' : 'border-gray-200'
                  }`}>
                    <button
                      onClick={handleDeleteAccount}
                      className="text-red-600 hover:text-red-700 font-semibold transition-colors duration-200"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage; 