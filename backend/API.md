# InterIIT Discussion Platform API

## Base URL
```
http://localhost:3000/api
```

## Authentication
Protected routes require a Bearer token in the Authorization header:
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

#### Get Post with Comments
```http
GET /api/posts/:id/comments?sortBy=upvotes&sortOrder=desc&limit=50&skip=0
```

#### Upvote Post
```http
POST /api/posts/:id/upvote
Authorization: Bearer <token>
```

### Comment Routes (`/api/comments`)

#### Create Comment
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

#### Upvote Comment
```http
POST /api/comments/:id/upvote
Authorization: Bearer <token>
```

## Response Format

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
```

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Start MongoDB (make sure it's running on localhost:27017)

3. Seed the database with sample data:
```bash
node src/scripts/seed.js
```

4. Start the development server:
```bash
npm run dev
```

The server will be available at `http://localhost:3000`