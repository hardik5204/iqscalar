// Test Service for managing IQ test questions and generating non-repetitive tests

class TestService {
  constructor() {
    this.questions = [];
    this.userTestHistory = new Map(); // Track user's test history
    this.loadQuestions();
  }

  async loadQuestions() {
    try {
      const response = await fetch('/IQ_Test_Questions.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      const normalized = this.normalizeIQFormat(data);
      if (normalized && normalized.length > 0) {
        this.questions = normalized;
        // Deduplicate by id just in case
        const seen = new Set();
        this.questions = this.questions.filter(q => {
          if (seen.has(q.id)) return false;
          seen.add(q.id);
          return true;
        });
        console.log(`Loaded ${this.questions.length} questions from /IQ_Test_Questions.json`);
        return;
      }
    } catch (error) {
      console.warn('Failed to load /IQ_Test_Questions.json:', error);
    }

    // Fallback to minimal built-in if the main file fails
    console.error('Falling back to built-in questions');
    this.questions = this.getFallbackQuestions();
  }

  // Normalize format: { iq_questions: [ {id, category, question_text, options: {A..D}, answer: 'C', explanation} ] }
  normalizeIQFormat(data) {
    const entries = Array.isArray(data) ? data : Array.isArray(data.iq_questions) ? data.iq_questions : [];
    return entries
      .filter(Boolean)
      .map((item, idx) => {
        const optionObject = item.options || {};
        const optionKeys = Object.keys(optionObject).sort();
        const options = optionKeys.map(k => optionObject[k]).filter(v => typeof v === 'string');
        const answerLetter = (item.answer || '').toString().trim();
        const letterIndex = ['A','B','C','D','E'].indexOf(answerLetter);
        const correctIndex = letterIndex >= 0 ? letterIndex : Math.max(0, options.findIndex(opt => opt === item.answer));
        const answerText = options[correctIndex] || '';
        return {
          id: item.id ?? `iq_${idx}`,
          category: item.category || 'General',
          question: item.question_text || item.question || '',
          options,
          answerText,
          correctIndex,
          explanation: item.explanation || ''
        };
      })
      .filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2);
  }

