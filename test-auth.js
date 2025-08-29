const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const UserAuthHistory = require('./src/models/UserAuthHistory');
const UserSession = require('./src/models/UserSession');
const AuthService = require('./src/services/authService');

// Mock request object
const mockRequest = {
  headers: {
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'x-forwarded-for': '192.168.1.1'
  },
  connection: { remoteAddress: '192.168.1.1' }
};

async function testAuthSystem() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Test data
    const testUserData = {
      clerkUserId: 'test_user_123',
      email: 'test@example.com',
      fullName: 'Test User',
      profileImage: 'https://example.com/avatar.jpg',
      signupMethod: 'email',
      emailVerified: true
    };

    console.log('\n📝 Testing user signup...');
    const user = await AuthService.logSignup(
      testUserData.clerkUserId,
      testUserData,
      mockRequest
    );
    console.log('✅ User created:', user.email);

    console.log('\n🔐 Testing user login...');
    const loginResult = await AuthService.logLogin(
      testUserData.clerkUserId,
      testUserData,
      mockRequest
    );
    console.log('✅ Login successful, session created:', loginResult.session.sessionId);

    console.log('\n📊 Testing statistics...');
    const authHistory = await AuthService.getAuthHistory(user._id, 10);
    console.log('✅ Auth history retrieved:', authHistory.length, 'events');

    const sessionStats = await AuthService.getSessionStats(user._id, 30);
    console.log('✅ Session stats retrieved:', sessionStats);

    const activeSessions = await AuthService.getActiveSessions(user._id);
    console.log('✅ Active sessions:', activeSessions.length);

    console.log('\n🚪 Testing logout...');
    const logoutResult = await AuthService.logLogout(
      testUserData.clerkUserId,
      loginResult.session.sessionId,
      mockRequest
    );
    console.log('✅ Logout successful');

    console.log('\n🧹 Testing cleanup...');
    const cleanupResult = await AuthService.cleanupExpiredSessions();
    console.log('✅ Cleanup completed:', cleanupResult.modifiedCount, 'sessions cleaned');

    console.log('\n📋 Final statistics:');
    const finalHistory = await AuthService.getAuthHistory(user._id, 20);
    console.log('Total auth events:', finalHistory.length);
    
    const eventTypes = finalHistory.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {});
    console.log('Event breakdown:', eventTypes);

    console.log('\n🎉 All tests passed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 MongoDB connection closed');
  }
}

// Run the test
testAuthSystem();
