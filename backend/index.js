import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

// Import database connection
import connectDB from "./src/config/database.js";

// Import middleware
import logger from "./src/middleware/logger.js";
import errorHandler from "./src/middleware/errorHandler.js";
import responseMiddleware from "./src/middleware/response.js";

// Import routes
import authRoutes from "./src/routes/auth.js";
import postRoutes from "./src/routes/posts.js";
import commentRoutes from "./src/routes/comments.js";

// Connect to database
connectDB();

const port = process.env.PORT || 3000;
const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("combined"));
app.use(limiter);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Custom middleware
app.use(logger);
app.use(responseMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
// app.use('/*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// Error-handling middleware should be last
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
