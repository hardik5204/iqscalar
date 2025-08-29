const express = require('express');
const router = express.Router();
const TestSession = require('../models/TestSession');
const Question = require('../models/Question');
const User = require('../models/User');

// Middleware for error handling
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/analytics/overview
 * @desc    Get overall platform analytics
 * @access  Private (Admin only)
 */
router.get('/overview', asyncHandler(async (req, res) => {
  const { period = 'all' } = req.query;
  
  let dateFilter = {};
  if (period === 'week') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'month') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'year') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
  }

  // Platform statistics
  const platformStats = await TestSession.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    }
  ]);

  // Test type distribution
  const testTypeDistribution = await TestSession.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$testType',
        count: { $sum: 1 },
        averageScore: { $avg: '$score' }
      }
    }
  ]);

  // Category performance
  const categoryPerformance = await TestSession.aggregate([
    { $match: dateFilter },
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

  // User statistics
  const userStats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: {
            $cond: [
              { $gte: ['$lastActiveAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] },
              1,
              0
            ]
          }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      platform: platformStats[0] || {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0
      },
      testTypeDistribution,
      categoryPerformance,
      users: userStats[0] || {
        totalUsers: 0,
        activeUsers: 0
      }
    }
  });
}));

/**
 * @route   GET /api/analytics/leaderboard
 * @desc    Get global leaderboard
 * @access  Public
 */
router.get('/leaderboard', asyncHandler(async (req, res) => {
  const { period = 'all', limit = 50 } = req.query;
  
  let dateFilter = {};
  if (period === 'week') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'month') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  }

  const leaderboard = await TestSession.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$userId',
        bestScore: { $max: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalTests: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    },
    { $sort: { bestScore: -1 } },
    { $limit: parseInt(limit) },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'userInfo'
      }
    },
    {
      $project: {
        userId: '$_id',
        bestScore: 1,
        averageAccuracy: { $round: ['$averageAccuracy', 2] },
        totalTests: 1,
        totalQuestions: 1,
        totalCorrect: 1,
        totalTimeSpent: 1,
        fullName: { $arrayElemAt: ['$userInfo.fullName', 0] },
        email: { $arrayElemAt: ['$userInfo.email', 0] }
      }
    }
  ]);

  res.json({
    success: true,
    data: leaderboard
  });
}));

/**
 * @route   GET /api/analytics/trends
 * @desc    Get performance trends over time
 * @access  Private (Admin only)
 */
router.get('/trends', asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

  // Daily trends
  const dailyTrends = await TestSession.aggregate([
    { $match: { completedAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
        },
        sessions: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalUsers: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        date: '$_id',
        sessions: 1,
        averageScore: { $round: ['$averageScore', 2] },
        averageAccuracy: { $round: ['$averageAccuracy', 2] },
        uniqueUsers: { $size: '$totalUsers' }
      }
    },
    { $sort: { date: 1 } }
  ]);

  // Category trends
  const categoryTrends = await TestSession.aggregate([
    { $match: { completedAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          category: '$category',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } }
        },
        sessions: { $sum: 1 },
        averageScore: { $avg: '$score' }
      }
    },
    {
      $project: {
        category: '$_id.category',
        date: '$_id.date',
        sessions: 1,
        averageScore: { $round: ['$averageScore', 2] }
      }
    },
    { $sort: { date: 1 } }
  ]);

  res.json({
    success: true,
    data: {
      dailyTrends,
      categoryTrends
    }
  });
}));

/**
 * @route   GET /api/analytics/question-stats
 * @desc    Get question performance statistics
 * @access  Private (Admin only)
 */
router.get('/question-stats', asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  // Most difficult questions
  const difficultQuestions = await Question.aggregate([
    {
      $lookup: {
        from: 'testsessions',
        localField: '_id',
        foreignField: 'questions.questionId',
        as: 'sessions'
      }
    },
    {
      $project: {
        questionId: 1,
        questionText: 1,
        category: 1,
        difficulty: 1,
        totalAttempts: { $size: '$sessions' },
        correctAttempts: {
          $size: {
            $filter: {
              input: '$sessions',
              as: 'session',
              cond: {
                $in: [
                  '$_id',
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: '$session.userAnswers',
                          as: 'answer',
                          cond: { $eq: ['$$answer.isCorrect', true] }
                        }
                      },
                      as: 'correctAnswer',
                      in: '$$correctAnswer.questionId'
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    {
      $addFields: {
        successRate: {
          $cond: [
            { $eq: ['$totalAttempts', 0] },
            0,
            { $multiply: [{ $divide: ['$correctAttempts', '$totalAttempts'] }, 100] }
          ]
        }
      }
    },
    { $sort: { successRate: 1 } },
    { $limit: parseInt(limit) }
  ]);

  // Most popular questions
  const popularQuestions = await Question.aggregate([
    {
      $lookup: {
        from: 'testsessions',
        localField: '_id',
        foreignField: 'questions.questionId',
        as: 'sessions'
      }
    },
    {
      $project: {
        questionId: 1,
        questionText: 1,
        category: 1,
        totalAttempts: { $size: '$sessions' }
      }
    },
    { $sort: { totalAttempts: -1 } },
    { $limit: parseInt(limit) }
  ]);

  res.json({
    success: true,
    data: {
      difficultQuestions,
      popularQuestions
    }
  });
}));

/**
 * @route   GET /api/analytics/user-growth
 * @desc    Get user growth analytics
 * @access  Private (Admin only)
 */
router.get('/user-growth', asyncHandler(async (req, res) => {
  const { days = 30 } = req.query;
  const startDate = new Date(Date.now() - parseInt(days) * 24 * 60 * 60 * 1000);

  // Daily user registrations
  const dailyRegistrations = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        newUsers: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Cumulative user growth
  const cumulativeGrowth = await User.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        newUsers: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $group: {
        _id: null,
        dates: { $push: '$_id' },
        counts: { $push: '$newUsers' }
      }
    },
    {
      $project: {
        _id: 0,
        dates: 1,
        cumulative: {
          $reduce: {
            input: '$counts',
            initialValue: [],
            in: {
              $concatArrays: [
                '$$value',
                [{ $add: [{ $ifNull: [{ $arrayElemAt: ['$$value', -1] }, 0] }, '$$this'] }]
              ]
            }
          }
        }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      dailyRegistrations,
      cumulativeGrowth: cumulativeGrowth[0] || { dates: [], cumulative: [] }
    }
  });
}));

module.exports = router;
