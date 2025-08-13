# Clerk OAuth Setup Guide

## 🚀 Quick Setup

### 1. Create a Clerk Account
- Go to [clerk.com](https://clerk.com)
- Sign up for a free account
- Create a new application

### 2. Get Your Publishable Key
- In your Clerk dashboard, go to API Keys
- Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### 3. Update the App
- Open `src/App.js`
- Replace `"pk_test_YOUR_CLERK_PUBLISHABLE_KEY"` with your actual publishable key

### 4. Configure OAuth Providers
In your Clerk dashboard:
- Go to **User & Authentication** → **Social Connections**
- Enable the providers you want (Google, GitHub, etc.)
- Configure the OAuth settings for each provider

### 5. Set Up Redirect URLs
Add these to your Clerk application settings:
- `http://localhost:3000/*` (for development)
- `https://yourdomain.com/*` (for production)

## 🎨 Features Included

✅ **Custom Styled Components**
- Premium glass morphism design
- Animated backgrounds and particles
- Responsive design for mobile/desktop

✅ **Authentication Features**
- Sign In with email/password
- Sign Up with email/password
- Social OAuth (Google, GitHub, etc.)
- User profile management
- Session persistence

✅ **UI Components**
- Custom SignIn page (`ClerkSignIn.js`)
- Custom SignUp page (`ClerkSignUp.js`)
- User avatar and name in header
- Logout functionality

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in your project root:
```
REACT_APP_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Then update `App.js`:
```javascript
<ClerkProvider publishableKey={process.env.REACT_APP_CLERK_PUBLISHABLE_KEY}>
```

### Custom Styling
The Clerk components are styled to match your premium design. You can customize the appearance in:
- `src/components/ClerkSignIn.js`
- `src/components/ClerkSignUp.js`

## 🎯 Free Tier Benefits

Clerk's free tier includes:
- 5,000 monthly active users
- Unlimited sign-ups and sign-ins
- Social OAuth providers
- User management dashboard
- Email verification
- Password reset functionality

## 🚀 Ready to Use!

Once you've added your publishable key, the authentication system will be fully functional with:
- Beautiful, premium-styled login/signup pages
- Social OAuth integration
- User session management
- Responsive design
- Animated backgrounds and effects

The app will automatically handle user authentication state and show the appropriate UI based on whether the user is logged in or not. 