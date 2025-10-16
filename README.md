# Discussion Platform

Full-stack discussion platform with nested comments and upvoting system.

Deployed at: https://comment-system-frontend.vercel.app

## Project Overview

A full-stack discussion platform with nested comments and upvoting system. Users can create posts, comment on them, and engage through upvoting.

### Frontend Features

The frontend consists of 4 main pages:

1. **Login Page** - User authentication with email and password
2. **Signup Page** - User registration with email and password
3. **Posts List Page** - Displays all posts in card format with upvote status
4. **Post Details Page** - Shows detailed post with nested comments

**Key Frontend Features:**
- Authentication using JWT tokens with bcryptjs password hashing
- Posts displayed in card format showing upvote status for each user
- Detailed post view with nested comment system
- Users can upvote posts and comments, and reply to comments
- Comment prioritization: user's own comments first, then by upvote count
- Pagination: 10 comments in first layer, 2 in second layer, with "see more" button for additional content
- Light/dark theme support
- Responsive design

### Backend Features

The backend provides a RESTful API with the following routes and features:

#### Authentication Routes (`/api/auth`)
- **POST `/register`** - User registration with name, email, and password
  - Validates email format and password strength
  - Hashes password using bcryptjs with salt
  - Returns JWT token and user profile
- **POST `/login`** - User authentication
  - Validates email and password
  - Returns JWT token and user profile
  - Handles account deactivation status
- **GET `/profile`** - Get current user profile (requires authentication)

#### Posts Routes (`/api/posts`)
- **GET `/`** - Get all posts with pagination and sorting
  - Query parameters: `sortBy`, `sortOrder`, `limit`, `skip`
  - Returns posts with upvote status for current user
- **GET `/:id/comments`** - Get specific post with nested comments
  - Query parameters: `sortBy`, `sortOrder` for comment sorting
  - Returns post details with comments (user's comments first, then by upvotes -- this part is handled at frontend)
- **POST `/:id/upvote`** - Toggle upvote on a post
  - Adds/removes user from upvotedBy array
  - Updates upvote count

#### Comments Routes (`/api/comments`)
- **POST `/`** - Create new comment or reply
  - Body: `text`, `postId`, `parentId`
  - Validates comment text and post existence
  - Supports nested replies through parentId
- **POST `/:id/upvote`** - Toggle upvote on a comment/reply
  - Adds/removes user from upvotedBy array
  - Updates upvote count

#### Key Backend Features
- **JWT Authentication** - Secure token-based authentication
- **Password Security** - bcryptjs hashing with salt rounds
- **Input Validation** - Express-validator for request validation
- **Error Handling** - Centralized error handling middleware
- **Rate Limiting** - Request rate limiting for API protection
- **CORS Configuration** - Cross-origin resource sharing setup
- **Security Headers** - Helmet.js for security headers
- **Database Integration** - MongoDB with Mongoose ODM
- **Nested Comments** - Support for unlimited comment nesting
- **Upvote System** - Toggle-based upvoting for posts and comments

### Architecture

• **Frontend**: React with TypeScript, Vite for fast development
• **Backend**: Node.js/Express API with MongoDB database
• **Authentication**: JWT tokens with bcrypt password hashing
• **Deployment**: Docker containers with Nginx reverse proxy
• **Security**: Rate limiting, CORS, Helmet security headers

## Quick Deploy

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

## Features

- JWT authentication
- Nested comments
- Post/comment upvoting
- Light/dark theme
- Responsive design

## Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT  
**Frontend**: React, TypeScript, Vite, Framer Motion  
**Deploy**: Docker, Nginx, Let's Encrypt SSL

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/profile` | Get current user profile | Yes |

### Posts Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts with pagination | Yes |
| GET | `/api/posts/:id/comments` | Get post with nested comments | Yes |
| POST | `/api/posts/:id/upvote` | Toggle upvote on post | Yes |

### Comments Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/comments` | Create comment or reply | Yes |
| POST | `/api/comments/:id/upvote` | Toggle upvote on comment | Yes |

### Request/Response Examples

#### Register User
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Create Comment
```json
POST /api/comments
{
  "text": "This is a great post!",
  "postId": "64a1b2c3d4e5f6789abcdef0",
  "parentId": "64a1b2c3d4e5f6789abcdef1" // Optional for replies
}
```

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

## Production Deployment

The project includes complete Docker setup with:
• **3 services**: MongoDB, Backend API, Frontend
• **SSL certificates** via Let's Encrypt
• **Nginx reverse proxy** with load balancing
• **Health checks** and auto-restart policies
• **Volume persistence** for database data
