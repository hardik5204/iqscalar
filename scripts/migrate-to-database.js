#!/usr/bin/env node

require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../src/models/Question');
const User = require('../src/models/User');
const TestSession = require('../src/models/TestSession');

// Import existing question data - using dynamic import for ES6 modules
let iqQuestions, practiceQuestions, mainIqQuestions, mainPracticeQuestions;

const loadQuestionData = async () => {
  try {
    // Dynamic imports for ES6 modules
    const fullIqModule = await import('../src/data/fullIqQuestions.js');
    const fullPracticeModule = await import('../src/data/fullPracticeQuestions.js');
    const mainIqModule = await import('../src/data/iqQuestions.js');
    const mainPracticeModule = await import('../src/data/practiceQuestions.js');
    
    iqQuestions = fullIqModule.iqQuestions;
    practiceQuestions = fullPracticeModule.default;
    mainIqQuestions = mainIqModule.iqQuestions;
    mainPracticeQuestions = mainPracticeModule.practiceQuestions;
    
    console.log('✅ Question data loaded successfully');
  } catch (error) {
    console.error('❌ Error loading question data:', error);
    throw error;
  }
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected for migration');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Normalize question format
const normalizeQuestion = (question, source, index) => {
  const questionId = `${source}_${index + 1}`;
  
  // Handle different question formats
  const questionText = question.question_text || question.question || '';
  const options = question.options || {};
  const answer = question.answer || '';
  const explanation = question.explanation || '';
  
  // Extract options
  const normalizedOptions = {
    A: options.A || options[0] || '',
    B: options.B || options[1] || '',
    C: options.C || options[2] || '',
    D: options.D || options[3] || '',
  };
  
  // Add option E if it exists
  if (options.E || options[4]) {
    normalizedOptions.E = options.E || options[4];
  }
  
  // Determine correct answer
  let correctAnswer = answer;
  if (typeof answer === 'string') {
    // Handle multiple answers like "A, B, C" - take the first one
    if (answer.includes(',')) {
      correctAnswer = answer.split(',')[0].trim().toUpperCase();
    } else if (answer.length === 1) {
      correctAnswer = answer.toUpperCase();
    } else {
      // Find the index of the correct answer in options
      const answerIndex = Object.values(normalizedOptions).findIndex(opt => opt === answer);
      if (answerIndex >= 0) {
        correctAnswer = String.fromCharCode(65 + answerIndex);
      }
    }
  }
  
  // Validate correct answer is a single letter A-E
  if (!['A', 'B', 'C', 'D', 'E'].includes(correctAnswer)) {
    correctAnswer = 'A'; // Default fallback
  }
  
  // Generate tags based on category
  const tags = [];
  if (question.category) {
    const category = question.category.toLowerCase();
    if (category.includes('verbal') || category.includes('logical')) {
      tags.push('verbal-reasoning', 'logical-thinking');
    }
    if (category.includes('numerical') || category.includes('abstract')) {
      tags.push('numerical-reasoning', 'mathematical-thinking');
    }
    if (category.includes('pattern')) {
      tags.push('pattern-recognition', 'visual-thinking');
    }
  }
  
  return {
    questionId,
    category: question.category || 'General',
    difficulty: 3, // Default difficulty
    questionText,
    options: normalizedOptions,
    correctAnswer,
    explanation,
    tags,
    source,
    isActive: true,
    usageCount: 0,
    successRate: 0
  };
};

// Migrate questions
const migrateQuestions = async () => {
  try {
    console.log('🔄 Starting question migration...');
    
    // Clear existing questions
    await Question.deleteMany({});
    console.log('✅ Cleared existing questions');
    
    const allQuestions = [];
    let questionIndex = 0;
    
    // Process full IQ questions
    console.log('📝 Processing full IQ questions...');
    iqQuestions.forEach(question => {
      const normalized = normalizeQuestion(question, 'fullIqQuestions', questionIndex++);
      allQuestions.push(normalized);
    });
    
    // Process full practice questions
    console.log('📝 Processing full practice questions...');
    practiceQuestions.forEach(question => {
      const normalized = normalizeQuestion(question, 'fullPracticeQuestions', questionIndex++);
      allQuestions.push(normalized);
    });
    
    // Process main IQ questions
    console.log('📝 Processing main IQ questions...');
    mainIqQuestions.forEach(question => {
      const normalized = normalizeQuestion(question, 'mainIqQuestions', questionIndex++);
      allQuestions.push(normalized);
    });
    
    // Process main practice questions
    console.log('📝 Processing main practice questions...');
    mainPracticeQuestions.forEach(question => {
      const normalized = normalizeQuestion(question, 'mainPracticeQuestions', questionIndex++);
      allQuestions.push(normalized);
    });
    
    // Remove duplicates based on question text
    const uniqueQuestions = [];
    const seenQuestions = new Set();
    
    allQuestions.forEach(question => {
      const questionHash = question.questionText.toLowerCase().replace(/\s+/g, ' ').trim();
      if (!seenQuestions.has(questionHash)) {
        seenQuestions.add(questionHash);
        uniqueQuestions.push(question);
      }
    });
    
    console.log(`📊 Found ${allQuestions.length} total questions, ${uniqueQuestions.length} unique questions`);
    
    // Insert questions into database
    console.log('💾 Inserting questions into database...');
    const insertedQuestions = await Question.insertMany(uniqueQuestions);
    
    console.log(`✅ Successfully migrated ${insertedQuestions.length} questions to database`);
    
    // Create indexes
    console.log('🔧 Creating database indexes...');
    await Question.collection.createIndex({ category: 1, difficulty: 1, isActive: 1 });
    await Question.collection.createIndex({ tags: 1, isActive: 1 });
    await Question.collection.createIndex({ source: 1, isActive: 1 });
    
    console.log('✅ Database indexes created');
    
    // Show statistics
    const stats = await Question.aggregate([
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        avgDifficulty: { $avg: '$difficulty' }
      }},
      { $sort: { count: -1 } }
    ]);
    
    console.log('\n📈 Migration Statistics:');
    stats.forEach(stat => {
      console.log(`  ${stat._id}: ${stat.count} questions (avg difficulty: ${stat.avgDifficulty.toFixed(1)})`);
    });
    
    return insertedQuestions;
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Create sample user for testing
const createSampleUser = async () => {
  try {
    const existingUser = await User.findOne({ email: 'test@iqscalar.com' });
    if (existingUser) {
      console.log('✅ Sample user already exists');
      return existingUser;
    }
    
    const sampleUser = new User({
      clerkUserId: 'sample_user_123',
      email: 'test@iqscalar.com',
      fullName: 'Test User',
      subscription: {
        plan: 'free',
        status: 'active'
      },
      preferences: {
        theme: 'light',
        notifications: true,
        emailUpdates: true
      }
    });
    
    await sampleUser.save();
    console.log('✅ Sample user created');
    return sampleUser;
  } catch (error) {
    console.error('❌ Failed to create sample user:', error);
    throw error;
  }
};

// Main migration function
const runMigration = async () => {
  try {
    await connectDB();
    
    console.log('🚀 Starting database migration...\n');
    
    // Load question data first
    await loadQuestionData();
    
    // Migrate questions
    await migrateQuestions();
    
    // Create sample user
    await createSampleUser();
    
    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('  1. Update your services to use database instead of local files');
    console.log('  2. Test the application with the new database');
    console.log('  3. Deploy to production with MongoDB Atlas');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  }
};

// Run migration if this script is executed directly
if (require.main === module) {
  runMigration();
}

module.exports = { runMigration, migrateQuestions, createSampleUser };
