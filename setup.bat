@echo off
REM Track Guide Setup Script for Windows
REM This script will set up and run Track Guide automatically

echo ================================
echo Track Guide - Automated Setup
echo ================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo + Node.js is installed
node --version

REM Check if MongoDB is running
where mongo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ! MongoDB CLI not found
    echo Make sure MongoDB is running on localhost:27017
    echo Or use Docker: docker-compose up -d
)

echo.
echo Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Backend installation failed!
    pause
    exit /b 1
)
echo + Backend dependencies installed

echo.
echo Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Frontend installation failed!
    pause
    exit /b 1
)
echo + Frontend dependencies installed

cd ..

REM Create .env if it doesn't exist
if not exist .env (
    echo.
    echo Creating .env file...
    copy .env.example .env
    echo + .env file created
    echo ! Please update JWT_SECRET in .env before production use
)

echo.
echo ================================
echo + Setup Complete!
echo ================================
echo.
echo To start the application:
echo.
echo 1. Start MongoDB (if not using Docker):
echo    mongod
echo.
echo 2. Start Backend (in a new terminal):
echo    cd backend
echo    npm run dev
echo.
echo 3. Start Frontend (in another terminal):
echo    cd frontend
echo    npm start
echo.
echo OR use Docker:
echo    docker-compose up -d
echo.
echo Then open: http://localhost:3000
echo ================================
echo.
pause
