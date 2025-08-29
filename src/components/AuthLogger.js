import React, { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import apiService from '../services/apiService';

const AuthLogger = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();

  // Log authentication events to our database
  const logAuthEvent = async (eventType, additionalData = {}) => {
    if (!user) return;

    try {
      const userData = {
        clerkUserId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        profileImage: user.imageUrl,
        ...additionalData
      };

      const response = await apiService.post(`/auth/${eventType}`, userData);
      
      if (response.success) {
        console.log(`✅ ${eventType} event logged successfully`);
        
        // Store session ID for logout tracking
        if (eventType === 'login' && response.data?.sessionId) {
          localStorage.setItem('currentSessionId', response.data.sessionId);
        }
      }
    } catch (error) {
      console.error(`❌ Error logging ${eventType} event:`, error);
    }
  };

  // Log activity updates
  const logActivity = async () => {
    const sessionId = localStorage.getItem('currentSessionId');
    if (!sessionId) return;

    try {
      await apiService.post('/auth/activity', { sessionId });
    } catch (error) {
      console.error('❌ Error logging activity:', error);
    }
  };

  // Log signup event
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Check if this is a new user (first time signing in)
      const isNewUser = user.createdAt && 
        (new Date() - new Date(user.createdAt)) < 60000; // Within 1 minute of creation
      
      if (isNewUser) {
        logAuthEvent('signup', {
          signupMethod: user.externalAccounts?.length > 0 ? 'oauth' : 'email',
          emailVerified: user.emailAddresses?.[0]?.verification?.status === 'verified'
        });
      } else {
        // Regular login
        logAuthEvent('login', {
          loginMethod: user.externalAccounts?.length > 0 ? 'oauth' : 'email'
        });
      }
    }
  }, [isLoaded, isSignedIn, user]);

  // Set up activity tracking
  useEffect(() => {
    if (!isSignedIn) return;

    // Log activity every 5 minutes
    const activityInterval = setInterval(logActivity, 5 * 60 * 1000);

    // Log activity on page visibility change
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        logActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Log activity on user interaction
    const handleUserInteraction = () => {
      logActivity();
    };

    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
      document.addEventListener(event, handleUserInteraction, { passive: true });
    });

    return () => {
      clearInterval(activityInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, [isSignedIn]);

  // Log logout event when component unmounts or user signs out
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSignedIn && user) {
        const sessionId = localStorage.getItem('currentSessionId');
        if (sessionId) {
          // Use sendBeacon for reliable logout logging
          const data = JSON.stringify({
            clerkUserId: user.id,
            sessionId
          });
          
          navigator.sendBeacon('/api/auth/logout', data);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isSignedIn, user]);

  // This component doesn't render anything
  return null;
};

export default AuthLogger;
