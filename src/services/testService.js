// Enhanced Test Service for managing IQ test questions and generating truly randomized, unique tests
import { iqQuestions } from '../data/fullIqQuestions.js';
import { practiceQuestions } from '../data/fullPracticeQuestions.js';
import { iqQuestions as mainIqQuestions } from '../data/iqQuestions.js';
import { practiceQuestions as mainPracticeQuestions } from '../data/practiceQuestions.js';

class TestService {
  constructor() {
    this.allQuestions = [];
    this.userTestHistory = new Map(); // Track user's test history
    this.loadAllQuestions();
  }

  loadAllQuestions() {
    try {
      // Combine all question sources for maximum variety
      const allSources = [
        { source: 'fullIqQuestions', data: iqQuestions },
        { source: 'fullPracticeQuestions', data: practiceQuestions },
        { source: 'mainIqQuestions', data: mainIqQuestions },
        { source: 'mainPracticeQuestions', data: mainPracticeQuestions }
      ];

      this.allQuestions = [];
      const seenIds = new Set();

      allSources.forEach(({ source, data }) => {
        if (data && Array.isArray(data)) {
          const normalized = this.normalizeQuestionFormat(data, source);
          normalized.forEach(question => {
            // Create unique ID to avoid conflicts between sources
            const uniqueId = `${source}_${question.id}`;
            if (!seenIds.has(uniqueId)) {
              seenIds.add(uniqueId);
              this.allQuestions.push({
                ...question,
                id: uniqueId,
                source: source
              });
            }
          });
        }
      });

      // Remove any duplicates based on question content
      this.allQuestions = this.removeDuplicateQuestions(this.allQuestions);
      
      console.log(`Loaded ${this.allQuestions.length} unique questions from all sources`);
      console.log('Question distribution:', this.getQuestionDistribution());
      
    } catch (error) {
      console.error('Failed to load questions from all sources:', error);
      this.allQuestions = this.getFallbackQuestions();
    }
  }

  // Remove duplicate questions based on content similarity
  removeDuplicateQuestions(questions) {
    const uniqueQuestions = [];
    const seenContent = new Set();

    questions.forEach(question => {
      // Create a content hash based on question text and options
      const contentHash = this.createContentHash(question);
      
      if (!seenContent.has(contentHash)) {
        seenContent.add(contentHash);
        uniqueQuestions.push(question);
      }
    });

    return uniqueQuestions;
  }

  // Create a hash based on question content for duplicate detection
  createContentHash(question) {
    const questionText = question.question?.toLowerCase().replace(/\s+/g, ' ').trim();
    const options = question.options?.map(opt => opt.toLowerCase().replace(/\s+/g, ' ').trim()).sort().join('|');
    return `${questionText}|${options}`;
  }

  // Get distribution of questions by source and category
  getQuestionDistribution() {
    const distribution = {};
    this.allQuestions.forEach(question => {
      if (!distribution[question.source]) {
        distribution[question.source] = {};
      }
      if (!distribution[question.source][question.category]) {
        distribution[question.source][question.category] = 0;
      }
      distribution[question.source][question.category]++;
    });
    return distribution;
  }

  // Normalize question format from different sources
  normalizeQuestionFormat(data, source) {
    return data
      .filter(Boolean)
      .map((item, idx) => {
        // Handle different question formats
        const questionText = item.question_text || item.question || '';
        const options = this.extractOptions(item);
        const answer = this.extractAnswer(item, options);
        
        if (!questionText || options.length < 2) {
          return null;
        }

        return {
          id: item.id ?? `${source}_${idx}`,
          category: item.category || 'General',
          question: questionText,
          options: options,
          answerText: answer.text,
          correctIndex: answer.index,
          explanation: item.explanation || '',
          source: source
        };
      })
      .filter(Boolean);
  }

