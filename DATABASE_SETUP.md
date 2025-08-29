# 🗄️ Database Setup Guide for IQ Test App

## 🎯 **Quick Start (5 Minutes)**

### **Step 1: Setup MongoDB Atlas (Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with password
5. Get your connection string

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Configure Environment**
1. Copy `env.example` to `.env`
2. Add your MongoDB connection string:
```env
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/iqscalar?retryWrites=true&w=majority
```

### **Step 4: Migrate Data**
```bash
npm run migrate
```

### **Step 5: Test**
```bash
npm start
```

## 🚀 **Detailed Setup**

### **1. MongoDB Atlas Setup**

#### **Create Account & Cluster**
1. Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for free account
3. Choose "Build a Database"
4. Select "FREE" tier (M0)
5. Choose cloud provider (AWS/Google Cloud/Azure)
6. Choose region (closest to your users)
7. Click "Create"

#### **Configure Database Access**
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username and password (save these!)
5. Select "Read and write to any database"
6. Click "Add User"

#### **Configure Network Access**
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add specific IP addresses
5. Click "Confirm"

#### **Get Connection String**
1. Go to "Database" in left sidebar
2. Click "Connect"
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your actual password

### **2. Local Development Setup**

#### **Install Dependencies**
```bash
# Install MongoDB dependencies
npm install mongoose dotenv

# Install additional dependencies if needed
npm install express cors helmet
```

#### **Environment Configuration**
Create `.env` file in root directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/iqscalar?retryWrites=true&w=majority

# App Configuration
NODE_ENV=development
PORT=3000

# Optional: Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### **3. Data Migration**

#### **Run Migration Script**
```bash
# Migrate all existing questions to database
npm run migrate
```

#### **Verify Migration**
The script will show:
- ✅ Number of questions migrated
- ✅ Statistics by category
- ✅ Database indexes created
- ✅ Sample user created

### **4. Database Models**

#### **Available Models**
- **User**: User profiles, subscriptions, preferences
- **Question**: All IQ test questions with metadata
- **TestSession**: Test attempts and results
- **UserProgress**: Learning progress and analytics

#### **Key Features**
- **Automatic indexing** for fast queries
- **Data validation** and constraints
- **Virtual properties** for computed fields
- **Instance methods** for common operations

### **5. Performance Optimization**

#### **Database Indexes**
The migration automatically creates indexes for:
- Category-based queries
- Difficulty-based filtering
- Tag-based searches
- User-specific data

#### **Query Optimization**
- Questions are cached in memory for fast access
- User sessions are optimized for quick retrieval
- Analytics queries use aggregation pipelines

## 🔧 **Advanced Configuration**

### **Production Setup**

#### **Environment Variables**
```env
# Production MongoDB (with SSL)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/iqscalar?retryWrites=true&w=majority&ssl=true

# Security
NODE_ENV=production
JWT_SECRET=your_jwt_secret

# Performance
CACHE_TTL=3600
MAX_CONNECTIONS=10
```

#### **Connection Pooling**
```javascript
// In database.js
const conn = await mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
});
```

### **Backup Strategy**

#### **Automated Backups**
1. Enable MongoDB Atlas automated backups
2. Set retention period (7-30 days)
3. Configure point-in-time recovery

#### **Manual Backups**
```bash
# Export questions
mongoexport --uri="your_connection_string" --collection=questions --out=questions_backup.json

# Export users
mongoexport --uri="your_connection_string" --collection=users --out=users_backup.json
```

### **Monitoring & Analytics**

#### **MongoDB Atlas Monitoring**
- Database performance metrics
- Query performance analysis
- Connection monitoring
- Storage usage tracking

#### **Custom Analytics**
```javascript
// Track question performance
await Question.updateUsageStats(questionId, isCorrect);

// Get user analytics
const userStats = await TestSession.getUserBestScores(userId);
```

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **Connection Errors**
```bash
# Check if MongoDB URI is correct
echo $MONGODB_URI

# Test connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected!')).catch(console.error)"
```

#### **Migration Failures**
```bash
# Clear database and retry
npm run migrate -- --force

# Check question format
node scripts/validate-questions.js
```

#### **Performance Issues**
```bash
# Check database indexes
db.questions.getIndexes()

# Analyze slow queries
db.questions.find().explain("executionStats")
```

### **Support**

#### **MongoDB Atlas Support**
- 24/7 support for paid plans
- Community forums
- Documentation and tutorials

#### **Local Development**
- MongoDB Compass for GUI
- MongoDB Shell for CLI
- VS Code MongoDB extension

## 📊 **Database Statistics**

### **Expected Performance**
- **Questions**: 400+ questions, < 1ms query time
- **Users**: 10,000+ users, < 10ms query time
- **Sessions**: 100,000+ sessions, < 50ms query time
- **Storage**: ~50MB for 10,000 users

### **Scaling Considerations**
- **Read Replicas**: For high read loads
- **Sharding**: For very large datasets
- **Caching**: Redis for frequently accessed data
- **CDN**: For static assets and certificates

## 🎉 **Benefits of This Setup**

### **For Development**
- ✅ **Fast Setup**: 5-minute database setup
- ✅ **Free Tier**: No cost for development
- ✅ **Easy Migration**: One-command data migration
- ✅ **Local Development**: Full offline capability

### **For Production**
- ✅ **Scalable**: Handles millions of users
- ✅ **Reliable**: 99.9% uptime SLA
- ✅ **Secure**: Built-in security features
- ✅ **Monitored**: Real-time performance tracking

### **For Users**
- ✅ **Fast**: Sub-second response times
- ✅ **Reliable**: No data loss
- ✅ **Secure**: Encrypted data storage
- ✅ **Analytics**: Personalized insights

## 🚀 **Next Steps**

1. **Test the setup** with sample data
2. **Update services** to use database
3. **Deploy to production** with MongoDB Atlas
4. **Monitor performance** and optimize
5. **Scale as needed** with read replicas

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.

