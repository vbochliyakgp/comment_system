# InterIIT Tech Meet 14.0 - Comment System API

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

#### Update User Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "avatar": "https://example.com/avatar.jpg"
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Post Routes (`/api/posts`)

#### Get All Posts
```http
GET /api/posts?limit=10&skip=0&sortBy=createdAt&sortOrder=desc
```

#### Get Single Post
```http
GET /api/posts/:id
```

#### Get Post with Comments
```http
GET /api/posts/:id/comments?sortBy=upvotes&sortOrder=desc&limit=50&skip=0
```

#### Create Post (Protected)
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Post Title",
  "content": "Post content here...",
  "author": "Author Name"
}
```

#### Update Post (Protected)
```http
PUT /api/posts/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Post (Protected)
```http
DELETE /api/posts/:id
Authorization: Bearer <token>
```

#### Upvote Post
```http
POST /api/posts/:id/upvote
```

### Comment Routes (`/api/comments`)

#### Get All Comments for Post
```http
GET /api/comments/post/:postId?sortBy=upvotes&sortOrder=desc&limit=50&skip=0
```

#### Get Top-Level Comments for Post
```http
GET /api/comments/post/:postId/top-level?sortBy=upvotes&sortOrder=desc&limit=20&skip=0
```

#### Create Comment (Protected)
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "This is my comment",
  "postId": "post_id_here",
  "parentId": "parent_comment_id_here" // Optional for replies
}
```

#### Update Comment (Protected)
```http
PUT /api/comments/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Updated comment text"
}
```

#### Delete Comment (Protected)
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

#### Upvote Comment
```http
POST /api/comments/:id/upvote
```

#### Downvote Comment
```http
POST /api/comments/:id/downvote
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/interiit_comments

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (make sure it's running on localhost:27017)

3. Seed the database with sample data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3000`

## Health Check

```http
GET /api/health
```

Returns server status and timestamp.
