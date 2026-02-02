# 🚀 Quick Start Guide - Track Guide

## Get Started in 5 Minutes!

### Prerequisites

- Node.js (v16+) - [Download here](https://nodejs.org/)
- MongoDB - [Download here](https://www.mongodb.com/try/download/community) OR use Docker

---

## Option 1: Using Docker (Easiest!)

If you have Docker installed, this is the fastest way:

```bash
# 1. Navigate to project folder
cd Track_Guide

# 2. Start everything with one command
docker-compose up -d

# 3. Open your browser
# http://localhost (Frontend)
# http://localhost:5000 (Backend API)
```

That's it! The app is now running with MongoDB, Backend, and Frontend all configured.

---

## Option 2: Manual Setup

### Step 1: Install MongoDB

**Windows:**

```bash
# Download MongoDB Community Server from:
# https://www.mongodb.com/try/download/community

# After installation, start MongoDB:
mongod
```

**Mac (using Homebrew):**

```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**

```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

### Step 2: Setup Backend

Open a terminal/command prompt:

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Start the server
npm run dev
```

You should see: ✅ MongoDB Connected Successfully

### Step 3: Setup Frontend

Open a NEW terminal/command prompt:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start React app
npm start
```

Your browser should automatically open to http://localhost:3000

---

## First Time Usage

### 1. Create Account

- Click "Sign up here"
- Enter username, email, and password
- Click "Sign Up"

### 2. Add Your Tasks

- Go to "✏️ Manage Tasks" tab
- Click "+ Add New Task"
- Add tasks like:
  - DSA Practice
  - Quizzes
  - Project Work
  - Data & ML Study
  - Revisions
  - Internship Applications

### 3. Track Daily Progress

- Go to "📊 Track Progress" tab
- Check boxes for completed tasks each day
- Use navigation buttons to view different date ranges

### 4. View Reports

- Go to "📈 Monthly Report" tab
- Select month from dropdown
- View charts and statistics

---

## Default Ports

- **Frontend**: http://localhost:3000 (development) or http://localhost (Docker)
- **Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## Troubleshooting

### "Port already in use" error

**Frontend (3000):**

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

**Backend (5000):**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Error

1. Make sure MongoDB is running:

```bash
# Windows
mongod

# Mac/Linux
sudo systemctl status mongodb
```

2. Check if MongoDB is on port 27017:

```bash
mongo --port 27017
```

### Can't login after signup

1. Check backend terminal for errors
2. Verify MongoDB is running
3. Try different email/username

---

## Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackguide
JWT_SECRET=my_super_secret_key_123
NODE_ENV=development
```

**Important:** Change `JWT_SECRET` to a random string in production!

---

## Next Steps

✅ Application is running  
✅ Created your account  
✅ Added tasks  
✅ Started tracking

**What's next?**

- Track daily for a month
- Generate your first monthly report
- Invite team members to use the app
- Deploy to cloud for remote access

---

## Testing API Endpoints

You can test the API using tools like Postman or curl:

### Health Check

```bash
curl http://localhost:5000/api/health
```

### Create Account

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

---

## Need Help?

1. Check the [README.md](README.md) for detailed information
2. Check the [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
3. Review error messages in terminal/console
4. Make sure all services (MongoDB, Backend, Frontend) are running

---

## Stop the Application

### Docker:

```bash
docker-compose down
```

### Manual:

- Press `Ctrl + C` in both frontend and backend terminals
- Stop MongoDB if you started it manually

---

Happy Tracking! 📊🎯
