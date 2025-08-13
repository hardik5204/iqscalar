import userService from './userService';

class PracticeService {
  constructor() {
    this.practiceQuestions = [];
    this.userPracticeHistory = new Map();
  }

  // Load practice questions from JSON file
  async loadPracticeQuestions() {
    try {
      const response = await fetch('/Practice_Questions.json');
      if (!response.ok) {
        throw new Error('Failed to load practice questions');
      }
      const data = await response.json();
      this.practiceQuestions = this.normalizePracticeFormat(data.practice_questions);
      console.log(`Loaded ${this.practiceQuestions.length} practice questions`);
      return this.practiceQuestions;
    } catch (error) {
      console.error('Error loading practice questions:', error);
      this.practiceQuestions = this.getFallbackPracticeQuestions();
      return this.practiceQuestions;
    }
  }

  // Normalize practice question format
  normalizePracticeFormat(questions) {
    return questions.map(q => ({
      id: q.id,
      category: q.category,
      question: q.question_text,
      options: Object.values(q.options),
      answerText: q.options[q.answer],
      correctIndex: Object.keys(q.options).indexOf(q.answer),
      explanation: q.explanation
    }));
  }

  // Get questions by category
  getQuestionsByCategory(category) {
    return this.practiceQuestions.filter(q => q.category === category);
  }

  // Get all available categories
  getCategories() {
    const categories = [...new Set(this.practiceQuestions.map(q => q.category))];
    return categories;
  }

  // Generate practice questions (can be repeated, unlike tests)
  generatePracticeQuestions(category = null, numQuestions = 10) {
    if (this.practiceQuestions.length === 0) {
      console.warn('Practice questions not loaded yet');
      return this.getFallbackPracticeQuestions().slice(0, numQuestions);
    }

    let availableQuestions = this.practiceQuestions;
    
    // Filter by category if specified
    if (category) {
      availableQuestions = this.getQuestionsByCategory(category);
    }

    // Shuffle and select questions
    const shuffled = this.shuffleArray(availableQuestions);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }

  // Calculate practice results
  calculatePracticeResults(practiceQuestions, userAnswers) {
    let correctAnswers = 0;
    const results = practiceQuestions.map((question, index) => {
      const userAnswerIndex = userAnswers[index];
      const isCorrect = userAnswerIndex === question.correctIndex;
      if (isCorrect) correctAnswers++;
      
      return {
        ...question,
        userAnswerIndex,
        isCorrect,
        correctAnswerText: question.answerText,
        userAnswerText: typeof userAnswerIndex === 'number' ? (question.options[userAnswerIndex] || '') : ''
      };
    });

    const score = correctAnswers;
    const percentage = (correctAnswers / practiceQuestions.length) * 100;
    const totalQuestions = practiceQuestions.length;

    // Category-wise performance
    const categoryPerformance = this.calculateCategoryPerformance(results);

    const practiceResults = {
      score,
      percentage,
      totalQuestions,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      results,
      categoryPerformance,
      timestamp: new Date().toISOString(),
      practiceId: this.generatePracticeId(),
      isPractice: true
    };

    // Save practice results to user service
    try {
      const practiceCategory = practiceQuestions.length > 0 ? practiceQuestions[0].category : 'Mixed';
      userService.addTestResult({
        ...practiceResults,
        type: `Practice - ${practiceCategory}`,
        isPractice: true
      });
    } catch (error) {
      console.error('Error saving practice results:', error);
    }

    return practiceResults;
  }

  // Calculate performance by category
  calculateCategoryPerformance(results) {
    const categoryStats = {};
    
    results.forEach(result => {
      const category = result.category;
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0 };
      }
      categoryStats[category].total++;
      if (result.isCorrect) {
        categoryStats[category].correct++;
      }
    });

    Object.keys(categoryStats).forEach(category => {
      const stats = categoryStats[category];
      stats.percentage = (stats.correct / stats.total) * 100;
    });

    return categoryStats;
  }

  // Get user's practice history
  getUserPracticeHistory(userId) {
    return this.userPracticeHistory.get(userId) || [];
  }

  // Save practice result to user history
  savePracticeResult(userId, result) {
    const history = this.getUserPracticeHistory(userId);
    history.push(result);
    this.userPracticeHistory.set(userId, history);
  }

  // Get user's practice statistics
  getUserPracticeStats(userId) {
    const history = this.getUserPracticeHistory(userId);
    if (history.length === 0) {
      return {
        totalPractices: 0,
        averageScore: 0,
        bestScore: 0,
        totalQuestions: 0,
        categoryStats: {}
      };
    }

    const totalPractices = history.length;
    const totalScore = history.reduce((sum, result) => sum + result.score, 0);
    const totalQuestions = history.reduce((sum, result) => sum + result.totalQuestions, 0);
    const averageScore = totalScore / totalQuestions * 100;
    const bestScore = Math.max(...history.map(result => result.percentage));

    // Calculate category statistics
    const categoryStats = {};
    history.forEach(result => {
      Object.keys(result.categoryPerformance).forEach(category => {
        if (!categoryStats[category]) {
          categoryStats[category] = { total: 0, correct: 0 };
        }
        categoryStats[category].total += result.categoryPerformance[category].total;
        categoryStats[category].correct += result.categoryPerformance[category].correct;
      });
    });

    Object.keys(categoryStats).forEach(category => {
      categoryStats[category].percentage = (categoryStats[category].correct / categoryStats[category].total) * 100;
    });

    return {
      totalPractices,
      averageScore,
      bestScore,
      totalQuestions,
      categoryStats
    };
  }

  // Generate unique practice ID
  generatePracticeId() {
    return `practice_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Shuffle array (Fisher-Yates algorithm)
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Fallback practice questions if JSON loading fails
  getFallbackPracticeQuestions() {
    return [
      {
        id: "fallback_practice_1",
        category: "Verbal-Logical Reasoning",
        question: "Which word best completes the analogy: HAPPY is to SAD as JOY is to _______?",
        options: ["Sorrow", "Anger", "Fear", "Love", "Peace"],
        answerText: "Sorrow",
        correctIndex: 0,
        explanation: "Happy and sad are opposites. Joy and sorrow are also opposites."
      },
      {
        id: "fallback_practice_2",
        category: "Numerical & Abstract Reasoning",
        question: "What number comes next in the sequence: 2, 4, 8, 16, 32, ?",
        options: ["48", "56", "64", "72", "80"],
        answerText: "64",
        correctIndex: 2,
        explanation: "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64."
      },
      {
        id: "fallback_practice_3",
        category: "Spatial Reasoning",
        question: "If you have 5 different colored balls, how many different ways can you arrange them in a line?",
        options: ["25", "60", "120", "240", "360"],
        answerText: "120",
        correctIndex: 2,
        explanation: "This is a permutation of 5 distinct items: 5! = 5×4×3×2×1 = 120."
      }
    ];
  }

  // Get practice statistics
  getPracticeStatistics() {
    return {
      totalQuestions: this.practiceQuestions.length,
      categories: this.getCategories(),
      questionsPerCategory: this.getCategories().map(category => ({
        category,
        count: this.getQuestionsByCategory(category).length
      }))
    };
  }
}

const practiceService = new PracticeService();
export default practiceService; 