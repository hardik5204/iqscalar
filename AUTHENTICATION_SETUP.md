# Authentication System Setup

This document explains how the authentication system works with MongoDB storage for user login, signup, and history tracking.

## Overview

The application uses Clerk for authentication but stores all user authentication events, sessions, and history in MongoDB for comprehensive tracking and analytics.

## Database Models

### 1. User Model (`src/models/User.js`)
Stores basic user information synced from Clerk:
- `clerkUserId`: Unique Clerk user ID
- `email`: User's email address
- `fullName`: User's full name
- `profileImage`: Profile picture URL
- `lastLogin`: Timestamp of last login
- `subscription`: Subscription details
- `preferences`: User preferences

### 2. UserAuthHistory Model (`src/models/UserAuthHistory.js`)
Tracks all authentication events:
- `userId`: Reference to User model
- `clerkUserId`: Clerk user ID
- `eventType`: Type of event (signup, login, logout, etc.)
- `ipAddress`: IP address of the request
- `userAgent`: Browser/device information
- `deviceInfo`: Parsed device details (browser, OS, device type)
- `location`: Geographic location (if available)
- `success`: Whether the event was successful
- `errorMessage`: Error details if failed
- `timestamp`: When the event occurred

### 3. UserSession Model (`src/models/UserSession.js`)
Manages active user sessions:
- `userId`: Reference to User model
- `clerkUserId`: Clerk user ID
- `sessionId`: Unique session identifier
- `clerkSessionId`: Clerk session ID
- `ipAddress`: IP address
- `userAgent`: Browser information
- `deviceInfo`: Device details
- `isActive`: Whether session is active
- `lastActivity`: Last activity timestamp
- `loginTime`: Session start time
- `logoutTime`: Session end time
- `sessionDuration`: Total session duration

## API Endpoints

### Authentication Events
- `POST /api/auth/signup` - Log user signup
- `POST /api/auth/login` - Log user login
- `POST /api/auth/logout` - Log user logout
- `POST /api/auth/failed-login` - Log failed login attempts
- `POST /api/auth/activity` - Update user activity

### User History & Analytics
- `GET /api/auth/history/:userId` - Get authentication history
- `GET /api/auth/sessions/:userId` - Get user sessions
- `GET /api/auth/stats/:userId` - Get authentication statistics
- `GET /api/auth/security/:userId` - Get security information
- `DELETE /api/auth/session/:sessionId` - End specific session
- `POST /api/auth/cleanup` - Cleanup expired sessions

## Frontend Integration

### AuthLogger Component (`src/components/AuthLogger.js`)
Automatically logs authentication events:
- Detects signup vs login events
- Tracks user activity
- Logs logout events on page unload
- Updates session activity

### AuthDashboard Component (`src/components/AuthDashboard.js`)
Displays authentication analytics:
- Recent activity timeline
- Active sessions
- Security score
- Failed login attempts
- Session statistics

## Setup Instructions

### 1. Environment Variables
Add these to your `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

### 2. Database Connection
The system automatically connects to MongoDB using the connection string in your environment variables.

### 3. API Integration
The AuthLogger component automatically calls the authentication API endpoints when users sign up, log in, or perform actions.

### 4. Dashboard Access
Add the AuthDashboard component to your app to display authentication analytics:
```jsx
import AuthDashboard from './components/AuthDashboard';

// In your app routing
<Route path="/auth-dashboard" component={AuthDashboard} />
```

## Features

### Automatic Event Logging
- Signup events with device information
- Login events with session creation
- Logout events with session termination
- Failed login attempts
- User activity tracking

### Security Features
- IP address tracking
- Device fingerprinting
- Session management
- Security scoring
- Failed attempt monitoring

### Analytics
- Login frequency analysis
- Session duration statistics
- Device usage patterns
- Geographic login patterns
- Security risk assessment

### Session Management
- Multiple active sessions tracking
- Automatic session cleanup
- Session duration calculation
- Activity monitoring

## Usage Examples

### Logging a Signup Event
```javascript
const userData = {
  clerkUserId: 'user_123',
  email: 'user@example.com',
  fullName: 'John Doe',
  signupMethod: 'email',
  emailVerified: true
};

await apiService.post('/auth/signup', userData);
```

### Getting User History
```javascript
const history = await apiService.get('/auth/history/userId?limit=50');
```

### Getting Security Information
```javascript
const security = await apiService.get('/auth/security/userId');
```

## Maintenance

### Regular Cleanup
Run session cleanup periodically:
```javascript
await apiService.post('/api/auth/cleanup');
```

### Database Indexes
The models include optimized indexes for efficient querying:
- User lookup by Clerk ID
- Authentication history by user and timestamp
- Session tracking by user and activity
- Event type filtering

## Security Considerations

1. **IP Address Storage**: Store IP addresses for security monitoring
2. **Session Management**: Track and manage multiple active sessions
3. **Failed Attempt Monitoring**: Monitor and alert on suspicious activity
4. **Data Retention**: Consider implementing data retention policies
5. **Privacy Compliance**: Ensure compliance with privacy regulations

## Troubleshooting

### Common Issues

1. **User Not Found**: Ensure Clerk user ID is properly synced
2. **Session Tracking**: Check if session IDs are being generated correctly
3. **Activity Updates**: Verify activity tracking is working
4. **Database Connection**: Ensure MongoDB connection is stable

### Debug Mode
Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Future Enhancements

- Real-time notifications for suspicious activity
- Advanced device fingerprinting
- Geographic anomaly detection
- Integration with security monitoring tools
- Automated security score improvements
