// User Service for managing user data, settings, and achievements

class UserService {
  constructor() {
    this.storageKey = 'IQScalar_user_data';
    this.testHistoryKey = 'IQScalar_test_history';
    this.achievementsKey = 'IQScalar_achievements';
    this.settingsKey = 'IQScalar_settings';
    
    this.initializeUser();
  }

  // Initialize user data with defaults if not exists
  initializeUser() {
    if (!this.getUserData()) {
      const defaultUser = {
        id: this.generateUserId(),
        name: 'IQ Test User',
        email: '',
        phone: '',
        country: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        joinDate: new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      this.saveUserData(defaultUser);
    }

    if (!this.getSettings()) {
      const defaultSettings = {
        notifications: {
          email: false,
          push: false,
          sms: false
        },
        privacy: {
          publicProfile: true,
          dataSharing: false
        },
        preferences: {
          theme: 'light',
          language: 'en'
        }
      };
      this.saveSettings(defaultSettings);
    }

    if (!this.getAchievements()) {
      this.initializeAchievements();
    }
  }

  // Generate unique user ID
  generateUserId() {
    let id = localStorage.getItem('IQScalar_user_id');
    if (!id) {
      id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('IQScalar_user_id', id);
    }
    return id;
  }

  // Get user data
  getUserData() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  // Save user data
  saveUserData(userData) {
    userData.lastActive = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
  }

  // Update user profile
  updateProfile(profileData) {
    const currentUser = this.getUserData();
    const updatedUser = { ...currentUser, ...profileData };
    this.saveUserData(updatedUser);
    return updatedUser;
  }

  // Get user settings
  getSettings() {
    const settings = localStorage.getItem(this.settingsKey);
    return settings ? JSON.parse(settings) : null;
  }

  // Save user settings
  saveSettings(settings) {
    localStorage.setItem(this.settingsKey, JSON.stringify(settings));
  }

  // Update specific setting
  updateSetting(category, key, value) {
    const settings = this.getSettings();
    if (!settings[category]) {
      settings[category] = {};
    }
    settings[category][key] = value;
    this.saveSettings(settings);
    return settings;
  }

  // Get test history
  getTestHistory() {
    const history = localStorage.getItem(this.testHistoryKey);
    return history ? JSON.parse(history) : [];
  }

  // Add test result to history
  addTestResult(testResult) {
    const history = this.getTestHistory();
    const testEntry = {
      id: testResult.testId || `test_${Date.now()}`,
      date: new Date().toISOString(),
      type: testResult.type || 'Full IQ Test',
      score: testResult.iqScore || testResult.score,
      accuracy: `${Math.round(testResult.percentage)}%`,
      time: testResult.duration || 'N/A',
      totalQuestions: testResult.totalQuestions,
      correctAnswers: testResult.correctAnswers,
      categoryPerformance: testResult.categoryPerformance,
      isPractice: testResult.isPractice || false
    };
    
    history.unshift(testEntry); // Add to beginning
    
    // Keep only last 50 test results
    if (history.length > 50) {
      history.splice(50);
    }
    
    localStorage.setItem(this.testHistoryKey, JSON.stringify(history));
    
    // Update achievements based on new test
    this.updateAchievements(testEntry);
    
    return testEntry;
  }

  // Get achievements
  getAchievements() {
    const achievements = localStorage.getItem(this.achievementsKey);
    return achievements ? JSON.parse(achievements) : null;
  }

  // Initialize achievements
  initializeAchievements() {
    const achievements = [
      {
        id: 'first_test',
        name: 'First Test',
        description: 'Completed your first IQ test',
        icon: '🎯',
        status: 'locked',
        progress: 0,
        total: 1,
        earned: null
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete 5 tests in under 25 minutes each',
        icon: '⚡',
        status: 'locked',
        progress: 0,
        total: 5,
        earned: null
      },
      {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Achieve 100% accuracy on any test',
        icon: '🏆',
        status: 'locked',
        progress: 0,
        total: 1,
        earned: null
      },
      {
        id: 'consistent_performer',
        name: 'Consistent Performer',
        description: 'Maintain 90%+ accuracy for 3 consecutive tests',
        icon: '📈',
        status: 'locked',
        progress: 0,
        total: 3,
        earned: null
      },
      {
        id: 'test_veteran',
        name: 'Test Veteran',
        description: 'Complete 10 IQ tests',
        icon: '🎖️',
        status: 'locked',
        progress: 0,
        total: 10,
        earned: null
      },
      {
        id: 'category_master',
        name: 'Category Master',
        description: 'Score 95%+ in all question categories',
        icon: '🧠',
        status: 'locked',
        progress: 0,
        total: 1,
        earned: null
      }
    ];
    
    localStorage.setItem(this.achievementsKey, JSON.stringify(achievements));
    return achievements;
  }

  // Update achievements based on test result
  updateAchievements(testResult) {
    const achievements = this.getAchievements();
    const history = this.getTestHistory();
    let updated = false;

    achievements.forEach(achievement => {
      if (achievement.status === 'earned') return;

      switch (achievement.id) {
        case 'first_test':
          if (history.length >= 1 && !testResult.isPractice) {
            achievement.status = 'earned';
            achievement.earned = testResult.date;
            achievement.progress = 1;
            updated = true;
          }
          break;

        case 'speed_demon':
          const fastTests = history.filter(test => 
            !test.isPractice && 
            test.time && 
            this.parseTimeToMinutes(test.time) <= 25
          );
          achievement.progress = Math.min(fastTests.length, achievement.total);
          if (achievement.progress >= achievement.total) {
            achievement.status = 'earned';
            achievement.earned = testResult.date;
            updated = true;
          }
          break;

        case 'perfect_score':
          const perfectScore = parseInt(testResult.accuracy) === 100;
          if (perfectScore && !testResult.isPractice) {
            achievement.status = 'earned';
            achievement.earned = testResult.date;
            achievement.progress = 1;
            updated = true;
          }
          break;

        case 'consistent_performer':
          const recentTests = history
            .filter(test => !test.isPractice)
            .slice(0, 3);
          if (recentTests.length >= 3) {
            const allAbove90 = recentTests.every(test => 
              parseInt(test.accuracy) >= 90
            );
            if (allAbove90) {
              achievement.status = 'earned';
              achievement.earned = testResult.date;
              achievement.progress = 3;
              updated = true;
            } else {
              achievement.progress = recentTests.filter(test => 
                parseInt(test.accuracy) >= 90
              ).length;
            }
          }
          break;

        case 'test_veteran':
          const completedTests = history.filter(test => !test.isPractice).length;
          achievement.progress = Math.min(completedTests, achievement.total);
          if (achievement.progress >= achievement.total) {
            achievement.status = 'earned';
            achievement.earned = testResult.date;
            updated = true;
          }
          break;

        case 'category_master':
          if (testResult.categoryPerformance && !testResult.isPractice) {
            const categories = Object.values(testResult.categoryPerformance);
            const allAbove95 = categories.every(cat => cat.percentage >= 95);
            if (allAbove95 && categories.length > 1) {
              achievement.status = 'earned';
              achievement.earned = testResult.date;
              achievement.progress = 1;
              updated = true;
            }
          }
          break;
        default:
          break;
      }
    });

    if (updated) {
      localStorage.setItem(this.achievementsKey, JSON.stringify(achievements));
    }

    return achievements;
  }

  // Helper function to parse time string to minutes
  parseTimeToMinutes(timeString) {
    if (!timeString || timeString === 'N/A') return 999;
    
    const matches = timeString.match(/(\d+)\s*min/);
    return matches ? parseInt(matches[1]) : 999;
  }

  // Get user statistics
  getUserStats() {
    const history = this.getTestHistory().filter(test => !test.isPractice);
    const achievements = this.getAchievements();
    
    if (history.length === 0) {
      return {
        totalTests: 0,
        averageScore: 0,
        averageAccuracy: 0,
        bestScore: 0,
        totalAchievements: 0,
        earnedAchievements: 0,
        recentImprovement: 0
      };
    }

    const scores = history.map(test => test.score).filter(score => typeof score === 'number');
    const accuracies = history.map(test => parseInt(test.accuracy)).filter(acc => !isNaN(acc));
    
    const averageScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const averageAccuracy = accuracies.length > 0 ? Math.round(accuracies.reduce((a, b) => a + b, 0) / accuracies.length) : 0;
    const bestScore = scores.length > 0 ? Math.max(...scores) : 0;
    
    const earnedAchievements = achievements.filter(a => a.status === 'earned').length;
    
    // Calculate recent improvement (last 3 vs previous 3 tests)
    let recentImprovement = 0;
    if (history.length >= 6) {
      const recent3 = history.slice(0, 3);
      const previous3 = history.slice(3, 6);
      const recentAvg = recent3.reduce((sum, test) => sum + parseInt(test.accuracy), 0) / 3;
      const previousAvg = previous3.reduce((sum, test) => sum + parseInt(test.accuracy), 0) / 3;
      recentImprovement = Math.round(recentAvg - previousAvg);
    }

    return {
      totalTests: history.length,
      averageScore,
      averageAccuracy,
      bestScore,
      totalAchievements: achievements.length,
      earnedAchievements,
      recentImprovement
    };
  }

  // Clear all user data (for account deletion)
  clearAllData() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.testHistoryKey);
    localStorage.removeItem(this.achievementsKey);
    localStorage.removeItem(this.settingsKey);
    localStorage.removeItem('IQScalar_user_id');
  }

  // Export user data
  exportUserData() {
    return {
      userData: this.getUserData(),
      settings: this.getSettings(),
      testHistory: this.getTestHistory(),
      achievements: this.getAchievements(),
      stats: this.getUserStats(),
      exportDate: new Date().toISOString()
    };
  }
}

// Create singleton instance
const userService = new UserService();

export default userService;
