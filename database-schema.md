# IQ Test App Database Schema Design

## 🗄️ Database: MongoDB + Mongoose

### 📊 Collections Structure:

## 1. **Users Collection**
```javascript
{
  _id: ObjectId,
  clerkUserId: String, // Clerk authentication ID
  email: String,
  fullName: String,
  profileImage: String,
  createdAt: Date,
  lastLogin: Date,
  subscription: {
    plan: String, // 'free', 'premium', 'pro'
    startDate: Date,
    endDate: Date,
    status: String // 'active', 'expired', 'cancelled'
  },
  preferences: {
    theme: String, // 'light', 'dark'
    notifications: Boolean,
    emailUpdates: Boolean
  }
}
```

## 2. **Questions Collection**
```javascript
{
  _id: ObjectId,
  questionId: String, // Unique identifier like 'iq_001', 'practice_001'
  category: String, // 'Verbal-Logical Reasoning', 'Numerical & Abstract Reasoning', 'Pattern Recognition'
  difficulty: Number, // 1-5 scale
  questionText: String,
  options: {
    A: String,
    B: String,
    C: String,
    D: String,
    E: String // Optional
  },
  correctAnswer: String, // 'A', 'B', 'C', 'D', 'E'
  explanation: String,
  tags: [String], // ['analogies', 'syllogisms', 'word-relationships']
  source: String, // 'fullIqQuestions', 'fullPracticeQuestions', 'mainIqQuestions', 'mainPracticeQuestions'
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date,
  usageCount: Number, // How many times used in tests
  successRate: Number // Percentage of correct answers
}
```

## 3. **Test Sessions Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  sessionId: String, // Unique session identifier
  testType: String, // 'iq_test', 'practice', 'learning_practice'
  category: String, // Specific category or 'mixed'
  questions: [{
    questionId: ObjectId, // Reference to Questions
    userAnswer: String, // 'A', 'B', 'C', 'D', 'E'
    isCorrect: Boolean,
    timeSpent: Number, // Seconds
    questionNumber: Number
  }],
  totalQuestions: Number,
  correctAnswers: Number,
  score: Number, // Percentage
  timeLimit: Number, // Minutes
  timeSpent: Number, // Total time in seconds
  startedAt: Date,
  completedAt: Date,
  status: String // 'in_progress', 'completed', 'abandoned'
}
```

## 4. **User Progress Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  category: String,
  totalTests: Number,
  averageScore: Number,
  bestScore: Number,
  totalQuestionsAnswered: Number,
  correctAnswers: Number,
  lastTestDate: Date,
  improvementTrend: Number, // Percentage improvement over time
  weakAreas: [String], // Categories where user struggles
  strongAreas: [String], // Categories where user excels
  learningPath: {
    currentLevel: Number, // 1-10
    completedTopics: [String],
    recommendedTopics: [String]
  }
}
```

## 5. **Learning Content Collection**
```javascript
{
  _id: ObjectId,
  topicId: String, // 'verbal-logical', 'numerical-abstract', 'pattern-recognition'
  title: String,
  icon: String,
  description: String,
  content: {
    overview: String,
    keyConcepts: [String],
    strategies: [String],
    examples: [{
      type: String,
      question: String,
      answer: String,
      explanation: String
    }]
  },
  difficulty: Number, // 1-5
  estimatedTime: Number, // Minutes
  prerequisites: [String], // Required topics
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 6. **Certificates Collection**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // Reference to Users
  certificateId: String, // Unique certificate identifier
  testSessionId: ObjectId, // Reference to Test Sessions
  score: Number,
  category: String,
  issuedAt: Date,
  expiresAt: Date, // Optional
  certificateUrl: String, // Generated certificate file URL
  isActive: Boolean
}
```

## 7. **Analytics Collection**
```javascript
{
  _id: ObjectId,
  date: Date,
  metrics: {
    totalUsers: Number,
    activeUsers: Number,
    testsCompleted: Number,
    averageScore: Number,
    popularCategories: [{
      category: String,
      count: Number
    }],
    questionPerformance: [{
      questionId: ObjectId,
      usageCount: Number,
      successRate: Number
    }]
  }
}
```

## 🔧 **Database Indexes for Optimization:**

```javascript
// Users Collection
db.users.createIndex({ "clerkUserId": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })

// Questions Collection
db.questions.createIndex({ "category": 1 })
db.questions.createIndex({ "difficulty": 1 })
db.questions.createIndex({ "tags": 1 })
db.questions.createIndex({ "isActive": 1 })
db.questions.createIndex({ "source": 1 })

// Test Sessions Collection
db.testSessions.createIndex({ "userId": 1 })
db.testSessions.createIndex({ "sessionId": 1 }, { unique: true })
db.testSessions.createIndex({ "testType": 1 })
db.testSessions.createIndex({ "startedAt": 1 })

// User Progress Collection
db.userProgress.createIndex({ "userId": 1, "category": 1 }, { unique: true })
db.userProgress.createIndex({ "userId": 1 })

// Learning Content Collection
db.learningContent.createIndex({ "topicId": 1 }, { unique: true })
db.learningContent.createIndex({ "isActive": 1 })

// Certificates Collection
db.certificates.createIndex({ "userId": 1 })
db.certificates.createIndex({ "certificateId": 1 }, { unique: true })
```

## 🚀 **Implementation Steps:**

1. **Setup MongoDB Atlas** (Free tier)
2. **Install Dependencies**: `npm install mongoose dotenv`
3. **Create Database Models** using Mongoose schemas
4. **Migrate Existing Data** from JSON files to MongoDB
5. **Update Services** to use database instead of local files
6. **Add Authentication** integration with Clerk
7. **Implement Caching** for frequently accessed data

## 💡 **Benefits of This Design:**

- **Scalable**: Can handle millions of users and questions
- **Flexible**: Easy to add new question types and categories
- **Analytics Ready**: Built-in tracking for insights
- **Performance Optimized**: Proper indexing for fast queries
- **Cost Effective**: MongoDB Atlas free tier is generous
- **Future Proof**: Easy to extend with new features

