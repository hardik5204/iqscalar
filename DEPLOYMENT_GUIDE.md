# Deployment Guide

## 🚀 GitHub Pages Deployment (Frontend)

Your React application is now configured for GitHub Pages deployment. The deployment will happen automatically when you push to the `main` branch.

### Current Status
- ✅ GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- ✅ Package.json configured with GitHub Pages homepage
- ✅ gh-pages package installed

### Frontend URL
Your application will be available at: **https://hardik5204.github.io/iqscalar**

### Automatic Deployment
The GitHub Actions workflow will:
1. Build your React application
2. Deploy it to GitHub Pages
3. Make it available at the URL above

## 🔧 Backend Deployment Options

Since your application has a Node.js/Express backend with MongoDB, you'll need to deploy the backend separately. Here are your options:

### Option 1: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NODE_ENV=production
   PORT=5001
   ```
4. Deploy the `server.js` file

### Option 2: Render
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: `npm install`
5. Set start command: `node server.js`
6. Add environment variables

### Option 3: Heroku
1. Create a Heroku account
2. Install Heroku CLI
3. Create a new app
4. Deploy using Git

## 🔗 Connecting Frontend to Backend

Once your backend is deployed, update the API URL in `src/services/apiService.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? 'https://your-backend-domain.com/api' : 'http://localhost:5001/api');
```

Replace `https://your-backend-domain.com` with your actual backend URL.

## 📋 Environment Variables

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-domain.com/api
```

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
NODE_ENV=production
PORT=5001
```

## 🔍 Testing Deployment

1. **Frontend**: Visit https://hardik5204.github.io/iqscalar
2. **Backend**: Test API endpoints at `https://your-backend-domain.com/api/health`

## 📊 Monitoring

- Check GitHub Actions tab for deployment status
- Monitor backend logs in your hosting platform
- Test authentication flow end-to-end

## 🛠️ Troubleshooting

### Frontend Issues
- Check GitHub Actions logs
- Verify build process locally: `npm run build`
- Check browser console for API errors

### Backend Issues
- Verify MongoDB connection
- Check environment variables
- Monitor server logs

## 🎯 Next Steps

1. Deploy your backend to a hosting service
2. Update the API URL in the frontend
3. Test the complete authentication flow
4. Monitor performance and logs

---

**Your GitHub Pages URL**: https://hardik5204.github.io/iqscalar
**Repository**: https://github.com/hardik5204/iqscalar
