
# Discussion Platform

Full-stack discussion platform with nested comments and upvoting system.

## 📋 Project Overview

This is a modern discussion platform:

• **Real-time discussions** - Create posts and engage in threaded conversations
• **Nested commenting** - Unlimited comment depth with proper threading
• **Voting system** - Upvote posts and comments to highlight quality content
• **User authentication** - Secure JWT-based login/registration system
• **Responsive design** - Works seamlessly on desktop and mobile devices
• **Theme support** - Light and dark mode for better user experience
• **Production ready** - Docker containerized with SSL certificates

### Architecture
• **Frontend**: React with TypeScript, Vite for fast development
• **Backend**: Node.js/Express API with MongoDB database
• **Authentication**: JWT tokens with bcrypt password hashing
• **Deployment**: Docker containers with Nginx reverse proxy
• **Security**: Rate limiting, CORS, Helmet security headers

## 🚀 Quick Deploy

```bash
./setup/deploy.sh
```

## 🛠️ Local Development

```bash
# Backend
cd backend
npm install
cp .env.example .env
npm run dev

# Frontend
cd frontend  
npm install
npm run dev

# Seed database
cd backend
npm run seed
```

## ✨ Features

- JWT authentication
- Nested comments
- Post/comment upvoting
- Light/dark theme
- Responsive design

## 🏗️ Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT  
**Frontend**: React, TypeScript, Vite, Framer Motion  
**Deploy**: Docker, Nginx, Let's Encrypt SSL

## 📡 API Endpoints

### Authentication
• `POST /api/auth/register` - User registration
• `POST /api/auth/login` - User login
• `GET /api/auth/profile` - Get user profile

### Posts
• `GET /api/posts` - Get all posts
• `POST /api/posts` - Create new post
• `GET /api/posts/:id/comments` - Get post with comments
• `POST /api/posts/:id/upvote` - Upvote/downvote post

### Comments
• `POST /api/comments` - Create comment
• `POST /api/comments/:id/upvote` - Upvote/downvote comment
• `GET /api/comments/:id/replies` - Get comment replies

## 🔧 Configuration

### Environment Variables
• `MONGODB_URI` - MongoDB connection string
• `JWT_SECRET` - Secret key for JWT tokens
• `FRONTEND_URL` - Frontend URL for CORS
• `RATE_LIMIT_WINDOW_MS` - Rate limiting window
• `RATE_LIMIT_MAX_REQUESTS` - Max requests per window

### Database Schema
• **Users**: username, email, password (hashed)
• **Posts**: title, content, author, upvotes, createdAt
• **Comments**: content, author, post, parentComment, upvotes

## 🚀 Production Deployment

The project includes complete Docker setup with:
• **3 services**: MongoDB, Backend API, Frontend
• **SSL certificates** via Let's Encrypt
• **Nginx reverse proxy** with load balancing
• **Health checks** and auto-restart policies
• **Volume persistence** for database data