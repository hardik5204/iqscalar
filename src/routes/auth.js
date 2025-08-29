const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const AuthService = require('../services/authService');
const User = require('../models/User');
const UserAuthHistory = require('../models/UserAuthHistory');
const UserSession = require('../models/UserSession');

// Middleware for error handling
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   POST /api/auth/signup
 * @desc    Log user signup event
 * @access  Public
 */
router.post('/signup', asyncHandler(async (req, res) => {
  const { clerkUserId, email, fullName, profileImage, signupMethod, emailVerified } = req.body;

  if (!clerkUserId || !email || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: clerkUserId, email, fullName'
    });
  }

  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. This is a test environment.',
      readyState: mongoose.connection.readyState
    });
  }

  const userData = {
    email,
    fullName,
    profileImage,
    signupMethod,
    emailVerified
  };

  const user = await AuthService.logSignup(clerkUserId, userData, req);

  res.status(201).json({
    success: true,
    message: 'User signup logged successfully',
    data: {
      userId: user._id,
      email: user.email,
      fullName: user.fullName
    }
  });
}));

/**
 * @route   POST /api/auth/login
 * @desc    Log user login event
 * @access  Public
 */
router.post('/login', asyncHandler(async (req, res) => {
  const { clerkUserId, email, fullName, profileImage, loginMethod, sessionId } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: clerkUserId'
    });
  }

  const userData = {
    email,
    fullName,
    profileImage,
    loginMethod,
    sessionId
  };

  const { user, session } = await AuthService.logLogin(clerkUserId, userData, req);

  res.json({
    success: true,
    message: 'User login logged successfully',
    data: {
      userId: user._id,
      sessionId: session.sessionId,
      email: user.email,
      fullName: user.fullName
    }
  });
}));

/**
 * @route   POST /api/auth/logout
 * @desc    Log user logout event
 * @access  Public
 */
router.post('/logout', asyncHandler(async (req, res) => {
  const { clerkUserId, sessionId } = req.body;

  if (!clerkUserId || !sessionId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields: clerkUserId, sessionId'
    });
  }

  const result = await AuthService.logLogout(clerkUserId, sessionId, req);

  res.json({
    success: true,
    message: 'User logout logged successfully',
    data: {
      sessionId,
      sessionDuration: result?.session?.sessionDuration || 0
    }
  });
}));

/**
 * @route   POST /api/auth/failed-login
 * @desc    Log failed login attempt
 * @access  Public
 */
router.post('/failed-login', asyncHandler(async (req, res) => {
  const { clerkUserId, error } = req.body;

  if (!clerkUserId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: clerkUserId'
    });
  }

  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: 'Database not connected. This is a test environment.',
      readyState: mongoose.connection.readyState
    });
  }

  await AuthService.logFailedLogin(clerkUserId, { message: error }, req);

  res.json({
    success: true,
    message: 'Failed login attempt logged'
  });
}));

/**
 * @route   POST /api/auth/activity
 * @desc    Update user activity
 * @access  Public
 */
router.post('/activity', asyncHandler(async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: 'Missing required field: sessionId'
    });
  }

  const session = await AuthService.updateActivity(sessionId);

  res.json({
    success: true,
    message: 'Activity updated successfully',
    data: {
      sessionId,
      lastActivity: session?.lastActivity
    }
  });
}));

/**
 * @route   GET /api/auth/history/:userId
 * @desc    Get user authentication history
 * @access  Public
 */
router.get('/history/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { limit = 50, eventType } = req.query;

  let filter = { userId };
  if (eventType) {
    filter.eventType = eventType;
  }

  const history = await UserAuthHistory.find(filter)
    .sort({ timestamp: -1 })
    .limit(parseInt(limit))
    .select('-__v');

  res.json({
    success: true,
    data: history,
    count: history.length
  });
}));

/**
 * @route   GET /api/auth/sessions/:userId
 * @desc    Get user sessions
 * @access  Public
 */
