const mongoose = require('mongoose');

const userAuthHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clerkUserId: {
    type: String,
    required: true,
    index: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['signup', 'login', 'logout', 'password_reset', 'email_verification', 'profile_update'],
    index: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    isMobile: Boolean
  },
  location: {
    country: String,
    city: String,
    timezone: String
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  success: {
    type: Boolean,
    default: true
  },
  errorMessage: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
userAuthHistorySchema.index({ userId: 1, timestamp: -1 });
userAuthHistorySchema.index({ clerkUserId: 1, timestamp: -1 });
userAuthHistorySchema.index({ eventType: 1, timestamp: -1 });
userAuthHistorySchema.index({ success: 1, timestamp: -1 });

// Static method to log authentication event
userAuthHistorySchema.statics.logEvent = function(data) {
  return this.create({
    userId: data.userId,
    clerkUserId: data.clerkUserId,
    eventType: data.eventType,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    deviceInfo: data.deviceInfo,
    location: data.location,
    metadata: data.metadata,
    success: data.success !== false,
    errorMessage: data.errorMessage
  });
};

// Static method to get user's authentication history
userAuthHistorySchema.statics.getUserHistory = function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('-__v');
};

// Static method to get login statistics
userAuthHistorySchema.statics.getLoginStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(userId),
        eventType: 'login',
        timestamp: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
        },
        loginCount: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to get failed login attempts
userAuthHistorySchema.statics.getFailedLogins = function(userId, hours = 24) {
  const startDate = new Date();
  startDate.setHours(startDate.getHours() - hours);

  return this.find({
    userId,
    eventType: 'login',
    success: false,
    timestamp: { $gte: startDate }
  }).sort({ timestamp: -1 });
};

module.exports = mongoose.model('UserAuthHistory', userAuthHistorySchema);