  // Extract options from different question formats
  extractOptions(item) {
    if (item.options && typeof item.options === 'object') {
      // Handle object format: { A: "option1", B: "option2", ... }
      if (!Array.isArray(item.options)) {
        return Object.values(item.options).filter(opt => typeof opt === 'string');
      }
      // Handle array format: ["option1", "option2", ...]
      return item.options.filter(opt => typeof opt === 'string');
    }
    return [];
  }

  // Extract answer from different question formats
  extractAnswer(item, options) {
    if (item.answer && typeof item.answer === 'string') {
      // Handle letter format: "A", "B", "C", etc.
      const letterIndex = ['A', 'B', 'C', 'D', 'E'].indexOf(item.answer.toUpperCase());
      if (letterIndex >= 0 && letterIndex < options.length) {
        return {
          text: options[letterIndex],
          index: letterIndex
        };
      }
      
      // Handle direct text answer
      const textIndex = options.findIndex(opt => opt === item.answer);
      if (textIndex >= 0) {
        return {
          text: item.answer,
          index: textIndex
        };
      }
    }
    
    // Fallback to first option
    return {
      text: options[0] || '',
      index: 0
    };
  }

  // Get questions by category
  getQuestionsByCategory(category) {
    return this.allQuestions.filter(q => q.category === category);
  }

  // Get all available categories
  getCategories() {
    const categories = [...new Set(this.allQuestions.map(q => q.category))];
    return categories.sort();
  }

  // Generate a truly randomized test with questions from all sources
  generateTest(userId = 'anonymous', numQuestions = 15) {
    if (this.allQuestions.length === 0) {
      console.warn('Questions not loaded yet');
      return this.getFallbackQuestions().slice(0, numQuestions);
    }

    // Get user's previously used questions
    const usedIds = new Set(this.getUserUsedQuestions(userId));
    let available = this.allQuestions.filter(q => !usedIds.has(q.id));

    // If not enough available questions, reset user history
    if (available.length < numQuestions) {
      console.log(`Not enough unused questions (${available.length}), resetting user history`);
      this.resetUserHistory(userId);
      available = this.allQuestions;
    }

    // Create a balanced test with questions from different categories
    const selected = this.generateBalancedTest(available, numQuestions);

    // Mark questions as used for this user
    this.markQuestionsAsUsed(userId, selected.map(q => q.id));

    // Add test metadata
    return selected.map((q, idx) => ({
      ...q,
      testQuestionId: idx + 1,
      userAnswer: null,
      isCorrect: null,
      questionNumber: idx + 1
    }));
  }

  // Generate a balanced test with questions from different categories
  generateBalancedTest(availableQuestions, numQuestions) {
    const categories = this.getCategories();
    const selected = [];

    // Calculate how many questions to take from each category
    const questionsPerCategory = this.calculateQuestionsPerCategory(categories, numQuestions);

    // Select questions from each category
    categories.forEach(category => {
      const categoryQuestions = availableQuestions.filter(q => q.category === category);
      const targetCount = questionsPerCategory[category] || 0;
      
      if (categoryQuestions.length > 0 && targetCount > 0) {
        const shuffled = this.shuffleArray(categoryQuestions);
        const taken = shuffled.slice(0, Math.min(targetCount, categoryQuestions.length));
        selected.push(...taken);
      }
    });

    // If we don't have enough questions, fill with random questions from any category
    if (selected.length < numQuestions) {
      const remaining = availableQuestions.filter(q => !selected.find(s => s.id === q.id));
      const shuffled = this.shuffleArray(remaining);
      const additional = shuffled.slice(0, numQuestions - selected.length);
      selected.push(...additional);
    }

    // Final shuffle to randomize the order
    return this.shuffleArray(selected).slice(0, numQuestions);
  }