router.get('/sessions/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { active = true } = req.query;

  let filter = { userId };
  if (active === 'true') {
    filter.isActive = true;
  } else if (active === 'false') {
    filter.isActive = false;
  }

  const sessions = await UserSession.find(filter)
    .sort({ lastActivity: -1 })
    .select('-__v');

  res.json({
    success: true,
    data: sessions,
    count: sessions.length
  });
}));

/**
 * @route   GET /api/auth/stats/:userId
 * @desc    Get user authentication and session statistics
 * @access  Public
 */
router.get('/stats/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { days = 30 } = req.query;

  const [sessionStats, loginStats, failedLogins] = await Promise.all([
    AuthService.getSessionStats(userId, parseInt(days)),
    AuthService.getLoginStats(userId, parseInt(days)),
    UserAuthHistory.getFailedLogins(userId, 24)
  ]);

  res.json({
    success: true,
    data: {
      sessionStats,
      loginStats,
      failedLogins: failedLogins.length,
      period: `${days} days`
    }
  });
}));

/**
 * @route   GET /api/auth/security/:userId
 * @desc    Get user security information
 * @access  Public
 */
router.get('/security/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const [activeSessions, recentLogins, failedAttempts] = await Promise.all([
    AuthService.getActiveSessions(userId),
    UserAuthHistory.find({ 
      userId, 
      eventType: 'login', 
      success: true 
    }).sort({ timestamp: -1 }).limit(5),
    UserAuthHistory.find({ 
      userId, 
      eventType: 'login', 
      success: false 
    }).sort({ timestamp: -1 }).limit(10)
  ]);

  res.json({
    success: true,
    data: {
      activeSessions: activeSessions.length,
      recentLogins,
      failedAttempts,
      securityScore: calculateSecurityScore(activeSessions.length, failedAttempts.length)
    }
  });
}));

/**
 * @route   DELETE /api/auth/session/:sessionId
 * @desc    End a specific session
 * @access  Public
 */
router.delete('/session/:sessionId', asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await UserSession.findOne({ sessionId });
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Session not found'
    });
  }

  await session.endSession();

  res.json({
    success: true,
    message: 'Session ended successfully',
    data: {
      sessionId,
      sessionDuration: session.sessionDuration
    }
  });
}));

/**
 * @route   POST /api/auth/cleanup
 * @desc    Cleanup expired sessions (admin only)
 * @access  Private
 */
router.post('/cleanup', asyncHandler(async (req, res) => {
  const result = await AuthService.cleanupExpiredSessions();

  res.json({
    success: true,
    message: 'Cleanup completed successfully',
    data: {
      sessionsCleaned: result.modifiedCount
    }
  });
}));

// Helper function to calculate security score
function calculateSecurityScore(activeSessions, failedAttempts) {
  let score = 100;
  
  // Deduct points for multiple active sessions
  if (activeSessions > 3) {
    score -= (activeSessions - 3) * 10;
  }
  
  // Deduct points for failed attempts
  score -= failedAttempts * 5;
  
  return Math.max(0, Math.min(100, score));
}

/**
 * @route   GET /api/auth/test
 * @desc    Test endpoint to verify API is working
 * @access  Public
 */
router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Authentication API is working correctly',
    timestamp: new Date().toISOString(),
    databaseStatus: mongoose.connection.readyState === 1 ? 'Connected' : 'Not Connected',
    endpoints: [
      'POST /api/auth/signup',
      'POST /api/auth/login', 
      'POST /api/auth/logout',
      'POST /api/auth/failed-login',
      'POST /api/auth/activity',
      'GET /api/auth/history/:userId',
      'GET /api/auth/sessions/:userId',
      'GET /api/auth/stats/:userId',
      'GET /api/auth/security/:userId',
      'DELETE /api/auth/session/:sessionId',
      'POST /api/auth/cleanup'
    ]
  });
});

module.exports = router;
