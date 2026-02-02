# Track Guide - Performance Tracking Website

A comprehensive performance tracking website that allows multiple users to track their daily work, mark task completion, and generate monthly reports with visualizations.

## Features

- 🔐 **User Authentication**: Secure signup and login system
- 📊 **Task Tracking**: Track multiple tasks with daily checkboxes
- 📅 **Date-wise Progress**: Mark tasks as complete/incomplete by date
- 📈 **Monthly Reports**: Auto-generate reports with visualizations
- 👥 **Multi-user Support**: Isolated data for each user
- 🎨 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Fast & Scalable**: Built for concurrent user access

## Tech Stack

### Backend

- Node.js + Express
- MongoDB (Database)
- JWT (Authentication)
- bcryptjs (Password hashing)

### Frontend

- React
- Chart.js (Visualizations)
- Axios (API calls)
- CSS3 (Styling)

## Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)

### Setup Instructions

1. **Clone the repository**

   ```bash
   cd Track_Guide
   ```

2. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Configure environment variables**

   ```bash
   cd ..
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

5. **Start MongoDB**

   ```bash
   # If using local MongoDB
   mongod
   ```

6. **Start backend server**

   ```bash
   cd backend
   npm run dev
   ```

7. **Start frontend (in new terminal)**

   ```bash
   cd frontend
   npm start
   ```

8. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage

1. **Sign Up**: Create a new account with username and password
2. **Login**: Sign in with your credentials
3. **Add Tasks**: Add tasks you want to track (e.g., DSA, Quizzes, Projects)
4. **Track Progress**: Mark tasks as complete daily using checkboxes
5. **View Reports**: Generate monthly reports to see your progress
6. **Visualize**: View charts showing completion rates and trends

## Deployment

### Using Docker

```bash
docker-compose up -d
```

### Manual Deployment

1. Build frontend: `cd frontend && npm run build`
2. Deploy backend to services like Heroku, Railway, or DigitalOcean
3. Deploy frontend to Vercel, Netlify, or serve from backend
4. Use MongoDB Atlas for cloud database

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login

### Tasks

- `GET /api/tasks` - Get all user tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Progress

- `GET /api/progress` - Get progress data
- `POST /api/progress` - Update task completion
- `GET /api/progress/report/:month` - Generate monthly report

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- User data isolation
- Input validation
- CORS protection

## License

MIT