  // Normalize simple format: [ { id, category, question, options: [..], answer: 'text', explanation } ]
  normalizeSimpleFormat(data) {
    const entries = Array.isArray(data) ? data : [];
    return entries
      .filter(Boolean)
      .map((item, idx) => {
        const options = Array.isArray(item.options) ? item.options : [];
        const correctIndex = options.findIndex(opt => opt === item.answer);
        return {
          id: item.id ?? `q_${idx}`,
          category: item.category || 'General',
          question: item.question || item.question_text || '',
          options,
          answerText: item.answer || (correctIndex >= 0 ? options[correctIndex] : ''),
          correctIndex: correctIndex >= 0 ? correctIndex : 0,
          explanation: item.explanation || ''
        };
      })
      .filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2);
  }

  // Get questions by category
  getQuestionsByCategory(category) {
    return this.questions.filter(q => q.category === category);
  }

  // Get all available categories
  getCategories() {
    const categories = [...new Set(this.questions.map(q => q.category))];
    return categories;
  }

  // Generate a non-repeating test of N questions
  generateTest(userId = 'anonymous', numQuestions = 15) {
    if (this.questions.length === 0) {
      console.warn('Questions not loaded yet');
      return this.getFallbackQuestions().slice(0, numQuestions);
    }

    const usedIds = new Set(this.getUserUsedQuestions(userId));
    const available = this.questions.filter(q => !usedIds.has(q.id));

    // If not enough available, reset and try again
    if (available.length < numQuestions) {
      this.resetUserHistory(userId);
      return this.generateTest(userId, numQuestions);
    }

    // Mix categories fairly: sample evenly across categories when possible
    const categories = this.getCategories();
    const perCatBase = Math.floor(numQuestions / categories.length);
    const extra = numQuestions % categories.length;

    let selected = [];
    categories.forEach((cat, idx) => {
      const catAvailable = available.filter(q => q.category === cat);
      const take = perCatBase + (idx < extra ? 1 : 0);
      const shuffled = this.shuffleArray(catAvailable);
      selected.push(...shuffled.slice(0, Math.min(take, catAvailable.length)));
    });

    // If still short for edge cases, top up from remaining available
    if (selected.length < numQuestions) {
      const remaining = available.filter(q => !selected.find(s => s.id === q.id));
      const topup = this.shuffleArray(remaining).slice(0, numQuestions - selected.length);
      selected.push(...topup);
    }

    // Shuffle final selection
    selected = this.shuffleArray(selected).slice(0, numQuestions);

    // Mark used
    this.markQuestionsAsUsed(userId, selected.map(q => q.id));

    // Add per-test metadata
    return selected.map((q, idx) => ({
      ...q,
      testQuestionId: idx + 1,
      userAnswer: null,
      isCorrect: null
    }));
  }

  // Get user's used question IDs
  getUserUsedQuestions(userId) {
    return this.userTestHistory.get(userId) || [];
  }

  // Mark questions as used for a user
  markQuestionsAsUsed(userId, questionIds) {
    const currentHistory = this.getUserUsedQuestions(userId);
    const updatedHistory = [...currentHistory, ...questionIds];
    this.userTestHistory.set(userId, updatedHistory);
  }

  // Reset user's test history
  resetUserHistory(userId) {
    this.userTestHistory.delete(userId);
  }

  // Get user's test count
  getUserTestCount(userId) {
    const usedQuestions = this.getUserUsedQuestions(userId);
    return Math.floor(usedQuestions.length / 15);
  }

  // Check if user can take more tests
  canUserTakeMoreTests(userId) {
    const testCount = this.getUserTestCount(userId);
    const totalPossibleTests = Math.floor(this.questions.length / 15);
    return testCount < totalPossibleTests;
  }

  // Get remaining tests for user
  getRemainingTests(userId) {
    const testCount = this.getUserTestCount(userId);
    const totalPossibleTests = Math.floor(this.questions.length / 15);
    return Math.max(0, totalPossibleTests - testCount);
  }

  // Calculate test results
  calculateResults(testQuestions, userAnswers) {
    let correctAnswers = 0;
    const results = testQuestions.map((question, index) => {
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
    const percentage = (correctAnswers / testQuestions.length) * 100;
    const totalQuestions = testQuestions.length;

    // Category-wise performance
    const categoryPerformance = this.calculateCategoryPerformance(results);

    // IQ score: map percentage to IQ with mean 100, SD 15 using an approximate linear/clamp mapping
    const iqScore = Math.round(Math.max(70, Math.min(145, 55 + percentage * 0.9)));

    return {
      score,
      percentage,
      iqScore,
      totalQuestions,
      correctAnswers,
      wrongAnswers: totalQuestions - correctAnswers,
      results,
      categoryPerformance,
      timestamp: new Date().toISOString(),
      testId: this.generateTestId()
    };
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

  // Generate unique test ID
  generateTestId() {
    return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
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

  // Fallback questions if JSON fails to load
  getFallbackQuestions() {
    return [
      {
        id: "fallback_1",
        category: "numerical_reasoning",
        question: "What is the missing number in the sequence: 2, 4, 6, 8, ?",
        options: ["9", "10", "12", "14"],
        answerText: "10",
        correctIndex: 1,
        explanation: "The sequence increases by 2 each time.",
        testQuestionId: 1
      },
      {
        id: "fallback_2",
        category: "logical_reasoning",
        question: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles.",
        options: ["True", "False", "Cannot be determined", "Sometimes true"],
        answerText: "True",
        correctIndex: 0,
        explanation: "This is a logical syllogism.",
        testQuestionId: 2
      },
      {
        id: "fallback_3",
        category: "numerical_reasoning",
        question: "Find the missing number: 5, 10, 15, ?, 25",
        options: ["16", "20", "18", "22"],
        answerText: "20",
        correctIndex: 1,
        explanation: "The sequence increases by 5 each time.",
        testQuestionId: 3
      },
      {
        id: "fallback_4",
        category: "logical_reasoning",
        question: "Which word doesn't belong: Apple, Orange, Banana, Carrot",
        options: ["Apple", "Orange", "Banana", "Carrot"],
        answerText: "Carrot",
        correctIndex: 3,
        explanation: "Carrot is a vegetable, while the others are fruits.",
        testQuestionId: 4
      },
      {
        id: "fallback_5",
        category: "numerical_reasoning",
        question: "What comes next: 3, 6, 9, 12, ?",
        options: ["14", "15", "16", "18"],
        answerText: "15",
        correctIndex: 1,
        explanation: "The sequence increases by 3 each time.",
        testQuestionId: 5
      },
      {
        id: "fallback_6",
        category: "logical_reasoning",
        question: "Complete the analogy: Book is to Reading as Fork is to ?",
        options: ["Eating", "Cooking", "Kitchen", "Food"],
        answerText: "Eating",
        correctIndex: 0,
        explanation: "A book is used for reading, a fork is used for eating.",
        testQuestionId: 6
      },
      {
        id: "fallback_7",
        category: "numerical_reasoning",
        question: "Complete the series: 100, 90, 80, 70, ?",
        options: ["50", "60", "65", "55"],
        answerText: "60",
        correctIndex: 1,
        explanation: "The sequence decreases by 10 each time.",
        testQuestionId: 7
      },
      {
        id: "fallback_8",
        category: "logical_reasoning",
        question: "If RED = 27 and BLUE = 32, then GREEN = ?",
        options: ["55", "59", "52", "58"],
        answerText: "55",
        correctIndex: 0,
        explanation: "Add the position of each letter in the alphabet.",
        testQuestionId: 8
      },
      {
        id: "fallback_9",
        category: "numerical_reasoning",
        question: "Find the next number: 1, 4, 9, 16, ?",
        options: ["20", "25", "24", "30"],
        answerText: "25",
        correctIndex: 1,
        explanation: "These are perfect squares: 1², 2², 3², 4², 5²",
        testQuestionId: 9
      },
      {
        id: "fallback_10",
        category: "logical_reasoning",
        question: "Which figure completes the pattern?",
        options: ["Circle", "Square", "Triangle", "Star"],
        answerText: "Triangle",
        correctIndex: 2,
        explanation: "The pattern alternates between geometric shapes.",
        testQuestionId: 10
      }
    ];
  }

  // Get test statistics
  getTestStatistics() {
    const categories = this.getCategories();
    const stats = {
      totalQuestions: this.questions.length,
      categories: categories.length,
      questionsPerCategory: {},
      totalPossibleTests: Math.floor(this.questions.length / 15)
    };

    categories.forEach(category => {
      stats.questionsPerCategory[category] = this.getQuestionsByCategory(category).length;
    });

    return stats;
  }

  // Get user progress
  getUserProgress(userId) {
    const testCount = this.getUserTestCount(userId);
    const remainingTests = this.getRemainingTests(userId);
    const totalPossibleTests = Math.floor(this.questions.length / 15);
    const progressPercentage = totalPossibleTests > 0 ? (testCount / totalPossibleTests) * 100 : 0;

    return {
      testCount,
      remainingTests,
      totalPossibleTests,
      progressPercentage,
      canTakeMoreTests: this.canUserTakeMoreTests(userId)
    };
  }
}

// Create singleton instance
const testService = new TestService();

export default testService; 