const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// Middleware for error handling
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   GET /api/questions
 * @desc    Get all questions with filtering and pagination
 * @access  Public
 */
router.get('/', asyncHandler(async (req, res) => {
  const {
    category,
    difficulty,
    limit = 20,
    page = 1,
    search,
    random = false
  } = req.query;

  // Build filter object
  const filter = {};
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = parseInt(difficulty);
  if (search) {
    filter.$or = [
      { questionText: { $regex: search, $options: 'i' } },
      { explanation: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
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
    // Get paginated questions
    questions = await Question.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');
    
    total = await Question.countDocuments(filter);
  }

  res.json({
    success: true,
    data: questions,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit))
    }
  });
}));

/**
 * @route   GET /api/questions/categories
 * @desc    Get all available categories
 * @access  Public
 */
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Question.distinct('category');
  
  res.json({
    success: true,
    data: categories
  });
}));

/**
 * @route   GET /api/questions/stats
 * @desc    Get question statistics
 * @access  Public
 */
router.get('/stats', asyncHandler(async (req, res) => {
  const stats = await Question.aggregate([
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
    }
  ]);

  const totalQuestions = await Question.countDocuments();

  res.json({
    success: true,
    data: {
      totalQuestions,
      categories: stats
    }
  });
}));

module.exports = router;
