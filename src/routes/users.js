const express = require('express');
const router = express.Router();
const User = require('../models/User');
const TestSession = require('../models/TestSession');

// Middleware for error handling
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/users
 * @desc    Get all users (with pagination)
 * @access  Private (Admin only)
 */
router.get('/', asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, search } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = {};
  if (search) {
    filter.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .select('-__v');

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

/**
 * @route   GET /api/users/:id
 * @desc    Get single user by ID
 * @access  Public
 */
router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

/**
 * @route   GET /api/users/clerk/:clerkUserId
 * @desc    Get user by Clerk ID
 * @access  Public
 */
router.get('/clerk/:clerkUserId', asyncHandler(async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.params.clerkUserId }).select('-__v');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Public
 */
router.post('/', asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  
  res.status(201).json({
    success: true,
    data: user
  });
}));

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).select('-__v');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
}));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private (Admin only)
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Also delete associated test sessions
  await TestSession.deleteMany({ userId: req.params.id });

  res.json({
    success: true,
    message: 'User and associated data deleted successfully'
  });
}));

/**
 * @route   GET /api/users/:id/profile
 * @desc    Get user profile with statistics
 * @access  Public
 */
router.get('/:id/profile', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-__v');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Get user statistics
  const stats = await TestSession.aggregate([
    { $match: { userId: req.params.id } },
    {
      $group: {
        _id: null,
        totalTests: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        bestScore: { $max: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    }
  ]);

  // Get recent test sessions
  const recentSessions = await TestSession.find({ userId: req.params.id })
    .sort({ completedAt: -1 })
    .limit(5)
    .select('testType score accuracy completedAt category');

  // Get category performance
  const categoryPerformance = await TestSession.aggregate([
    { $match: { userId: req.params.id } },
    {
      $group: {
        _id: '$category',
        tests: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' }
      }
    },
    {
      $project: {
        category: '$_id',
        tests: 1,
        averageScore: { $round: ['$averageScore', 2] },
        averageAccuracy: { $round: ['$averageAccuracy', 2] }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      user,
      statistics: stats[0] || {
        totalTests: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageScore: 0,
        averageAccuracy: 0,
        bestScore: 0,
        totalTimeSpent: 0
      },
      recentSessions,
      categoryPerformance
    }
  });
}));

/**
 * @route   GET /api/users/:id/leaderboard
 * @desc    Get user's position in leaderboard
 * @access  Public
 */
router.get('/:id/leaderboard', asyncHandler(async (req, res) => {
  const { period = 'all' } = req.query;
  
  let dateFilter = {};
  if (period === 'week') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'month') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  }

  // Get user's best score
  const userBestScore = await TestSession.findOne({ userId: req.params.id, ...dateFilter })
    .sort({ score: -1 })
    .select('score');

  if (!userBestScore) {
    return res.json({
      success: true,
      data: {
        userRank: null,
        totalUsers: 0,
        userScore: 0,
        topUsers: []
      }
    });
  }

  // Get total users with scores in this period
  const totalUsers = await TestSession.distinct('userId', dateFilter);

  // Get users with better scores than current user
  const usersWithBetterScores = await TestSession.distinct('userId', {
    ...dateFilter,
    score: { $gt: userBestScore.score }
  });

  const userRank = usersWithBetterScores.length + 1;

  // Get top 10 users
  const topUsers = await TestSession.aggregate([
    { $match: dateFilter },
    {
      $group: {
        _id: '$userId',
        bestScore: { $max: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalTests: { $sum: 1 }
      }
    },
    { $sort: { bestScore: -1 } },
    { $limit: 10 },
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
        fullName: { $arrayElemAt: ['$userInfo.fullName', 0] },
        email: { $arrayElemAt: ['$userInfo.email', 0] }
      }
    }
  ]);

  res.json({
    success: true,
    data: {
      userRank,
      totalUsers: totalUsers.length,
      userScore: userBestScore.score,
      topUsers
    }
  });
}));

module.exports = router;
