const User = require('../models/User');
const UserAuthHistory = require('../models/UserAuthHistory');
const UserSession = require('../models/UserSession');
const { v4: uuidv4 } = require('uuid');

// Utility function to extract device info from user agent
const parseUserAgent = (userAgent) => {
  if (!userAgent) return {};

  const isMobile = /Mobile|Android|iPhone|iPad/.test(userAgent);
  let browser = 'Unknown';
  let os = 'Unknown';

  // Browser detection
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  // OS detection
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac OS')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  return {
    browser,
    os,
    device: isMobile ? 'Mobile' : 'Desktop',
    isMobile
  };
};

// Utility function to get IP address from request
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.headers['x-real-ip'] ||
         req.connection?.remoteAddress ||
         req.socket?.remoteAddress ||
         req.ip ||
         'Unknown';
};

class AuthService {
  /**
   * Log user signup event
   */
  static async logSignup(clerkUserId, userData, req) {
    try {
      const ipAddress = getClientIP(req);
      const userAgent = req.headers['user-agent'];
      const deviceInfo = parseUserAgent(userAgent);

      // Create user in our database
      const user = await User.create({
        clerkUserId,
        email: userData.email,
        fullName: userData.fullName,
        profileImage: userData.profileImage
      });

      // Log signup event
      await UserAuthHistory.logEvent({
        userId: user._id,
        clerkUserId,
        eventType: 'signup',
        ipAddress,
        userAgent,
        deviceInfo,
        metadata: {
          signupMethod: userData.signupMethod || 'email',
          emailVerified: userData.emailVerified || false
        }
      });

      return user;
    } catch (error) {
      console.error('Error logging signup:', error);
      throw error;
    }
  }

  /**
   * Log user login event and create session
   */
  static async logLogin(clerkUserId, userData, req) {
    try {
      const ipAddress = getClientIP(req);
      const userAgent = req.headers['user-agent'];
      const deviceInfo = parseUserAgent(userAgent);

      // Find or create user
      let user = await User.findOne({ clerkUserId });
      if (!user) {
        user = await User.create({
          clerkUserId,
          email: userData.email,
          fullName: userData.fullName,
          profileImage: userData.profileImage
        });
      } else {
        // Update last login
        user.lastLogin = new Date();
        await user.save();
      }

      // Create session
      const sessionId = uuidv4();
      const session = await UserSession.createSession({
        userId: user._id,
        clerkUserId,
        sessionId,
        clerkSessionId: userData.sessionId || sessionId,
        ipAddress,
        userAgent,
        deviceInfo,
        metadata: {
          loginMethod: userData.loginMethod || 'email'
        }
      });

      // Log login event
      await UserAuthHistory.logEvent({
        userId: user._id,
        clerkUserId,
        eventType: 'login',
        ipAddress,
        userAgent,
        deviceInfo,
        metadata: {
          loginMethod: userData.loginMethod || 'email',
          sessionId: session.sessionId
        }
      });

      return { user, session };
    } catch (error) {
      console.error('Error logging login:', error);
      throw error;
    }
  }

  /**
   * Log user logout event and end session
   */
  static async logLogout(clerkUserId, sessionId, req) {
    try {
      const user = await User.findOne({ clerkUserId });
      if (!user) return null;

      // End session
      const session = await UserSession.findOne({ sessionId });
      if (session) {
        await session.endSession();
      }

      // Log logout event
      const ipAddress = getClientIP(req);
      const userAgent = req.headers['user-agent'];
      const deviceInfo = parseUserAgent(userAgent);

      await UserAuthHistory.logEvent({
        userId: user._id,
        clerkUserId,
        eventType: 'logout',
        ipAddress,
        userAgent,
        deviceInfo,
        metadata: {
          sessionId,
          sessionDuration: session ? session.sessionDuration : null
        }
      });

      return { user, session };
    } catch (error) {
      console.error('Error logging logout:', error);
      throw error;
    }
  }

  /**
   * Log failed login attempt
   */
  static async logFailedLogin(clerkUserId, error, req) {
    try {
      const ipAddress = getClientIP(req);
      const userAgent = req.headers['user-agent'];
      const deviceInfo = parseUserAgent(userAgent);

      // Find user if exists
      const user = await User.findOne({ clerkUserId });
      if (!user) return null;

      // Log failed login event
      await UserAuthHistory.logEvent({
        userId: user._id,
        clerkUserId,
        eventType: 'login',
        ipAddress,
        userAgent,
        deviceInfo,
        success: false,
        errorMessage: error.message || 'Authentication failed'
      });

      return user;
    } catch (error) {
      console.error('Error logging failed login:', error);
      throw error;
    }
  }

  /**
   * Update user activity
   */
  static async updateActivity(sessionId) {
    try {
      const session = await UserSession.findOne({ sessionId, isActive: true });
      if (session) {
        await session.updateActivity();
      }
      return session;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  }

  /**
   * Get user authentication history
   */
  static async getAuthHistory(userId, limit = 50) {
    try {
      return await UserAuthHistory.getUserHistory(userId, limit);
    } catch (error) {
      console.error('Error getting auth history:', error);
      throw error;
    }
  }

  /**
   * Get user session statistics
   */
  static async getSessionStats(userId, days = 30) {
    try {
      const stats = await UserSession.getSessionStats(userId, days);
      return stats[0] || {
        totalSessions: 0,
        averageSessionDuration: 0,
        totalSessionTime: 0,
        longestSession: 0
      };
    } catch (error) {
      console.error('Error getting session stats:', error);
      throw error;
    }
  }

  /**
   * Get login statistics
   */
  static async getLoginStats(userId, days = 30) {
    try {
      return await UserAuthHistory.getLoginStats(userId, days);
    } catch (error) {
      console.error('Error getting login stats:', error);
      throw error;
    }
  }

  /**
   * Get active sessions for user
   */
  static async getActiveSessions(userId) {
    try {
      return await UserSession.getActiveSessions(userId);
    } catch (error) {
      console.error('Error getting active sessions:', error);
      throw error;
    }
  }

  /**
   * Cleanup expired sessions
   */
  static async cleanupExpiredSessions() {
    try {
      const result = await UserSession.cleanupExpiredSessions();
      console.log(`Cleaned up ${result.modifiedCount} expired sessions`);
      return result;
    } catch (error) {
      console.error('Error cleaning up expired sessions:', error);
      throw error;
    }
  }
}

module.exports = AuthService;
