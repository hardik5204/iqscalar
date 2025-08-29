import userService from './userService.js';
import practiceQuestions from '../data/fullPracticeQuestions.js';
import { practiceQuestions as mainPracticeQuestions } from '../data/practiceQuestions.js';
import { iqQuestions as mainIqQuestions } from '../data/iqQuestions.js';

class PracticeService {
  constructor() {
    this.allPracticeQuestions = [];
    this.userPracticeHistory = new Map();
    this.loadAllPracticeQuestions();
  }

  // Load practice questions from all available sources
  loadAllPracticeQuestions() {
    try {
      // Combine all question sources for maximum variety
      const allSources = [
        { source: 'fullPracticeQuestions', data: practiceQuestions },
        { source: 'mainPracticeQuestions', data: mainPracticeQuestions },
        { source: 'mainIqQuestions', data: mainIqQuestions }
      ];

      this.allPracticeQuestions = [];
      const seenIds = new Set();

      allSources.forEach(({ source, data }) => {
        if (data && Array.isArray(data)) {
          const normalized = this.normalizePracticeFormat(data, source);
          normalized.forEach(question => {
            // Create unique ID to avoid conflicts between sources
            const uniqueId = `${source}_${question.id}`;
            if (!seenIds.has(uniqueId)) {
              seenIds.add(uniqueId);
              this.allPracticeQuestions.push({
                ...question,
                id: uniqueId,
                source: source
              });
            }
          });
        }
      });

      // Remove any duplicates based on question content
      this.allPracticeQuestions = this.removeDuplicateQuestions(this.allPracticeQuestions);
      
      console.log(`Loaded ${this.allPracticeQuestions.length} unique practice questions from all sources`);
      console.log('Practice question distribution:', this.getQuestionDistribution());
      
    } catch (error) {
      console.error('Error loading practice questions:', error);
      this.allPracticeQuestions = this.getFallbackPracticeQuestions();
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
    this.allPracticeQuestions.forEach(question => {
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

  // Normalize practice question format from different sources
  normalizePracticeFormat(questions, source) {
    return questions.map((q, idx) => {
      // Handle different question formats
      const questionText = q.question_text || q.question || '';
      const options = this.extractOptions(q);
      const answer = this.extractAnswer(q, options);
      
      if (!questionText || options.length < 2) {
        return null;
      }

      return {
        id: q.id ?? `${source}_${idx}`,
        category: q.category || 'General',
        question: questionText,
        options: options,
        answerText: answer.text,
        correctIndex: answer.index,
        explanation: q.explanation || '',
        source: source
      };
    }).filter(Boolean);
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
    return this.allPracticeQuestions.filter(q => q.category === category);
  }

  // Get all available categories
  getCategories() {
    const categories = [...new Set(this.allPracticeQuestions.map(q => q.category))];
    return categories.sort();
  }

  // Generate truly randomized practice questions
  generatePracticeQuestions(category = null, numQuestions = 10) {
    if (this.allPracticeQuestions.length === 0) {
      console.warn('Practice questions not loaded yet');
      return this.getFallbackPracticeQuestions().slice(0, numQuestions);
    }

    let availableQuestions = this.allPracticeQuestions;
    
    // Filter by category if specified
    if (category) {
      availableQuestions = this.getQuestionsByCategory(category);
    }

    // Enhanced shuffling for better randomization
    const shuffled = this.shuffleArray(availableQuestions);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }

  // Generate balanced practice questions from multiple categories
  generateBalancedPracticeQuestions(numQuestions = 15) {
    if (this.allPracticeQuestions.length === 0) {
      return this.getFallbackPracticeQuestions().slice(0, numQuestions);
    }

    const categories = this.getCategories();
    const selected = [];

    // Calculate how many questions to take from each category
    const questionsPerCategory = this.calculateQuestionsPerCategory(categories, numQuestions);

    // Select questions from each category
    categories.forEach(category => {
      const categoryQuestions = this.getQuestionsByCategory(category);
      const targetCount = questionsPerCategory[category] || 0;
      
      if (categoryQuestions.length > 0 && targetCount > 0) {
        const shuffled = this.shuffleArray(categoryQuestions);
        const taken = shuffled.slice(0, Math.min(targetCount, categoryQuestions.length));
        selected.push(...taken);
      }
    });

    // If we don't have enough questions, fill with random questions from any category
    if (selected.length < numQuestions) {
      const remaining = this.allPracticeQuestions.filter(q => !selected.find(s => s.id === q.id));
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
      isPractice: true,
      questionSources: this.getQuestionSources(practiceQuestions)
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

  // Get distribution of question sources in the practice session
  getQuestionSources(practiceQuestions) {
    const sources = {};
    practiceQuestions.forEach(q => {
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

  // Fallback practice questions if all sources fail
  getFallbackPracticeQuestions() {
    return [
      {
        id: "fallback_practice_1",
        category: "Verbal-Logical Reasoning",
        question: "Which word best completes the analogy: HAPPY is to SAD as JOY is to _______?",
        options: ["Sorrow", "Anger", "Fear", "Love", "Peace"],
        answerText: "Sorrow",
        correctIndex: 0,
        explanation: "Happy and sad are opposites. Joy and sorrow are also opposites.",
        source: "fallback"
      },
      {
        id: "fallback_practice_2",
        category: "Numerical & Abstract Reasoning",
        question: "What number comes next in the sequence: 2, 4, 8, 16, 32, ?",
        options: ["48", "56", "64", "72", "80"],
        answerText: "64",
        correctIndex: 2,
        explanation: "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32, 32×2=64.",
        source: "fallback"
      },
      {
        id: "fallback_practice_3",
        category: "Pattern Recognition",
        question: "Complete the pattern: 1, 3, 6, 10, 15, ?",
        options: ["18", "20", "21", "24", "25"],
        answerText: "21",
        correctIndex: 2,
        explanation: "This is the sequence of triangular numbers. Each number is the sum of consecutive integers starting from 1.",
        source: "fallback"
      }
    ];
  }

  // Get comprehensive practice statistics
  getPracticeStatistics() {
    const categories = this.getCategories();
    const distribution = this.getQuestionDistribution();
    
    return {
      totalQuestions: this.allPracticeQuestions.length,
      categories: categories,
      questionsPerCategory: categories.map(category => ({
        category,
        count: this.getQuestionsByCategory(category).length
      })),
      questionSources: Object.keys(distribution),
      sourceDistribution: distribution
    };
  }

  // Get a random sample of practice questions for preview
  getRandomSample(numQuestions = 5) {
    if (this.allPracticeQuestions.length === 0) {
      return this.getFallbackPracticeQuestions().slice(0, numQuestions);
    }
    
    const shuffled = this.shuffleArray(this.allPracticeQuestions);
    return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
  }
}

const practiceService = new PracticeService();
export default practiceService; 