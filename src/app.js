import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    databases: {
      postgres: 'Users, Auth, Structured Data',
      mongodb: 'Transactions, ML Data'
    },
    timestamp: new Date().toISOString()
  });
});

// Import and mount routes
import routes from './routes/index.js';
app.use('/api/v1', routes);

// API root
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'SETAP Finance API',
    version: '1.0.0',
    documentation: '/api/v1'
  });
});

// API v1 info
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'SETAP Finance API v1',
    endpoints: {
      auth: '/api/v1/auth',
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;
