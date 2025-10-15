
A full-stack discussion platform with nested comments and upvoting system.

## Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation

1. **Clone and setup backend**
```bash
git clone <repository-url>
cd ParentDir/backend
npm install
cp .env.example .env  # Add your MongoDB URI
npm start
```

2. **Setup frontend**
```bash
cd ../frontend
npm install
npm run dev
```

3. **Seed database**
```bash
cd ../backend
node src/scripts/seed.js
```

## Features

- **Authentication**: JWT-based login/register
- **Posts**: Create and upvote posts
- **Comments**: Nested commenting system
- **Upvoting**: Upvote posts and comments
- **Theme**: Light/dark mode toggle

## Tech Stack

**Backend**: Node.js, Express, MongoDB, JWT, bcrypt  
**Frontend**: React, TypeScript, Vite, Framer Motion

## API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get profile

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id/comments` - Get post with comments
- `POST /api/posts/:id/upvote` - Upvote post

### Comments
- `POST /api/comments` - Create comment
- `POST /api/comments/:id/upvote` - Upvote comment

## Development

```bash
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev
```

---