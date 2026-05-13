import express from 'express';
import dotenv from 'dotenv';
import { initPSQL } from './config/psql.js';
import { initMongoDb } from './config/mongoDb.js';
import './cron/notificationCron.js'; 

// Load environment variables
dotenv.config();

// Import app configuration (will create this)
import app from './app.js';

const PORT = process.env.PORT || 3000;

// Start server
const startServer = async () => {
  try {

    Promise.all([initPSQL(), initMongoDb()])
      .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ PostgreSQL: User data, auth, structured data`);
      console.log(`🍃 MongoDB: Transactions, ML data`);
    });
    });
  
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};


// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();
