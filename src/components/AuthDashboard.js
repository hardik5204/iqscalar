import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import apiService from '../services/apiService';

const AuthDashboard = () => {
  const { user } = useUser();
  const [authHistory, setAuthHistory] = useState([]);
  const [sessionStats, setSessionStats] = useState({});
  const [loginStats, setLoginStats] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [securityInfo, setSecurityInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState(30);

  useEffect(() => {
    if (user) {
      fetchAuthData();
    }
  }, [user, selectedPeriod]);

  const fetchAuthData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get user from our database
      const userResponse = await apiService.get(`/users/clerk/${user.id}`);
      if (!userResponse.success) {
        console.error('User not found in database');
        return;
      }

      const userId = userResponse.data._id;

      // Fetch all auth data in parallel
      const [historyRes, statsRes, sessionsRes, securityRes] = await Promise.all([
        apiService.get(`/auth/history/${userId}?limit=20`),
        apiService.get(`/auth/stats/${userId}?days=${selectedPeriod}`),
        apiService.get(`/auth/sessions/${userId}?active=true`),
        apiService.get(`/auth/security/${userId}`)
      ]);

      if (historyRes.success) setAuthHistory(historyRes.data);
      if (statsRes.success) {
        setSessionStats(statsRes.data.sessionStats);
        setLoginStats(statsRes.data.loginStats);
      }
      if (sessionsRes.success) setActiveSessions(sessionsRes.data);
      if (securityRes.success) setSecurityInfo(securityRes.data);

    } catch (error) {
      console.error('Error fetching auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0s';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };

  const getEventIcon = (eventType) => {
    switch (eventType) {
      case 'login': return '🔐';
      case 'logout': return '🚪';
      case 'signup': return '📝';
      case 'password_reset': return '🔑';
      case 'email_verification': return '✉️';
      case 'profile_update': return '👤';
      default: return '📋';
    }
  };

  const getSecurityScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-300 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Authentication Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Monitor your login activity, sessions, and security status
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                <span className="text-2xl">🔐</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Logins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loginStats.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatDuration(sessionStats.averageSessionDuration || 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                <span className="text-2xl">🖥️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activeSessions.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                <span className="text-2xl">🛡️</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Score</p>
                <p className={`text-2xl font-bold ${getSecurityScoreColor(securityInfo.securityScore || 100)}`}>
                  {securityInfo.securityScore || 100}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Time Period
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(parseInt(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
          </select>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Authentication History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {authHistory.map((event, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl mr-3">{getEventIcon(event.eventType)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white capitalize">
                      {event.eventType.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {formatDate(event.timestamp)}
                    </p>
                    {event.ipAddress && (
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        IP: {event.ipAddress}
                      </p>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    event.success 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {event.success ? 'Success' : 'Failed'}
                  </div>
                </div>
              ))}
              {authHistory.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No activity recorded yet
                </p>
              )}
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Active Sessions
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activeSessions.map((session, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {session.deviceInfo?.browser || 'Unknown Browser'}
                    </span>
                    <span className="text-xs text-green-600 dark:text-green-400">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    {session.deviceInfo?.os || 'Unknown OS'} • {session.deviceInfo?.device || 'Unknown Device'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    IP: {session.ipAddress} • Last active: {formatDate(session.lastActivity)}
                  </p>
                </div>
              ))}
              {activeSessions.length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                  No active sessions
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Security Information */}
        {securityInfo.failedAttempts && securityInfo.failedAttempts.length > 0 && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Failed Login Attempts
            </h2>
            <div className="space-y-3">
              {securityInfo.failedAttempts.slice(0, 5).map((attempt, index) => (
                <div key={index} className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <span className="text-red-500 mr-3">⚠️</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      Failed login attempt
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {formatDate(attempt.timestamp)} • IP: {attempt.ipAddress}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDashboard;
