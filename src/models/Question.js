const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  difficulty: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    default: 3,
    index: true
  },
  questionText: {
    type: String,
    required: true
  },
  options: {
    A: {
      type: String,
      required: true
    },
    B: {
      type: String,
      required: true
    },
    C: {
      type: String,
      required: true
    },
    D: {
      type: String,
      required: true
    },
    E: {
      type: String,
      required: false
    }
  },
  correctAnswer: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E']
  },
  explanation: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    index: true
  }],
  source: {
    type: String,
    required: true,
    enum: ['fullIqQuestions', 'fullPracticeQuestions', 'mainIqQuestions', 'mainPracticeQuestions'],
    index: true
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for efficient querying
questionSchema.index({ category: 1, difficulty: 1, isActive: 1 });
questionSchema.index({ tags: 1, isActive: 1 });
questionSchema.index({ source: 1, isActive: 1 });

// Virtual for getting options array
questionSchema.virtual('optionsArray').get(function() {
  const options = [this.options.A, this.options.B, this.options.C, this.options.D];
  if (this.options.E) options.push(this.options.E);
  return options;
});

// Virtual for getting correct answer text
questionSchema.virtual('correctAnswerText').get(function() {
  return this.options[this.correctAnswer];
});

// Method to update usage statistics
questionSchema.methods.updateUsageStats = function(isCorrect) {
  this.usageCount += 1;
  
  // Calculate new success rate
  const totalCorrect = Math.round((this.successRate * (this.usageCount - 1)) / 100);
  const newCorrect = totalCorrect + (isCorrect ? 1 : 0);
  this.successRate = Math.round((newCorrect / this.usageCount) * 100);
  
  return this.save();
};

// Static method to get questions by category
questionSchema.statics.getQuestionsByCategory = function(category, limit = 10, excludeIds = []) {
  return this.find({
    category,
    isActive: true,
    _id: { $nin: excludeIds }
  })
  .limit(limit)
  .sort({ usageCount: 1, successRate: -1 }); // Prioritize less used questions
};

// Static method to get random questions
questionSchema.statics.getRandomQuestions = function(category = null, limit = 10, excludeIds = []) {
  const query = {
    isActive: true,
    _id: { $nin: excludeIds }
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.aggregate([
    { $match: query },
    { $sample: { size: limit } }
  ]);
};

// Static method to get questions by difficulty
questionSchema.statics.getQuestionsByDifficulty = function(difficulty, category = null, limit = 10) {
  const query = {
    difficulty,
    isActive: true
  };
  
  if (category) {
    query.category = category;
  }
  
  return this.find(query).limit(limit);
};

// Method to normalize question format for frontend
questionSchema.methods.toNormalizedFormat = function() {
  return {
    id: this.questionId,
    category: this.category,
    question: this.questionText,
    options: this.optionsArray,
    answerText: this.correctAnswerText,
    correctIndex: this.optionsArray.indexOf(this.correctAnswerText),
    explanation: this.explanation,
    source: this.source,
    difficulty: this.difficulty,
    tags: this.tags
  };
};

module.exports = mongoose.model('Question', questionSchema);
