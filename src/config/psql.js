import 'dotenv/config'
import { neon } from '@neondatabase/serverless' 
import config from "./index.js"

export const sql = neon(config.postgresUri) ;

export async function initPSQL() {
  try {
    await sql`
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100),
        phone VARCHAR(20),
        avatar VARCHAR(500),
        currency VARCHAR(3) DEFAULT 'USD',
        language VARCHAR(10) DEFAULT 'en',
        is_verified BOOLEAN DEFAULT FALSE,
        role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
        gamification_level INTEGER DEFAULT 1,
        gamification_points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    ` ; 
    await sql `
    -- Email verification tokens
    CREATE TABLE IF NOT EXISTS email_verification_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await sql ` 
    -- Password reset tokens
    CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await sql ` 
    -- Refresh tokens
    CREATE TABLE IF NOT EXISTS refresh_tokens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `
    await sql ` 
    -- Token blacklist (for logout)
    CREATE TABLE IF NOT EXISTS token_blacklist (
        id SERIAL PRIMARY KEY,
        token TEXT UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`

    await sql`
    -- Categories table
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
      icon VARCHAR(50) DEFAULT 'default',
      color VARCHAR(7) DEFAULT '#000000',
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Transactions table
    CREATE TABLE IF NOT EXISTS transactions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      amount DECIMAL(12,2) NOT NULL,
      description VARCHAR(255),
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    -- Budgets table
    CREATE TABLE IF NOT EXISTS budgets (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
      amount DECIMAL(12,2) NOT NULL,
      period VARCHAR(20) DEFAULT 'monthly' CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
      start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      end_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (user_id, category_id, period)
    )`;
  } catch (error) {
    console.log("Error while initalising PSQL client : " , error) ; } }
