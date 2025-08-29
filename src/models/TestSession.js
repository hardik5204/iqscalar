const mongoose = require('mongoose');

const testSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  testType: {
    type: String,
    required: true,
    enum: ['iq_test', 'practice', 'learning_practice'],
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Verbal-Logical Reasoning', 'Numerical & Abstract Reasoning', 'Pattern Recognition', 'mixed'],
    index: true
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    userAnswer: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', null],
      default: null
    },
    isCorrect: {
      type: Boolean,
      default: null
    },
    timeSpent: {
      type: Number,
      default: 0,
      min: 0
    },
    questionNumber: {
      type: Number,
      required: true
    }
  }],
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  correctAnswers: {
    type: Number,
    default: 0,
    min: 0
  },
  score: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  timeLimit: {
    type: Number,
    default: 30, // minutes
    min: 1
  },
  timeSpent: {
    type: Number,
    default: 0, // seconds
    min: 0
  },
  startedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  completedAt: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress',
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
testSessionSchema.index({ userId: 1, status: 1 });
testSessionSchema.index({ userId: 1, testType: 1 });
testSessionSchema.index({ userId: 1, category: 1 });
testSessionSchema.index({ startedAt: -1 });

// Virtual for completion percentage
testSessionSchema.virtual('completionPercentage').get(function() {
  if (this.totalQuestions === 0) return 0;
  const answeredQuestions = this.questions.filter(q => q.userAnswer !== null).length;
  return Math.round((answeredQuestions / this.totalQuestions) * 100);
});

// Virtual for time remaining
testSessionSchema.virtual('timeRemaining').get(function() {
  if (this.status === 'completed') return 0;
  const timeLimitSeconds = this.timeLimit * 60;
  const remaining = timeLimitSeconds - this.timeSpent;
  return Math.max(0, remaining);
});

// Method to add question to session
testSessionSchema.methods.addQuestion = function(questionId, questionNumber) {
  this.questions.push({
    questionId,
    questionNumber,
    userAnswer: null,
    isCorrect: null,
    timeSpent: 0
  });
  return this.save();
};

// Method to answer question
testSessionSchema.methods.answerQuestion = function(questionNumber, userAnswer, timeSpent) {
  const question = this.questions.find(q => q.questionNumber === questionNumber);
  if (question) {
    question.userAnswer = userAnswer;
    question.timeSpent = timeSpent;
    this.timeSpent += timeSpent;
  }
  return this.save();
};

// Method to complete test
testSessionSchema.methods.completeTest = function() {
  // Calculate final score
  this.correctAnswers = this.questions.filter(q => q.isCorrect === true).length;
  this.score = Math.round((this.correctAnswers / this.totalQuestions) * 100);
  this.completedAt = new Date();
  this.status = 'completed';
  
  return this.save();
};

// Method to abandon test
testSessionSchema.methods.abandonTest = function() {
  this.status = 'abandoned';
  this.completedAt = new Date();
  return this.save();
};

// Method to get test results
testSessionSchema.methods.getResults = function() {
  const categoryPerformance = {};
  
  // Group questions by category and calculate performance
  this.questions.forEach(question => {
    if (!categoryPerformance[question.category]) {
      categoryPerformance[question.category] = {
        total: 0,
        correct: 0,
        score: 0
      };
    }
    
    categoryPerformance[question.category].total++;
    if (question.isCorrect) {
      categoryPerformance[question.category].correct++;
    }
  });
  
  // Calculate category scores
  Object.keys(categoryPerformance).forEach(category => {
    const cat = categoryPerformance[category];
    cat.score = Math.round((cat.correct / cat.total) * 100);
  });
  
  return {
    sessionId: this.sessionId,
    testType: this.testType,
    category: this.category,
    totalQuestions: this.totalQuestions,
    correctAnswers: this.correctAnswers,
    score: this.score,
    timeSpent: this.timeSpent,
    timeLimit: this.timeLimit,
    startedAt: this.startedAt,
    completedAt: this.completedAt,
    status: this.status,
    categoryPerformance,
    completionPercentage: this.completionPercentage
  };
};

// Static method to get user's test history
testSessionSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ startedAt: -1 })
    .limit(limit)
    .populate('questions.questionId', 'category questionText');
};

// Static method to get user's best scores
testSessionSchema.statics.getUserBestScores = function(userId) {
  return this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId), status: 'completed' } },
    { $group: {
      _id: '$category',
      bestScore: { $max: '$score' },
      averageScore: { $avg: '$score' },
      totalTests: { $sum: 1 }
    }},
    { $sort: { bestScore: -1 } }
  ]);
};

module.exports = mongoose.model('TestSession', testSessionSchema);

