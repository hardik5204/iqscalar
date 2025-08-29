const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkUserId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  fullName: {
    type: String,
    required: true
  },
  profileImage: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'pro'],
      default: 'free'
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'expired', 'cancelled'],
      default: 'active'
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    emailUpdates: {
      type: Boolean,
      default: true
    }
  }
}, {
  timestamps: true
});

// Update lastLogin on save
userSchema.pre('save', function(next) {
  this.lastLogin = new Date();
  next();
});

// Virtual for subscription status
userSchema.virtual('isSubscriptionActive').get(function() {
  if (this.subscription.plan === 'free') return true;
  if (this.subscription.status !== 'active') return false;
  if (!this.subscription.endDate) return true;
  return this.subscription.endDate > new Date();
});

// Method to update subscription
userSchema.methods.updateSubscription = function(plan, months = 1) {
  this.subscription.plan = plan;
  this.subscription.status = 'active';
  this.subscription.startDate = new Date();
  this.subscription.endDate = new Date();
  this.subscription.endDate.setMonth(this.subscription.endDate.getMonth() + months);
  return this.save();
};

// Method to get user stats
userSchema.methods.getStats = function() {
  return {
    userId: this._id,
    email: this.email,
    fullName: this.fullName,
    subscription: this.subscription,
    isSubscriptionActive: this.isSubscriptionActive,
    createdAt: this.createdAt,
    lastLogin: this.lastLogin
  };
};

module.exports = mongoose.model('User', userSchema);

