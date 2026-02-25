import pkg from 'pg';
const { Pool } = pkg;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL Connection (for users, auth, structured data)
export const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
  ssl: process.env.POSTGRES_URI?.includes('neon.tech') || process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('✅ PostgreSQL connected successfully');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL error:', err);
  if (process.env.NODE_ENV === 'production') {
    process.exit(-1);
  }
});

// MongoDB Connection (for transactions, ML data)
export const connectMongoDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('⚠️  MongoDB URI not configured. Skipping MongoDB connection.');
      return;
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
    console.warn('⚠️  Continuing without MongoDB in development mode...');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end();
  await mongoose.connection.close();
  console.log('Database connections closed');
  process.exit(0);
});

// Test connections
export const testConnections = async () => {
  console.log('🔍 Testing database connections...');
  let hasErrors = false;

  // Test PostgreSQL
  try {
    if (!process.env.POSTGRES_URI) {
      console.warn('⚠️  PostgreSQL URI not configured');
    } else {
      const pgResult = await pool.query('SELECT NOW()');
      console.log('✅ PostgreSQL test successful:', pgResult.rows[0].now);
    }
  } catch (error) {
    console.error('❌ PostgreSQL test failed:', error.message);
    if (process.env.NODE_ENV === 'production') {
      hasErrors = true;
    }
  }

  // Test MongoDB
  try {
    const mongoState = mongoose.connection.readyState;
    if (mongoState === 1) {
      console.log('✅ MongoDB connection verified');
    } else {
      console.warn('⚠️  MongoDB not connected');
    }
  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
  }

  return !hasErrors;
};