  // Calculate how many questions to take from each category
  calculateQuestionsPerCategory(categories, totalQuestions) {
    const distribution = {};
    const basePerCategory = Math.floor(totalQuestions / categories.length);
    const remainder = totalQuestions % categories.length;

    categories.forEach((category, index) => {
      distribution[category] = basePerCategory + (index < remainder ? 1 : 0);
    });

    return distribution;
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
    const totalPossibleTests = Math.floor(this.allQuestions.length / 15);
    return testCount < totalPossibleTests;
  }

  // Get remaining tests for user
  getRemainingTests(userId) {
    const testCount = this.getUserTestCount(userId);
    const totalPossibleTests = Math.floor(this.allQuestions.length / 15);
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
      testId: this.generateTestId(),
      questionSources: this.getQuestionSources(testQuestions)
    };
  }

  // Get distribution of question sources in the test
  getQuestionSources(testQuestions) {
    const sources = {};
    testQuestions.forEach(q => {
      sources[q.source] = (sources[q.source] || 0) + 1;
    });
    return sources;
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

  // Enhanced shuffle array (Fisher-Yates algorithm with additional randomization)
  shuffleArray(array) {
    const shuffled = [...array];
    // Multiple passes for better randomization
    for (let pass = 0; pass < 3; pass++) {
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
    }
    return shuffled;
  }

  // Fallback questions if all sources fail
  getFallbackQuestions() {
    return [
      {
        id: "fallback_1",
        category: "Numerical & Abstract Reasoning",
        question: "What is the missing number in the sequence: 2, 4, 6, 8, ?",
        options: ["9", "10", "12", "14"],
        answerText: "10",
        correctIndex: 1,
        explanation: "The sequence increases by 2 each time.",
        testQuestionId: 1,
        source: "fallback"
      },
      {
        id: "fallback_2",
        category: "Verbal-Logical Reasoning",
        question: "If all Bloops are Razzles and all Razzles are Lazzles, then all Bloops are definitely Lazzles.",
        options: ["True", "False", "Cannot be determined", "Sometimes true"],
        answerText: "True",
        correctIndex: 0,
        explanation: "This is a logical syllogism.",
        testQuestionId: 2,
        source: "fallback"
      },
      {
        id: "fallback_3",
        category: "Pattern Recognition",
        question: "Find the missing number: 5, 10, 15, ?, 25",
        options: ["16", "20", "18", "22"],
        answerText: "20",
        correctIndex: 1,
        explanation: "The sequence increases by 5 each time.",
        testQuestionId: 3,
        source: "fallback"
      }
    ];
  }

  // Get comprehensive test statistics
  getTestStatistics() {
    const categories = this.getCategories();
    const distribution = this.getQuestionDistribution();
    
    const stats = {
      totalQuestions: this.allQuestions.length,
      categories: categories.length,
      questionsPerCategory: {},
      totalPossibleTests: Math.floor(this.allQuestions.length / 15),
      questionSources: Object.keys(distribution),
      sourceDistribution: distribution
    };

    categories.forEach(category => {
      stats.questionsPerCategory[category] = this.getQuestionsByCategory(category).length;
    });

    return stats;
  }

  // Get user progress with enhanced information
  getUserProgress(userId) {
    const testCount = this.getUserTestCount(userId);
    const remainingTests = this.getRemainingTests(userId);
    const totalPossibleTests = Math.floor(this.allQuestions.length / 15);
    const progressPercentage = totalPossibleTests > 0 ? (testCount / totalPossibleTests) * 100 : 0;

    return {
      testCount,
      remainingTests,
      totalPossibleTests,
      progressPercentage,
      canTakeMoreTests: this.canUserTakeMoreTests(userId),
      totalAvailableQuestions: this.allQuestions.length,
      categoriesAvailable: this.getCategories()
    };
  }

  // Get a random sample of questions for preview
  getRandomSample(numQuestions = 5) {
    if (this.allQuestions.length === 0) {
      return this.getFallbackQuestions().slice(0, numQuestions);
    }
    
    const shuffled = this.shuffleArray(this.allQuestions);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }
}

// Create singleton instance
const testService = new TestService();

export default testService; 