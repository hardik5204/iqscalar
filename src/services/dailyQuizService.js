// Daily Quiz Service for managing daily questions

class DailyQuizService {
  constructor() {
    this.questions = [];
    this.storageKey = 'iqscalar_daily_quiz';
    this.loadQuestions();
  }

  // Load questions from the main IQ test dataset
  async loadQuestions() {
    try {
      const response = await fetch('/IQ_Test_Questions.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.questions = this.normalizeQuestions(data);
      console.log(`Daily Quiz: Loaded ${this.questions.length} questions`);
    } catch (error) {
      console.warn('Failed to load daily quiz questions:', error);
      this.questions = this.getFallbackQuestions();
    }
  }

  // Normalize questions to consistent format
  normalizeQuestions(data) {
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
        
        return {
          id: item.id ?? `daily_${idx}`,
          category: item.category || 'General',
          question: item.question_text || item.question || '',
          options,
          correctIndex,
          explanation: item.explanation || '',
          answerText: options[correctIndex] || ''
        };
      })
      .filter(q => q.question && Array.isArray(q.options) && q.options.length >= 2);
  }

  // Get today's date as a string (YYYY-MM-DD)
  getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  // Generate a deterministic random number based on date
  getDailyRandomSeed(date) {
    let hash = 0;
    const str = `iqscalar_daily_${date}`;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Get today's daily question
  getTodaysQuestion() {
    if (this.questions.length === 0) {
      return this.getFallbackQuestions()[0];
    }

    const today = this.getTodayString();
    const seed = this.getDailyRandomSeed(today);
    const questionIndex = seed % this.questions.length;
    
    const question = {
      ...this.questions[questionIndex],
      date: today,
      dailyQuizId: `daily_${today}_${questionIndex}`
    };

    return question;
  }

  // Get user's daily quiz data
  getDailyQuizData() {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  // Save user's daily quiz data
  saveDailyQuizData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Check if user has answered today's quiz
  hasAnsweredToday() {
    const data = this.getDailyQuizData();
    const today = this.getTodayString();
    return data[today] && data[today].answered === true;
  }

  // Submit user's answer for today's quiz
  submitAnswer(answerIndex) {
    const today = this.getTodayString();
    const question = this.getTodaysQuestion();
    const isCorrect = answerIndex === question.correctIndex;
    
    const data = this.getDailyQuizData();
    data[today] = {
      answered: true,
      answerIndex,
      isCorrect,
      question: question.question,
      correctIndex: question.correctIndex,
      explanation: question.explanation,
      timestamp: new Date().toISOString()
    };
    
    this.saveDailyQuizData(data);
    
    return {
      isCorrect,
      correctAnswer: question.options[question.correctIndex],
      explanation: question.explanation,
      userAnswer: question.options[answerIndex]
    };
  }

  // Get today's answer if already submitted
  getTodaysAnswer() {
    const data = this.getDailyQuizData();
    const today = this.getTodayString();
    return data[today] || null;
  }

  // Get user's daily quiz statistics
  getStats() {
    const data = this.getDailyQuizData();
    const entries = Object.values(data);
    
    const totalAnswered = entries.length;
    const correctAnswers = entries.filter(entry => entry.isCorrect).length;
    const currentStreak = this.getCurrentStreak();
    const bestStreak = this.getBestStreak();
    
    return {
      totalAnswered,
      correctAnswers,
      accuracy: totalAnswered > 0 ? Math.round((correctAnswers / totalAnswered) * 100) : 0,
      currentStreak,
      bestStreak
    };
  }

  // Calculate current streak of correct answers
  getCurrentStreak() {
    const data = this.getDailyQuizData();
    const today = new Date();
    let streak = 0;
    
    // Check backwards from today
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = data[dateStr];
      if (!dayData || !dayData.answered) {
        // If we hit a day that wasn't answered, stop counting
        if (i > 0) break;
      } else if (dayData.isCorrect) {
        streak++;
      } else {
        // Incorrect answer breaks the streak
        break;
      }
    }
    
    return streak;
  }

  // Calculate best streak ever
  getBestStreak() {
    const data = this.getDailyQuizData();
    const dates = Object.keys(data).sort();
    
    let bestStreak = 0;
    let currentStreak = 0;
    
    for (const date of dates) {
      const dayData = data[date];
      if (dayData.answered && dayData.isCorrect) {
        currentStreak++;
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }
    
    return bestStreak;
  }

  // Fallback questions if main dataset fails to load
  getFallbackQuestions() {
    return [
      {
        id: "daily_fallback_1",
        category: "Logical Reasoning",
        question: "If all cats are animals and some animals are pets, which of the following must be true?",
        options: [
          "All cats are pets",
          "Some cats might be pets", 
          "No cats are pets",
          "All pets are cats"
        ],
        correctIndex: 1,
        explanation: "Since all cats are animals and some animals are pets, it's possible that some cats are among those animals that are pets, but it's not guaranteed that all cats are pets.",
        answerText: "Some cats might be pets"
      },
      {
        id: "daily_fallback_2", 
        category: "Numerical Reasoning",
        question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
        options: ["40", "42", "44", "46"],
        correctIndex: 1,
        explanation: "The differences between consecutive terms are 4, 6, 8, 10, so the next difference should be 12. 30 + 12 = 42.",
        answerText: "42"
      }
    ];
  }
}

// Create singleton instance
const dailyQuizService = new DailyQuizService();

export default dailyQuizService;
