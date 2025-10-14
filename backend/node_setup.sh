#!/bin/bash

# A script to generate a boilerplate Express.js project structure.

PROJECT_DIR="backend"

# --- VALIDATION ---
# Check if the directory already exists to prevent overwriting.
if [ -d "$PROJECT_DIR" ]; then
  echo "Error: Directory '$PROJECT_DIR' already exists."
  exit 1
fi

# --- PROJECT INITIALIZATION ---
echo "Initializing project in './$PROJECT_DIR'..."
mkdir "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Silently initialize a Node.js project.
npm init -y > /dev/null

# Overwrite the default package.json to include ES module support and start/dev scripts.
cat <<EOF > package.json
{
  "name": "${PROJECT_DIR}",
  "version": "1.0.0",
  "description": "A boilerplate Express project",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
EOF

# Install required dependencies.
echo "Installing dependencies: express, morgan, dotenv, nodemailer..."
npm install express morgan dotenv nodemailer > /dev/null

# Install development dependencies.
echo "Installing dev dependencies: nodemon..."
npm install --save-dev nodemon > /dev/null


# --- DIRECTORY & FILE CREATION ---
echo "Creating standard project directories..."
mkdir -p src/middleware src/controllers src/routes

echo "Generating project files..."

# .gitignore
cat <<EOF > .gitignore
# Dependencies
node_modules/

# Environment variables
.env
EOF

# .env
cat <<EOF > .env
PORT=3000
EOF

# index.js (Main entry point)
cat <<EOF > index.js
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// --- Middleware ---
import logger from './src/middleware/logger.js';
import errorHandler from './src/middleware/errorHandler.js';
import responseMiddleware from './src/middleware/response.js';

// --- Routes ---
import userRoutes from './src/routes/users.js';

app.use(logger);
app.use(responseMiddleware);

app.use('/users', userRoutes);

// Error-handling middleware should be last
app.use(errorHandler);

app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});
EOF

# src/middleware/response.js
cat <<EOF > src/middleware/response.js
const responseMiddleware = (req, res, next) => {
  res.sendSuccess = (message, data = null, status = 200) => {
    return res.status(status).json({
      success: true,
      message,
      data,
    });
  };

  res.sendCreated = (message, data = null) => {
    return res.sendSuccess(message, data, 201);
  };

  res.sendNoContent = () => {
    return res.status(204).send();
  };

  res.sendError = (message, status = 500, data = null) => {
    return res.status(status).json({
      success: false,
      message,
      data,
    });
  };

  next();
};

export default responseMiddleware;
EOF

# src/middleware/errorHandler.js
cat <<EOF > src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.sendError('Something went wrong on the server', 500);
};

export default errorHandler;
EOF

# src/middleware/logger.js
cat <<EOF > src/middleware/logger.js
import morgan from 'morgan';

// Using 'dev' gives you colored status codes for better readability
const logger = morgan('dev');

export default logger;
EOF

# src/controllers/userController.js
cat <<EOF > src/controllers/userController.js
export const getUsers = (req, res) => {
  const exampleData = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
  ];
  res.sendSuccess("Users fetched successfully", exampleData);
};
EOF

# src/routes/users.js
cat <<EOF > src/routes/users.js
import express from "express";
import { getUsers } from "../controllers/userController.js";

const router = express.Router();

router.get("/", getUsers);

export default router;
EOF

# --- GIT INITIALIZATION ---
echo "Initializing git repository..."
git init &> /dev/null
git branch -M main &> /dev/null

# --- COMPLETION MESSAGE ---
echo ""
echo "All done! Your new Express project is ready."
echo ""
echo "--- Next Steps ---"
echo "1. cd $PROJECT_DIR"
echo "2. For development, run: npm run dev"
echo "3. For production, run: npm start"
echo ""
echo "Your API will be available at http://localhost:3000/"