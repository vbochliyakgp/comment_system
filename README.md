# InterIIT Tech Meet 14.0 - Discussion Platform

A full-stack discussion platform built with React, Node.js, and MongoDB, featuring nested comments, upvoting system, and real-time interactions.

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd interIIT
```

2. **Backend Setup**
```bash
cd backend
npm install
cp .env.example .env  # Configure your MongoDB URI
npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

4. **Seed Database**
```bash
cd backend
node src/scripts/seed.js
```

## System Architecture

### Backend (Node.js + Express + MongoDB)
- **Authentication**: JWT-based auth with user registration/login
- **Posts**: CRUD operations with upvoting system
- **Comments**: Nested commenting with depth limiting (max 10 levels)
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful endpoints with proper error handling

### Frontend (React + TypeScript + Vite)
- **State Management**: React Context API for auth and data
- **UI Components**: Modular components with Framer Motion animations
- **Theme Support**: Light/Dark mode toggle
- **Responsive Design**: Mobile-first approach

## Core Features

### 1. User Authentication
- **Registration/Login**: Email-based authentication
- **JWT Tokens**: Secure session management
- **Protected Routes**: Authentication required for upvoting/commenting

### 2. Post System
- **Create Posts**: Rich text content with metadata
- **Upvote System**: Toggle upvotes with real-time updates
- **Post List**: Paginated post listing with sorting options

### 3. Comment System
- **Nested Comments**: Unlimited depth with visual indentation
- **Reply Functionality**: Inline reply forms with smooth animations
- **Upvote Comments**: Individual comment upvoting
- **Real-time Updates**: Comments refresh after posting

### 4. Interactive Features
- **Upvote Tracking**: Server-side upvote status with user tracking
- **Responsive UI**: Smooth animations and transitions
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations

## Project Structure

```
interIIT/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # Express routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   └── scripts/        # Database seeding
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # State management
│   │   ├── services/       # API calls
│   │   └── types/          # TypeScript definitions
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Posts
- `GET /api/posts` - Get all posts (with upvote status)
- `GET /api/posts/:id/comments` - Get post with comments
- `POST /api/posts/:id/upvote` - Upvote/unupvote post

### Comments
- `POST /api/comments` - Create comment/reply
- `PUT /api/comments/:id` - Edit comment
- `POST /api/comments/:id/upvote` - Upvote/unupvote comment

## How It Works

### 1. User Flow
1. **Register/Login** → JWT token stored in localStorage
2. **Browse Posts** → View post list with upvote status
3. **View Post Details** → See full post with nested comments
4. **Interact** → Upvote posts/comments, add comments/replies

### 2. Data Flow
```
Frontend → API Service → Backend Controller → Database
    ↑                                           ↓
    ← State Update ← Response ← JSON Response ←
```

### 3. State Management
- **AuthContext**: User authentication state
- **DataContext**: Posts, comments, and upvote status
- **ThemeContext**: UI theme preferences

## Key Technologies

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **CSS Variables** - Theming

## Development

### Backend Development
```bash
cd backend
npm run dev  # Start with nodemon
```

### Frontend Development
```bash
cd frontend
npm run dev  # Start Vite dev server
```

### Database Management
```bash
# Seed with sample data
node backend/src/scripts/seed.js

# Clear database
# (Modify seed.js to clear existing data)
```

## Features Demo

1. **Authentication**: Register new users or login with existing accounts
2. **Post Interaction**: Click posts to view details and upvote
3. **Commenting**: Add top-level comments using the comment form
4. **Replying**: Click "Reply" on any comment to add nested replies
5. **Upvoting**: Click thumbs up to upvote posts or comments
6. **Theme Toggle**: Switch between light and dark modes

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Rate limiting (configurable)
- SQL injection prevention (MongoDB)

## Performance

- **Frontend**: Vite for fast development and optimized builds
- **Backend**: Express with efficient middleware stack
- **Database**: MongoDB with proper indexing
- **Caching**: Local state management for reduced API calls

---

**Built for InterIIT Tech Meet 14.0** - A modern discussion platform with real-time interactions and smooth user experience.
