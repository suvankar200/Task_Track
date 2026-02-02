#!/bin/bash

# Track Guide Setup Script
# This script will set up and run Track Guide automatically

echo "================================"
echo "Track Guide - Automated Setup"
echo "================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js is installed: $(node --version)"

# Check if MongoDB is running
if ! command -v mongo &> /dev/null && ! command -v mongosh &> /dev/null; then
    echo "⚠️  MongoDB CLI not found"
    echo "Make sure MongoDB is running on localhost:27017"
    echo "Or use Docker: docker-compose up -d"
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed!"
    exit 1
fi
echo "✅ Backend dependencies installed"

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed!"
    exit 1
fi
echo "✅ Frontend dependencies installed"

cd ..

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo "⚠️  Please update JWT_SECRET in .env before production use"
fi

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start MongoDB (if not using Docker):"
echo "   mongod"
echo ""
echo "2. Start Backend (in a new terminal):"
echo "   cd backend && npm run dev"
echo ""
echo "3. Start Frontend (in another terminal):"
echo "   cd frontend && npm start"
echo ""
echo "OR use Docker:"
echo "   docker-compose up -d"
echo ""
echo "Then open: http://localhost:3000"
echo "================================"
