# SETAP Finance Backend API

A hybrid database Express.js backend for personal finance management with ML-ready transaction data.

##  Architecture

**Hybrid Database Approach:**
- **PostgreSQL**: Users, authentication, categories, budgets, notifications, gamification (structured data)
- **MongoDB**: Transactions, product queries (high-volume, ML-ready data)

##  Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- MongoDB 6+
- Redis (optional, for token blacklist)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

### 3. Set Up PostgreSQL Database
```bash
# Create database
createdb setap_db

# Run schema
psql -d setap_db -f src/database/schema.sql
```

### 4. Start MongoDB
```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGO_URI in .env
```

### 5. Run the Server
```bash
# Development
npm run dev

# Production
npm start
```

Server will be running at `http://localhost:3000`

##  API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/forgot-password` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password
- `GET /api/v1/auth/verify-email` - Verify email address

### Transactions (MongoDB)
- `GET /api/v1/transactions` - Get all transactions
- `POST /api/v1/transactions` - Create transaction
- `GET /api/v1/transactions/:id` - Get transaction by ID
- `PUT /api/v1/transactions/:id` - Update transaction
- `DELETE /api/v1/transactions/:id` - Delete transaction
- `GET /api/v1/transactions/stats` - Get transaction statistics

### Categories (PostgreSQL)
- `GET /api/v1/categories` - Get all categories
- `POST /api/v1/categories` - Create category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Budgets (PostgreSQL)
- `GET /api/v1/budgets` - Get all budgets
- `POST /api/v1/budgets` - Create budget
- `PUT /api/v1/budgets/:id` - Update budget
- `DELETE /api/v1/budgets/:id` - Delete budget

### Dashboard
- `GET /api/v1/dashboard/summary` - Get dashboard summary
- `GET /api/v1/dashboard/recent-activity` - Get recent activity
- `GET /api/v1/dashboard/spending-by-category` - Category breakdown

### Gamification (PostgreSQL)
- `GET /api/v1/gamification/progress` - Get user progress
- `GET /api/v1/gamification/achievements` - Get achievements
- `GET /api/v1/gamification/leaderboard` - Get leaderboard

### Predictions (ML Integration)
- `GET /api/v1/predictions/spending` - Predict spending
- `GET /api/v1/predictions/budget-recommendations` - Budget suggestions
- `GET /api/v1/predictions/insights` - Spending insights

##  Database Schemas

### PostgreSQL Tables
- `users` - User accounts and profiles
- `categories` - Expense/income categories
- `budgets` - Budget management
- `notifications` - User notifications
- `gamification` - User levels and achievements
- `email_verification_tokens`
- `password_reset_tokens`
- `refresh_tokens`
- `token_blacklist`

### MongoDB Collections
- `transactions` - All financial transactions (indexed for ML queries)
- `productqueries` - Price comparison cache

##  Authentication

Uses JWT with refresh tokens:
- **Access Token**: 15 minutes (short-lived)
- **Refresh Token**: 7 days (stored in database)
- **Token Blacklist**: Logout invalidation

##  Development

```bash
# Run in development mode with auto-reload
npm run dev

# Test database connections
curl http://localhost:3000/health
```

##  ML Integration

Transaction data in MongoDB is optimized for ML models:
- Indexed by user_id, date, type, category
- Flexible schema with metadata field
- Direct MongoDB connection for ML pipelines
- RESTful API for predictions service

##  Configuration

Key environment variables:

```env
# Required
POSTGRES_URI=postgresql://...
MONGO_URI=mongodb://...
JWT_SECRET=random_secure_string

# Optional
REDIS_HOST=localhost
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
AI_API_KEY=your_openai_key
```

##  Security Features

- Helmet.js security headers
- CORS configuration
- Rate limiting on authentication routes
- JWT token rotation
- Password hashing with bcrypt
- SQL injection prevention (parameterized queries)
- NoSQL injection prevention (Mongoose validation)

##  Project Structure

```
src/
├── app.js                 # Express app configuration
├── server.js              # Server startup
├── database/
│   ├── index.js           # Database connections
│   └── schema.sql         # PostgreSQL schema
├── models/
│   └── index.js           # Database models
├── controllers/           # Route controllers
├── services/              # Business logic
├── routes/                # API routes
├── middleware/            # Custom middleware
├── utils/                 # Utility functions
├── validators/            # Input validation
├── integrations/          # External APIs
└── jobs/                  # Cron jobs
```

##  License

ISC

## 👥 Contributors

GROUP-2E-SETAP
