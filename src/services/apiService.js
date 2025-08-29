// API Service for communicating with backend
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://your-backend-domain.com/api' : 'http://localhost:5001/api');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Questions API
  async getQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/questions?${queryString}`);
  }

  async getQuestion(id) {
    return this.request(`/questions/${id}`);
  }

  async getQuestionCategories() {
    return this.request('/questions/categories');
  }

  async getQuestionStats() {
    return this.request('/questions/stats');
  }

  async createQuestion(questionData) {
    return this.request('/questions', {
      method: 'POST',
      body: JSON.stringify(questionData),
    });
  }

  async updateQuestion(id, questionData) {
    return this.request(`/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData),
    });
  }

  async deleteQuestion(id) {
    return this.request(`/questions/${id}`, {
      method: 'DELETE',
    });
  }

  // Test Sessions API
  async createTestSession(sessionData) {
    return this.request('/test-sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getTestSessions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/test-sessions?${queryString}`);
  }

  async getTestSession(id) {
    return this.request(`/test-sessions/${id}`);
  }

  async getUserTestSessions(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/test-sessions/user/${userId}?${queryString}`);
  }

  async getUserAnalytics(userId, period = 'all') {
    return this.request(`/test-sessions/analytics/${userId}?period=${period}`);
  }

  async deleteTestSession(id) {
    return this.request(`/test-sessions/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/users?${queryString}`);
  }

  async getUser(id) {
    return this.request(`/users/${id}`);
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id, userData) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserProfile(id) {
    return this.request(`/users/${id}/profile`);
  }

  async getUserLeaderboard(id, period = 'all') {
    return this.request(`/users/${id}/leaderboard?period=${period}`);
  }

  // Practice API
  async getPracticeQuestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/practice/questions?${queryString}`);
  }

  async createPracticeSession(sessionData) {
    return this.request('/practice/session', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async getPracticeCategories() {
    return this.request('/practice/categories');
  }

  async getUserPracticeHistory(userId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/practice/user/${userId}?${queryString}`);
  }

  async getUserPracticeAnalytics(userId, period = 'all') {
    return this.request(`/practice/analytics/${userId}?period=${period}`);
  }

  async getPracticeRecommendations(userId) {
    return this.request(`/practice/recommendations/${userId}`);
  }

  // Analytics API
  async getAnalyticsOverview(period = 'all') {
    return this.request(`/analytics/overview?period=${period}`);
  }

  async getLeaderboard(period = 'all', limit = 50) {
    return this.request(`/analytics/leaderboard?period=${period}&limit=${limit}`);
  }

  async getTrends(days = 30) {
    return this.request(`/analytics/trends?days=${days}`);
  }

  async getQuestionStats(limit = 20) {
    return this.request(`/analytics/question-stats?limit=${limit}`);
  }

  async getUserGrowth(days = 30) {
    return this.request(`/analytics/user-growth?days=${days}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
