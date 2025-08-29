const express = require('express');
const router = express.Router();
const TestSession = require('../models/TestSession');
const Question = require('../models/Question');

// Middleware for error handling
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   POST /api/test-sessions
 * @desc    Create new test session
 * @access  Public
 */
router.post('/', asyncHandler(async (req, res) => {
  const {
    userId,
    testType,
    questions,
    answers,
    timeSpent,
    score,
    totalQuestions,
    category
  } = req.body;

  // Calculate additional metrics
  const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
  const accuracy = (correctAnswers / totalQuestions) * 100;
  const averageTimePerQuestion = timeSpent / totalQuestions;

  const testSession = await TestSession.create({
    userId,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    testType,
    questions,
    userAnswers: answers,
    score,
    totalQuestions,
    correctAnswers,
    accuracy,
    timeSpent,
    averageTimePerQuestion,
    category,
    completedAt: new Date()
  });

  res.status(201).json({
    success: true,
    data: testSession
  });
}));

/**
 * @route   GET /api/test-sessions
 * @desc    Get test sessions with filtering
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const {
    userId,
    testType,
    limit = 20,
    page = 1,
    sortBy = 'completedAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  if (userId) filter.userId = userId;
  if (testType) filter.testType = testType;

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const sessions = await TestSession.find(filter)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await TestSession.countDocuments(filter);

  res.json({
    success: true,
    data: sessions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

/**
 * @route   GET /api/test-sessions/user/:userId
 * @desc    Get all test sessions for a specific user
 * @access  Public
 */
router.get('/user/:userId', asyncHandler(async (req, res) => {
  const { limit = 50, page = 1 } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const sessions = await TestSession.find({ userId: req.params.userId })
    .sort({ completedAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await TestSession.countDocuments({ userId: req.params.userId });

  res.json({
    success: true,
    data: sessions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

/**
 * @route   GET /api/test-sessions/analytics/:userId
 * @desc    Get analytics for a specific user
 * @access  Public
 */
router.get('/analytics/:userId', asyncHandler(async (req, res) => {
  const { period = 'all' } = req.query;
  
  let dateFilter = {};
  if (period === 'week') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'month') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'year') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
  }

  const analytics = await TestSession.aggregate([
    { $match: { userId: req.params.userId, ...dateFilter } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalTimeSpent: { $sum: '$timeSpent' },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        averageTimePerQuestion: { $avg: '$averageTimePerQuestion' },
        bestScore: { $max: '$score' },
        worstScore: { $min: '$score' }
      }
    },
    {
      $project: {
        _id: 0,
        totalSessions: 1,
        totalQuestions: 1,
        totalCorrect: 1,
        totalTimeSpent: 1,
        averageScore: { $round: ['$averageScore', 2] },
        averageAccuracy: { $round: ['$averageAccuracy', 2] },
        averageTimePerQuestion: { $round: ['$averageTimePerQuestion', 2] },
        bestScore: 1,
        worstScore: 1,
        overallAccuracy: {
          $round: [
            { $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] },
            2
          ]
        }
      }
    }
  ]);

  // Get category-wise performance
  const categoryPerformance = await TestSession.aggregate([
    { $match: { userId: req.params.userId, ...dateFilter } },
    {
      $group: {
        _id: '$category',
        sessions: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' }
      }
    },
    {
      $project: {
        category: '$_id',
        sessions: 1,
        averageScore: { $round: ['$averageScore', 2] },
        averageAccuracy: { $round: ['$averageAccuracy', 2] },
        totalQuestions: 1,
        totalCorrect: 1,
        categoryAccuracy: {
          $round: [
            { $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] },
            2
          ]
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      overview: analytics[0] || {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        averageAccuracy: 0,
        averageTimePerQuestion: 0,
        bestScore: 0,
        worstScore: 0,
        overallAccuracy: 0
      },
      categoryPerformance
    }
  });
}));

/**
 * @route   GET /api/test-sessions/:id
 * @desc    Get single test session by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const session = await TestSession.findById(req.params.id).select('-__v');
  
  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Test session not found'
    });
  }

  res.json({
    success: true,
    data: session
  });
}));

/**
 * @route   DELETE /api/test-sessions/:id
 * @desc    Delete test session
 * @access  Private (Admin only)
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const session = await TestSession.findByIdAndDelete(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: 'Test session not found'
    });
  }

  res.json({
    success: true,
    message: 'Test session deleted successfully'
  });
}));

module.exports = router;
