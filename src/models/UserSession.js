const mongoose = require('mongoose');

const userSessionSchema = new mongoose.Schema({
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
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  clerkSessionId: {
    type: String,
    required: true,
    index: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  deviceInfo: {
    browser: String,
    os: String,
    device: String,
    isMobile: Boolean,
    screenResolution: String
  },
  location: {
    country: String,
    city: String,
    timezone: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastActivity: {
    type: Date,
    default: Date.now,
    index: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: {
    type: Date,
    default: null
  },
  sessionDuration: {
    type: Number, // in seconds
    default: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
userSessionSchema.index({ userId: 1, isActive: 1 });
userSessionSchema.index({ clerkUserId: 1, isActive: 1 });
userSessionSchema.index({ lastActivity: -1 });
userSessionSchema.index({ loginTime: -1 });

// Method to update last activity
userSessionSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Method to end session
userSessionSchema.methods.endSession = function() {
  this.isActive = false;
  this.logoutTime = new Date();
  this.sessionDuration = Math.floor((this.logoutTime - this.loginTime) / 1000);
  return this.save();
};

// Static method to create new session
userSessionSchema.statics.createSession = function(data) {
  return this.create({
    userId: data.userId,
    clerkUserId: data.clerkUserId,
    sessionId: data.sessionId,
    clerkSessionId: data.clerkSessionId,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    deviceInfo: data.deviceInfo,
    location: data.location,
    metadata: data.metadata
  });
};

// Static method to get active sessions for user
userSessionSchema.statics.getActiveSessions = function(userId) {
  return this.find({ userId, isActive: true })
    .sort({ lastActivity: -1 });
};

// Static method to get session statistics
userSessionSchema.statics.getSessionStats = function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return this.aggregate([
    { 
      $match: { 
        userId: new mongoose.Types.ObjectId(userId),
        loginTime: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        averageSessionDuration: { $avg: '$sessionDuration' },
        totalSessionTime: { $sum: '$sessionDuration' },
        longestSession: { $max: '$sessionDuration' }
      }
    }
  ]);
};

// Static method to cleanup expired sessions (older than 24 hours)
userSessionSchema.statics.cleanupExpiredSessions = function() {
  const cutoffTime = new Date();
  cutoffTime.setHours(cutoffTime.getHours() - 24);

  return this.updateMany(
    { 
      isActive: true, 
      lastActivity: { $lt: cutoffTime } 
    },
    { 
      $set: { 
        isActive: false,
        logoutTime: new Date()
      }
    }
  );
};

module.exports = mongoose.model('UserSession', userSessionSchema);
