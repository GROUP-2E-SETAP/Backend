# SETUP GUIDE - SETAP Finance Backend

## Quick Setup Steps

### 1️ Install Dependencies
```bash
npm install
```

### 2️ Configure Your Environment

Edit the [.env](.env) file with your actual credentials:

**Required Settings:**
```env
# PostgreSQL (get from Neon.tech or local)
POSTGRES_URI=postgresql://user:password@host:5432/dbname

# MongoDB (get from MongoDB Atlas or local)
MONGO_URI=mongodb://localhost:27017/setap_transactions

# JWT Secrets (generate random strings!)
JWT_SECRET=your_random_32_character_secret_here
JWT_REFRESH_SECRET=another_random_secret_for_refresh

# Email (for notifications)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
```

### 3️ Set Up PostgreSQL Database

**Option A: Using Neon (Recommended for Cloud)**
1. Sign up at https://neon.tech
2. Create new project
3. Copy connection string to `.env`
4. Run schema:
```bash
# Install psql if needed
psql YOUR_NEON_CONNECTION_STRING -f src/database/schema.sql
```

**Option B: Local PostgreSQL**
```bash
# Create database
createdb setap_db

# Run schema
psql -d setap_db -f src/database/schema.sql
```

### 4️ Set Up MongoDB

**Option A: MongoDB Atlas (Recommended for Cloud)**
1. Sign up at https://mongodb.com/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

**Option B: Local MongoDB**
```bash
# Install and start MongoDB
mongod --dbpath ~/data/db
```

### 5️ Start the Server

```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB connected successfully
✅ PostgreSQL connected successfully
# Server running on http://localhost:3000
```

### 6️ Test the API

```bash
# Health check
curl http://localhost:3000/health

# API endpoints
curl http://localhost:3000/api/v1

# Register a user
curl -X POST http://localhost:3000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

##  Common Issues

### Issue: Cannot connect to PostgreSQL
**Solution:** Check your connection string format:
```env
# Local
POSTGRES_URI=postgresql://username:password@localhost:5432/setap_db

# Neon
POSTGRES_URI=postgresql://user:pass@host.region.neon.tech/dbname?sslmode=require
```

### Issue: Cannot connect to MongoDB
**Solution:** 
- Local: Make sure MongoDB is running (`mongod`)
- Atlas: Check connection string includes password and database name

### Issue: Email not working
**Solution:** 
- Gmail: Use App Password (not regular password)
- Go to Google Account → Security → 2-Step Verification → App Passwords

### Issue: Module errors
**Solution:** Make sure you ran `npm install` and have Node.js 18+

##  Database Structure

### PostgreSQL (Structured Data)
- Users & Authentication
- Categories
- Budgets
- Notifications
- Gamification

### MongoDB (High-Volume Data)
- Transactions (indexed for ML)
- Product Price Cache

## Generate Strong Secrets

```bash
# Generate random JWT secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

##  Next Steps

1. ✅ Set up both databases
2. ✅ Configure environment variables
3. ✅ Test API endpoints
4. 📝 Implement remaining controllers (transactions, budgets, etc.)
5. 🤖 Connect ML model to MongoDB transactions
6. 📱 Connect frontend application

## 📚 Documentation

- Full API docs: [README.md](README.md)
- Database schema: [src/database/schema.sql](src/database/schema.sql)
- Environment template: [.env.example](.env.example)

##  Tips

- Use `.env.example` as a template
- Never commit `.env` to git
- Use strong, random JWT secrets
- Enable 2FA on email accounts
- Backup your databases regularly

##  Need Help?

Check the main [README.md](README.md) or review the code comments in:
- [src/database/index.js](src/database/index.js) - Database connections
- [src/server.js](src/server.js) - Server startup
- [src/app.js](src/app.js) - Express configuration
