const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const TestSession = require('../models/TestSession');

// Middleware for error handling
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/practice/questions
 * @desc    Get practice questions with filtering
 * @access  Public
 */
router.get('/questions', asyncHandler(async (req, res) => {
  const {
    category,
    difficulty,
    limit = 10,
    random = true
  } = req.query;

  // Build filter object
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = parseInt(difficulty);

  let questions;
  let total;

  if (random === 'true') {
    // Get random questions
    questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: parseInt(limit) } }
    ]);
    total = questions.length;
  } else {
    // Get sequential questions
    questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('-__v');
    
    total = await Question.countDocuments(filter);
  }

  res.json({
    success: true,
    data: questions,
    total
  });
}));

/**
 * @route   POST /api/practice/session
 * @desc    Create practice session
 * @access  Public
 */
router.post('/session', asyncHandler(async (req, res) => {
  const {
    userId,
    category,
    questions,
    answers,
    timeSpent,
    score,
    totalQuestions
  } = req.body;

  // Calculate metrics
  const correctAnswers = Object.values(answers).filter(answer => answer.isCorrect).length;
  const accuracy = (correctAnswers / totalQuestions) * 100;
  const averageTimePerQuestion = timeSpent / totalQuestions;

  const practiceSession = await TestSession.create({
    userId,
    sessionId: `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    testType: 'practice',
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
    data: practiceSession
  });
}));

/**
 * @route   GET /api/practice/categories
 * @desc    Get practice categories with question counts
 * @access  Public
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Question.aggregate([
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgDifficulty: { $avg: '$difficulty' }
      }
    },
    {
      $project: {
        category: '$_id',
        count: 1,
        avgDifficulty: { $round: ['$avgDifficulty', 1] }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.json({
    success: true,
    data: categories
  });
}));

/**
 * @route   GET /api/practice/user/:userId
 * @desc    Get user's practice history
 * @access  Public
 */
router.get('/user/:userId', asyncHandler(async (req, res) => {
  const { limit = 20, page = 1, category } = req.query;
  const skip = (parseInt(page) - 1) * parseInt(limit);

  const filter = { userId: req.params.userId, testType: 'practice' };
  if (category) filter.category = category;

  const sessions = await TestSession.find(filter)
    .sort({ completedAt: -1 })
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
 * @route   GET /api/practice/analytics/:userId
 * @desc    Get practice analytics for user
 * @access  Public
 */
router.get('/analytics/:userId', asyncHandler(async (req, res) => {
  const { period = 'all' } = req.query;
  
  let dateFilter = {};
  if (period === 'week') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
  } else if (period === 'month') {
    dateFilter = { completedAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
  }

  // Overall practice statistics
  const overallStats = await TestSession.aggregate([
    { $match: { userId: req.params.userId, testType: 'practice', ...dateFilter } },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalTimeSpent: { $sum: '$timeSpent' },
        bestScore: { $max: '$score' },
        improvement: {
          $avg: {
            $subtract: ['$score', { $ifNull: ['$previousScore', '$score'] }]
          }
        }
      }
    }
  ]);

  // Category-wise performance
  const categoryPerformance = await TestSession.aggregate([
    { $match: { userId: req.params.userId, testType: 'practice', ...dateFilter } },
    {
      $group: {
        _id: '$category',
        sessions: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalQuestions: { $sum: '$totalQuestions' },
        totalCorrect: { $sum: '$correctAnswers' },
        totalTimeSpent: { $sum: '$timeSpent' }
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
        totalTimeSpent: 1,
        categoryAccuracy: {
          $round: [
            { $multiply: [{ $divide: ['$totalCorrect', '$totalQuestions'] }, 100] },
            2
          ]
        }
      }
    }
  ]);

  // Progress over time (last 10 sessions)
  const progressOverTime = await TestSession.find({
    userId: req.params.userId,
    testType: 'practice'
  })
    .sort({ completedAt: -1 })
    .limit(10)
    .select('score accuracy completedAt category')
    .lean();

  res.json({
    success: true,
    data: {
      overall: overallStats[0] || {
        totalSessions: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        averageScore: 0,
        averageAccuracy: 0,
        totalTimeSpent: 0,
        bestScore: 0,
        improvement: 0
      },
      categoryPerformance,
      progressOverTime: progressOverTime.reverse()
    }
  });
}));

/**
 * @route   GET /api/practice/recommendations/:userId
 * @desc    Get personalized practice recommendations
 * @access  Public
 */
router.get('/recommendations/:userId', asyncHandler(async (req, res) => {
  // Get user's weakest categories
  const weakCategories = await TestSession.aggregate([
    { $match: { userId: req.params.userId, testType: 'practice' } },
    {
      $group: {
        _id: '$category',
        averageAccuracy: { $avg: '$accuracy' },
        sessions: { $sum: 1 }
      }
    },
    { $sort: { averageAccuracy: 1 } },
    { $limit: 3 }
  ]);

  // Get recommended questions for weak categories
  const recommendations = [];
  
  for (const category of weakCategories) {
    const questions = await Question.aggregate([
      { $match: { category: category._id } },
      { $sample: { size: 5 } }
    ]);
    
    recommendations.push({
      category: category._id,
      averageAccuracy: Math.round(category.averageAccuracy * 100) / 100,
      sessions: category.sessions,
      questions
    });
  }

  res.json({
    success: true,
    data: {
      weakCategories,
      recommendations
    }
  });
}));

module.exports = router;
