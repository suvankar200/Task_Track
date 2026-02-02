# Track Guide - Deployment Guide

## Deployment Options

### Option 1: Docker Deployment (Recommended for Production)

#### Prerequisites

- Docker and Docker Compose installed
- At least 2GB RAM available

#### Steps

1. **Clone/Copy the project**

   ```bash
   cd Track_Guide
   ```

2. **Create environment file**

   ```bash
   # Copy example env file
   copy .env.example .env

   # Edit .env and set secure values
   # IMPORTANT: Change JWT_SECRET in production!
   ```

3. **Build and start all services**

   ```bash
   docker-compose up -d
   ```

4. **Check if services are running**

   ```bash
   docker-compose ps
   ```

5. **View logs**

   ```bash
   docker-compose logs -f
   ```

6. **Access the application**

   - Frontend: http://localhost
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

7. **Stop services**

   ```bash
   docker-compose down
   ```

8. **Stop and remove all data**
   ```bash
   docker-compose down -v
   ```

---

### Option 2: Manual Local Development

#### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)

#### Backend Setup

1. **Navigate to backend**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create .env file** in root directory

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/trackguide
   JWT_SECRET=your_very_secure_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB** (if local)

   ```bash
   mongod
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```

#### Frontend Setup (Open new terminal)

1. **Navigate to frontend**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Access application**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

---

### Option 3: Cloud Deployment

#### MongoDB Atlas Setup

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get connection string
4. Update MONGODB_URI in .env

#### Backend Deployment (Heroku/Railway/Render)

**Using Railway:**

1. Create account at https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variables:
   - PORT=5000
   - MONGODB_URI=your_atlas_connection_string
   - JWT_SECRET=your_secret_key
   - NODE_ENV=production
5. Set root directory to `/backend`
6. Deploy

**Using Render:**

1. Create account at https://render.com
2. New → Web Service
3. Connect your repository
4. Set:
   - Root Directory: backend
   - Build Command: npm install
   - Start Command: npm start
5. Add environment variables
6. Deploy

#### Frontend Deployment (Vercel/Netlify)

**Using Vercel:**

1. Create account at https://vercel.com
2. Import your repository
3. Framework: Create React App
4. Root Directory: frontend
5. Build Command: npm run build
6. Output Directory: build
7. Add environment variable:
   - REACT_APP_API_URL=your_backend_url
8. Deploy

**Using Netlify:**

1. Create account at https://netlify.com
2. New site from Git
3. Base directory: frontend
4. Build command: npm run build
5. Publish directory: frontend/build
6. Deploy

---

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackguide
JWT_SECRET=your_super_secret_key_change_this
NODE_ENV=production
```

### Frontend (optional for production)

```env
REACT_APP_API_URL=https://your-backend-url.com
```

---

## Security Checklist for Production

- [ ] Change JWT_SECRET to a strong random string
- [ ] Use MongoDB Atlas or secure MongoDB instance
- [ ] Enable HTTPS for both frontend and backend
- [ ] Set up CORS properly in backend
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting on API endpoints
- [ ] Set up database backups
- [ ] Monitor application logs
- [ ] Use strong passwords for MongoDB
- [ ] Keep dependencies updated

---

## Scaling for Multiple Users

### Database Optimization

- Add indexes (already configured in models)
- Use MongoDB Atlas for automatic scaling
- Enable MongoDB connection pooling

### Backend Scaling

- Use PM2 for process management
- Deploy multiple instances behind load balancer
- Use Redis for session management (if needed)

### Frontend Scaling

- Use CDN for static assets
- Enable caching headers
- Optimize images and assets

---

## Monitoring & Maintenance

### Health Checks

- Backend health: http://your-backend-url/api/health
- Monitor MongoDB connection status
- Set up uptime monitoring (UptimeRobot, Pingdom)

### Logs

```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2 logs
pm2 logs
```

### Database Backup

```bash
# MongoDB backup
mongodump --uri="your_mongodb_uri" --out=/backup/path

# Restore
mongorestore --uri="your_mongodb_uri" /backup/path
```

---

## Troubleshooting

### Backend won't start

- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

### Frontend can't connect to backend

- Verify backend is running
- Check CORS settings in backend
- Update proxy in frontend package.json

### Database connection errors

- Verify MongoDB URI is correct
- Check MongoDB is running
- Verify network connectivity
- Check MongoDB credentials

---

## Performance Tips

1. **Database**: Add compound indexes for frequently queried fields
2. **Backend**: Enable gzip compression
3. **Frontend**: Code splitting and lazy loading
4. **CDN**: Serve static assets from CDN
5. **Caching**: Implement Redis caching for frequent queries

---

## Support

For issues and questions:

1. Check the logs first
2. Verify environment variables
3. Test API endpoints directly
4. Check MongoDB connection

Good luck with your deployment! 🚀
